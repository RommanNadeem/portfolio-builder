'use client';

import { useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TemplateBlock } from './types';
import { TemplateRenderer } from './TemplateRenderer';

interface NotionStyleSectionProps {
  block: TemplateBlock;
  index: number;
  isExpanded: boolean;
  isSaved: boolean;
  viewMode: 'edit' | 'preview';
  onToggle: () => void;
  onChange: (block: TemplateBlock) => void;
  onDelete: () => void;
  entityType?: 'project' | 'career'; // Optional entity type for block customization
}

export function NotionStyleSection({
  block,
  index,
  isExpanded,
  isSaved,
  viewMode,
  onToggle,
  onChange,
  onDelete,
  entityType,
}: NotionStyleSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: block.id,
    disabled: index === 0 // Disable dragging for Hero
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [hovering, setHovering] = useState(false);

  // In preview mode, hide empty sections
  const isEmpty = !isSaved;
  if (viewMode === 'preview' && isEmpty) {
    return null;
  }

  // In preview mode, render without any wrapper - just the content
  if (viewMode === 'preview') {
    return (
      <div ref={setNodeRef} style={style} className="mt-12 first:mt-8">
        <TemplateRenderer
          blocks={[block]}
          onChange={(blocks) => onChange(blocks[0])}
          mode="preview"
          entityType={entityType}
        />
      </div>
    );
  }

  // Edit mode - Notion-style document layout with fixed left rail for drag handle
  return (
    <section 
      ref={setNodeRef} 
      style={style}
      className={`group/section mt-12 first:mt-8 hover-tint rounded-md -mx-2 px-2 py-3 ${
        isDragging ? 'scale-[0.98] opacity-60' : ''
      } transition-all duration-150`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Title Row with Fixed Left Rail for Alignment */}
      <div className="flex items-start gap-3 mb-3">
        {/* Left Rail - Fixed width for consistent alignment */}
        <div className="w-8 flex-shrink-0 pt-1">
          {index !== 0 && (
            <div {...attributes} {...listeners}>
              <button 
                className="inline-flex items-center justify-center w-8 h-8 opacity-40 hover:opacity-100 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 ring-gray-300 rounded transition-opacity"
                title="Drag to reorder"
              >
                <GripVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Title and Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            {/* Section Title - Exact spec */}
            <h2 className="text-[18px] font-medium tracking-[0.2px] text-gray-900">
              {block.sectionLabel || block.type}
            </h2>

            {/* Actions Row */}
            <div className="flex items-center gap-2">
              {/* Complete Indicator */}
              {isSaved && (
                <span className="text-xs text-green-600 font-medium">
                  ✓
                </span>
              )}

              {/* Delete Button */}
              {index !== 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="opacity-0 group-hover/section:opacity-100 p-1.5 text-gray-400 hover:text-red-500 rounded transition-all"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Section Description - Optional */}
          {block.sectionDescription && (
            <p className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px] mt-2">
              {block.sectionDescription}
            </p>
          )}
        </div>
      </div>

      {/* Section Content - Clean, no wrapper, aligned with title */}
      <div className="ml-11"> {/* 32px (w-8) + 12px (gap-3) = 44px offset */}
          <TemplateRenderer
            blocks={[block]}
            onChange={(blocks) => onChange(blocks[0])}
            mode="edit"
            entityType={entityType}
          />
      </div>

      {/* Subtle Divider */}
      <div className="section-divider" />
    </section>
  );
}

