/**
 * TestimonialsSection Component (Controlled Version)
 * 
 * Fully controlled component with no internal state.
 * Real-time sync between editor and preview.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Plus, MessageSquare, Linkedin } from 'lucide-react';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { ItemList } from '@/app/editor/core/components';
import { TestimonialItem, convertFromLegacy, convertToLegacy, Testimonial } from './types';
import { TestimonialCard } from './TestimonialCard';

interface TestimonialsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function TestimonialsSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
  onScrollToSection,
}: TestimonialsSectionProps) {
  
  // Convert legacy data to new format (memoized)
  const testimonials = useMemo(() => {
    const legacyTestimonials = data.testimonials || [];
    return legacyTestimonials.map((t: Testimonial) => convertFromLegacy(t));
  }, [data.testimonials]);

  // Handle changes - update parent immediately
  const handleTestimonialsChange = useCallback((newTestimonials: TestimonialItem[]) => {
    const legacy = newTestimonials.map(convertToLegacy);
    onChange(prev => ({
      ...prev,
      testimonials: legacy,
    }));
  }, [onChange]);

  // Use controlled hook
  const {
    items: currentTestimonials,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<TestimonialItem>({
    items: testimonials,
    onChange: handleTestimonialsChange,
  });

  const handleAdd = () => {
    // Check if there's already an empty testimonial
    const hasEmptyTestimonial = currentTestimonials.some(t => 
      t.name.trim().length === 0 || t.content.trim().length === 0
    );
    
    if (hasEmptyTestimonial) {
      console.log('[TestimonialsSection] Empty testimonial already exists, not adding new one');
      return; // Don't add new one, user should fill existing
    }
    
    const now = new Date().toISOString();
    add({
      name: '',
      role: '',
      company: '',
      content: '',
      avatar: null,
      linkedinUrl: '',
    });
  };

  // In preview renderMode, render the preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    // Filter out empty testimonials (name and content required)
    const validTestimonials = currentTestimonials.filter(t => 
      t.name.trim().length > 0 && t.content.trim().length > 0
    );
    
    if (validTestimonials.length === 0) {
      return null; // Don't show empty section
    }

    const isMobile = previewMode === 'mobile';
    
    return (
      <div id="testimonials" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
        {/* Section Header */}
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className={`rounded-lg bg-yellow-100 flex items-center justify-center ${
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          }`}>
            <MessageSquare className={isMobile ? 'w-3.5 h-3.5 text-yellow-600' : 'w-5 h-5 text-yellow-600'} />
          </div>
          <h2 className={`font-bold text-gray-900 ${
            isMobile ? 'text-lg' : 'text-3xl'
          }`}>Testimonials</h2>
        </div>
        
        <div className={`grid gap-4 ${
          isMobile ? 'grid-cols-1' : 'md:grid-cols-2 gap-6'
        }`}>
          {validTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all ${
                isMobile ? 'p-4' : 'p-6 sm:p-8'
              }`}
            >
              <p className={`text-gray-700 italic leading-relaxed ${
                isMobile ? 'text-xs mb-3' : 'text-sm mb-4'
              }`}>&ldquo;{testimonial.content}&rdquo;</p>
              <div className={`flex items-center justify-between ${isMobile ? 'gap-2' : 'gap-3'}`}>
                <div className="flex items-center gap-3">
                  <div className={`bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold ${
                    isMobile ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm'
                  }`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-semibold text-gray-900 ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>{testimonial.name}</p>
                    <p className={`text-gray-600 ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}>
                      {testimonial.role}
                      {testimonial.company && ` @ ${testimonial.company}`}
                    </p>
                  </div>
                </div>
                {/* LinkedIn Icon */}
                {testimonial.linkedinUrl && (
                  <a
                    href={testimonial.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-shrink-0 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all ${
                      isMobile ? '' : ''
                    }`}
                    title="View LinkedIn Profile"
                  >
                    <Linkedin className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-3">
      <ItemList
        items={currentTestimonials}
        onReorder={reorderByIndex}
        renderItem={(testimonial, index) => (
          <TestimonialCard
            testimonial={testimonial}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={() => reorder(testimonial.id, 'up')}
            onMoveDown={() => reorder(testimonial.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < currentTestimonials.length - 1}
          />
        )}
      />
      
      {/* Add button - Always visible */}
      {currentTestimonials.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <MessageSquare className="w-12 h-12 text-yellow-300 mb-1" />
          <div className="text-center">
            <p className="font-medium">No testimonials yet</p>
            <p className="text-sm text-gray-500">Click to add your first testimonial</p>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      )}
    </div>
  );
}

