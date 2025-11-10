/**
 * StrengthCard Component (V2)
 * 
 * Card component for displaying and editing a single strength.
 */

'use client';

import { X } from 'lucide-react';
import { ItemCard } from '@/app/editor/core/components';
import EmojiPicker from '../../components/EmojiPicker';
import { StrengthItem } from './types';

interface StrengthCardProps {
  strength: StrengthItem;
  onUpdate: (id: string, updates: Partial<StrengthItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function StrengthCard({
  strength,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: StrengthCardProps) {
  
  const handleUpdate = (field: keyof StrengthItem, value: any) => {
    onUpdate(strength.id, { [field]: value });
  };

  return (
    <ItemCard
      id={strength.id}
      onDelete={() => onDelete(strength.id)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      isDraggable={true}
      className="bg-gradient-to-br from-white to-orange-50"
    >
      <div className="space-y-3">
        {/* Icon and Title */}
        <div className="flex items-center gap-3">
          {/* Emoji Picker */}
          <div className="relative group flex-shrink-0">
            <EmojiPicker
              value={strength.icon || '⭐'}
              onChange={(icon) => handleUpdate('icon', icon)}
            />
            {/* Remove emoji button */}
            {strength.icon && (
              <button
                onClick={() => handleUpdate('icon', '')}
                className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                title="Remove emoji"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={strength.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="User Research & Testing"
            className="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
          />
        </div>

        {/* Category (optional) */}
        <select
          value={strength.category || ''}
          onChange={(e) => handleUpdate('category', e.target.value || undefined)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Category (optional)</option>
          <option value="skill">Skill</option>
          <option value="tool">Tool</option>
          <option value="soft-skill">Soft Skill</option>
        </select>

        {/* Proficiency (optional) */}
        <select
          value={strength.proficiency || ''}
          onChange={(e) => handleUpdate('proficiency', e.target.value || undefined)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Proficiency (optional)</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>

        {/* Description */}
        <textarea
          value={strength.description}
          onChange={(e) => handleUpdate('description', e.target.value)}
          placeholder="Expert in conducting user interviews, usability tests, and turning insights into actionable product improvements."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none placeholder:text-gray-400"
        />
      </div>
    </ItemCard>
  );
}

