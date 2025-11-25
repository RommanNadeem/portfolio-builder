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
  const isPurePreview = renderMode === 'preview';
  const isPreviewView = viewMode === 'preview';

  if (isPurePreview || isPreviewView) {
    // Filter out empty testimonials (name and content required)
    const validTestimonials = currentTestimonials.filter(t => 
      t.name.trim().length > 0 && t.content.trim().length > 0
    );
    const isMobile = previewMode === 'mobile';

    // Hide entire section if there are no testimonials in pure preview
    if (validTestimonials.length === 0) {
      if (isPurePreview) {
        return null;
      }

      return (
        <div
          id="testimonials"
          className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}
        >
          <div
            className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}
          >
            <div
              className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
                isMobile ? 'w-6 h-6' : 'w-8 h-8'
              }`}
            >
              <MessageSquare
                className={
                  isMobile
                    ? 'w-3.5 h-3.5 text-emerald-600'
                    : 'w-5 h-5 text-emerald-600'
                }
              />
            </div>
            <h2
              className={`font-bold text-gray-900 ${
                isMobile ? 'text-lg' : 'text-3xl'
              }`}
            >
              Testimonials
            </h2>
          </div>

          <div
            className={`bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl flex flex-col items-center justify-center ${
              isMobile ? 'p-6' : 'p-8'
            }`}
          >
            <MessageSquare
              className={`text-emerald-600 ${
                isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'
              }`}
            />
            <p
              className={`text-gray-600 mb-3 text-center ${
                isMobile ? 'text-sm' : 'text-base'
              }`}
            >
              No testimonials added yet
            </p>
            <p className="text-xs text-gray-500 text-center">
              Add testimonials from the editor panel to see them here.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div id="testimonials" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
        {/* Section Header - match Projects section */}
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          }`}>
            <MessageSquare className={isMobile ? 'w-3.5 h-3.5 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
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
                  <div
                    className={`rounded-full flex items-center justify-center font-semibold ${
                      isMobile ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm'
                    }`}
                    style={{
                      backgroundColor: 'var(--pastel-green)',
                      color: 'var(--text-primary)',
                    }}
                  >
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
                    className="flex-shrink-0 p-2 rounded-lg transition-all"
                    style={{
                      color: 'var(--cta-green)',
                      backgroundColor: 'rgba(91, 198, 74, 0.08)',
                    }}
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
          className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-xl hover:bg-emerald-50 hover:border-emerald-500 hover:text-gray-900 transition-all"
        >
          <MessageSquare className="w-12 h-12 text-emerald-700 mb-1" />
          <div className="text-center">
            <p className="font-semibold text-gray-900">No testimonials yet</p>
            <p className="text-sm text-gray-500">Click to add your first testimonial</p>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      )}
    </div>
  );
}

