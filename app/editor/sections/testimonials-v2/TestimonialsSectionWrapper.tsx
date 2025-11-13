/**
 * TestimonialsSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { TestimonialsSection as TestimonialsSectionCore } from './TestimonialsSection';

interface TestimonialsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function TestimonialsSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId,
  onScrollToSection 
}: TestimonialsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const testimonialCount = (data.testimonials || []).length;
  const prevCountRef = useRef(testimonialCount);

  // Auto-expand when new testimonial is added
  useEffect(() => {
    if (testimonialCount > prevCountRef.current) {
      console.log('[TestimonialsSection] 💬 New testimonial added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = testimonialCount;
  }, [testimonialCount]);
  
  // Create wrapped onScrollToSection that also expands
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'testimonials') {
      console.log('[TestimonialsSection] Expanding section before scroll');
      setIsExpanded(true);
    }
    onScrollToSection?.(sectionId);
  };

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <TestimonialsSectionCore
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
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900">Testimonials</h3>
            <p className="text-xs text-gray-600">What others say</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-700 font-medium">
              {(data.testimonials || []).length} {(data.testimonials || []).length === 1 ? 'testimonial' : 'testimonials'}
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
          <TestimonialsSectionCore
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

