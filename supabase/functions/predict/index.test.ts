import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/predict`;

Deno.test("predict: missing Authorization header returns 401 with { error: 'Unauthorized' }", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyMetrics: {} }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("predict: malformed Authorization header (no Bearer prefix) returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "not-a-bearer-token" },
    body: JSON.stringify({ companyMetrics: {} }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("predict: empty Authorization header returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "" },
    body: JSON.stringify({ companyMetrics: {} }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("predict: no auth + empty body returns 401 (not 400)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "",
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("predict: no auth + malformed JSON body returns 401 (not 400)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not valid json",
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("predict: no auth + no body at all returns 401 (not 400)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

Deno.test("predict: bogus Bearer token + malformed body returns 401 (not 400/500)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer not-a-real-jwt" },
    body: "{not valid json",
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body, { error: "Unauthorized" });
});

// Note: 400 validation responses require a valid JWT (auth runs first).
// These contract tests verify auth-first behavior; authenticated 400 paths
// are exercised via the app and manual curl_edge_functions calls.

