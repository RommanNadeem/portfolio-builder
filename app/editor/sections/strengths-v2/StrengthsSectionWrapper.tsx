/**
 * StrengthsSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { StrengthsSection as StrengthsSectionCore } from './StrengthsSection';

interface StrengthsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function StrengthsSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId,
  onScrollToSection 
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
  
  // Create wrapped onScrollToSection that also expands
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'strengths') {
      console.log('[StrengthsSection] Expanding section before scroll');
      setIsExpanded(true);
    }
    onScrollToSection?.(sectionId);
  };

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
        onScrollToSection={handleScrollToSection}
      />
    );
  }

  // In editor renderMode, wrap with collapsible header
  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-all group relative"
      >
        {/* Drag Handle - appears on left on hover */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-3 group-hover:pl-6 transition-all">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900">Strengths</h3>
            <p className="text-xs text-gray-600">Your key skills</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-700 font-medium">
              {(data.strengths || []).length} {(data.strengths || []).length === 1 ? 'strength' : 'strengths'}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
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
            onScrollToSection={handleScrollToSection}
          />
        </div>
      )}
    </div>
  );
}

