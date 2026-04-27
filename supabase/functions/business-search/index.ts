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

    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.length > 500) {
      return new Response(JSON.stringify({ error: "Invalid search query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

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
            content: `You are a business opportunity researcher for VentureShield. Given a search query (industry, niche, or theme), return 4-6 realistic, differentiated business opportunities — not generic categories.

Rules:
- Each opportunity must be a SPECIFIC business concept (e.g. "B2B carbon-accounting SaaS for SMB manufacturers"), not a vague vertical ("green tech").
- marketSize: include a number with units (e.g. "$4.2B globally, 12% CAGR").
- competition: name the type of incumbents and saturation ("Crowded — dominated by HubSpot, Salesforce" / "Emerging — few specialized players").
- investmentRange: realistic seed-to-Series A range (e.g. "$50K – $500K to launch MVP").
- growthPotential: High / Medium / Low based on market trends, not hype.
- Avoid duplicates and keep ideas spread across business models (SaaS, marketplace, services, hardware, D2C).`,
          },
          { role: "user", content: `Find business opportunities for: "${query.trim()}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_results",
              description: "Return business opportunity search results",
              parameters: {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        industry: { type: "string" },
                        opportunity: { type: "string" },
                        marketSize: { type: "string" },
                        competition: { type: "string" },
                        investmentRange: { type: "string" },
                        growthPotential: { type: "string", enum: ["High", "Medium", "Low"] },
                      },
                      required: ["name", "industry", "opportunity", "marketSize", "competition", "investmentRange", "growthPotential"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["results"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_results" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No results from AI");
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    // Persist search
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: saved, error: saveErr } = await adminClient
      .from("business_searches")
      .insert({
        user_id: userId,
        query: query.trim(),
        results: parsed.results ?? [],
      })
      .select("id, created_at")
      .single();
    if (saveErr) console.error("Failed to save business search:", saveErr);

    return new Response(
      JSON.stringify({ ...parsed, id: saved?.id, created_at: saved?.created_at }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("business-search error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
