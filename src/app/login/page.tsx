'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, User, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function LoginPage() {
  const router = useRouter();
  const { highContrast } = useAccessibility();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed. Please verify your credentials.');
      } else {
        if (data.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'learner' | 'admin') => {
    if (role === 'learner') {
      setEmail('learner@mitraspeak.com');
      setPassword('LearnerPass123!');
    } else {
      setEmail('admin@mitraspeak.com');
      setPassword('AdminPass123!');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div
        className={`p-8 rounded-3xl border-2 transition-all ${
          highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        <div className="text-center mb-8">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
              highContrast
                ? 'bg-amber-400 text-black border-2 border-white'
                : 'bg-primary-50 text-primary-600'
            }`}
          >
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Sign In</h1>
          <p className="text-sm text-slate-500 mt-2">
            Welcome back to your personalized learning journey
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl mb-6 bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 rounded-xl border-2 font-medium min-h-[50px] transition-all focus:outline-none focus:ring-4 ${
                  highContrast
                    ? 'bg-slate-800 border-amber-400 text-white placeholder-slate-400 focus:ring-amber-200'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-primary-200 focus:border-primary-600'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full px-4 py-3.5 rounded-xl border-2 font-medium min-h-[50px] transition-all focus:outline-none focus:ring-4 ${
                  highContrast
                    ? 'bg-slate-800 border-amber-400 text-white placeholder-slate-400 focus:ring-amber-200'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-primary-200 focus:border-primary-600'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 ${
              loading
                ? 'opacity-60 cursor-not-allowed bg-slate-300'
                : highContrast
                ? 'bg-amber-400 text-black hover:bg-amber-300 border-2 border-white'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Demo Pre-fill Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 text-center">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemo('learner')}
              className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-primary-500" />
              <span>Learner (Arthur)</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin (Eleanor)</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-6 text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
