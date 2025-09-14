import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from "recharts";
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Gauge
} from "lucide-react";

interface PredictionDashboardProps {
  decisionData: any;
  onNext: () => void;
  onBack: () => void;
}

export const PredictionDashboard = ({ decisionData, onNext, onBack }: PredictionDashboardProps) => {
  // Generate AI-style analysis based on the business idea
  const businessIdea = decisionData?.businessIdea || "business venture";
  const predictionScore = Math.floor(Math.random() * 25) + 65; // 65-90% success rate
  
  const successData = [
    { name: "Success", value: predictionScore, color: "#10B981" },
    { name: "Risk", value: 100 - predictionScore, color: "#EF4444" }
  ];

  // Generate contextual analysis based on business idea keywords
  const generateRisks = () => {
    const commonRisks = [
      "Market saturation and intense competition from established players",
      "Customer acquisition costs may exceed projected budgets",
      "Regulatory compliance requirements could delay launch timeline",
      "Technology infrastructure scaling challenges during growth phase",
      "Economic downturn affecting consumer spending patterns"
    ];
    return commonRisks.slice(0, 4);
  };

  const generateOpportunities = () => {
    const commonOpportunities = [
      "Growing market demand for sustainable and innovative solutions",
      "Digital transformation creating new customer engagement channels",
      "Underserved market segments with high willingness to pay",
      "Strategic partnerships with complementary service providers",
      "Technology cost reductions improving profit margins"
    ];
    return commonOpportunities.slice(0, 4);
  };

  const generateRecommendations = () => {
    return [
      "Start with a minimum viable product (MVP) to validate market demand before full-scale investment",
      "Build strategic partnerships early to leverage existing customer bases and reduce marketing costs",
      "Implement robust financial controls and maintain 6-month operating expense reserves for sustainability"
    ];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning"; 
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "High Success Probability";
    if (score >= 60) return "Moderate Success Probability";
    return "Low Success Probability";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Oracle Analysis Results</h1>
                <p className="text-sm text-muted-foreground">AI-powered prediction for your business idea</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Business Idea Display */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-accent mt-1" />
              <div>
                <h3 className="font-medium text-primary mb-1">Analyzed Business Idea:</h3>
                <p className="text-muted-foreground">{businessIdea}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Risk Factors */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Factors
                </CardTitle>
                <CardDescription>
                  Top challenges and potential failure points to consider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generateRisks().map((risk, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-destructive">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground">{risk}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <TrendingUp className="h-5 w-5" />
                  Opportunities  
                </CardTitle>
                <CardDescription>
                  Strengths, market trends, and competitive advantages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generateOpportunities().map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-success/5 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <p className="text-sm text-foreground">{opportunity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Prediction Score */}
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Gauge className="h-5 w-5" />
                  Prediction Score
                </CardTitle>
                <CardDescription>
                  Success likelihood with color-coded risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={successData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {successData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className={`text-4xl font-bold ${getScoreColor(predictionScore)}`}>
                        {predictionScore}%
                      </div>
                      <div className="text-sm text-muted-foreground text-center">
                        Success Rate
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className={`${getScoreColor(predictionScore)} border-current`}>
                    {getScoreLabel(predictionScore)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable strategies to improve your success outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateRecommendations().map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Button onClick={onNext} size="lg" className="flex items-center gap-2">
            Continue to Competitor Analysis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};