'use client';

import { useState } from 'react';
import { Menu, ChevronDown, ChevronUp } from 'lucide-react';
import { NavigationEditor } from './NavigationEditor';
import { NavigationPreview } from './NavigationPreview';

interface NavigationSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function NavigationSection({ data, onChange, viewMode, previewMode, renderMode }: NavigationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (renderMode === 'editor') {
    return (
      <div className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Menu className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Navigation Bar</h3>
              <p className="text-xs text-gray-500">Top menu links</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Content */}
        <div className="px-4 pb-4">
          <NavigationEditor isExpanded={isExpanded} />
        </div>
      </div>
    );
  }

  return (
    <NavigationPreview
      portfolioData={data}
      previewMode={previewMode}
    />
  );
}

