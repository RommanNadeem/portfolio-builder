/**
 * TemplateEditorContent - Reusable Content Area for Template Editors
 * 
 * Handles both edit and preview modes with drag-and-drop.
 */

'use client';

import { useState } from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TemplateRenderer, SlashCommandMenu, createEmptyBlock } from '@/app/editor/templates';
import type { TemplateBlock } from '@/app/editor/templates/types';

interface SortableSectionProps {
  block: TemplateBlock;
  index: number;
  isExpanded: boolean;
  isSaved: boolean;
  viewMode: 'edit' | 'preview';
  onToggle: () => void;
  onChange: (block: TemplateBlock) => void;
  onDelete: () => void;
}

function SortableSection({
  block,
  index,
  isExpanded,
  isSaved,
  viewMode,
  onToggle,
  onChange,
  onDelete,
}: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: block.id,
    disabled: index === 0 // Hero can't be dragged
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [hovering, setHovering] = useState(false);

  // Preview mode: hide empty sections
  if (viewMode === 'preview' && !isSaved) {
    return null;
  }

  // Preview mode: render without wrapper
  if (viewMode === 'preview') {
    return (
      <div ref={setNodeRef} style={style} className="mt-12 first:mt-8">
        <TemplateRenderer
          blocks={[block]}
          onChange={(blocks) => onChange(blocks[0])}
          mode="preview"
        />
      </div>
    );
  }

  // Edit mode
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
      <div className="flex items-start gap-3 mb-3">
        {/* Drag Handle */}
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
            <h2 className="text-[18px] font-medium tracking-[0.2px] text-gray-900">
              {block.sectionLabel || block.type}
            </h2>

            <div className="flex items-center gap-2">
              {isSaved && (
                <span className="text-xs text-green-600 font-medium">✓</span>
              )}

              {index !== 0 && (
                <button
                  onClick={onDelete}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-11">
        <TemplateRenderer
          blocks={[block]}
          onChange={(blocks) => onChange(blocks[0])}
          mode="edit"
        />
      </div>
    </section>
  );
}

interface TemplateEditorContentProps {
  blocks: TemplateBlock[];
  viewMode: 'edit' | 'preview';
  deviceMode: 'desktop' | 'mobile';
  expandedSections: Set<number>;
  savedBlockIds: Set<string>;
  onBlocksChange: (blocks: TemplateBlock[]) => void;
  onBlockChange: (index: number, block: TemplateBlock) => void;
  onBlockDelete: (index: number) => void;
  onToggleSection: (index: number) => void;
}

export function TemplateEditorContent({
  blocks,
  viewMode,
  deviceMode,
  expandedSections,
  savedBlockIds,
  onBlocksChange,
  onBlockChange,
  onBlockDelete,
  onToggleSection,
}: TemplateEditorContentProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex(b => b.id === active.id);
    const newIndex = blocks.findIndex(b => b.id === over.id);

    if (oldIndex === 0 || newIndex === 0) return; // Can't move hero

    const newBlocks = arrayMove(blocks, oldIndex, newIndex);
    onBlocksChange(newBlocks);
  };

  return (
    <main className={`mx-auto ${
      viewMode === 'preview'
        ? deviceMode === 'mobile'
          ? 'max-w-md'
          : 'max-w-5xl'
        : 'max-w-3xl'
    } px-6 py-12`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => (
            <SortableSection
              key={block.id}
              block={block}
              index={index}
              isExpanded={expandedSections.has(index)}
              isSaved={savedBlockIds.has(block.id)}
              viewMode={viewMode}
              onToggle={() => onToggleSection(index)}
              onChange={(updatedBlock) => onBlockChange(index, updatedBlock)}
              onDelete={() => onBlockDelete(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Section Button */}
      {viewMode === 'edit' && (
        <div className="mt-12">
          <button
            onClick={() => setShowSlashMenu(!showSlashMenu)}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Section</span>
          </button>

          {showSlashMenu && (
            <SlashCommandMenu
              isOpen={showSlashMenu}
              onSelect={(blockType) => {
                const newBlock = createEmptyBlock(blockType);
                onBlocksChange([...blocks, newBlock]);
                setShowSlashMenu(false);
              }}
              onClose={() => setShowSlashMenu(false)}
              position={{ top: 0, left: 0 }}
            />
          )}
        </div>
      )}
    </main>
  );
}

