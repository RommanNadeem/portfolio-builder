import { useState, useCallback } from 'react';

/**
 * Generic hook for section CRUD operations
 * Implements state colocation pattern - each section manages its own state
 */
export function useSection<T extends { id: string }>(
  items: T[],
  onUpdate: (items: T[]) => void
) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCallback((item: Omit<T, 'id'>) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(), // Use UUID instead of timestamp
    } as T;
    onUpdate([...items, newItem]);
    setIsAdding(false);
  }, [items, onUpdate]);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate(updated);
  }, [items, onUpdate]);

  const deleteItem = useCallback((id: string) => {
    onUpdate(items.filter(item => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }, [items, onUpdate, editingId]);

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onUpdate(updated);
  }, [items, onUpdate]);

  return {
    items,
    editingId,
    setEditingId,
    isAdding,
    setIsAdding,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
  };
}

