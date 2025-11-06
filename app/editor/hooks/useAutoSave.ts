import { useEffect, useRef, useState } from 'react';
import { PortfolioData } from './usePortfolioData';

export function useAutoSave(
  portfolio: PortfolioData | null,
  saveFunction: (data: PortfolioData) => Promise<any>,
  debounceMs: number = 2000
) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');

  useEffect(() => {
    if (!portfolio) return;

    const currentData = JSON.stringify(portfolio);
    
    // Skip if data hasn't changed
    if (currentData === previousDataRef.current) return;

    // Mark as dirty
    setIsDirty(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new debounced save
    timeoutRef.current = setTimeout(async () => {
      console.log('[useAutoSave] ⏰ Auto-save triggered after', debounceMs, 'ms');
      setIsSaving(true);
      try {
        const result = await saveFunction(portfolio);
        if (result?.error) {
          console.error('[useAutoSave] ❌ Auto-save failed:', result.error);
        } else {
          console.log('[useAutoSave] ✅ Auto-save successful');
        }
        setIsDirty(false);
        setLastSaved(new Date());
        previousDataRef.current = currentData;
      } catch (error) {
        console.error('[useAutoSave] ❌ Auto-save error:', error);
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [portfolio, saveFunction, debounceMs]);

  const forceSave = async () => {
    if (!portfolio) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);
    try {
      await saveFunction(portfolio);
      setIsDirty(false);
      setLastSaved(new Date());
      previousDataRef.current = JSON.stringify(portfolio);
    } catch (error) {
      console.error('Force save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isDirty,
    isSaving,
    lastSaved,
    forceSave,
  };
}

