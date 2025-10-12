import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const formSchema = z.object({
  company_name: z.string().trim().min(1, 'Company name is required').max(200),
  industry: z.string().trim().min(1, 'Industry is required').max(200),
  revenue: z.number().min(0).max(1000000000000),
  expenses: z.number().min(0).max(1000000000000),
  debt_ratio: z.number().min(0).max(100),
  market_growth: z.number().min(0).max(100),
  employee_turnover: z.number().min(0).max(100),
  innovation_score: z.number().min(0).max(100),
});

interface RiskPredictionFormProps {
  onPredictionComplete: (prediction: any) => void;
}

export default function RiskPredictionForm({ onPredictionComplete }: RiskPredictionFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    revenue: '',
    expenses: '',
    debt_ratio: '',
    market_growth: '',
    employee_turnover: '',
    innovation_score: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string inputs to numbers
      const numericData = {
        company_name: formData.company_name.trim(),
        industry: formData.industry.trim(),
        revenue: parseFloat(formData.revenue) || 0,
        expenses: parseFloat(formData.expenses) || 0,
        debt_ratio: parseFloat(formData.debt_ratio) || 0,
        market_growth: parseFloat(formData.market_growth) || 0,
        employee_turnover: parseFloat(formData.employee_turnover) || 0,
        innovation_score: parseFloat(formData.innovation_score) || 0,
      };

      // Validate with zod
      formSchema.parse(numericData);

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call the predict function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            businessIdea: `${numericData.company_name} - ${numericData.industry} company`,
            companyData: numericData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }

      const prediction = await response.json();
      
      toast({
        title: "Analysis Complete",
        description: "Your business risk prediction is ready",
      });
      
      onPredictionComplete(prediction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: err.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to analyze business",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-2xl">Business Risk Analysis</CardTitle>
        <CardDescription>
          Enter your company metrics for AI-powered failure prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Acme Corp"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="Technology"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Annual Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue}
                onChange={(e) => handleInputChange('revenue', e.target.value)}
                placeholder="1000000"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Annual Expenses ($)</Label>
              <Input
                id="expenses"
                type="number"
                value={formData.expenses}
                onChange={(e) => handleInputChange('expenses', e.target.value)}
                placeholder="800000"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debt_ratio">Debt Ratio (%)</Label>
              <Input
                id="debt_ratio"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.debt_ratio}
                onChange={(e) => handleInputChange('debt_ratio', e.target.value)}
                placeholder="45"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market_growth">Market Growth Rate (%)</Label>
              <Input
                id="market_growth"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.market_growth}
                onChange={(e) => handleInputChange('market_growth', e.target.value)}
                placeholder="15"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_turnover">Employee Turnover Rate (%)</Label>
              <Input
                id="employee_turnover"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.employee_turnover}
                onChange={(e) => handleInputChange('employee_turnover', e.target.value)}
                placeholder="12"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="innovation_score">Innovation Score (0-100)</Label>
              <Input
                id="innovation_score"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.innovation_score}
                onChange={(e) => handleInputChange('innovation_score', e.target.value)}
                placeholder="75"
                required
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Predict Risk'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}