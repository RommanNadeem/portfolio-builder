/**
 * TestimonialCard Component (V2)
 * 
 * Card component for displaying and editing a single testimonial.
 */

'use client';

import { Linkedin, User } from 'lucide-react';
import { ItemCard } from '@/app/editor/core/components';
import { TestimonialItem } from './types';

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  onUpdate: (id: string, updates: Partial<TestimonialItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function TestimonialCard({
  testimonial,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: TestimonialCardProps) {
  
  const handleUpdate = (field: keyof TestimonialItem, value: any) => {
    onUpdate(testimonial.id, { [field]: value });
  };

  return (
    <ItemCard
      id={testimonial.id}
      onDelete={() => onDelete(testimonial.id)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      isDraggable={true}
      className="bg-gradient-to-br from-white to-gray-50"
    >
      <div className="space-y-3">
        {/* Name Input */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-700 flex-shrink-0" />
          <input
            type="text"
            value={testimonial.name}
            onChange={(e) => handleUpdate('name', e.target.value)}
            placeholder="Sarah Johnson"
            className="thin-input"
          />
        </div>

        {/* Role Input */}
        <input
          type="text"
          value={testimonial.role}
          onChange={(e) => handleUpdate('role', e.target.value)}
          placeholder="VP of Product"
          className="thin-input"
        />

        {/* Company Input */}
        <input
          type="text"
          value={testimonial.company}
          onChange={(e) => handleUpdate('company', e.target.value)}
          placeholder="TechCorp Inc"
          className="thin-input"
        />

        {/* LinkedIn URL */}
        <div className="flex items-center gap-2">
          <Linkedin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <input
            type="url"
            value={testimonial.linkedinUrl || ''}
            onChange={(e) => handleUpdate('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/in/sarahjohnson"
            className="thin-input"
          />
        </div>

        {/* Testimonial Content */}
        <textarea
          value={testimonial.content}
          onChange={(e) => handleUpdate('content', e.target.value)}
          placeholder="Working with [Name] was transformative for our product. Their attention to detail and user-first approach helped us achieve our goals faster than expected."
          rows={4}
          className="thin-textarea"
        />
      </div>
    </ItemCard>
  );
}

