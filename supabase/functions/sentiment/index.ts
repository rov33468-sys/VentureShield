import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (text.length > 5000) {
      return new Response(JSON.stringify({ error: "Text must be under 5000 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a senior sentiment & customer-insight analyst for VentureShield. Analyze the provided text (review, feedback, social post, transcript, etc.) and produce a precise, business-grade sentiment report.

Rules:
- overall_sentiment must reflect the dominant tone, not an average of opposites.
- confidence drops below 60 when the text is short, ambiguous, or mixed.
- emotions: 2-5 distinct emotions (joy, anger, frustration, trust, fear, anticipation, etc.) with intensity 0-100.
- key_phrases: 3-6 short verbatim spans (≤8 words) that drove your verdict, each tagged.
- summary: ONE sentence, plain English, what the author actually feels and why.
- business_implications: ONE actionable sentence telling the business what to do about it.`,
          },
          {
            role: "user",
            content: `Analyze the sentiment of this text:\n\n"""${text}"""`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_sentiment",
              description: "Report the sentiment analysis results",
              parameters: {
                type: "object",
                properties: {
                  overall_sentiment: {
                    type: "string",
                    enum: ["very_positive", "positive", "neutral", "negative", "very_negative"],
                  },
                  confidence: { type: "number", description: "Confidence score 0-100" },
                  emotions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        emotion: { type: "string" },
                        intensity: { type: "number", description: "0-100" },
                      },
                      required: ["emotion", "intensity"],
                      additionalProperties: false,
                    },
                  },
                  key_phrases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        phrase: { type: "string" },
                        sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                      },
                      required: ["phrase", "sentiment"],
                      additionalProperties: false,
                    },
                  },
                  summary: { type: "string" },
                  business_implications: { type: "string" },
                },
                required: ["overall_sentiment", "confidence", "emotions", "key_phrases", "summary", "business_implications"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_sentiment" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "Failed to extract sentiment data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sentiment = JSON.parse(toolCall.function.arguments);

    // Persist analysis
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: saved, error: saveErr } = await adminClient
      .from("sentiment_analyses")
      .insert({
        user_id: userId,
        input_text: text.trim(),
        overall_sentiment: sentiment.overall_sentiment,
        confidence: sentiment.confidence,
        emotions: sentiment.emotions,
        key_phrases: sentiment.key_phrases,
        summary: sentiment.summary,
        business_implications: sentiment.business_implications,
      })
      .select("id, created_at")
      .single();

    if (saveErr) console.error("Failed to save sentiment:", saveErr);

    return new Response(
      JSON.stringify({ ...sentiment, id: saved?.id, created_at: saved?.created_at }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sentiment error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
