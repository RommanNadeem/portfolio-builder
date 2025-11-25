'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setHasRecoverySession(Boolean(data.session));
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasRecoverySession(Boolean(session));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasRecoverySession) {
      setError('Please use the password reset link from your email.');
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('');

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setStatus('Password updated! Redirecting you to sign in...');
    setTimeout(() => {
      router.push('/signin');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
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
            Reset your password
          </h1>
          <p className="text-base text-gray-800">
            {hasRecoverySession
              ? 'Choose a new password to secure your account.'
              : 'Open the password reset link from your email to continue.'}
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold mb-2"
              style={{ color: '#111111' }}
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter your new password"
              className="w-full px-5 py-3.5 text-base bg-white border-2 border-gray-200 rounded-xl transition-all outline-none focus:border-emerald-700 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#111111' }}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold mb-2"
              style={{ color: '#111111' }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Re-enter your new password"
              className="w-full px-5 py-3.5 text-base bg-white border-2 border-gray-200 rounded-xl transition-all outline-none focus:border-emerald-700 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#111111' }}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 border-2 border-red-200 bg-red-50 rounded-xl">
              <p className="text-sm font-semibold" style={{ color: '#111111' }}>
                {error}
              </p>
            </div>
          )}

          {status && (
            <div className="p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl">
              <p className="text-sm font-semibold" style={{ color: '#111111' }}>
                {status}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              !password.trim() ||
              !confirmPassword.trim() ||
              !hasRecoverySession
            }
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              background: '#5BC64A',
              border: '2px solid #111111',
              color: '#111111',
            }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-800">
              Remember your password?{' '}
              <Link
                href="/signin"
                className="text-gray-900 font-semibold hover:text-emerald-600 transition-colors"
              >
                Go back to sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}




