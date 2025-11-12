'use client';

import { useState, useEffect } from 'react';
import { checkSlugAvailability } from '@/lib/publishing';
import { sanitizeSlugInput, getSlugValidationErrors } from '@/lib/reserved-slugs';

interface SlugSelectorProps {
  userId: string;
  currentSlug?: string;
  onSlugChange: (slug: string, isValid: boolean) => void;
}

export function SlugSelector({ userId, currentSlug = '', onSlugChange }: SlugSelectorProps) {
  const [slug, setSlug] = useState(currentSlug);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    error?: string;
    suggestions?: string[];
    takenByCurrentUser?: boolean;
  } | null>(null);
  const [touched, setTouched] = useState(false);

  // Debounced availability check
  useEffect(() => {
    if (!slug || slug === currentSlug) {
      setAvailability(null);
      onSlugChange(slug, false);
      return;
    }

    // Check format first (instant feedback)
    const errors = getSlugValidationErrors(slug);
    if (errors.length > 0) {
      setAvailability({ available: false, error: errors[0] });
      onSlugChange(slug, false);
      return;
    }

    setChecking(true);

    const timer = setTimeout(async () => {
      const result = await checkSlugAvailability(slug, userId);
      setAvailability(result);
      setChecking(false);
      onSlugChange(slug, result.available);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, userId, currentSlug, onSlugChange]);

  const handleInputChange = (value: string) => {
    setTouched(true);
    const sanitized = sanitizeSlugInput(value);
    setSlug(sanitized);
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Your Portfolio URL
      </label>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-gray-500 text-sm whitespace-nowrap">
          {baseUrl.replace('https://', '').replace('http://', '')}/
        </span>
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={slug}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="your-name"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              !touched
                ? 'border-gray-300 focus:ring-blue-500'
                : availability?.available
                ? 'border-green-500 focus:ring-green-500'
                : availability?.error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            maxLength={30}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {checking && (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            )}
            {!checking && touched && availability?.available && (
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {!checking && touched && availability?.error && !availability?.available && (
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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

      {/* Availability feedback */}
      {touched && availability && !checking && (
        <div className="mt-3">
          {availability.available && !availability.takenByCurrentUser && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    ✓ This URL is available!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {baseUrl}/{slug}
                  </p>
                </div>
              </div>
            </div>
          )}

          {availability.takenByCurrentUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                  This is your current URL
                </p>
              </div>
            </div>
          )}

          {!availability.available && !availability.takenByCurrentUser && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    {availability.error || 'This URL is not available'}
                  </p>
                  {availability.suggestions && availability.suggestions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1 font-medium">Try these instead:</p>
                      <div className="flex flex-wrap gap-2">
                        {availability.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleInputChange(suggestion)}
                            className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:border-blue-500 hover:text-blue-600 transition-colors"
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
    </div>
  );
}

