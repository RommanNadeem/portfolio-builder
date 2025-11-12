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
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Question
          </label>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => handleUpdate('question', e.target.value)}
            placeholder="What services do you offer?"
            className="w-full px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        {/* Answer Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Answer
          </label>
          <textarea
            value={faq.answer}
            onChange={(e) => handleUpdate('answer', e.target.value)}
            placeholder="I offer UX design, product strategy, and user research services..."
            rows={4}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-500"
          />
        </div>

        {/* Optional Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Category (Optional)
          </label>
          <input
            type="text"
            value={faq.category || ''}
            onChange={(e) => handleUpdate('category', e.target.value)}
            placeholder="General, Services, Process..."
            className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
          />
        </div>
      </div>
    </ItemCard>
  );
}

