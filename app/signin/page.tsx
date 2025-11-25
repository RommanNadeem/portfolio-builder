'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [view, setView] = useState<'signin' | 'reset'>('signin');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setStatusMessage('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    if (data.user && data.session) {
      // Set a flag to indicate fresh auth
      localStorage.setItem('freshAuth', 'true');
      
      // Check if user has existing portfolio data
      const existingData = localStorage.getItem('portfolioData');
      
      if (existingData) {
        // User has data, go to editor
        router.push('/editor');
      } else {
        // No data yet, go to dashboard
        router.push('/dashboard');
      }
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter the email associated with your account.');
      return;
    }

    setResetLoading(true);
    setError('');
    setStatusMessage('');

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : `${process.env.NEXT_PUBLIC_SITE_URL || ''}/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setResetLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setStatusMessage('Password reset link sent! Please check your email.');
  };

  const toggleView = (nextView: 'signin' | 'reset') => {
    setView(nextView);
    setError('');
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-12 text-center">
          <div className="flex items-center gap-2 justify-center mb-6">
            <img src="/icon.svg" alt="BuildSpace" className="h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-base text-gray-800">
            Sign in to your BuildSpace account
          </p>
        </div>

        <form
          onSubmit={view === 'signin' ? handleSignIn : handlePasswordResetRequest}
          className="space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2" style={{ color: '#111111' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
                setStatusMessage('');
              }}
              placeholder="you@example.com"
              className="w-full px-5 py-3.5 text-base bg-white border-2 border-gray-200 rounded-xl transition-all outline-none focus:border-emerald-700 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#111111' }}
              disabled={loading || resetLoading}
              autoFocus
            />
          </div>

          {view === 'signin' && (
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2" style={{ color: '#111111' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="w-full px-5 py-3.5 text-base bg-white border-2 border-gray-200 rounded-xl transition-all outline-none focus:border-emerald-700 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: '#111111' }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleView('reset')}
                className="mt-3 text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {view === 'reset' && (
            <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-800 font-semibold">
                We'll send you a secure link to reset your password. Make sure you have access to the email address
                above.
              </p>
              <button
                type="button"
                onClick={() => toggleView('signin')}
                className="mt-4 text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
              >
                Back to sign in
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 border-2 border-red-200 bg-red-50 rounded-xl">
              <p className="text-sm font-semibold" style={{ color: '#111111' }}>{error}</p>
            </div>
          )}

          {statusMessage && (
            <div className="p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl">
              <p className="text-sm font-semibold" style={{ color: '#111111' }}>{statusMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              (view === 'signin' && (loading || !email.trim() || !password.trim())) ||
              (view === 'reset' && (resetLoading || !email.trim()))
            }
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
          >
            {view === 'signin'
              ? loading
                ? 'Signing in...'
                : 'Sign In'
              : resetLoading
                ? 'Sending reset link...'
                : 'Send reset link'}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-800">
              Don't have an account?{' '}
              <Link
                href="/onboarding-v2/start"
                className="text-gray-900 font-semibold hover:text-emerald-600 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

