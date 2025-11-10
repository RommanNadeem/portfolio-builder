/**
 * Testimonials Types (V2 - Using Core Types)
 */

import { BaseItem } from '@/app/editor/core/types';

export interface TestimonialItem extends BaseItem {
  name: string;
  role: string;      // Changed from 'title' to match core types
  company: string;   // NEW - separated from role
  content: string;   // Changed from 'testimonial' to match core types
  avatar?: string | null;
  linkedinUrl?: string;
  relationship: string; // NEW - "Manager", "Colleague", "Client"
}

/**
 * Legacy type mapping for backwards compatibility
 */
export interface Testimonial {
  id: string;
  name: string;
  title: string;  // role + company combined
  testimonial: string; // maps to content
  linkedinUrl: string;
}

/**
 * Convert legacy testimonial to new format
 */
export function convertFromLegacy(legacy: Testimonial): TestimonialItem {
  const now = new Date().toISOString();
  
  // Try to split title into role and company
  const titleParts = legacy.title.split('@');
  const role = titleParts[0]?.trim() || legacy.title;
  const company = titleParts[1]?.trim() || '';
  
  return {
    id: legacy.id,
    name: legacy.name,
    role,
    company,
    content: legacy.testimonial,
    avatar: null,
    linkedinUrl: legacy.linkedinUrl,
    relationship: '', // Default empty, user can fill
    created_at: now,
    updated_at: now,
    order_index: 0,
  };
}

/**
 * Convert new format to legacy for backwards compatibility
 */
export function convertToLegacy(item: TestimonialItem): Testimonial {
  return {
    id: item.id,
    name: item.name,
    title: item.company ? `${item.role} @ ${item.company}` : item.role,
    testimonial: item.content,
    linkedinUrl: item.linkedinUrl || '',
  };
}

