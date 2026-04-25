import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Shield, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
});

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email: validEmail } = schema.parse({ email });
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(validEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
        toast({
          title: 'Reset link sent',
          description: 'Check your inbox for password reset instructions.',
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden gradient-hero">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent shadow-glow">
            <Shield className="h-7 w-7 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
            VentureShield
          </h1>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-elegant">
          <CardHeader className="space-y-1.5">
            <CardTitle className="text-2xl font-semibold">
              {sent ? 'Check your email' : 'Forgot password?'}
            </CardTitle>
            <CardDescription>
              {sent
                ? `We've sent a password reset link to ${email}.`
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>

          {sent ? (
            <>
              <CardContent>
                <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">
                    If an account exists for that email, you'll receive instructions shortly. The link expires in 1 hour.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                >
                  Send to a different email
                </Button>
                <Link
                  to="/login"
                  className="text-sm text-accent hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to login
                </Link>
              </CardFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/90">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 bg-secondary/50 border-border/60 focus-visible:ring-accent transition-smooth"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-accent text-accent-foreground font-semibold shadow-accent hover:shadow-glow transition-smooth"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-accent transition-smooth inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
