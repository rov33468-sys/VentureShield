import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Keep in sync with supabase/functions/predict/index.ts PREDICT_SCHEMA_VERSION
const PREDICT_SCHEMA_VERSION = '1.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Machine-readable description of the active predict request contract.
// The frontend can fetch this to render dynamic forms or gate features by version.
const SCHEMA = {
  schema_version: PREDICT_SCHEMA_VERSION,
  endpoint: 'predict',
  request: {
    type: 'object',
    required: ['businessIdea'],
    additionalProperties: false,
    properties: {
      businessIdea: { type: 'string', minLength: 1, maxLength: 2000 },
      companyData: {
        type: 'object',
        additionalProperties: false,
        properties: {
          company_name: { type: 'string', maxLength: 200 },
          industry: { type: 'string', maxLength: 200 },
          revenue: { type: 'number', min: -1_000_000_000, max: 1_000_000_000_000, nullable: true },
          expenses: { type: 'number', min: -1_000_000_000, max: 1_000_000_000_000, nullable: true },
          cash_flow: { type: 'number', min: -1_000_000_000, max: 1_000_000_000_000, nullable: true },
          debt_ratio: { type: 'number', min: 0, max: 100, nullable: true },
          market_growth: { type: 'number', min: 0, max: 100, nullable: true },
          employee_turnover: { type: 'number', min: 0, max: 100, nullable: true },
          innovation_score: { type: 'number', min: 0, max: 100, nullable: true },
        },
      },
    },
  },
  response: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      created_at: { type: 'string', format: 'date-time' },
      schema_version: { type: 'string' },
      risk_score: { type: 'number', min: 0, max: 100 },
      confidence: { type: 'number', min: 0, max: 100 },
      risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
      summary: { type: 'string' },
      recommendations: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 3 },
    },
  },
};

serve((req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return new Response(JSON.stringify(SCHEMA), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
});
