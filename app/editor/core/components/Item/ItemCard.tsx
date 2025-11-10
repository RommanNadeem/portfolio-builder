/**
 * ItemCard Component
 * 
 * Base card component for displaying section items with actions.
 */

'use client';

import { ReactNode } from 'react';
import { GripVertical, Trash2, Edit2, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ItemCardProps {
  id: string;
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onOpenDetail?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isDraggable?: boolean;
  className?: string;
  actionsPosition?: 'top-right' | 'bottom-right' | 'floating';
}

export function ItemCard({
  id,
  children,
  onEdit,
  onDelete,
  onOpenDetail,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  isDraggable = true,
  className = '',
  actionsPosition = 'top-right',
}: ItemCardProps) {
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white border border-gray-200 rounded-lg p-4
        hover:border-gray-300 hover:shadow-sm transition-all
        ${className}
      `}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-2 top-4 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      )}

      {/* Content */}
      <div className={isDraggable ? 'ml-6' : ''}>
        {children}
      </div>

      {/* Actions */}
      <div className={`
        absolute ${actionsPosition === 'top-right' ? 'top-4 right-4' : 'bottom-4 right-4'}
        flex items-center gap-2
        opacity-0 group-hover:opacity-100 transition-opacity
      `}>
        {/* Move buttons */}
        {onMoveUp && canMoveUp && (
          <button
            onClick={onMoveUp}
            className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4 text-gray-600" />
          </button>
        )}
        
        {onMoveDown && canMoveDown && (
          <button
            onClick={onMoveDown}
            className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Edit button */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {/* Open detail button */}
        {onOpenDetail && (
          <button
            onClick={onOpenDetail}
            className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
            title="Open detail page"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 bg-white border border-gray-200 rounded hover:bg-red-50 hover:border-red-300 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}

