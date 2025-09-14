import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DecisionInputProps {
  onNext: (data: any) => void;
}

const sampleScenarios = [
  {
    title: "Electric Scooter Rentals",
    description: "Launching electric scooter rentals in Bangalore",
    icon: <Zap className="h-5 w-5" />
  },
  {
    title: "AI Food Delivery Expansion", 
    description: "Expanding an AI-powered food delivery app in tier-2 cities",
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    title: "Gen Z Skincare Brand",
    description: "Starting an online organic skincare brand for Gen Z",
    icon: <Lightbulb className="h-5 w-5" />
  }
];

export function DecisionInput({ onNext }: DecisionInputProps) {
  const { toast } = useToast();
  const [businessIdea, setBusinessIdea] = useState("");

  const handleSampleClick = (sample: typeof sampleScenarios[0]) => {
    setBusinessIdea(sample.description);
    // Auto-analyze after a short delay to show the flow
    setTimeout(() => {
      handleAnalyze(sample.description);
    }, 500);
  };

  const handleAnalyze = (idea?: string) => {
    const ideaToAnalyze = idea || businessIdea;
    
    if (!ideaToAnalyze.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your business idea before analyzing.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: "Oracle is analyzing your business idea for risks and opportunities..."
    });

    onNext({ businessIdea: ideaToAnalyze });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl mb-4">
            <span className="text-2xl font-bold text-primary-foreground">O</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Oracle Business Predictor</h1>
        </div>

        {/* Main Input Card */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-primary mb-2">
              Enter your business idea or upcoming project, and Oracle will predict potential risks and opportunities.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder="Describe your business idea, project, or strategic decision here..."
                className="min-h-[120px] text-base"
              />
              <Button type="submit" size="lg" className="w-full">
                Analyze with Oracle
              </Button>
            </form>

            {/* Sample Scenarios */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Or try one of these sample scenarios:
              </p>
              <div className="grid gap-3">
                {sampleScenarios.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSampleClick(sample)}
                    className="justify-start h-auto p-4 text-left hover:bg-accent/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-accent mt-1">
                        {sample.icon}
                      </div>
                      <div>
                        <div className="font-medium text-primary">{sample.title}</div>
                        <div className="text-sm text-muted-foreground">{sample.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}