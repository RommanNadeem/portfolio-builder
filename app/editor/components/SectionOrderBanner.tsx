'use client';

import { ArrowUpDown, Info } from 'lucide-react';
import { useState } from 'react';

export function SectionOrderBanner() {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sectionOrderBannerDismissed') === 'true';
    }
    return false;
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('sectionOrderBannerDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <ArrowUpDown className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-blue-900">
              Drag & Drop to Reorder Sections
            </h3>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">
            Hover over any section below (Career, Projects, Strengths, Testimonials) to reveal the drag handle on the left. 
            Click and drag to reorder sections in your portfolio. Your changes are saved automatically.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
          title="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

