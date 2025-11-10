/**
 * Strengths Types (V2 - Using Core Types)
 */

import { BaseItem } from '@/app/editor/core/types';

export interface StrengthItem extends BaseItem {
  title: string;
  description: string;
  icon?: string;
  category?: 'skill' | 'tool' | 'soft-skill';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

/**
 * Legacy type for backwards compatibility
 */
export interface Strength {
  id: string;
  title: string;
  description: string;
  icon: string;
  isPageBlock?: boolean;
  pageContent?: string;
  sections?: any[];
}

/**
 * Convert legacy strength to new format
 */
export function convertFromLegacy(legacy: Strength): StrengthItem {
  const now = new Date().toISOString();
  
  return {
    id: legacy.id,
    title: legacy.title,
    description: legacy.description,
    icon: legacy.icon || '⭐',
    category: undefined,
    proficiency: undefined,
    created_at: now,
    updated_at: now,
    order_index: 0,
  };
}

/**
 * Convert new format to legacy
 */
export function convertToLegacy(item: StrengthItem): Strength {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    icon: item.icon || '⭐',
  };
}

