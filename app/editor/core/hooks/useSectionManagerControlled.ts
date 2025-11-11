/**
 * useSectionManagerControlled Hook
 * 
 * Fully controlled hook for managing portfolio sections.
 * No internal state - parent component is the single source of truth.
 * This eliminates sync issues and provides real-time updates.
 */

import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BaseItem, ValidationResult } from '../types';

interface UseSectionManagerControlledOptions<T extends BaseItem> {
  items: T[]; // Controlled - comes from parent
  onChange: (items: T[]) => void; // Direct update to parent
  validation?: (item: T) => ValidationResult;
  maxItems?: number;
}

export function useSectionManagerControlled<T extends BaseItem>({
  items,
  onChange,
  validation,
  maxItems,
}: UseSectionManagerControlledOptions<T>) {
  
  // Validate item
  const validateItem = useCallback((item: T): ValidationResult => {
    if (validation) {
      return validation(item);
    }
    return { valid: true };
  }, [validation]);

  // Add item - updates parent immediately
  const add = useCallback((newItem: Omit<T, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => {
    if (maxItems && items.length >= maxItems) {
      console.warn(`[useSectionManagerControlled] Cannot add: max ${maxItems} reached`);
      return;
    }

    const now = new Date().toISOString();
    const item = {
      ...newItem,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
      order_index: items.length,
    } as T;

    const validationResult = validateItem(item);
    if (!validationResult.valid) {
      console.error('[useSectionManagerControlled] Validation failed:', validationResult.errors);
      return;
    }

    // Update parent immediately
    const newItems = [...items, item];
    console.log('[useSectionManagerControlled] ✅ Adding item. New count:', newItems.length);
    onChange(newItems);
  }, [items, maxItems, validateItem, onChange]);

  // Update item - updates parent immediately
  const update = useCallback((id: string, updates: Partial<T>) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          ...updates,
          updated_at: new Date().toISOString(),
        };

        const validationResult = validateItem(updatedItem);
        if (!validationResult.valid) {
          console.error('[useSectionManagerControlled] Validation failed:', validationResult.errors);
          return item;
        }

        return updatedItem;
      }
      return item;
    });

    console.log('[useSectionManagerControlled] ✅ Updating item:', id);
    onChange(newItems);
  }, [items, validateItem, onChange]);

  // Remove item - updates parent immediately
  const remove = useCallback((id: string) => {
    console.log('[useSectionManagerControlled] 🗑️ Removing item:', id);
    
    const filtered = items.filter(item => item.id !== id);
    
    // Reorder remaining items
    const reordered = filtered.map((item, index) => ({
      ...item,
      order_index: index,
    }));
    
    console.log('[useSectionManagerControlled] ✅ Item removed. New count:', reordered.length);
    onChange(reordered);
  }, [items, onChange]);

  // Reorder by direction - updates parent immediately
  const reorder = useCallback((id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];

    // Update order_index
    const withUpdatedOrder = reordered.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    console.log('[useSectionManagerControlled] ✅ Reordered:', { from: index, to: newIndex });
    onChange(withUpdatedOrder);
  }, [items, onChange]);

  // Reorder by index (drag-and-drop) - updates parent immediately
  const reorderByIndex = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= items.length) return;
    if (toIndex < 0 || toIndex >= items.length) return;

    const reordered = [...items];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);

    // Update order_index
    const withUpdatedOrder = reordered.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    console.log('[useSectionManagerControlled] ✅ Reordered by index:', { from: fromIndex, to: toIndex });
    onChange(withUpdatedOrder);
  }, [items, onChange]);

  // Computed values
  const itemCount = items.length;
  const canAddMore = !maxItems || itemCount < maxItems;

  return {
    // State (controlled from parent)
    items,
    itemCount,
    canAddMore,

    // Operations (all update parent immediately)
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
  };
}

