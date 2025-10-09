import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface FormData {
  companyName: string;
  industry: string;
  revenue: string;
  expenses: string;
  debtRatio: string;
  marketGrowth: string;
  employeeTurnover: string;
  innovationScore: string;
}

interface PredictionResult {
  risk_score: number;
  confidence: number;
  summary: string;
  recommendations: string[];
  risk_level: string;
}

interface RiskPredictionFormProps {
  onPredictionComplete: (result: PredictionResult & FormData) => void;
}

export default function RiskPredictionForm({ onPredictionComplete }: RiskPredictionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    industry: '',
    revenue: '',
    expenses: '',
    debtRatio: '',
    marketGrowth: '',
    employeeTurnover: '',
    innovationScore: '',
  });

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('predict', {
        body: {
          businessIdea: `${formData.companyName} in ${formData.industry} industry`,
          companyData: {
            company_name: formData.companyName,
            industry: formData.industry,
            revenue: parseFloat(formData.revenue),
            expenses: parseFloat(formData.expenses),
            debt_ratio: parseFloat(formData.debtRatio),
            market_growth: parseFloat(formData.marketGrowth),
            employee_turnover: parseFloat(formData.employeeTurnover),
            innovation_score: parseFloat(formData.innovationScore),
          }
        }
      });

      if (error) throw error;

      if (data?.success && data?.prediction) {
        toast({
          title: "Prediction Complete",
          description: "Risk analysis has been generated successfully",
        });
        onPredictionComplete({ ...data.prediction, ...formData });
      } else {
        throw new Error('Invalid response from prediction service');
      }
    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: error.message || "Failed to generate prediction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Risk Assessment</CardTitle>
        <CardDescription>Enter your company metrics for AI-powered risk analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Acme Corp"
                value={formData.companyName}
                onChange={handleChange('companyName')}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="Technology"
                value={formData.industry}
                onChange={handleChange('industry')}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                placeholder="1000000"
                value={formData.revenue}
                onChange={handleChange('revenue')}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenses">Expenses ($)</Label>
              <Input
                id="expenses"
                type="number"
                step="0.01"
                placeholder="800000"
                value={formData.expenses}
                onChange={handleChange('expenses')}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debtRatio">Debt Ratio (%)</Label>
              <Input
                id="debtRatio"
                type="number"
                step="0.01"
                placeholder="45"
                value={formData.debtRatio}
                onChange={handleChange('debtRatio')}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketGrowth">Market Growth (%)</Label>
              <Input
                id="marketGrowth"
                type="number"
                step="0.01"
                placeholder="5.5"
                value={formData.marketGrowth}
                onChange={handleChange('marketGrowth')}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeTurnover">Employee Turnover (%)</Label>
              <Input
                id="employeeTurnover"
                type="number"
                step="0.01"
                placeholder="12"
                value={formData.employeeTurnover}
                onChange={handleChange('employeeTurnover')}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="innovationScore">Innovation Score (0-100)</Label>
              <Input
                id="innovationScore"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="75"
                value={formData.innovationScore}
                onChange={handleChange('innovationScore')}
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
