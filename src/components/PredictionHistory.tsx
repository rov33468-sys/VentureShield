import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, Calendar, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface Prediction {
  id: string;
  created_at: string;
  company_name: string;
  industry: string;
  risk_score: number;
  confidence: number;
  risk_level: string;
  summary: string;
  recommendations: string[];
}

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPredictions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load prediction history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <TrendingDown className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Predictions Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start analyzing businesses to see your prediction history here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Prediction History</h2>
        <p className="text-muted-foreground">
          Review your past business risk assessments
        </p>
      </div>

      <div className="grid gap-4">
        {predictions.map((prediction) => (
          <Card key={prediction.id} className="shadow-card hover:shadow-elegant transition-smooth">
            <Collapsible>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {prediction.company_name || 'Unnamed Company'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(prediction.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getRiskBadgeVariant(prediction.risk_level)}>
                      {prediction.risk_level?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{prediction.risk_score}%</div>
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="ml-2 font-medium">{prediction.industry || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="ml-2 font-medium">{prediction.confidence}%</span>
                  </div>
                </div>

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full">
                    <span>View Details</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-4 pt-4 border-t">
                  <div>
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prediction.summary}
                    </p>
                  </div>

                  {prediction.recommendations && prediction.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="flex gap-2 text-sm">
                            <span className="text-primary">•</span>
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}