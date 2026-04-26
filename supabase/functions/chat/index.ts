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

    const body = await req.json();
    const { messages, conversationId } = body ?? {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return new Response(JSON.stringify({ error: "Each message must have role and content" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (msg.content.length > 5000) {
        return new Response(JSON.stringify({ error: "Message content too long" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Service-role client for writes
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Resolve / create conversation
    let convId = conversationId as string | undefined;
    if (convId) {
      const { data: existing } = await adminClient
        .from("chat_conversations")
        .select("id, user_id")
        .eq("id", convId)
        .maybeSingle();
      if (!existing || existing.user_id !== userId) {
        return new Response(JSON.stringify({ error: "Conversation not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const firstUserMsg = messages.find((m: any) => m.role === "user")?.content ?? "New conversation";
      const title = firstUserMsg.slice(0, 60);
      const { data: created, error: createErr } = await adminClient
        .from("chat_conversations")
        .insert({ user_id: userId, title })
        .select("id")
        .single();
      if (createErr || !created) {
        console.error("Failed to create conversation:", createErr);
        return new Response(JSON.stringify({ error: "Could not create conversation" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      convId = created.id;
    }

    // Save the latest user message (last in the array if it's user)
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "user") {
      await adminClient.from("chat_messages").insert({
        conversation_id: convId,
        user_id: userId,
        role: "user",
        content: lastMsg.content,
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are VentureShield AI Strategist, an AI business strategist and interviewer. Your role is to have a natural, engaging conversation with entrepreneurs to deeply understand their business goals, motivations, challenges, and vision.

CONVERSATION PHASES:
1. **DISCOVERY** (first 2-3 messages): Greet warmly. Ask about their background, what drives them, and what problem they want to solve. Be curious and empathetic.
2. **DEEP DIVE** (next 2-3 messages): Probe deeper into their industry knowledge, target market, competitive awareness, financial readiness, and risk tolerance. Ask ONE focused question at a time.
3. **INSIGHT** (after 4-5 exchanges): Synthesize what you've learned. Share a brief assessment of their readiness, strengths, and blind spots.
4. **UNLOCK** (after sufficient understanding): When you feel you understand their motive and readiness well enough, include the exact marker **[SEARCH_UNLOCKED]** in your response. Tell them you're granting them access to the Business Discovery Search tool based on their profile. Summarize their entrepreneur profile in 3-4 bullet points.

PERSONALITY:
- Warm but sharp. You notice things others miss.
- Use short, punchy sentences mixed with longer insights.
- Occasionally use metaphors related to navigation/exploration.
- Never be generic. Tailor every response to what they've shared.

RULES:
- Ask only ONE question per message (keep focused).
- Never unlock search before at least 4 user messages.
- If the user tries to skip ahead, gently redirect them back to the conversation.
- Keep responses under 150 words unless synthesizing insights.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tee the upstream stream: forward to client AND collect text to persist + detect unlock.
    const [forwardStream, collectStream] = aiResponse.body!.tee();

    (async () => {
      try {
        const reader = collectStream.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let assistantText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const c = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (c) assistantText += c;
            } catch { /* ignore */ }
          }
        }

        if (assistantText) {
          const cleaned = assistantText.replace("[SEARCH_UNLOCKED]", "").trim();
          await adminClient.from("chat_messages").insert({
            conversation_id: convId,
            user_id: userId,
            role: "assistant",
            content: cleaned,
          });
          if (assistantText.includes("[SEARCH_UNLOCKED]")) {
            await adminClient
              .from("chat_conversations")
              .update({ search_unlocked: true })
              .eq("id", convId);
          }
        }
      } catch (e) {
        console.error("Error persisting assistant message:", e);
      }
    })();

    return new Response(forwardStream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Conversation-Id": convId!,
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
