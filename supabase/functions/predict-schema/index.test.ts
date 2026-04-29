import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/predict-schema`;

const EXPECTED_SCHEMA_VERSION = "1.0.0";

Deno.test("predict-schema: GET returns 200 with expected schema_version", async () => {
  const res = await fetch(FUNCTION_URL, { method: "GET" });
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.schema_version, EXPECTED_SCHEMA_VERSION);
  assertEquals(body.endpoint, "predict");
});

Deno.test("predict-schema: response body describes request + response contracts", async () => {
  const res = await fetch(FUNCTION_URL, { method: "GET" });
  const body = await res.json();
  assertEquals(body.request.type, "object");
  assert(Array.isArray(body.request.required));
  assert(body.request.required.includes("businessIdea"));
  assertEquals(body.request.properties.businessIdea.type, "string");
  assertEquals(body.response.type, "object");
  assertEquals(body.response.properties.schema_version.type, "string");
  assertEquals(body.response.properties.risk_level.enum, ["low", "medium", "high"]);
});

Deno.test("predict-schema: GET returns CORS + cache + content-type headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "GET" });
  await res.text();
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  const allowHeaders = res.headers.get("access-control-allow-headers") ?? "";
  assert(allowHeaders.includes("authorization"));
  assert(allowHeaders.includes("content-type"));
  assert((res.headers.get("content-type") ?? "").includes("application/json"));
  assert((res.headers.get("cache-control") ?? "").includes("max-age"));
});

Deno.test("predict-schema: OPTIONS preflight returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
    headers: {
      "Origin": "https://example.com",
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization, content-type",
    },
  });
  await res.text();
  assert(res.status === 200 || res.status === 204);
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  const allowHeaders = res.headers.get("access-control-allow-headers") ?? "";
  assert(allowHeaders.includes("authorization"));
  assert(allowHeaders.includes("content-type"));
});

Deno.test("predict-schema: accessible without Authorization header (public)", async () => {
  const res = await fetch(FUNCTION_URL, { method: "GET" });
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.schema_version, EXPECTED_SCHEMA_VERSION);
});
