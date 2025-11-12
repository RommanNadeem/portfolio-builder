/**
 * Services Types (V2 - Using Core Types)
 */

import { BaseItem } from '@/app/editor/core/types';

export interface ServiceItem extends BaseItem {
  title: string;
  description: string;
  icon?: string;
  price?: string;
  duration?: string;
  features?: string[];
  cta_text?: string;
  cta_url?: string;
  is_featured?: boolean;
}

/**
 * Legacy type for backwards compatibility
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  duration?: string;
  features?: string[];
  cta_text?: string;
  cta_url?: string;
  is_featured?: boolean;
}

/**
 * Convert legacy service to new format
 */
export function convertFromLegacy(legacy: Service): ServiceItem {
  const now = new Date().toISOString();
  
  return {
    id: legacy.id,
    title: legacy.title,
    description: legacy.description,
    icon: legacy.icon || '',
    price: legacy.price,
    duration: legacy.duration,
    features: legacy.features || [],
    cta_text: legacy.cta_text,
    cta_url: legacy.cta_url,
    is_featured: legacy.is_featured,
    created_at: now,
    updated_at: now,
    order_index: 0,
  };
}

/**
 * Convert new format to legacy
 */
export function convertToLegacy(item: ServiceItem): Service {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    icon: item.icon || '',
    price: item.price,
    duration: item.duration,
    features: item.features || [],
    cta_text: item.cta_text,
    cta_url: item.cta_url,
    is_featured: item.is_featured,
  };
}

