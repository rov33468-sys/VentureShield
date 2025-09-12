import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Zap } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === "demo@gmail.com" && password === "demo123") {
      onLogin();
    } else {
      setError("Invalid email or password. Please try again.");
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setError("");
    setIsLoading(true);
    setEmail("demo@gmail.com");
    setPassword("demo123");

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>
      
      <Card className="w-full max-w-md shadow-elegant border-border/50 bg-card/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to FailSafe AI</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your business intelligence dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 transition-all duration-300 focus:ring-2 focus:ring-accent/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="demo123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 transition-all duration-300 focus:ring-2 focus:ring-accent/20"
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-11 border-2 hover:bg-accent/5 hover:border-accent/30 transition-all duration-300 font-medium" 
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Zap className="mr-2 h-4 w-4 text-accent" />
                Try Demo Account
              </Button>
            </div>
          </form>
          
          {/* Demo Credentials Hint */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
            <p className="text-sm font-medium mb-2 text-center text-foreground">Demo Credentials</p>
            <div className="space-y-1 text-sm text-muted-foreground text-center">
              <p><strong className="text-foreground">Email:</strong> demo@gmail.com</p>
              <p><strong className="text-foreground">Password:</strong> demo123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};