/**
 * CareerSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { CareerSection as CareerSectionCore } from './CareerSection';

interface CareerSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
}

export function CareerSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId 
}: CareerSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const highlightCount = (data.careerHighlights || []).length;
  const prevCountRef = useRef(highlightCount);

  // Auto-expand when new career highlight is added (count increases)
  useEffect(() => {
    if (highlightCount > prevCountRef.current) {
      // New career highlight added - expand to show it
      console.log('[CareerSection] 💼 New career highlight added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = highlightCount;
  }, [highlightCount]);

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <CareerSectionCore
        data={data}
        onChange={onChange}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode={renderMode}
        userId={userId}
      />
    );
  }

  // In editor renderMode, wrap with collapsible header
  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900">Career Highlights</h3>
            <p className="text-xs text-gray-500">Your work experience</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {highlightCount} {highlightCount === 1 ? 'highlight' : 'highlights'}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content - only render when expanded */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <CareerSectionCore
            data={data}
            onChange={onChange}
            viewMode={viewMode}
            previewMode={previewMode}
            renderMode="editor"
            userId={userId}
          />
        </div>
      )}
    </div>
  );
}

