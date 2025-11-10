/**
 * Companies Types (V2 - Using Core Types)
 */

import { BaseItem } from '@/app/editor/core/types';

export interface CompanyItem extends BaseItem {
  name: string;
}

/**
 * Convert string array to CompanyItem array
 */
export function convertFromStringArray(companies: string[]): CompanyItem[] {
  const now = new Date().toISOString();
  
  return companies.map((name, index) => ({
    id: `company-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    created_at: now,
    updated_at: now,
    order_index: index,
  }));
}

/**
 * Convert CompanyItem array back to string array
 */
export function convertToStringArray(items: CompanyItem[]): string[] {
  return items.map(item => item.name);
}

