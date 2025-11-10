/**
 * StrengthsSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { StrengthsSection as StrengthsSectionCore } from './StrengthsSection';

interface StrengthsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
}

export function StrengthsSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId 
}: StrengthsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const strengthCount = (data.strengths || []).length;
  const prevCountRef = useRef(strengthCount);

  // Auto-expand when new strength is added
  useEffect(() => {
    if (strengthCount > prevCountRef.current) {
      console.log('[StrengthsSection] ⭐ New strength added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = strengthCount;
  }, [strengthCount]);

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <StrengthsSectionCore
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
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900">Strengths</h3>
            <p className="text-xs text-gray-500">Your key skills</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {(data.strengths || []).length} {(data.strengths || []).length === 1 ? 'strength' : 'strengths'}
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
          <StrengthsSectionCore
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

