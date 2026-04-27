import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate FIRST — before parsing/validating any body data
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = claimsData.claims.sub;

    // Input validation and sanitization
    const requestBody = await req.json();
    const { businessIdea, companyData } = requestBody;

    // Validate businessIdea
    if (!businessIdea || typeof businessIdea !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid businessIdea: must be a non-empty string' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (businessIdea.length > 2000) {
      return new Response(JSON.stringify({ error: 'businessIdea exceeds maximum length of 2000 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize businessIdea (remove potential XSS)
    const sanitizedBusinessIdea = businessIdea.trim().replace(/[<>]/g, '');

    // Validate companyData if provided
    if (companyData) {
      if (typeof companyData !== 'object' || Array.isArray(companyData)) {
        return new Response(JSON.stringify({ error: 'Invalid companyData: must be an object' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate string fields
      const stringFields = ['company_name', 'industry'];
      for (const field of stringFields) {
        if (companyData[field]) {
          if (typeof companyData[field] !== 'string') {
            return new Response(JSON.stringify({ error: `${field} must be a string` }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          if (companyData[field].length > 200) {
            return new Response(JSON.stringify({ error: `${field} exceeds maximum length of 200 characters` }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          // Sanitize string fields
          companyData[field] = companyData[field].trim().replace(/[<>]/g, '');
        }
      }

      // Validate numeric fields
      const numericFields = ['revenue', 'expenses', 'cash_flow', 'debt_ratio', 'market_growth', 'employee_turnover', 'innovation_score'];
      for (const field of numericFields) {
        if (companyData[field] !== undefined && companyData[field] !== null) {
          const value = Number(companyData[field]);
          if (isNaN(value) || !isFinite(value)) {
            return new Response(JSON.stringify({ error: `${field} must be a valid number` }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          // Range validation for percentages
          if (['debt_ratio', 'market_growth', 'employee_turnover', 'innovation_score'].includes(field)) {
            if (value < 0 || value > 100) {
              return new Response(JSON.stringify({ error: `${field} must be between 0 and 100` }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          }
          // Range validation for financial fields
          if (['revenue', 'expenses', 'cash_flow'].includes(field)) {
            if (value < -1000000000 || value > 1000000000000) {
              return new Response(JSON.stringify({ error: `${field} is out of acceptable range` }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          }
          companyData[field] = value;
        }
      }
    }
    
    // Service-role client for DB writes
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are VentureShield's senior AI risk analyst. You evaluate startup and business viability with the rigor of a venture capital partner combined with a forensic financial auditor.

SCORING METHODOLOGY (apply consistently):
- risk_score (0-100): Probability the venture FAILS within 24 months. 0 = bulletproof, 100 = imminent collapse.
  • 0-25  = low risk: strong unit economics, healthy cash flow, growing market
  • 26-55 = medium risk: viable but with material weaknesses
  • 56-100 = high risk: serious red flags or insufficient information
- confidence (0-100): How much the provided data supports your conclusion. If metrics are missing or vague, confidence MUST drop below 60.
- risk_level: Map directly from risk_score using the bands above.

EVALUATION FRAMEWORK — weigh these dimensions:
1. Financial health: revenue vs expenses, cash flow runway, debt_ratio (>60% is concerning)
2. Market dynamics: market_growth (<3% is stagnant, >15% is hot), industry maturity
3. Operations: employee_turnover (>25% is a culture/leadership red flag)
4. Innovation moat: innovation_score (<40 means commoditization risk)
5. Idea–market fit: does the business idea match the metrics and industry?

OUTPUT RULES:
- summary: 2 crisp sentences. First sentence states the verdict; second sentence names the single most important driver.
- recommendations: EXACTLY 3 specific, actionable next steps. No platitudes ("work harder"). Each must reference a concrete metric, channel, or experiment.
- If data is sparse, say so explicitly in the summary and lower confidence — do NOT fabricate optimism.`;

    const userPrompt = `Business Idea: ${sanitizedBusinessIdea}

Company Metrics:
${companyData ? JSON.stringify(companyData, null, 2) : 'No specific metrics provided yet'}

Produce your risk assessment by calling the report_risk_assessment tool.`;

    console.log('Calling Lovable AI for prediction...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'report_risk_assessment',
              description: 'Return the structured risk assessment for the venture.',
              parameters: {
                type: 'object',
                properties: {
                  risk_score: { type: 'number', description: 'Failure probability 0-100' },
                  confidence: { type: 'number', description: 'Confidence in the assessment 0-100' },
                  risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
                  summary: { type: 'string', description: 'Two-sentence verdict' },
                  recommendations: {
                    type: 'array',
                    minItems: 3,
                    maxItems: 3,
                    items: { type: 'string' },
                  },
                },
                required: ['risk_score', 'confidence', 'risk_level', 'summary', 'recommendations'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'report_risk_assessment' } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway Error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    let prediction: {
      risk_score: number;
      confidence: number;
      risk_level: 'low' | 'medium' | 'high';
      summary: string;
      recommendations: string[];
    };

    try {
      if (!toolCall?.function?.arguments) throw new Error('Missing tool call');
      prediction = JSON.parse(toolCall.function.arguments);
      // Clamp & normalize
      prediction.risk_score = Math.max(0, Math.min(100, Number(prediction.risk_score) || 50));
      prediction.confidence = Math.max(0, Math.min(100, Number(prediction.confidence) || 60));
      if (!['low', 'medium', 'high'].includes(prediction.risk_level)) {
        prediction.risk_level = prediction.risk_score <= 25 ? 'low' : prediction.risk_score <= 55 ? 'medium' : 'high';
      }
      if (!Array.isArray(prediction.recommendations) || prediction.recommendations.length === 0) {
        prediction.recommendations = [
          'Provide detailed financial metrics for better analysis',
          'Include market research data',
          'Define clear business objectives',
        ];
      }
    } catch (parseError) {
      console.error('Failed to parse AI tool call:', parseError);
      prediction = {
        risk_score: 50,
        confidence: 50,
        risk_level: 'medium',
        summary: 'Analysis pending. Insufficient structured data to produce a confident verdict.',
        recommendations: [
          'Provide detailed financial metrics (revenue, expenses, cash flow)',
          'Add market context (industry, growth rate, competition)',
          'Clarify the core value proposition and target customer',
        ],
      };
    }

    // Save prediction to database
    const predictionData = {
      user_id: userId,
      company_name: companyData?.company_name || null,
      industry: companyData?.industry || null,
      revenue: companyData?.revenue || null,
      expenses: companyData?.expenses || null,
      cash_flow: companyData?.cash_flow || null,
      debt_ratio: companyData?.debt_ratio || null,
      market_growth: companyData?.market_growth || null,
      employee_turnover: companyData?.employee_turnover || null,
      innovation_score: companyData?.innovation_score || null,
      risk_score: prediction.risk_score,
      confidence: prediction.confidence,
      risk_level: prediction.risk_level,
      summary: prediction.summary,
      recommendations: prediction.recommendations,
    };

    const { data: savedPrediction, error: saveError } = await supabase
      .from('predictions')
      .insert([predictionData])
      .select()
      .single();

    if (saveError) {
      console.error('Error saving prediction:', saveError);
      throw saveError;
    }

    console.log('Prediction saved successfully');

    return new Response(JSON.stringify({
      ...prediction,
      id: savedPrediction.id,
      created_at: savedPrediction.created_at
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predict function:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
