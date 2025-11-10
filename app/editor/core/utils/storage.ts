/**
 * Storage Utilities
 * 
 * Helpers for localStorage operations with error handling
 */

/**
 * Save data to localStorage
 */
export function saveToLocalStorage<T>(key: string, data: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to save to localStorage:`, error);
    return false;
  }
}

/**
 * Load data from localStorage
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`[Storage] Failed to load from localStorage:`, error);
    return null;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromLocalStorage(key: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to remove from localStorage:`, error);
    return false;
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to clear localStorage:`, error);
    return false;
  }
}

