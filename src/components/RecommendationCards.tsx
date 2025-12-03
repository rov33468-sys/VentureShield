import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "growth" | "risk" | "efficiency" | "innovation";
  timeframe: string;
  implemented?: boolean;
}

interface RecommendationCardsProps {
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Diversify Revenue Streams",
    description: "Expand into adjacent markets to reduce dependency on primary revenue source. Consider SaaS model for recurring revenue.",
    impact: "high",
    category: "growth",
    timeframe: "3-6 months",
  },
  {
    id: "2",
    title: "Strengthen Cash Reserves",
    description: "Increase emergency fund to cover 6 months of operating expenses. Negotiate better payment terms with suppliers.",
    impact: "high",
    category: "risk",
    timeframe: "1-3 months",
  },
  {
    id: "3",
    title: "Automate Key Processes",
    description: "Implement automation in customer onboarding and support to improve efficiency and reduce operational costs by 20%.",
    impact: "medium",
    category: "efficiency",
    timeframe: "2-4 months",
  },
  {
    id: "4",
    title: "Invest in R&D",
    description: "Allocate 15% of revenue to innovation to stay competitive. Focus on AI-powered features for product differentiation.",
    impact: "medium",
    category: "innovation",
    timeframe: "6-12 months",
  },
];

const RecommendationCards = ({ recommendations = defaultRecommendations }: RecommendationCardsProps) => {
  const getCategoryIcon = (category: Recommendation["category"]) => {
    switch (category) {
      case "growth":
        return TrendingUp;
      case "risk":
        return Shield;
      case "efficiency":
        return Zap;
      case "innovation":
        return Lightbulb;
    }
  };

  const getCategoryColor = (category: Recommendation["category"]) => {
    switch (category) {
      case "growth":
        return "bg-success/10 text-success border-success/20";
      case "risk":
        return "bg-warning/10 text-warning border-warning/20";
      case "efficiency":
        return "bg-primary/10 text-primary border-primary/20";
      case "innovation":
        return "bg-accent/10 text-accent-foreground border-accent/20";
    }
  };

  const getImpactBadge = (impact: Recommendation["impact"]) => {
    const variants = {
      high: "bg-success/20 text-success border-success/30",
      medium: "bg-warning/20 text-warning border-warning/30",
      low: "bg-muted text-muted-foreground border-border",
    };
    return variants[impact];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          AI Recommendations
        </h3>
        <Badge variant="outline" className="text-xs">
          {recommendations.length} Actions
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const Icon = getCategoryIcon(rec.category);
          const categoryColor = getCategoryColor(rec.category);
          
          return (
            <Card 
              key={rec.id} 
              className={cn(
                "group hover:shadow-lg transition-all duration-300 border-l-4",
                rec.implemented ? "opacity-60" : "",
                rec.category === "growth" && "border-l-success",
                rec.category === "risk" && "border-l-warning",
                rec.category === "efficiency" && "border-l-primary",
                rec.category === "innovation" && "border-l-accent"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("p-2 rounded-lg", categoryColor)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", getImpactBadge(rec.impact))}>
                      {rec.impact} impact
                    </Badge>
                    {rec.implemented && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                  </div>
                </div>
                
                <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {rec.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {rec.timeframe}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationCards;
