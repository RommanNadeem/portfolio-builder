'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Edit, Eye, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/supabase';
import { getCompletePortfolio, convertToLegacyFormat } from '@/lib/database';

interface PortfolioData {
  fullName?: string;
  name?: string; // New onboarding flow uses 'name'
  heading?: string;
  profession?: string;
  role?: string; // New onboarding flow uses 'role'
  email: string;
  phone?: string;
  profileImage?: string | null;
  avatarUrl?: string; // New onboarding flow uses 'avatarUrl'
  tagline?: string;
  whoAreYou?: string;
  about?: string; // New onboarding flow uses 'about'
}

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure consistent hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadData = async () => {
      try {
        // Check if user is authenticated (optional - don't block on auth errors)
        const user = await getCurrentUser().catch(() => null);
        
        if (user) {
          // Try to load from Supabase
          const { data: portfolioData, error } = await getCompletePortfolio(user.id);
          
          if (!error && portfolioData) {
            // Convert to legacy format and set
            const legacyData = convertToLegacyFormat(portfolioData);
            setData(legacyData);
            // Also save to localStorage for offline access
            localStorage.setItem('portfolioData', JSON.stringify(legacyData));
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Auth check skipped:', error);
        // Continue to localStorage fallback
      }
      
      // Fallback: Load from localStorage
      const savedData = localStorage.getItem('portfolioData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        setLoading(false);
      } else {
        // No data anywhere, redirect to onboarding
        setLoading(false);
        router.push('/onboarding-v2/start');
      }
    };
    
    loadData();
  }, [router, mounted]);

  // Show loading state while mounting or loading data
  if (!mounted || loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={async () => {
                  await signOut();
                  localStorage.removeItem('portfolioData');
                  router.push('/');
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            {(data.profileImage || data.avatarUrl) ? (
              <img
                src={data.profileImage || data.avatarUrl}
                alt={data.fullName || data.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {data.fullName ? data.fullName.charAt(0) : data.name?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {data.fullName ? data.fullName.split(' ')[0] : data.name || 'there'}! 👋
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {data.profession || data.role || 'Professional'} • {data.email}
              </p>
              {data.tagline && (
                <p className="text-gray-700 italic">"{data.tagline}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Preview Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Your Portfolio</h3>
            <p className="text-indigo-100">Preview and edit your professional portfolio</p>
          </div>

          {/* Portfolio Thumbnail Preview */}
          <div className="p-8">
            <div className="border-4 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
              {/* Miniature portfolio preview */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-white p-12 relative">
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex items-center gap-4 mb-6">
                    {(data.profileImage || data.avatarUrl) ? (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-lg"></div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {data.fullName ? data.fullName.charAt(0) : data.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg"></div>
                    <div className="h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg"></div>
                    <div className="h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Portfolio Preview</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => router.push('/editor')}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                <Edit className="w-5 h-5" />
                Edit Portfolio
              </button>
              <button
                onClick={() => {
                  // Open preview in view mode
                  router.push('/editor?view=preview');
                }}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <Eye className="w-5 h-5" />
                View Live Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">Portfolio</h4>
            <p className="text-gray-600 text-sm">Ready to share</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">Settings</h4>
            <p className="text-gray-600 text-sm">Manage account</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">Preview</h4>
            <p className="text-gray-600 text-sm">See it live</p>
          </div>
        </div>
      </main>
    </div>
  );
}

