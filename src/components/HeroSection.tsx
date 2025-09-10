import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-analytics.jpg";

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

const HeroSection = ({ onStartAnalysis }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary to-primary/95 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Business Analytics Dashboard" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 text-center py-20 font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-light mb-6 text-primary-foreground tracking-tight">
            Predict Business Failures
            <span className="block text-3xl md:text-5xl mt-3 text-accent font-normal">Before They Happen</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Advanced AI-powered decision support that analyzes your business patterns, market conditions, and risk factors to prevent costly failures and optimize success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={onStartAnalysis}
              className="bg-accent hover:bg-accent/90 hover:shadow-accent hover:scale-[1.02] text-accent-foreground px-8 py-3 font-medium transition-all duration-300"
            >
              Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 font-medium border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
              View Demo
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:shadow-elegant hover:scale-[1.02] transition-all duration-500">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2 text-primary-foreground">94% Accuracy</h3>
                <p className="text-sm text-primary-foreground/70 font-light">In predicting business outcome patterns</p>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:shadow-elegant hover:scale-[1.02] transition-all duration-500">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2 text-primary-foreground">$2.3M Saved</h3>
                <p className="text-sm text-primary-foreground/70 font-light">Average loss prevention per analysis</p>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:shadow-elegant hover:scale-[1.02] transition-all duration-500">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2 text-primary-foreground">10K+ Leaders</h3>
                <p className="text-sm text-primary-foreground/70 font-light">Trust our decision support system</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;