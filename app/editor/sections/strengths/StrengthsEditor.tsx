'use client';

import { Plus, Trash2, X } from 'lucide-react';
import EmojiPicker from '../../components/EmojiPicker';
import { Strength } from './types';

interface StrengthsEditorProps {
  strengths: Strength[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Strength>) => void;
  onDelete: (id: string) => void;
  isExpanded: boolean;
}

export function StrengthsEditor({ 
  strengths, 
  onAdd, 
  onUpdate, 
  onDelete,
  isExpanded 
}: StrengthsEditorProps) {
  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {strengths.length} {strengths.length === 1 ? 'strength' : 'strengths'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {strengths.map((strength) => (
        <div key={strength.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          {/* Icon and Title */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <EmojiPicker
                value={strength.icon}
                onChange={(icon) => onUpdate(strength.id, { icon })}
              />
              {/* Remove emoji button - appears on hover if emoji exists */}
              {strength.icon && (
                <button
                  onClick={() => onUpdate(strength.id, { icon: '' })}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                  title="Remove emoji"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            <input
              value={strength.title}
              onChange={(e) => onUpdate(strength.id, { title: e.target.value })}
              placeholder="User Research & Testing"
              className="flex-1 px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none placeholder:text-gray-500"
            />
            <button
              onClick={() => onDelete(strength.id)}
              className="p-1 text-red-500 hover:text-red-700"
              title="Delete strength"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <textarea
            value={strength.description}
            onChange={(e) => onUpdate(strength.id, { description: e.target.value })}
            placeholder="Expert in conducting user interviews, usability tests, and turning insights into actionable product improvements."
            rows={2}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none placeholder:text-gray-500"
          />
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Strength</span>
      </button>
    </div>
  );
}

