/**
 * FAQs Types (V2 - Using Core Types)
 */

import { BaseItem } from '@/app/editor/core/types';

export interface FAQItem extends BaseItem {
  question: string;
  answer: string;
  category?: string;
}

/**
 * Legacy type for backwards compatibility
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

/**
 * Convert legacy FAQ to new format
 */
export function convertFromLegacy(legacy: FAQ): FAQItem {
  const now = new Date().toISOString();
  
  return {
    id: legacy.id,
    question: legacy.question,
    answer: legacy.answer,
    category: legacy.category,
    created_at: now,
    updated_at: now,
    order_index: 0,
  };
}

/**
 * Convert new format to legacy
 */
export function convertToLegacy(item: FAQItem): FAQ {
  return {
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
  };
}

