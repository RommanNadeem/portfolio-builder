'use client';

import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useSection } from '../../hooks/useSection';
import { TestimonialsEditor } from './TestimonialsEditor';
import { TestimonialsPreview } from './TestimonialsPreview';
import { Testimonial } from './types';

interface TestimonialsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function TestimonialsSection({ data, onChange, viewMode, previewMode, renderMode }: TestimonialsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (updatedTestimonials: Testimonial[]) => {
    onChange(prev => ({
      ...prev,
      testimonials: updatedTestimonials,
    }));
  };

  const { items: testimonials, addItem, updateItem, deleteItem } = useSection<Testimonial>(
    data.testimonials || [],
    handleUpdate
  );

  const handleAdd = () => {
    addItem({
      name: '',
      title: '',
      testimonial: '',
      linkedinUrl: '',
    });
  };

  if (renderMode === 'editor') {
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
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Content */}
        <div className="px-4 pb-4">
          <TestimonialsEditor
            testimonials={testimonials}
            onAdd={handleAdd}
            onUpdate={updateItem}
            onDelete={deleteItem}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    );
  }

  return (
    <TestimonialsPreview
      testimonials={testimonials}
      viewMode={viewMode}
      previewMode={previewMode}
    />
  );
}

