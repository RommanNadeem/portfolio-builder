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
        className="thin-chip thin-chip-editing"
      >
        <button
          {...attributes}
          {...listeners}
          className="thin-chip-drag"
          title="Drag to reorder"
        >
          <GripVertical className="w-3 h-3" />
        </button>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="thin-chip-input"
          autoFocus
          placeholder="Company name"
        />
        <button
          onClick={handleSave}
          className="thin-chip-action"
          title="Save (Enter)"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        </button>
        <button
          onClick={handleCancel}
          className="thin-chip-action thin-chip-action-delete"
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
      className="thin-chip"
    >
      <button
        {...attributes}
        {...listeners}
        className="thin-chip-drag"
        title="Drag to reorder"
      >
        <GripVertical className="w-3 h-3" />
      </button>
      <span className="text-gray-900 font-medium">{company.name}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="thin-chip-action"
        title="Edit company name"
      >
        <Edit2 className="w-3 h-3" />
      </button>
      <button
        onClick={() => onDelete(company.id)}
        className="thin-chip-action thin-chip-action-delete"
        title="Remove company"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

