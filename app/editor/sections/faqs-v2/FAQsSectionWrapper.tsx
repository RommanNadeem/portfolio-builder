/**
 * FAQsSection Wrapper
 * 
 * Wraps the V2 section with the collapsible header UI for consistency
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQsSection as FAQsSectionCore } from './FAQsSection';

interface FAQsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function FAQsSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId,
  onScrollToSection 
}: FAQsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const faqCount = (data.faqs || []).length;
  const prevCountRef = useRef(faqCount);

  // Auto-expand when new FAQ is added
  useEffect(() => {
    if (faqCount > prevCountRef.current) {
      console.log('[FAQsSection] ❓ New FAQ added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = faqCount;
  }, [faqCount]);
  
  // Create wrapped onScrollToSection that also expands
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'faqs') {
      console.log('[FAQsSection] Expanding section before scroll');
      setIsExpanded(true);
    }
    onScrollToSection?.(sectionId);
  };

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <FAQsSectionCore
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
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900">FAQs</h3>
            <p className="text-xs text-gray-500">Answer common questions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {faqCount} {faqCount === 1 ? 'FAQ' : 'FAQs'}
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
          <FAQsSectionCore
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

