'use client';

import { GripVertical } from 'lucide-react';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface DragHandleProps {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  visible?: boolean;
  disabled?: boolean;
}

export function DragHandle({ attributes, listeners, visible = true, disabled = false }: DragHandleProps) {
  if (disabled) return null;

  return (
    <div
      {...attributes}
      {...listeners}
      className={`
        group/drag
        flex items-center justify-center
        w-6 h-8
        cursor-grab active:cursor-grabbing
        rounded
        transition-all duration-200
        ${visible ? 'opacity-100' : 'opacity-0'}
        hover:opacity-100
        hover:bg-gray-100
        active:bg-gray-200
      `}
      style={{ touchAction: 'none' }}
    >
      <GripVertical 
        className="w-4 h-4 text-gray-400 group-hover/drag:text-gray-700 transition-colors" 
      />
    </div>
  );
}

// Enhanced version with tooltip and animations
interface EnhancedDragHandleProps extends DragHandleProps {
  showLabel?: boolean;
  position?: 'left' | 'right';
}

export function EnhancedDragHandle({ 
  attributes, 
  listeners, 
  visible = true,
  disabled = false,
  showLabel = false,
  position = 'left'
}: EnhancedDragHandleProps) {
  if (disabled) return null;

  return (
    <div className={`relative group/drag-enhanced ${position === 'left' ? '' : 'order-last'}`}>
      <div
        {...attributes}
        {...listeners}
        className={`
          flex items-center gap-1
          px-2 py-1.5
          cursor-grab active:cursor-grabbing
          rounded-lg
          transition-all duration-200 ease-out
          ${visible 
            ? 'opacity-60 hover:opacity-100' 
            : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'
          }
          hover:bg-gray-100 hover:shadow-sm
          active:bg-gray-200 active:scale-95
          relative
        `}
        style={{ touchAction: 'none' }}
        title="Drag to reorder"
      >
        {/* Grip icon */}
        <GripVertical 
          className="w-4 h-4 text-gray-400 group-hover/drag-enhanced:text-purple-600 transition-colors" 
        />
        
        {/* Optional label */}
        {showLabel && (
          <span className="text-xs font-medium text-gray-500 group-hover/drag-enhanced:text-purple-600 whitespace-nowrap">
            Drag
          </span>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="
        absolute left-full ml-2 top-1/2 -translate-y-1/2
        px-2 py-1 bg-gray-900 text-white text-xs rounded
        opacity-0 group-hover/drag-enhanced:opacity-100
        pointer-events-none transition-opacity
        whitespace-nowrap z-50
      ">
        Drag to reorder
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
      </div>
    </div>
  );
}

// Floating drag handle that appears on section hover
interface FloatingDragHandleProps extends DragHandleProps {
  sectionHovered: boolean;
}

export function FloatingDragHandle({ 
  attributes, 
  listeners, 
  sectionHovered,
  disabled = false
}: FloatingDragHandleProps) {
  if (disabled) return null;

  return (
    <div
      {...attributes}
      {...listeners}
      className={`
        absolute -left-10 top-1/2 -translate-y-1/2
        w-8 h-8
        flex items-center justify-center
        cursor-grab active:cursor-grabbing
        rounded-lg
        bg-white
        border-2 border-gray-200
        shadow-md
        transition-all duration-200
        ${sectionHovered 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-2 pointer-events-none'
        }
        hover:border-purple-500 hover:shadow-lg
        active:scale-90
        z-10
      `}
      style={{ touchAction: 'none' }}
      title="Drag to reorder"
    >
      <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
    </div>
  );
}

