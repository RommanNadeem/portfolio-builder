import { useEffect, useRef, useState } from 'react';
import { PortfolioData } from './usePortfolioData';

export function useAutoSave(
  portfolio: PortfolioData | null,
  saveFunction: (data: PortfolioData) => Promise<any>,
  debounceMs: number = 500
) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!portfolio) return;

    const currentData = JSON.stringify(portfolio);
    
    // On initial mount, just store the data without saving
    if (isInitialMount.current) {
      previousDataRef.current = currentData;
      isInitialMount.current = false;
      console.log('[useAutoSave] 📌 Initial data loaded, not saving');
      return;
    }
    
    // Skip if data hasn't changed
    if (currentData === previousDataRef.current) {
      console.log('[useAutoSave] ⏭️ No changes detected, skipping save');
      return;
    }

    console.log('[useAutoSave] 🔄 Data changed, saving...');
    
    // Mark as dirty
    setIsDirty(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Save quickly after short delay (to batch rapid changes)
    timeoutRef.current = setTimeout(async () => {
      console.log('[useAutoSave] 💾 Saving changes to database...');
      setIsSaving(true);
      try {
        const result = await saveFunction(portfolio);
        if (result?.error) {
          console.error('[useAutoSave] ❌ Save failed:', result.error);
        } else {
          console.log('[useAutoSave] ✅ Saved successfully');
        }
        setIsDirty(false);
        setLastSaved(new Date());
        previousDataRef.current = currentData;
      } catch (error) {
        console.error('[useAutoSave] ❌ Save error:', error);
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

