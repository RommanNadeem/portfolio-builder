/**
 * FAQCard Component (V2)
 * 
 * Card component for displaying and editing a single FAQ.
 */

'use client';

import { ItemCard } from '@/app/editor/core/components';
import { FAQItem } from './types';

interface FAQCardProps {
  faq: FAQItem;
  onUpdate: (id: string, updates: Partial<FAQItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function FAQCard({
  faq,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: FAQCardProps) {
  
  const handleUpdate = (field: keyof FAQItem, value: any) => {
    onUpdate(faq.id, { [field]: value });
  };

  return (
    <ItemCard
      id={faq.id}
      onDelete={() => onDelete(faq.id)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      isDraggable={true}
      className="bg-gradient-to-br from-white to-blue-50"
    >
      <div className="space-y-3">
        {/* Question Input */}
        <div>
          <label className="thin-label">
            Question
          </label>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => handleUpdate('question', e.target.value)}
            placeholder="What services do you offer?"
            className="thin-input"
          />
        </div>

        {/* Answer Input */}
        <div>
          <label className="thin-label">
            Answer
          </label>
          <textarea
            value={faq.answer}
            onChange={(e) => handleUpdate('answer', e.target.value)}
            placeholder="I offer UX design, product strategy, and user research services..."
            rows={4}
            className="thin-textarea"
          />
        </div>

        {/* Optional Category */}
        <div>
          <label className="thin-label">
            Category <span className="text-gray-600 font-medium">(Optional)</span>
          </label>
          <input
            type="text"
            value={faq.category || ''}
            onChange={(e) => handleUpdate('category', e.target.value)}
            placeholder="General, Services, Process..."
            className="thin-input"
          />
        </div>
      </div>
    </ItemCard>
  );
}

