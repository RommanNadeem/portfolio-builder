'use client';

import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  children: ReactNode;
  isDraggable?: boolean;
}

export function DraggableSection({ id, children, isDraggable = true }: DraggableSectionProps) {
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

  if (!isDraggable) {
    return <div>{children}</div>;
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing z-10"
        title="Drag to reorder section"
      >
        <div className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md rounded-lg p-2 transition-all">
          <GripVertical className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
        </div>
      </div>
      
      {/* Visual feedback during drag */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg pointer-events-none" />
      )}
      
      {children}
    </div>
  );
}

