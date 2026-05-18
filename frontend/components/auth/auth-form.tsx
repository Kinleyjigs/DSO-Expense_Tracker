'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, ArrowRight, Loader2, ShieldCheck, Sparkles, BarChart3, Lock } from 'lucide-react';

export function AuthForm() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register, isLoading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = await login(loginEmail, loginPassword);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!registerEmail || !registerPassword || !registerName) {
      setError('Please fill in all fields');
      return;
    }
    
    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const success = await register(registerEmail, registerPassword, registerName);
    if (!success) {
      setError('Email already exists or registration failed');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(129,140,248,0.15),_transparent_30%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background)_82%,black_18%))] px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:68px_68px] opacity-20" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-16 top-48 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-border/60 bg-card/60 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                ExpenseIQ
              </p>
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                A calmer way to start tracking money
              </h1>
            </div>
          </div>

          <div className="my-10 max-w-xl lg:my-16">
            <Badge className="mb-5 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary-foreground">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-cyan-300" />
              Faster onboarding, cleaner dashboard
            </Badge>
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              Sign in with a form that feels like the product, not a wall of fields.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              The backend still powers your real data, but this screen now gives you a sharper first impression with better hierarchy, stronger contrast, and a more polished signup path.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium text-foreground">Clear dashboards</p>
                <p className="mt-1 text-sm text-muted-foreground">Charts and totals that stay readable.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm font-medium text-foreground">Account-first flow</p>
                <p className="mt-1 text-sm text-muted-foreground">Sign in and register with the same path.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <Lock className="h-5 w-5 text-warning" />
                <p className="mt-3 text-sm font-medium text-foreground">Protected data</p>
                <p className="mt-1 text-sm text-muted-foreground">Everything stays tied to the authenticated user.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur-sm">
              <p className="text-2xl font-semibold text-foreground">1 click</p>
              <p className="mt-1 text-sm text-muted-foreground">to switch between sign in and sign up</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur-sm">
              <p className="text-2xl font-semibold text-foreground">Live</p>
              <p className="mt-1 text-sm text-muted-foreground">backend-backed account state</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur-sm">
              <p className="text-2xl font-semibold text-foreground">No clutter</p>
              <p className="mt-1 text-sm text-muted-foreground">just the fields you need first</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <Card className="border-border/50 bg-card/80 shadow-none backdrop-blur-md">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/60 p-1">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin}>
                    <CardHeader className="space-y-3 pb-4">
                      <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs">
                        Welcome back
                      </Badge>
                      <CardTitle className="text-2xl">Sign in to continue</CardTitle>
                      <CardDescription className="text-sm leading-6">
                        Pick up where you left off and open the dashboard.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {error && (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="bg-input/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="bg-input/60"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister}>
                    <CardHeader className="space-y-3 pb-4">
                      <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs">
                        Create account
                      </Badge>
                      <CardTitle className="text-2xl">Get started in a minute</CardTitle>
                      <CardDescription className="text-sm leading-6">
                        Set up your profile and start logging expenses immediately.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {error && (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Name</Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Your name"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="bg-input/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="you@example.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="bg-input/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="At least 6 characters"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="bg-input/60"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Connect to the backend server to sync real data into the dashboard.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
