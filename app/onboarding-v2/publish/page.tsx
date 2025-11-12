'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, ExternalLink, Loader2 } from 'lucide-react';
import PortfolioPreview from '@/components/preview/PortfolioPreview';
import { track } from '@/lib/telemetry';
import { getBaseUrl, getDisplayUrl, getPortfolioUrl } from '@/lib/url-utils';

export default function PublishPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [theme, setTheme] = useState<'clean' | 'mono' | 'grid'>('clean');
  const [isPublic, setIsPublic] = useState(true);
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Load draft data
    const draft = localStorage.getItem('portfolioData');
    if (!draft) {
      router.push('/onboarding-v2/start');
      return;
    }

    const parsed = JSON.parse(draft);
    setData(parsed);

    // Generate initial slug from name
    const initialSlug = generateSlug(parsed.name);
    setSlug(initialSlug);
    checkSlugAvailability(initialSlug);
  }, [router]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 30);
  };

  const checkSlugAvailability = async (slugToCheck: string) => {
    // Mock availability check
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In production, check against database
    const reserved = ['admin', 'api', 'auth', 'dashboard', 'settings'];
    setSlugAvailable(!reserved.includes(slugToCheck) && slugToCheck.length >= 3);
  };

  const handleSlugChange = (value: string) => {
    const sanitized = value
      .toLowerCase()
      .replace(/[^\w-]/g, '')
      .slice(0, 30);
    
    setSlug(sanitized);
    setSlugAvailable(null);
    
    if (sanitized.length >= 3) {
      checkSlugAvailability(sanitized);
    }
  };

  const handlePublish = async () => {
    if (!slugAvailable) return;

    setPublishing(true);

    // Save final portfolio with settings
    const finalData = {
      ...data,
      theme,
      isPublic,
      slug,
      publishedAt: new Date().toISOString()
    };

    localStorage.setItem('portfolioData', JSON.stringify(finalData));

    track({
      kind: 'published',
      payload: { slug, theme, isPublic }
    });

    // Simulate publishing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPublishing(false);
    setPublished(true);
  };

  const handleCopyLink = () => {
    const link = getPortfolioUrl(`u/${slug}`);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (published) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              🎉 Your portfolio is live!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Share it with the world
            </p>

            {/* Portfolio Link */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your portfolio URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-left px-4 py-3 bg-white border border-gray-300 rounded-lg text-indigo-600 font-mono text-sm">
                  {getPortfolioUrl(`u/${slug}`)}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`/u/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Portfolio
              </a>
              <button
                onClick={handleGoToDashboard}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2">📱</div>
              <p className="font-semibold text-gray-900">Share on social</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2">✏️</div>
              <p className="font-semibold text-gray-900">Keep editing</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-semibold text-gray-900">Track views</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Ready to publish?
          </h1>
          <p className="text-lg text-gray-600">
            Choose your theme and make your portfolio public
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Settings */}
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Theme</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'clean', label: 'Clean', desc: 'Minimal & modern' },
                  { value: 'mono', label: 'Mono', desc: 'Monochrome style' },
                  { value: 'grid', label: 'Grid', desc: 'Card-based layout' }
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      theme === t.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{t.label}</div>
                    <div className="text-xs text-gray-600">{t.desc}</div>
                    {theme === t.value && (
                      <div className="mt-2">
                        <Check className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Slug Configuration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio URL</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your custom URL
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">{getDisplayUrl()}/u/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono text-sm"
                    placeholder="your-name"
                  />
                  {slugAvailable !== null && (
                    <div className={`text-sm font-medium ${slugAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {slugAvailable ? '✓ Available' : '✗ Taken'}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use letters, numbers, and dashes only
                </p>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                />
                <div>
                  <div className="font-medium text-gray-900">Make portfolio public</div>
                  <div className="text-sm text-gray-600">
                    Anyone with the link can view your portfolio
                  </div>
                </div>
              </label>
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={!slugAvailable || publishing}
              className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Portfolio
                </>
              )}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-900 px-4 py-2">
                <p className="text-white text-sm font-medium">Live Preview - {theme} theme</p>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <PortfolioPreview data={{ ...data, theme }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

