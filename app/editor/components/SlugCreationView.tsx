/**
 * SlugCreationView - First step in publish overlay
 * 
 * Simple, focused UI for choosing portfolio URL slug
 */

'use client';

import { useState, useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { checkSlugAvailability, suggestSlugFromProfile } from '@/lib/publishing';
import { sanitizeSlugInput, getSlugValidationErrors } from '@/lib/reserved-slugs';
import { getBaseUrl, getDisplayUrl } from '@/lib/url-utils';

interface SlugCreationViewProps {
  userId: string;
  currentSlug?: string;
  onSlugClaimed: (slug: string) => void;
}

export function SlugCreationView({ userId, currentSlug, onSlugClaimed }: SlugCreationViewProps) {
  const [slug, setSlug] = useState(currentSlug || '');
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    error?: string;
    suggestions?: string[];
    takenByCurrentUser?: boolean;
  } | null>(null);
  const [touched, setTouched] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const baseUrl = getBaseUrl();
  const displayUrl = getDisplayUrl();

  // Load slug suggestion on mount
  useEffect(() => {
    if (!slug && !currentSlug) {
      loadSlugSuggestion();
    }
  }, []);

  const loadSlugSuggestion = async () => {
    const suggested = await suggestSlugFromProfile(userId);
    if (suggested) {
      setSlug(suggested);
    }
  };

  // Debounced availability check
  useEffect(() => {
    if (!slug) {
      setAvailability(null);
      return;
    }

    if (slug === currentSlug) {
      setAvailability({ available: true, takenByCurrentUser: true });
      return;
    }

    // Check format first (instant feedback)
    const errors = getSlugValidationErrors(slug);
    if (errors.length > 0) {
      setAvailability({ available: false, error: errors[0] });
      return;
    }

    setChecking(true);

    const timer = setTimeout(async () => {
      const result = await checkSlugAvailability(slug, userId);
      setAvailability(result);
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, userId, currentSlug]);

  const handleInputChange = (value: string) => {
    setTouched(true);
    const sanitized = sanitizeSlugInput(value);
    setSlug(sanitized);
  };

  const handleClaim = () => {
    if (availability?.available) {
      setClaiming(true);
      // Simulate brief delay for better UX
      setTimeout(() => {
        onSlugClaimed(slug);
      }, 300);
    }
  };

  const isValid = availability?.available && slug.length >= 3;

  return (
    <div className="space-y-6">
      {/* Header text */}
      <div>
        <p className="text-gray-600 text-sm">
          Choose a unique URL for your portfolio. This will be your professional link to share with anyone.
        </p>
      </div>

      {/* Slug Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Your Portfolio URL
        </label>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm whitespace-nowrap flex-shrink-0">
            {displayUrl}/
          </span>
          <div className="relative flex-1">
            <input
              type="text"
              value={slug}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="your-name"
              autoFocus
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${
                !touched
                  ? 'border-gray-300 focus:ring-blue-500'
                  : availability?.available
                  ? 'border-green-500 focus:ring-green-500 bg-green-50'
                  : availability?.error
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              maxLength={30}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checking && (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              )}
              {!checking && touched && availability?.available && (
                <Check className="w-5 h-5 text-green-600" />
              )}
              {!checking && touched && availability?.error && !availability?.available && (
                <X className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Character count */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>3-30 characters (lowercase, numbers, hyphens)</span>
          <span className={slug.length > 30 ? 'text-red-600' : ''}>
            {slug.length}/30
          </span>
        </div>
      </div>

      {/* Feedback */}
      {touched && availability && !checking && (
        <div className="mt-4">
          {availability.available && !availability.takenByCurrentUser && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    This URL is available!
                  </p>
                  <p className="text-xs text-green-700 mt-1 font-mono">
                    {baseUrl}/{slug}
                  </p>
                </div>
              </div>
            </div>
          )}

          {availability.takenByCurrentUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-blue-900">
                  This is your current URL
                </p>
              </div>
            </div>
          )}

          {!availability.available && !availability.takenByCurrentUser && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 mb-1">
                    {availability.error || 'This URL is not available'}
                  </p>
                  {availability.suggestions && availability.suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-700 mb-2 font-medium">Try these instead:</p>
                      <div className="flex flex-wrap gap-2">
                        {availability.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleInputChange(suggestion)}
                            className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:border-blue-500 hover:text-blue-600 transition-colors font-mono"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleClaim}
        disabled={!isValid || claiming}
        className="w-full px-6 py-3 text-sm font-semibold rounded-full transition-all hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ 
          background: (!isValid || claiming) ? '' : 'white', 
          border: '2px solid #111111', 
          color: '#111111' 
        }}
      >
        {claiming ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Claiming...
          </>
        ) : (
          'Claim URL'
        )}
      </button>
    </div>
  );
}


