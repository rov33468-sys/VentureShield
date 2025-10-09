import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, TrendingUp, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface PredictionResultsProps {
  result: {
    companyName: string;
    industry: string;
    risk_score: number;
    confidence: number;
    summary: string;
    recommendations: string[];
    risk_level?: string;
  };
  onSaveComplete?: () => void;
}

export default function PredictionResults({ result, onSaveComplete }: PredictionResultsProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-destructive';
    if (score >= 40) return 'text-amber-500';
    return 'text-green-500';
  };

  const getRiskBadgeVariant = (score: number): "destructive" | "default" | "secondary" => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'default';
    return 'secondary';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const handleSaveReport = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('predictions').insert({
        user_id: user.id,
        company_name: result.companyName,
        industry: result.industry,
        risk_score: result.risk_score,
        confidence: result.confidence,
        summary: result.summary,
        recommendations: result.recommendations,
        risk_level: result.risk_level || getRiskLevel(result.risk_score),
      });

      if (error) throw error;

      toast({
        title: "Report Saved",
        description: "Your prediction has been saved to history",
      });
      
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save report",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${getRiskColor(result.risk_score)}`}>
              {result.risk_score}%
            </div>
            <Progress value={result.risk_score} className="mt-2" />
            <Badge variant={getRiskBadgeVariant(result.risk_score)} className="mt-2">
              {getRiskLevel(result.risk_score)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confidence Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {result.confidence}%
            </div>
            <Progress value={result.confidence} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">Analysis Accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Company Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-semibold">{result.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-semibold">{result.industry}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
          <CardDescription>AI-generated action items to mitigate risks</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button onClick={handleSaveReport} disabled={saving} className="w-full" size="lg">
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Report'}
      </Button>
    </div>
  );
}
