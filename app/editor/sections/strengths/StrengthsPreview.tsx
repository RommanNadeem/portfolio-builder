'use client';

import { Star } from 'lucide-react';
import { Strength } from './types';

interface StrengthsPreviewProps {
  strengths: Strength[];
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
}

export function StrengthsPreview({ strengths, viewMode, previewMode }: StrengthsPreviewProps) {
  if (strengths.length === 0 && viewMode === 'preview') {
    return null;
  }

  const isMobile = previewMode === 'mobile';

  return (
    <div id="strengths" className={`w-full ${isMobile ? 'px-4 mb-6' : 'px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'}`}>
      {/* Section Header */}
      <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
        <div className={`rounded-lg bg-orange-100 flex items-center justify-center ${
          isMobile ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
        }`}>
          <Star className={isMobile ? 'w-3 h-3 text-orange-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-orange-600'} />
        </div>
        <h2 className={`font-bold text-gray-900 ${
          isMobile ? 'text-base' : 'text-2xl sm:text-3xl'
        }`}>Strengths</h2>
      </div>

      {/* Strengths Grid */}
      {strengths.length > 0 ? (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {strengths.map((strength) => (
            <div
              key={strength.id}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all ${
                isMobile ? 'p-3' : 'p-5'
              }`}
            >
              {/* Icon */}
              {strength.icon && (
                <div className={`mb-3 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {strength.icon}
                </div>
              )}

              {/* Title */}
              <h3 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>
                {strength.title}
              </h3>

              {/* Description */}
              {strength.description && (
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {strength.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No strengths yet. Add your key skills and abilities!
        </div>
      )}
    </div>
  );
}

