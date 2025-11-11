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
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-black mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-12 text-center">
          <h1 className="text-3xl font-medium text-black mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to your Portfolio Builder account
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              className="w-full px-4 py-3 text-base border border-gray-200 focus:border-black focus:outline-none transition-colors placeholder:text-gray-400"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
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
              placeholder="••••••••"
              className="w-full px-4 py-3 text-base border border-gray-200 focus:border-black focus:outline-none transition-colors placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 border border-red-200 bg-red-50">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link
                href="/onboarding-v2/start"
                className="text-black hover:underline transition-colors"
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

