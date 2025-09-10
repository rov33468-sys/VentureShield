import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown, Shield, DollarSign, Clock, Scale, Gavel, Lightbulb, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar } from "recharts";

interface PredictionDashboardProps {
  decisionData: any;
  onNext: () => void;
  onBack: () => void;
}

export function PredictionDashboard({ decisionData, onNext, onBack }: PredictionDashboardProps) {
  const successProbability = 68;
  const failureProbability = 32;

  const riskData = [
    { name: "Financial", value: 45, color: "hsl(var(--destructive))" },
    { name: "Operational", value: 30, color: "hsl(var(--warning))" },
    { name: "Market", value: 55, color: "hsl(var(--primary))" },
    { name: "Legal", value: 15, color: "hsl(var(--success))" }
  ];

  const probabilityData = [
    { name: "Success", value: successProbability, fill: "hsl(var(--success))" },
    { name: "Failure", value: failureProbability, fill: "hsl(var(--destructive))" }
  ];

  const blindSpots = [
    {
      type: "Financial Risk",
      severity: "High",
      message: "Budget may be underestimated by 25-40% based on similar projects in your industry",
      icon: DollarSign,
      color: "destructive"
    },
    {
      type: "Market Timing",
      severity: "Medium",
      message: "Seasonal trends suggest launching in Q2 instead of Q1 could improve success by 15%",
      icon: Clock,
      color: "warning"
    },
    {
      type: "Competitor Response",
      severity: "High",
      message: "Market leaders typically counter with pricing wars within 60-90 days of new entrants",
      icon: Shield,
      color: "destructive"
    }
  ];

  const alternatives = [
    {
      title: "Phased Market Entry",
      description: "Launch in 1-2 regions first, then expand based on performance",
      successRate: 78,
      pros: ["Lower initial risk", "Learn and adapt", "Easier to manage"],
      cons: ["Slower growth", "Competitors may respond faster", "Higher per-unit costs initially"]
    },
    {
      title: "Partnership Strategy",
      description: "Joint venture with established player to leverage their distribution",
      successRate: 72,
      pros: ["Shared risk", "Access to existing customers", "Faster market penetration"],
      cons: ["Shared profits", "Less control", "Potential conflicts"]
    },
    {
      title: "Premium Positioning",
      description: "Target high-end market segment with premium pricing strategy",
      successRate: 61,
      pros: ["Higher margins", "Less price competition", "Brand differentiation"],
      cons: ["Smaller market", "Higher customer acquisition cost", "Quality expectations"]
    }
  ];

  const getRiskColor = (value: number) => {
    if (value <= 30) return "text-success";
    if (value <= 60) return "text-warning";
    return "text-destructive";
  };

  const getRiskLabel = (value: number) => {
    if (value <= 30) return "Low";
    if (value <= 60) return "Medium";
    return "High";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Failure Prediction Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Analysis for: <span className="font-semibold">{decisionData?.projectName}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Back to Input
            </Button>
            <Button onClick={onNext}>
              View Competitor Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Success Probability Gauge */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Success vs Failure Probability
            </CardTitle>
            <CardDescription>
              Based on historical data from similar projects in your industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={probabilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {probabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success rounded-full"></div>
                <span className="text-sm">Success: {successProbability}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded-full"></div>
                <span className="text-sm">Failure: {failureProbability}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Risk Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Summary</CardTitle>
            <CardDescription>
              Key risk factors for your decision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskData.map((risk) => (
              <div key={risk.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{risk.name}</span>
                  <Badge variant={risk.value > 50 ? "destructive" : risk.value > 30 ? "default" : "secondary"}>
                    {getRiskLabel(risk.value)}
                  </Badge>
                </div>
                <Progress value={risk.value} className="h-2" />
                <span className={`text-xs ${getRiskColor(risk.value)}`}>
                  {risk.value}% risk level
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Blind Spot Alerts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Blind Spot Detector
          </CardTitle>
          <CardDescription>
            Critical factors you may have overlooked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blindSpots.map((blindSpot, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <blindSpot.icon className="h-5 w-5" />
                    <span className="font-semibold text-sm">{blindSpot.type}</span>
                  </div>
                  <Badge variant={blindSpot.color as any} className="text-xs">
                    {blindSpot.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {blindSpot.message}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alternative Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Alternative Strategies
          </CardTitle>
          <CardDescription>
            Safer or more optimized approaches to consider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {alternatives.map((alt, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{alt.title}</h3>
                  <p className="text-sm text-muted-foreground">{alt.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-sm font-bold text-success">{alt.successRate}%</span>
                  </div>
                  <Progress value={alt.successRate} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-success mb-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Pros
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {alt.pros.map((pro, i) => (
                        <li key={i}>• {pro}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-destructive mb-1 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Cons
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {alt.cons.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}