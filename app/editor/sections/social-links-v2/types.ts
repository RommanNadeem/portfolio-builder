/**
 * Social Links Types (V2 - Using Core Types)
 */

import { BaseItem } from '@/app/editor/core/types';

export interface SocialLinkItem extends BaseItem {
  platform: string;
  url: string;
  icon: string;
  username?: string;
}

/**
 * Legacy type for backwards compatibility
 */
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

/**
 * Available platforms with their icons (using lucide-react icons)
 */
export const AVAILABLE_PLATFORMS = [
  { platform: 'LinkedIn', icon: 'linkedin' },      // Linkedin icon
  { platform: 'GitHub', icon: 'github' },          // Github icon
  { platform: 'Twitter', icon: 'twitter' },        // Twitter icon
  { platform: 'Instagram', icon: 'instagram' },    // Instagram icon
  { platform: 'YouTube', icon: 'youtube' },        // Youtube icon
  { platform: 'Dribbble', icon: 'dribbble' },      // Dribbble icon
  { platform: 'Behance', icon: 'behance' },        // Palette icon
  { platform: 'Medium', icon: 'medium' },          // Edit3 icon (pen)
  { platform: 'Website', icon: 'globe' },          // Globe icon
  { platform: 'Email', icon: 'mail' },             // Mail icon
  { platform: 'Phone', icon: 'phone' },            // Phone icon
  { platform: 'Schedule a Call', icon: 'calendar' }, // Calendar icon
] as const;

/**
 * Convert legacy link to new format
 */
export function convertFromLegacy(legacy: SocialLink): SocialLinkItem {
  const now = new Date().toISOString();
  
  return {
    id: legacy.id,
    platform: legacy.platform,
    url: legacy.url,
    icon: legacy.icon,
    username: undefined,
    created_at: now,
    updated_at: now,
    order_index: 0,
  };
}

/**
 * Convert new format to legacy
 */
export function convertToLegacy(item: SocialLinkItem): SocialLink {
  return {
    id: item.id,
    platform: item.platform,
    url: item.url,
    icon: item.icon,
  };
}

