import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/sentiment`;

Deno.test("sentiment: missing Authorization header returns 401 with { error: 'Unauthorized' }", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "I love this product!" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("sentiment: malformed Authorization header (no Bearer prefix) returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "not-a-bearer-token" },
    body: JSON.stringify({ text: "I love this product!" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("sentiment: empty Authorization header returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "" },
    body: JSON.stringify({ text: "I love this product!" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});
