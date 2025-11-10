/**
 * TestimonialsSection Component (V2 - Using Core Architecture)
 * 
 * Testimonials section built with the unified core architecture.
 * Demonstrates the pattern that all sections should follow.
 */

'use client';

import { useSectionManager } from '@/app/editor/core/hooks';
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
}

export function TestimonialsSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
}: TestimonialsSectionProps) {
  
  // Convert legacy data to new format
  const legacyTestimonials = data.testimonials || [];
  const initialData: TestimonialItem[] = legacyTestimonials.map((t: Testimonial) => 
    convertFromLegacy(t)
  );

  // Use shared hook for state management
  const {
    items: testimonials,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    saveStatus,
    itemCount,
  } = useSectionManager<TestimonialItem>({
    initialData,
    onSave: async (items) => {
      // Convert back to legacy format for compatibility
      const legacy = items.map(convertToLegacy);
      
      // Update parent state
      onChange(prev => ({
        ...prev,
        testimonials: legacy,
      }));
      
      // TODO: Save to database when implemented
      console.log('[TestimonialsSection] 💾 Saved testimonials:', items.length);
    },
    autoSave: true,
    autoSaveDelay: 100, // Instant sync for live preview
    localStorageKey: `testimonials-${userId}`,
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    add({
      name: '',
      role: '',
      company: '',
      content: '',
      avatar: null,
      linkedinUrl: '',
      relationship: '',
    });
  };

  // In preview renderMode, render the preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    // TODO: Create TestimonialsPreview component
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <p className="text-gray-700 italic mb-4">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}
                    {testimonial.company && ` @ ${testimonial.company}`}
                  </p>
                </div>
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
        items={testimonials}
        onReorder={reorderByIndex}
        renderItem={(testimonial, index) => (
          <TestimonialCard
            testimonial={testimonial}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={() => reorder(testimonial.id, 'up')}
            onMoveDown={() => reorder(testimonial.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < testimonials.length - 1}
          />
        )}
      />
      
      {/* Add button */}
      {testimonials.length === 0 && (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <span className="text-3xl mb-2">💬</span>
          <div className="text-center">
            <p className="font-medium">No testimonials yet</p>
            <p className="text-sm">Add your first one!</p>
          </div>
        </button>
      )}
    </div>
  );
}

