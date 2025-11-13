'use client';

import { useState, useEffect } from 'react';
import { SlugSelector } from './SlugSelector';
import { claimSlug, publishPortfolio, getPublishStatus, suggestSlugFromProfile } from '@/lib/publishing';
import { validateBeforePublish } from '@/lib/publishing';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  portfolioData: any;
  onPublishSuccess?: (url: string) => void;
}

type Step = 'slug' | 'validation' | 'publishing' | 'success';

export function PublishModal({
  isOpen,
  onClose,
  userId,
  portfolioData,
  onPublishSuccess,
}: PublishModalProps) {
  const [step, setStep] = useState<Step>('slug');
  const [slug, setSlug] = useState('');
  const [isSlugValid, setIsSlugValid] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [hasSlug, setHasSlug] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState<{
    canPublish: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Load current publish status and suggest slug
  useEffect(() => {
    if (isOpen && userId) {
      loadPublishStatus();
    }
  }, [isOpen, userId, portfolioData]);

  const loadPublishStatus = async () => {
    setLoading(true);
    try {
      const status = await getPublishStatus(userId);
      if (status.slug) {
        setCurrentSlug(status.slug);
        setSlug(status.slug);
        setHasSlug(true);
        setIsSlugValid(true);
        // Skip to validation if already has slug
        setStep('validation');
      } else {
        // Suggest a slug
        const suggested = await suggestSlugFromProfile(userId);
        if (suggested) {
          setSlug(suggested);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading status:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSlugContinue = async () => {
    if (!isSlugValid) return;

    setLoading(true);
    setError('');

    try {
      // Claim the slug if it's different from current
      if (slug !== currentSlug) {
        const result = await claimSlug(userId, slug);
        if (!result.success) {
          setError(result.error || 'Failed to claim URL');
          setLoading(false);
          return;
        }
        
        // Update state - we pass the slug directly to publishPortfolio() to avoid race conditions
        setCurrentSlug(slug);
      }

      // Move to validation step
      setStep('validation');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleValidationContinue = () => {
    // Run validation
    const result = validateBeforePublish(portfolioData);
    setValidationResult(result);

    if (!result.canPublish) {
      return; // Errors will be shown
    }

    // Proceed to publish
    handlePublish();
  };

  const handlePublish = async () => {
    setStep('publishing');
    setLoading(true);
    setError('');

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[PublishModal] Publishing portfolio');
      }

      // Pass the portfolio data from editor directly to publish function
      // Also pass the current slug to avoid race conditions
      const result = await publishPortfolio(userId, portfolioData, currentSlug || undefined);

      if (!result.success) {
        setError(result.error || 'Failed to publish');
        
        // If slug is missing, redirect back to slug step
        if (result.error?.includes('portfolio URL')) {
          setStep('slug');
          setHasSlug(false);
        } else {
          setStep('validation');
        }
        
        setLoading(false);
        return;
      }

      setPublishedUrl(result.url || '');
      setStep('success');
      
      if (onPublishSuccess && result.url) {
        onPublishSuccess(result.url);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setStep('validation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publishedUrl);
    // Could add a toast notification here
  };

  const handleClose = () => {
    if (step !== 'publishing') {
      setStep('slug');
      setError('');
      setValidationResult(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'success' ? '🎉 Portfolio Published!' : 'Publish Portfolio'}
          </h2>
          {step !== 'publishing' && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Slug Selection */}
          {step === 'slug' && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Choose a unique URL for your portfolio. This will be your public link that you can share with anyone.
                </p>
              </div>

              <SlugSelector
                userId={userId}
                currentSlug={currentSlug || ''}
                onSlugChange={(newSlug, valid) => {
                  setSlug(newSlug);
                  setIsSlugValid(valid);
                }}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSlugContinue}
                  disabled={!isSlugValid || loading}
                  className="px-6 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                  style={{ background: !isSlugValid || loading ? '' : '#5BC64A', border: !isSlugValid || loading ? '' : '2px solid #111111', color: !isSlugValid || loading ? '' : '#111111' }}
                >
                  {loading ? 'Checking...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Validation */}
          {step === 'validation' && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Review your portfolio before publishing. Make sure everything looks good!
                </p>
              </div>

              {/* Portfolio Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Portfolio Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Projects:</span>
                    <span className="ml-2 font-medium">{portfolioData.projects?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Career Highlights:</span>
                    <span className="ml-2 font-medium">{portfolioData.careerHighlights?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Strengths:</span>
                    <span className="ml-2 font-medium">{portfolioData.strengths?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Testimonials:</span>
                    <span className="ml-2 font-medium">{portfolioData.testimonials?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">FAQs:</span>
                    <span className="ml-2 font-medium">{portfolioData.faqs?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Services:</span>
                    <span className="ml-2 font-medium">{portfolioData.services?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Resume:</span>
                    <span className="ml-2 font-medium">
                      {(portfolioData.resume || portfolioData.profile?.resume_url) ? '✓ Uploaded' : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Validation Results */}
              {validationResult && validationResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Issues Found</h4>
                  <ul className="space-y-1">
                    {validationResult.errors.map((err, i) => (
                      <li key={i} className="text-sm text-red-800">• {err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult && validationResult.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Suggestions</h4>
                  <ul className="space-y-1">
                    {validationResult.warnings.map((warn, i) => (
                      <li key={i} className="text-sm text-yellow-800">• {warn}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-yellow-700 mt-2">You can still publish, but consider addressing these for a better portfolio.</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleValidationContinue}
                  disabled={loading || (validationResult && !validationResult.canPublish)}
                  className="px-6 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                  style={{ background: (loading || (validationResult && !validationResult.canPublish)) ? '' : '#5BC64A', border: (loading || (validationResult && !validationResult.canPublish)) ? '' : '2px solid #111111', color: (loading || (validationResult && !validationResult.canPublish)) ? '' : '#111111' }}
                >
                  {loading ? 'Publishing...' : 'Publish Portfolio'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Publishing (Loading) */}
          {step === 'publishing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin mb-4" style={{ borderTopColor: '#5BC64A' }}></div>
              <p className="text-lg font-medium text-gray-900">Publishing your portfolio...</p>
              <p className="text-sm text-gray-600 mt-2">This will only take a moment</p>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Your portfolio is live!
                </h3>
                <p className="text-gray-600">
                  Share your portfolio with the world
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Portfolio URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={publishedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
                    style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg text-center"
                  style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
                >
                  View Live Site →
                </a>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

