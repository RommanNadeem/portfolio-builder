/**
 * CompanyChip Component (V2)
 * 
 * Chip component for displaying and editing a single company name.
 */

'use client';

import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { CompanyItem } from './types';

interface CompanyChipProps {
  company: CompanyItem;
  onUpdate: (id: string, updates: Partial<CompanyItem>) => void;
  onDelete: (id: string) => void;
}

export function CompanyChip({
  company,
  onUpdate,
  onDelete,
}: CompanyChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(company.name);

  const handleSave = () => {
    if (editValue.trim() && editValue !== company.name) {
      onUpdate(company.id, { name: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(company.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-100 transition-all">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white border-none outline-none focus:ring-0 px-2 py-0.5 text-sm font-medium min-w-[120px] rounded"
          autoFocus
          placeholder="Company name"
        />
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-700 transition-colors"
          title="Save (Enter)"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Cancel (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all">
      <span className="text-gray-700">{company.name}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Edit company name"
      >
        <Edit2 className="w-3 h-3" />
      </button>
      <button
        onClick={() => onDelete(company.id)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Remove company"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

