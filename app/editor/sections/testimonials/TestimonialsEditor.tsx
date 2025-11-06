'use client';

import { Plus, Trash2, Linkedin } from 'lucide-react';
import { Testimonial } from './types';

interface TestimonialsEditorProps {
  testimonials: Testimonial[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Testimonial>) => void;
  onDelete: (id: string) => void;
  isExpanded: boolean;
}

export function TestimonialsEditor({ 
  testimonials, 
  onAdd, 
  onUpdate, 
  onDelete,
  isExpanded 
}: TestimonialsEditorProps) {
  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {testimonials.length} {testimonials.length === 1 ? 'testimonial' : 'testimonials'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          {/* Name and Delete */}
          <div className="flex items-center gap-2">
            <input
              value={testimonial.name}
              onChange={(e) => onUpdate(testimonial.id, { name: e.target.value })}
              placeholder="Sarah Johnson"
              className="flex-1 px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none placeholder:text-gray-500"
            />
            <button
              onClick={() => onDelete(testimonial.id)}
              className="p-1 text-red-500 hover:text-red-700"
              title="Delete testimonial"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Title/Position */}
          <input
            value={testimonial.title}
            onChange={(e) => onUpdate(testimonial.id, { title: e.target.value })}
            placeholder="VP of Product @ TechCorp"
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-500"
          />

          {/* LinkedIn URL */}
          <div className="flex items-center gap-2">
            <Linkedin className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="url"
              value={testimonial.linkedinUrl}
              onChange={(e) => onUpdate(testimonial.id, { linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/sarahjohnson"
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-500"
            />
          </div>

          {/* Testimonial Text */}
          <textarea
            value={testimonial.testimonial}
            onChange={(e) => onUpdate(testimonial.id, { testimonial: e.target.value })}
            placeholder="Working with [Name] was transformative for our product. Their attention to detail and user-first approach helped us achieve our goals faster than expected."
            rows={3}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none placeholder:text-gray-500"
          />
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Testimonial</span>
      </button>
    </div>
  );
}

