import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/business-search`;

Deno.test("business-search: missing Authorization header returns 401 with { error: 'Unauthorized' }", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "fintech" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("business-search: malformed Authorization header (no Bearer prefix) returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "not-a-bearer-token" },
    body: JSON.stringify({ query: "fintech" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("business-search: empty Authorization header returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "" },
    body: JSON.stringify({ query: "fintech" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});
