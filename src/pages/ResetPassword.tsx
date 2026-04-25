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
import { Shield, Lock, Loader2 } from 'lucide-react';

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
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase parses the recovery token from URL hash automatically and emits
    // a PASSWORD_RECOVERY event. We treat the presence of a session as valid.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setValidSession(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });

    return () => subscription.unsubscribe();
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
            <CardTitle className="text-2xl font-semibold">Set a new password</CardTitle>
            <CardDescription>
              Choose a strong password with at least 8 characters.
            </CardDescription>
          </CardHeader>

          {validSession === false ? (
            <>
              <CardContent>
                <Alert variant="destructive" className="border-destructive/50">
                  <AlertDescription>
                    This reset link is invalid or has expired. Please request a new one.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Link to="/forgot-password" className="w-full">
                  <Button className="w-full gradient-accent text-accent-foreground font-semibold">
                    Request new link
                  </Button>
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
                  disabled={loading || validSession === null}
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
