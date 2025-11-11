'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Settings, LogOut, Sparkles } from 'lucide-react';
import { signOut } from '@/lib/supabase';

export default function SimpleDashboard() {
  const router = useRouter();
  const [totalItems, setTotalItems] = useState(0);
  const [publishedItems, setPublishedItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadData = () => {
      try {
        const data = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        const projects = data.projects || [];
        const careers = data.careerHighlights || [];
        
        const total = projects.length + careers.length;
        const published = projects.filter((p: any) => p.published).length + 
                         careers.filter((c: any) => c.published).length;
        
        setTotalItems(total);
        setPublishedItems(published);
        setUserName(data.fullName || 'there');
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasContent = totalItems > 0;
  const allPublished = publishedItems === totalItems && totalItems > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Portfolio Builder</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome back, {userName}! 👋
          </h2>
          
          {hasContent ? (
            <p className="text-lg text-gray-600">
              Your portfolio has <span className="font-semibold text-gray-900">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'}
              {publishedItems > 0 && (
                <span className="text-green-600">
                  {' • '}{publishedItems} published
                </span>
              )}
            </p>
          ) : (
            <p className="text-lg text-gray-600">
              Let's start building your portfolio
            </p>
          )}
        </div>

        {/* Primary Action */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/editor')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-12 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Edit className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2">Edit Portfolio</h3>
            <p className="text-purple-100 text-lg">
              {hasContent ? 'Continue editing your portfolio' : 'Start building your portfolio'}
            </p>
          </button>
        </div>

        {/* Next Step Suggestions */}
        {!hasContent && (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to get started?
            </h4>
            <p className="text-gray-600 mb-6">
              Click "Edit Portfolio" above to add your projects, career highlights, and personal information.
            </p>
          </div>
        )}

        {hasContent && !allPublished && (
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  You have {totalItems - publishedItems} unpublished {totalItems - publishedItems === 1 ? 'item' : 'items'}
                </h4>
                <p className="text-sm text-gray-600">
                  Make your work visible by publishing your items in the editor.
                </p>
              </div>
            </div>
          </div>
        )}

        {allPublished && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  🎉 Your portfolio is live!
                </h4>
                <p className="text-sm text-gray-600">
                  All your items are published and visible on your portfolio.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
