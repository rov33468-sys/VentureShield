import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface PredictionResultsProps {
  prediction: {
    risk_score: number;
    confidence: number;
    risk_level: 'low' | 'medium' | 'high';
    summary: string;
    recommendations: string[];
  };
  onNewPrediction: () => void;
}

export default function PredictionResults({ prediction, onNewPrediction }: PredictionResultsProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle2 className="h-8 w-8" />;
      case 'medium': return <AlertTriangle className="h-8 w-8" />;
      case 'high': return <AlertCircle className="h-8 w-8" />;
      default: return <TrendingDown className="h-8 w-8" />;
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
        <p className="text-muted-foreground">AI-powered business risk assessment</p>
      </div>

      {/* Risk Score Card */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Risk Assessment</span>
            <Badge variant={getRiskBadgeVariant(prediction.risk_level)}>
              {prediction.risk_level.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className={`${getRiskColor(prediction.risk_level)} mr-4`}>
              {getRiskIcon(prediction.risk_level)}
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{prediction.risk_score}%</div>
              <p className="text-sm text-muted-foreground mt-1">Failure Risk Score</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Level</span>
              <span className="font-semibold">{prediction.risk_score}%</span>
            </div>
            <Progress value={prediction.risk_score} className="h-3" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence Level</span>
              <span className="font-semibold">{prediction.confidence}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Outlook Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{prediction.summary}</p>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Improvement Recommendations</CardTitle>
          <CardDescription>
            Actionable steps to reduce business risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {prediction.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{index + 1}</span>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">{rec}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onNewPrediction} size="lg">
          Analyze Another Business
        </Button>
      </div>
    </div>
  );
}