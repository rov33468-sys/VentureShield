import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Target
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FailSafe AI</h1>
                <p className="text-xs text-muted-foreground">Business Prediction Platform</p>
              </div>
            </div>
            <Button onClick={onGetStarted} size="sm" className="shadow-lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_1px,transparent_1px)] bg-[length:32px_32px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-accent/10 text-accent border-accent/20">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Business Intelligence
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
              Predict Business Failures
              <span className="block bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                Before They Happen
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Advanced AI analyzes your business patterns, market conditions, and risk factors to prevent costly failures and optimize decision-making with 94% accuracy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-accent to-warning hover:opacity-90 text-accent-foreground px-8 py-4 text-lg font-semibold shadow-accent transition-all duration-300 hover:scale-105"
              >
                Start Free Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-medium border-2 hover:bg-secondary transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">94%</h3>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">$2.3M</h3>
                  <p className="text-sm text-muted-foreground">Average Loss Prevented</p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">10K+</h3>
                  <p className="text-sm text-muted-foreground">Business Leaders Trust Us</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Why Business Leaders Choose FailSafe AI
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive AI-powered analysis that transforms complex data into actionable insights for smarter business decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group">
                <Card className="h-full bg-card border-border/50 hover:shadow-elegant hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Real-time Analytics</h3>
                    <p className="text-muted-foreground mb-4">
                      Monitor key business metrics, cash flow patterns, and performance indicators with live dashboard updates.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        Live performance tracking
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        Custom KPI monitoring
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="group">
                <Card className="h-full bg-card border-border/50 hover:shadow-elegant hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                      <AlertTriangle className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Risk Assessment</h3>
                    <p className="text-muted-foreground mb-4">
                      Advanced AI algorithms identify potential failure points and risk factors before they impact your business.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        Early warning system
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        Predictive modeling
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="group">
                <Card className="h-full bg-card border-border/50 hover:shadow-elegant hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors duration-300">
                      <Target className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Strategic Planning</h3>
                    <p className="text-muted-foreground mb-4">
                      Get actionable recommendations and scenario planning to optimize decision-making and business outcomes.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        Scenario simulation
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        Actionable insights
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/95 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--accent))_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Prevent Your Next Business Failure?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join 10,000+ business leaders who use FailSafe AI to make smarter decisions and prevent costly mistakes.
            </p>
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Your Free Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm mt-4 opacity-70">No credit card required • 5-minute setup • Instant insights</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;