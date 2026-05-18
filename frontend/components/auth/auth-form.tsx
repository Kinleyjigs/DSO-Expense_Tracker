'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Loader2, Mail, Lock, User } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register, isLoading } = useAuthStore();

  const validateForm = () => {
    setError('');
    
    if (!email) {
      setError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (mode === 'signup' && !name) {
      setError('Name is required');
      return false;
    }

    if (mode === 'signup' && name.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSuccess('');
    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSuccess('');
    const success = await register(email, password, name);
    
    if (!success) {
      setError('This email is already registered. Please sign in instead.');
    } else {
      setSuccess('Account created! You are now signed in.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleInputChange = () => {
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main card */}
      <Card className="w-full max-w-md relative z-10 border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                ExpenseIQ
              </p>
              <p className="text-sm text-slate-400">
                {mode === 'login' ? 'Welcome back' : 'Get started'}
              </p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <Alert className="mb-4 border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-500 text-sm">{success}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {/* Name field - signup only */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-200">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      handleInputChange();
                    }}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleInputChange();
                  }}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500"
                  disabled={isLoading}
                  autoComplete={mode === 'login' ? 'email' : undefined}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? 'Enter your password' : 'At least 6 characters'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500"
                  disabled={isLoading}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium h-10"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Mode toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center">
              Your data is secured with JWT authentication and stored safely on our backend.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
