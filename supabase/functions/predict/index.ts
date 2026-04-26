import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Service-role client for DB writes
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an AI business analyst expert. Analyze the provided business idea and company metrics to predict business success/failure risk.

Your analysis should:
1. Calculate a risk_score (0-100, where 0 is lowest risk and 100 is highest risk of failure)
2. Provide a confidence level (0-100) for your assessment
3. Write a concise 2-sentence summary of the business outlook
4. Generate exactly 3 actionable recommendations for improvement

Consider these factors in your analysis:
- Financial health (revenue, expenses, cash flow, debt ratio)
- Market conditions (industry, market growth)
- Operational metrics (employee turnover)
- Innovation capability (innovation score)

Return ONLY valid JSON with this exact structure:
{
  "risk_score": number,
  "confidence": number,
  "risk_level": "low" | "medium" | "high",
  "summary": "string",
  "recommendations": ["string", "string", "string"]
}`;

    const userPrompt = `Business Idea: ${sanitizedBusinessIdea}

Company Metrics:
${companyData ? JSON.stringify(companyData, null, 2) : 'No specific metrics provided yet'}

Analyze this business and provide your assessment.`;

    console.log('Calling Lovable AI for prediction...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
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
    const aiContent = aiData.choices[0].message.content;
    
    console.log('AI Response:', aiContent);
    
    // Parse the AI response
    let prediction;
    try {
      prediction = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Provide a fallback response
      prediction = {
        risk_score: 50,
        confidence: 60,
        risk_level: 'medium',
        summary: 'Analysis pending. Please provide more detailed business metrics for accurate prediction.',
        recommendations: [
          'Provide detailed financial metrics for better analysis',
          'Include market research data',
          'Define clear business objectives'
        ]
      };
    }

    // Save prediction to database
    const predictionData = {
      user_id: user.id,
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
