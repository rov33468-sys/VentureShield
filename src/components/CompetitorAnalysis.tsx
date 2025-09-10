import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, TrendingDown, Target, Zap, Shield, DollarSign, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface CompetitorAnalysisProps {
  decisionData: any;
  onNext: () => void;
  onBack: () => void;
}

export function CompetitorAnalysis({ decisionData, onNext, onBack }: CompetitorAnalysisProps) {
  const competitors = [
    {
      name: "MarketLeader Corp",
      marketShare: 35,
      strengths: ["Strong brand recognition", "Extensive distribution network", "Large R&D budget"],
      weaknesses: ["Slow innovation cycles", "High operational costs", "Legacy technology"],
      financialStrength: 85,
      innovation: 60,
      customerLoyalty: 78,
      distribution: 92,
      pricing: 45
    },
    {
      name: "InnovateTech Solutions",
      marketShare: 22,
      strengths: ["Cutting-edge technology", "Agile development", "Strong online presence"],
      weaknesses: ["Limited resources", "Narrow product focus", "Small customer base"],
      financialStrength: 55,
      innovation: 95,
      customerLoyalty: 65,
      distribution: 40,
      pricing: 80
    },
    {
      name: "GlobalReach Industries",
      marketShare: 18,
      strengths: ["International presence", "Cost leadership", "Economies of scale"],
      weaknesses: ["Poor customer service", "Generic products", "Regulatory issues"],
      financialStrength: 75,
      innovation: 40,
      customerLoyalty: 35,
      distribution: 88,
      pricing: 90
    }
  ];

  const predictedMoves = [
    {
      competitor: "MarketLeader Corp",
      timeframe: "30-60 days",
      likelihood: 85,
      move: "Price reduction campaign",
      description: "Likely to reduce prices by 10-15% to maintain market dominance",
      impact: "High",
      type: "defensive"
    },
    {
      competitor: "InnovateTech Solutions",
      timeframe: "60-90 days",
      likelihood: 70,
      move: "Feature enhancement",
      description: "Will accelerate product development to match your new features",
      impact: "Medium",
      type: "competitive"
    },
    {
      competitor: "GlobalReach Industries",
      timeframe: "90-120 days",
      likelihood: 60,
      move: "Partnership announcement",
      description: "May partner with local distributors to strengthen market position",
      impact: "Medium",
      type: "strategic"
    }
  ];

  const counterStrategies = [
    {
      title: "Differentiation Focus",
      description: "Emphasize unique value proposition that competitors can't easily replicate",
      effectiveness: 82,
      effort: "Medium",
      tactics: [
        "Highlight superior customer service",
        "Focus on specialized features",
        "Build strong brand community"
      ]
    },
    {
      title: "Speed to Market",
      description: "Accelerate launch timeline to establish first-mover advantage",
      effectiveness: 75,
      effort: "High",
      tactics: [
        "Parallel development processes",
        "Strategic partnerships for faster deployment",
        "Minimum viable product approach"
      ]
    },
    {
      title: "Niche Market Penetration",
      description: "Target underserved segments where competitors are weak",
      effectiveness: 78,
      effort: "Low",
      tactics: [
        "Focus on SMB market",
        "Geographic expansion to overlooked regions",
        "Vertical-specific solutions"
      ]
    }
  ];

  const competitorStrengthData = competitors.map(comp => ({
    name: comp.name.split(' ')[0],
    financial: comp.financialStrength,
    innovation: comp.innovation,
    loyalty: comp.customerLoyalty,
    distribution: comp.distribution,
    pricing: comp.pricing
  }));

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getMoveTypeIcon = (type: string) => {
    switch (type) {
      case 'defensive': return Shield;
      case 'competitive': return Target;
      case 'strategic': return Zap;
      default: return Target;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Competitor & Opponent Analysis
            </h1>
            <p className="text-muted-foreground mt-2">
              Strategic intelligence for: <span className="font-semibold">{decisionData?.projectName}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={onNext}>
              View Simulation & Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Competitor Profiles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Competitor Business Model Snapshot
          </CardTitle>
          <CardDescription>
            Detailed analysis of key competitors in your market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {competitors.map((competitor, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{competitor.name}</h3>
                    <Badge variant="outline">{competitor.marketShare}% share</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Strengths
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {competitor.strengths.map((strength, i) => (
                        <li key={i}>• {strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Weaknesses
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {competitor.weaknesses.map((weakness, i) => (
                        <li key={i}>• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Financial Strength</span>
                      <span>{competitor.financialStrength}%</span>
                    </div>
                    <Progress value={competitor.financialStrength} className="h-1" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Innovation</span>
                      <span>{competitor.innovation}%</span>
                    </div>
                    <Progress value={competitor.innovation} className="h-1" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Customer Loyalty</span>
                      <span>{competitor.customerLoyalty}%</span>
                    </div>
                    <Progress value={competitor.customerLoyalty} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Strength Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Competitor Strength Comparison</CardTitle>
            <CardDescription>
              Relative positioning across key business dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitorStrengthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="financial" fill="hsl(var(--primary))" name="Financial" />
                  <Bar dataKey="innovation" fill="hsl(var(--accent))" name="Innovation" />
                  <Bar dataKey="loyalty" fill="hsl(var(--success))" name="Customer Loyalty" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Position Radar</CardTitle>
            <CardDescription>
              Multi-dimensional competitive analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { metric: 'Financial', MarketLeader: 85, InnovateTech: 55, GlobalReach: 75 },
                  { metric: 'Innovation', MarketLeader: 60, InnovateTech: 95, GlobalReach: 40 },
                  { metric: 'Loyalty', MarketLeader: 78, InnovateTech: 65, GlobalReach: 35 },
                  { metric: 'Distribution', MarketLeader: 92, InnovateTech: 40, GlobalReach: 88 },
                  { metric: 'Pricing', MarketLeader: 45, InnovateTech: 80, GlobalReach: 90 }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="MarketLeader" dataKey="MarketLeader" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                  <Radar name="InnovateTech" dataKey="InnovateTech" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.1} />
                  <Radar name="GlobalReach" dataKey="GlobalReach" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.1} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predicted Moves */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Predicted Competitor Moves
          </CardTitle>
          <CardDescription>
            AI forecasts of how competitors may respond to your market entry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictedMoves.map((move, index) => {
              const IconComponent = getMoveTypeIcon(move.type);
              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="font-semibold text-sm">{move.competitor}</span>
                    </div>
                    <Badge variant={getImpactColor(move.impact) as any} className="text-xs">
                      {move.impact} Impact
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{move.move}</h4>
                    <p className="text-xs text-muted-foreground">{move.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Likelihood</span>
                      <span>{move.likelihood}%</span>
                    </div>
                    <Progress value={move.likelihood} className="h-1" />
                    <div className="text-xs text-muted-foreground">
                      Expected: {move.timeframe}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Counter-Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Recommended Counter-Strategies
          </CardTitle>
          <CardDescription>
            Strategic approaches to outperform your competition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {counterStrategies.map((strategy, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{strategy.title}</h3>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Effectiveness</span>
                    <span className="text-sm font-bold text-success">{strategy.effectiveness}%</span>
                  </div>
                  <Progress value={strategy.effectiveness} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Implementation Effort: {strategy.effort}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Key Tactics</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {strategy.tactics.map((tactic, i) => (
                      <li key={i}>• {tactic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}