-- Add new columns to predictions table for comprehensive business analysis
ALTER TABLE public.predictions
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS market_growth NUMERIC,
ADD COLUMN IF NOT EXISTS employee_turnover NUMERIC,
ADD COLUMN IF NOT EXISTS innovation_score NUMERIC,
ADD COLUMN IF NOT EXISTS confidence NUMERIC,
ADD COLUMN IF NOT EXISTS summary TEXT;

-- Update recommendations column to use text array instead of plain text
ALTER TABLE public.predictions 
ALTER COLUMN recommendations TYPE TEXT[] USING 
  CASE 
    WHEN recommendations IS NULL THEN NULL
    WHEN recommendations = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY[recommendations]
  END;