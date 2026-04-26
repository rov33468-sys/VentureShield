import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Shield, Lock, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

type SessionState = 'checking' | 'valid' | 'invalid';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password is too long'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('checking');
  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let resolved = false;

    // Listen for the PASSWORD_RECOVERY event Supabase emits after parsing the
    // recovery token from the URL hash.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        resolved = true;
        if (session?.user?.email) setRecoveryEmail(session.user.email);
        setSessionState('valid');
      }
    });

    // Check existing session on mount.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        resolved = true;
        if (session.user?.email) setRecoveryEmail(session.user.email);
        setSessionState('valid');
      }
    });

    // Give Supabase a moment to parse the URL hash and emit PASSWORD_RECOVERY
    // before declaring the link invalid. Without this grace window we'd flash
    // the "invalid" state on every valid recovery link.
    const timeout = window.setTimeout(() => {
      if (!resolved) {
        setSessionState('invalid');
      }
    }, 1500);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validated = schema.parse({ password, confirmPassword });
      const { error: updateError } = await supabase.auth.updateUser({
        password: validated.password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        toast({
          title: 'Password updated',
          description: 'You can now sign in with your new password.',
        });
        await supabase.auth.signOut();
        navigate('/login');
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
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              {sessionState === 'checking' && (
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              )}
              {sessionState === 'valid' && (
                <CheckCircle2 className="h-5 w-5 text-accent" />
              )}
              {sessionState === 'invalid' && (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
              {sessionState === 'checking' && 'Verifying your link…'}
              {sessionState === 'valid' && 'Set a new password'}
              {sessionState === 'invalid' && 'Link no longer valid'}
            </CardTitle>
            <CardDescription>
              {sessionState === 'checking' &&
                'Hang tight while we confirm your password reset link.'}
              {sessionState === 'valid' &&
                'Choose a strong password with at least 8 characters.'}
              {sessionState === 'invalid' &&
                'For your security, reset links expire after a short time or can only be used once.'}
            </CardDescription>
          </CardHeader>

          {sessionState === 'checking' && (
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">
                Checking recovery session…
              </p>
            </CardContent>
          )}

          {sessionState === 'invalid' && (
            <>
              <CardContent>
                <Alert variant="destructive" className="border-destructive/50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This reset link is invalid or has expired. Please request a new one to continue.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Link to="/forgot-password" className="w-full">
                  <Button className="w-full gradient-accent text-accent-foreground font-semibold shadow-accent hover:shadow-glow transition-smooth">
                    Request new link
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                    Back to sign in
                  </Button>
                </Link>
              </CardFooter>
            </>
          )}

          {sessionState === 'valid' && (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/90">New password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={loading}
                      className="pl-10 bg-secondary/50 border-border/60 focus-visible:ring-accent transition-smooth"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground/90">Confirm password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={loading}
                      className="pl-10 bg-secondary/50 border-border/60 focus-visible:ring-accent transition-smooth"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-accent text-accent-foreground font-semibold shadow-accent hover:shadow-glow transition-smooth"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update password'
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
