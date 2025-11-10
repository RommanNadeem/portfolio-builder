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
 * Available platforms with their icons
 */
export const AVAILABLE_PLATFORMS = [
  { platform: 'LinkedIn', icon: 'linkedin' },
  { platform: 'GitHub', icon: 'github' },
  { platform: 'Twitter', icon: 'twitter' },
  { platform: 'Instagram', icon: 'instagram' },
  { platform: 'Website', icon: 'globe' },
  { platform: 'Behance', icon: 'behance' },
  { platform: 'Dribbble', icon: 'dribbble' },
  { platform: 'Medium', icon: 'medium' },
  { platform: 'YouTube', icon: 'youtube' },
  { platform: 'Schedule a Call', icon: 'calendar' },
  { platform: 'Email', icon: 'mail' },
  { platform: 'Phone', icon: 'phone' },
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

