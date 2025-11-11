/**
 * CompanyChip Component (V2)
 * 
 * Chip component for displaying and editing a single company name.
 * Now with drag-and-drop support.
 */

'use client';

import { useState } from 'react';
import { Edit2, Check, X, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

  // Drag-and-drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: company.id });

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isEditing) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-100 transition-all"
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          <GripVertical className="w-3 h-3" />
        </button>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white border-none outline-none focus:ring-0 px-2 py-0.5 text-sm font-medium min-w-[120px] rounded-lg"
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
    <div 
      ref={setNodeRef}
      style={style}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        title="Drag to reorder"
      >
        <GripVertical className="w-3 h-3" />
      </button>
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

