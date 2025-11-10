'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { saveCompletePortfolio } from '@/lib/database';
import { Loader2, ArrowLeft } from 'lucide-react';
import { track } from '@/lib/telemetry';

export default function OnboardingSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    // Check if user has completed onboarding data
    const savedData = sessionStorage.getItem('onboardingData');
    const savedEmail = sessionStorage.getItem('onboardingEmail');
    const savedPassword = sessionStorage.getItem('onboardingPassword');
    
    if (!savedData) {
      router.push('/onboarding-v2/flow');
      return;
    }
    
    const parsed = JSON.parse(savedData);
    setPortfolioData(parsed);
    
    console.log('[Signup Debug] Portfolio data loaded:', parsed);
    
    // Pre-fill email and password if available
    if (savedEmail) {
      setEmail(savedEmail);
    } else if (parsed.email) {
      setEmail(parsed.email);
    }
    
    if (savedPassword) {
      setPassword(savedPassword);
      // Auto-submit if both email and password are pre-filled
      // We'll let user review first, so commenting out auto-submit
      // handleSignup(new Event('submit') as any);
    }
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      track({
        kind: 'signup_completed',
        payload: { source: portfolioData?.source }
      } as any);

      // 2. Save portfolio data to Supabase
      if (portfolioData && authData.user) {
        console.log('[Signup Debug] Saving portfolio to Supabase for user:', authData.user.id);
        console.log('[Signup Debug] Portfolio data:', portfolioData);
        console.log('[Signup Debug] Social links in portfolio:', portfolioData.socialLinks);
        console.log('[Signup Debug] Social links count:', portfolioData.socialLinks?.length || 0);
        
        const { error: saveError } = await saveCompletePortfolio(authData.user.id, portfolioData);
        
        if (saveError) {
          console.error('[Signup Debug] Failed to save portfolio:', saveError);
          throw new Error('Failed to save your portfolio data. Please try again.');
        }
        
        console.log('[Signup Debug] ✅ Portfolio saved successfully including', portfolioData.socialLinks?.length || 0, 'social links');
      }

      // 3. Clear temporary session data
      sessionStorage.removeItem('onboardingData');
      sessionStorage.removeItem('onboardingEmail');
      sessionStorage.removeItem('onboardingPassword');
      
      // 4. Set auth flag to indicate fresh signup (bypass dashboard)
      localStorage.setItem('freshAuth', 'true');
      localStorage.setItem('bypassDashboard', 'true');
      
      track({
        kind: 'onboarding_flow_completed',
        payload: {
          hasData: !!portfolioData,
          source: portfolioData?.source
        }
      } as any);

      // 5. Navigate directly to editor (bypassing dashboard)
      console.log('[Signup Debug] Redirecting to editor');
      router.push('/editor');

    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Check if it's a network error
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Unable to connect to authentication service. You can skip signup and try again later, or check your internet connection.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Cannot skip - editor requires authentication now
    // Redirect back to start with a message
    alert('Account creation is required to save your portfolio. Please sign up or sign in.');
    router.push('/signin');
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Preview</span>
        </button>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step 3 of 3</span>
              <span className="text-sm font-semibold text-indigo-600">Almost done! 🎉</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-600">
              Sign up to save your portfolio and access it anywhere
            </p>
          </div>

          {/* Preview Summary */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-900 font-medium mb-2">
              ✓ Your portfolio is ready!
            </p>
            <div className="text-xs text-indigo-700 space-y-1">
              <div>• Name: {portfolioData.fullName}</div>
              {portfolioData.heading && <div>• Heading: {portfolioData.heading}</div>}
              {portfolioData.socialLinks?.length > 0 && (
                <div>• Social Links: {portfolioData.socialLinks.length} added</div>
              )}
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 border-gray-200"
                disabled={loading}
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 border-gray-200"
                disabled={loading}
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </span>
              ) : (
                'Create Account & Continue'
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    router.push('/signin');
                  }}
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is encrypted and secure. We'll never share your information.
          </p>
        </div>
      </div>
    </div>
  );
}

