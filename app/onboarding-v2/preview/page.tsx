'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioPreview from '@/components/preview/PortfolioPreview';
import { track } from '@/lib/telemetry';
import { Check, Loader2, Sparkles } from 'lucide-react';

export default function OnboardingPreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    // Load data from sessionStorage (temporary storage during onboarding)
    const savedData = sessionStorage.getItem('onboardingData');
    if (!savedData) {
      router.push('/onboarding-v2/start');
      return;
    }

    const parsed = JSON.parse(savedData);
    setData(parsed);
    
    console.log('[Preview Debug] Loaded data:', parsed);
    console.log('[Preview Debug] Career highlights:', parsed.careerHighlights);
    console.log('[Preview Debug] Career highlights count:', parsed.careerHighlights?.length || 0);
    
    // Log each career highlight
    if (parsed.careerHighlights?.length > 0) {
      parsed.careerHighlights.forEach((h: any, idx: number) => {
        console.log(`[Preview Debug] Career highlight ${idx}:`, h);
      });
    }
    
    track({ 
      kind: 'preview_shown', 
      payload: { 
        hasExperiences: parsed.careerHighlights?.length > 0,
        hasProjects: parsed.projects?.length > 0
      } 
    });

    calculateCompletion(parsed);
  }, [router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S: Manual save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (data) {
          localStorage.setItem('onboarding_draft', JSON.stringify(data));
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      }
      
      // Cmd/Ctrl + Enter: Continue to next step
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (completionScore >= 40) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, completionScore]);

  const calculateCompletion = (profileData: any) => {
    let score = 0;
    const checks = [
      { field: 'fullName', weight: 15 },
      { field: 'profession', weight: 15 },
      { field: 'tagline', weight: 15 },
      { field: 'whoAreYou', weight: 20 },
      { field: 'email', weight: 10 },
      { field: 'careerHighlights', weight: 20, isArray: true, min: 1 },
      { field: 'socialLinks', weight: 5, isArray: true, min: 1 }
    ];

    checks.forEach(check => {
      const value = profileData[check.field];
      if (check.isArray) {
        if (value && value.length >= (check.min || 1)) {
          score += check.weight;
        }
      } else {
        if (value && value.trim && value.trim()) {
          score += check.weight;
        } else if (value) {
          score += check.weight;
        }
      }
    });

    setCompletionScore(Math.min(score, 100));
  };

  const handleFieldUpdate = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    
    // Auto-save with debounce
    setSaving(true);
    setTimeout(() => {
      sessionStorage.setItem('onboardingData', JSON.stringify(updated));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      track({ kind: 'field_edited', payload: { field } });
      calculateCompletion(updated);
    }, 700);
  };

  const handleSave = () => {
    // Save to sessionStorage for signup page
    sessionStorage.setItem('onboardingData', JSON.stringify(data));
    
    track({ 
      kind: 'preview_shown', 
      payload: { 
        hasExperiences: data.careerHighlights?.length > 0,
        hasProjects: data.projects?.length > 0
      } 
    });
    
    router.push('/onboarding-v2/signup');
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Portfolio Completion
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {completionScore}%
                </span>
                {saving && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </span>
                )}
                {saved && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Saved
                  </span>
                )}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${completionScore}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={completionScore < 40}
              className="ml-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Live Preview */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2">
                  <p className="text-white text-sm font-medium">Live Preview</p>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  <PortfolioPreview data={data} showPlaceholders={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editor Form */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Let's refine your portfolio
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Edit anything you'd like. Changes appear instantly.
              </p>

              {/* Profession */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Role
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['Product Manager', 'Product Designer', 'Software Engineer'].map(role => (
                    <button
                      key={role}
                      onClick={() => handleFieldUpdate('profession', role)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                        data.profession === role
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={data.profession}
                  onChange={(e) => handleFieldUpdate('profession', e.target.value)}
                  placeholder="Or enter custom role..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              {/* Tagline */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                  <span className="ml-2 text-xs text-gray-500">(max 120 chars)</span>
                </label>
                {data.taglineSuggestions && data.taglineSuggestions.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Suggestions:
                    </p>
                    {data.taglineSuggestions.map((suggestion: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleFieldUpdate('tagline', suggestion)}
                        className="w-full text-left px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-gray-700 rounded-lg border border-indigo-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  value={data.tagline}
                  onChange={(e) => handleFieldUpdate('tagline', e.target.value)}
                  placeholder="A short, punchy one-liner about you..."
                  maxLength={120}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {data.tagline?.length || 0} / 120
                </p>
              </div>

              {/* About (Who Are You) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You
                  <span className="ml-2 text-xs text-gray-500">(280-600 chars)</span>
                </label>
                <textarea
                  value={data.whoAreYou}
                  onChange={(e) => handleFieldUpdate('whoAreYou', e.target.value)}
                  placeholder="Tell visitors about your background, what you do, and what drives you..."
                  minLength={280}
                  maxLength={900}
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {data.whoAreYou?.length || 0} / 900
                  {data.whoAreYou && data.whoAreYou.length < 280 && (
                    <span className="text-orange-600 ml-2">
                      (aim for 280+ characters)
                    </span>
                  )}
                </p>
              </div>

              {/* Contact */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleFieldUpdate('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => handleFieldUpdate('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Links
                </label>
                <div className="space-y-2">
                  {['LinkedIn', 'GitHub', 'Personal Site', 'Twitter'].map(platform => {
                    const existing = data.socialLinks?.find((l: any) => l.platform === platform);
                    return (
                      <div key={platform} className="flex gap-2">
                        <input
                          type="url"
                          value={existing?.url || ''}
                          onChange={(e) => {
                            const newLinks = data.socialLinks?.filter((l: any) => l.platform !== platform) || [];
                            if (e.target.value) {
                              newLinks.push({ 
                                id: `link-${platform.toLowerCase()}`,
                                platform, 
                                url: e.target.value,
                                icon: platform.toLowerCase()
                              });
                            }
                            handleFieldUpdate('socialLinks', newLinks);
                          }}
                          placeholder={`${platform} URL`}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Career Highlights Preview */}
            {data.careerHighlights && data.careerHighlights.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  {data.careerHighlights.length} Experience{data.careerHighlights.length !== 1 ? 's' : ''} Imported
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Your work history is ready! Preview:
                </p>
                <div className="space-y-2">
                  {data.careerHighlights.slice(0, 3).map((exp: any) => (
                    <div key={exp.id} className="text-xs bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{exp.role} at {exp.organization}</p>
                      <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-6">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">
                  ⚠️ No Work Experience Extracted
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  We couldn't extract work experience from your resume. This can happen with certain PDF formats.
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  <strong>You can:</strong>
                </p>
                <ul className="text-xs text-yellow-700 space-y-1 mb-4 list-disc list-inside">
                  <li>Continue and add experiences later in the dashboard</li>
                  <li>Try uploading a different resume format</li>
                  <li>Or use "Skip" and enter manually</li>
                </ul>
                <button
                  onClick={() => {
                    window.location.href = '/onboarding-v2/start';
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700"
                >
                  ← Go Back & Try Different Resume
                </button>
              </div>
            )}

            {/* Keyboard Shortcuts Hint */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 font-medium mb-2">⌨️ Keyboard Shortcuts:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Cmd/Ctrl + S</kbd> Save changes</div>
                <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Cmd/Ctrl + Enter</kbd> Continue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

