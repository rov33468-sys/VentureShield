import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Eye, 
  Route, 
  Users, 
  Clock, 
  Lightbulb,
  TrendingDown,
  Activity
} from "lucide-react";

const AnalysisModules = () => {
  const modules = [
    {
      id: "risk-forecast",
      title: "Risk Forecast",
      icon: AlertTriangle,
      description: "Probability analysis of success vs. failure with detailed reasoning and market factors.",
      risk: "medium",
      accuracy: 87,
      lastUpdate: "2 hours ago",
      status: "Active Analysis"
    },
    {
      id: "blind-spots",
      title: "Blind Spot Detector",
      icon: Eye,
      description: "Identify overlooked financial, operational, market, legal, and human resource risks.",
      risk: "high",
      accuracy: 92,
      lastUpdate: "15 minutes ago",
      status: "Critical Issues Found"
    },
    {
      id: "alternatives",
      title: "Alternative Strategies",
      icon: Route,
      description: "Safer and optimized approaches with comprehensive pros and cons analysis.",
      risk: "low",
      accuracy: 89,
      lastUpdate: "1 hour ago",
      status: "Recommendations Ready"
    },
    {
      id: "competitors",
      title: "Competitor Analysis",
      icon: Users,
      description: "Likely competitor moves, business models, and strategies affecting your plan.",
      risk: "medium",
      accuracy: 84,
      lastUpdate: "30 minutes ago",
      status: "Market Intelligence"
    },
    {
      id: "scenarios",
      title: "Future Scenario Simulation",
      icon: Clock,
      description: "Short-term and long-term predictions with multiple outcome possibilities.",
      risk: "low",
      accuracy: 91,
      lastUpdate: "45 minutes ago",
      status: "Simulation Complete"
    },
    {
      id: "insights",
      title: "Decision Insights",
      icon: Lightbulb,
      description: "Actionable suggestions backed by data patterns and industry benchmarks.",
      risk: "low",
      accuracy: 95,
      lastUpdate: "10 minutes ago",
      status: "Insights Available"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "destructive";
      default: return "secondary";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return Activity;
      case "medium": return AlertTriangle;
      case "high": return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <section id="analysis" className="py-20 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Business Analysis</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six core modules work together to provide complete decision support and risk assessment for your business ventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const RiskIcon = getRiskIcon(module.risk);
            const riskColor = getRiskColor(module.risk);
            
            return (
              <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        riskColor === 'success' ? 'bg-success/10' : 
                        riskColor === 'warning' ? 'bg-warning/10' : 
                        'bg-destructive/10'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          riskColor === 'success' ? 'text-success' : 
                          riskColor === 'warning' ? 'text-warning' : 
                          'text-destructive'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{module.lastUpdate}</p>
                      </div>
                    </div>
                    <Badge variant={riskColor === "success" ? "secondary" : riskColor === "warning" ? "outline" : "destructive"} className="flex items-center space-x-1">
                      <RiskIcon className="h-3 w-3" />
                      <span className="capitalize">{module.risk}</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy Score</span>
                      <span className="font-medium">{module.accuracy}%</span>
                    </div>
                    <Progress value={module.accuracy} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-sm font-medium ${
                      riskColor === 'success' ? 'text-success' : 
                      riskColor === 'warning' ? 'text-warning' : 
                      'text-destructive'
                    }`}>{module.status}</span>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                      Analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
            Start Comprehensive Analysis
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnalysisModules;