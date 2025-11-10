/**
 * ItemList Component
 * 
 * Drag-and-drop list for section items with reordering.
 */

'use client';

import { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BaseItem } from '../../types';

interface ItemListProps<T extends BaseItem> {
  items: T[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T) => string;
  className?: string;
  enableDragDrop?: boolean;
}

export function ItemList<T extends BaseItem>({
  items,
  onReorder,
  renderItem,
  keyExtractor = (item) => item.id,
  className = '',
  enableDragDrop = true,
}: ItemListProps<T>) {
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => keyExtractor(item) === active.id);
      const newIndex = items.findIndex((item) => keyExtractor(item) === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  if (!enableDragDrop || !onReorder) {
    // Simple list without drag-and-drop
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((item, index) => (
          <div key={keyExtractor(item)}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  // List with drag-and-drop
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(keyExtractor)}
        strategy={verticalListSortingStrategy}
      >
        <div className={`space-y-3 ${className}`}>
          {items.map((item, index) => (
            <div key={keyExtractor(item)}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

