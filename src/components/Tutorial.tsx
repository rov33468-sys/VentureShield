import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BarChart3, TrendingUp, History, ArrowRight, X } from "lucide-react";

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const Tutorial = ({ onComplete, onSkip }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to AI Analytics Dashboard",
      description: "Your intelligent business decision-making companion",
      icon: Brain,
      content: "This platform uses advanced AI to help you make data-driven decisions, analyze competitors, and predict business outcomes.",
      color: "bg-primary"
    },
    {
      title: "Live Dashboard",
      description: "Real-time business insights at your fingertips",
      icon: BarChart3,
      content: "Monitor key metrics, track performance indicators, and get instant analytics to understand your business health.",
      color: "bg-blue-500"
    },
    {
      title: "Predictive Analysis",
      description: "AI-powered decision support system",
      icon: TrendingUp,
      content: "Input your business scenarios and get AI predictions, risk assessments, and strategic recommendations.",
      color: "bg-green-500"
    },
    {
      title: "Decision History",
      description: "Learn from past decisions and outcomes",
      icon: History,
      content: "Track your decision accuracy, analyze patterns, and continuously improve your strategic thinking.",
      color: "bg-purple-500"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = tutorialSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Skip Button */}
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip Tutorial <X className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Tutorial Card */}
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center">
              <div className={`w-20 h-20 ${currentStepData.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">
                Step {currentStep + 1} of {tutorialSteps.length}
              </Badge>
              <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              <CardDescription className="text-base">
                {currentStepData.description}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground leading-relaxed">
              {currentStepData.content}
            </p>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="min-w-[100px]"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="min-w-[100px]"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>Get Started <ArrowRight className="w-4 h-4 ml-1" /></>
                ) : (
                  <>Next <ArrowRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Account Notice */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You're using the demo environment - explore all features freely!
          </p>
        </div>
      </div>
    </div>
  );
};