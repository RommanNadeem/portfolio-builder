/**
 * useSectionManager Hook
 * 
 * Universal hook for managing any portfolio section with CRUD operations,
 * auto-save, validation, and state management.
 */

import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BaseItem, CRUDOperations, SaveStatus, ValidationResult } from '../types';
import { useAutoSave } from './useAutoSave';

interface UseSectionManagerOptions<T extends BaseItem> {
  initialData: T[];
  onSave?: (items: T[]) => Promise<void>;
  validation?: (item: T) => ValidationResult;
  autoSave?: boolean;
  autoSaveDelay?: number;
  localStorageKey?: string;
  maxItems?: number;
}

export function useSectionManager<T extends BaseItem>({
  initialData,
  onSave,
  validation,
  autoSave = true,
  autoSaveDelay = 2500,
  localStorageKey,
  maxItems,
}: UseSectionManagerOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Auto-save functionality
  const { saveStatus, lastSaved, save: manualSave } = useAutoSave({
    data: items,
    onSave: async (data) => {
      if (onSave) {
        await onSave(data);
      }
    },
    delay: autoSaveDelay,
    enabled: autoSave && !!onSave,
    localStorageKey,
  });

  // Validate item
  const validateItem = useCallback((item: T): ValidationResult => {
    if (validation) {
      return validation(item);
    }
    return { valid: true };
  }, [validation]);

  // Add item
  const add = useCallback((newItem: Omit<T, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => {
    // Check max items limit
    if (maxItems && items.length >= maxItems) {
      console.warn(`[useSectionManager] Cannot add item: max limit of ${maxItems} reached`);
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

    // Validate
    const validationResult = validateItem(item);
    if (!validationResult.valid) {
      setErrors(prev => ({
        ...prev,
        [item.id]: validationResult.errors || []
      }));
      console.error('[useSectionManager] Validation failed:', validationResult.errors);
      return;
    }

    setItems(prev => [...prev, item]);
    console.log('[useSectionManager] ✅ Item added:', item.id);
  }, [items.length, maxItems, validateItem]);

  // Update item
  const update = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            ...updates,
            updated_at: new Date().toISOString(),
          };

          // Validate
          const validationResult = validateItem(updatedItem);
          if (!validationResult.valid) {
            setErrors(prevErrors => ({
              ...prevErrors,
              [id]: validationResult.errors || []
            }));
            console.error('[useSectionManager] Validation failed:', validationResult.errors);
            return item; // Return original if validation fails
          }

          // Clear errors if validation passes
          setErrors(prevErrors => {
            const { [id]: _, ...rest } = prevErrors;
            return rest;
          });

          return updatedItem;
        }
        return item;
      });

      console.log('[useSectionManager] ✅ Item updated:', id);
      return updated;
    });
  }, [validateItem]);

  // Remove item
  const remove = useCallback((id: string) => {
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      
      // Reorder remaining items
      const reordered = filtered.map((item, index) => ({
        ...item,
        order_index: index,
      }));
      
      console.log('[useSectionManager] ✅ Item removed:', id);
      return reordered;
    });

    // Clear errors for removed item
    setErrors(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Reorder by direction
  const reorder = useCallback((id: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const reordered = [...prev];
      [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];

      // Update order_index for both items
      reordered[index] = { ...reordered[index], order_index: index };
      reordered[newIndex] = { ...reordered[newIndex], order_index: newIndex };

      console.log('[useSectionManager] ✅ Items reordered:', { from: index, to: newIndex });
      return reordered;
    });
  }, []);

  // Reorder by index (for drag-and-drop)
  const reorderByIndex = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= items.length) return;
    if (toIndex < 0 || toIndex >= items.length) return;

    setItems(prev => {
      const reordered = [...prev];
      const [movedItem] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, movedItem);

      // Update all order_index values
      const withUpdatedOrder = reordered.map((item, index) => ({
        ...item,
        order_index: index,
      }));

      console.log('[useSectionManager] ✅ Items reordered by index:', { from: fromIndex, to: toIndex });
      return withUpdatedOrder;
    });
  }, [items.length]);

  // Bulk operations
  const bulkUpdate = useCallback((updates: Array<{ id: string; updates: Partial<T> }>) => {
    setItems(prev => {
      const updatedItems = prev.map(item => {
        const update = updates.find(u => u.id === item.id);
        if (update) {
          return {
            ...item,
            ...update.updates,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      });

      console.log('[useSectionManager] ✅ Bulk update:', updates.length, 'items');
      return updatedItems;
    });
  }, []);

  const bulkDelete = useCallback((ids: string[]) => {
    setItems(prev => {
      const filtered = prev.filter(item => !ids.includes(item.id));
      const reordered = filtered.map((item, index) => ({
        ...item,
        order_index: index,
      }));

      console.log('[useSectionManager] ✅ Bulk delete:', ids.length, 'items');
      return reordered;
    });

    // Clear errors for deleted items
    setErrors(prev => {
      const newErrors = { ...prev };
      ids.forEach(id => delete newErrors[id]);
      return newErrors;
    });
  }, []);

  // Replace all items (useful for loading from server)
  const setItemsFromServer = useCallback((newItems: T[]) => {
    const withOrder = newItems.map((item, index) => ({
      ...item,
      order_index: item.order_index ?? index,
    }));
    setItems(withOrder);
    setErrors({});
    console.log('[useSectionManager] ✅ Items loaded from server:', withOrder.length);
  }, []);

  // Computed values
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);
  const itemCount = items.length;
  const canAddMore = !maxItems || itemCount < maxItems;

  return {
    // State
    items,
    errors,
    hasErrors,
    itemCount,
    canAddMore,
    saveStatus,
    lastSaved,

    // CRUD Operations
    add,
    update,
    remove,
    reorder,
    reorderByIndex,

    // Bulk Operations
    bulkUpdate,
    bulkDelete,

    // Utilities
    setItems: setItemsFromServer,
    save: manualSave,
    validateItem,
  };
}

