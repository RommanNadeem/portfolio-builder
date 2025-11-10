/**
 * TestimonialsSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { TestimonialsSection as TestimonialsSectionCore } from './TestimonialsSection';

interface TestimonialsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
}

export function TestimonialsSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId 
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
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900">Testimonials</h3>
            <p className="text-xs text-gray-500">What others say</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {(data.testimonials || []).length} {(data.testimonials || []).length === 1 ? 'testimonial' : 'testimonials'}
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
          <TestimonialsSectionCore
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

