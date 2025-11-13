/**
 * useAutoSave Hook
 * 
 * Debounced auto-save functionality for portfolio sections
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { SaveStatus } from '../types';
import { saveToLocalStorage } from '../utils/storage';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
  localStorageKey?: string;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2500,
  enabled = true,
  localStorageKey,
}: UseAutoSaveOptions<T>) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<T>(data);
  const previousDataStringRef = useRef<string>('');
  const isInitialMount = useRef(true);

  // Update data ref
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Debounced save function
  const debouncedSave = useCallback(async () => {
    if (!enabled) return;

    // Clear any pending saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('saving');

    try {
      // Save to localStorage first (fast, synchronous)
      if (localStorageKey) {
        saveToLocalStorage(localStorageKey, dataRef.current);
      }

      // Then save to database (async)
      await onSave(dataRef.current);

      setSaveStatus('saved');
      setLastSaved(new Date());

      // Reset to idle after a delay
      setTimeout(() => {
        setSaveStatus((current) => (current === 'saved' ? 'idle' : current));
      }, 2000);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAutoSave] Save failed:', error);
      }
      setSaveStatus('error');

      // Reset error status after a delay
      setTimeout(() => {
        setSaveStatus((current) => (current === 'error' ? 'idle' : current));
      }, 3000);
    }
  }, [enabled, localStorageKey, onSave]);

  // Trigger save on data changes
  useEffect(() => {
    if (!enabled) return;

    // Convert data to string for comparison
    const currentDataString = JSON.stringify(data);

    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousDataStringRef.current = currentDataString;
      return;
    }

    // Check if data actually changed (prevent infinite loops)
    if (currentDataString === previousDataStringRef.current) {
      return;
    }

    previousDataStringRef.current = currentDataString;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set saving status immediately
    setSaveStatus('saving');

    // Schedule save
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, delay, enabled, debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Manual save function
  const save = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await debouncedSave();
  }, [debouncedSave]);

  return {
    saveStatus,
    lastSaved,
    save, // Manual save function
  };
}

