/**
 * Projects Types (V2 - Using Core Types)
 */

import { DetailableItem } from '@/app/editor/core/types';

export interface ProjectItem extends DetailableItem {
  // Card data (inherited from DetailableItem)
  // title, description, thumbnail, has_detail_page, template_type, blocks, published, published_at
  
  // Project-specific fields
  tags: string[];
  link?: string;
  role?: string;
  
  // Project metadata
  year?: string;
  team_size?: string;
  duration?: string;
  company?: string;
  
  // Legacy fields
  pageContent?: string;
  sections?: any[];
}

/**
 * Legacy type for backwards compatibility
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  tags: string[];
  pageContent: string;
  link?: string;
  sections?: any[];
  blocks?: any[];
}

/**
 * Convert legacy project to new format
 */
export function convertFromLegacy(legacy: Project): ProjectItem {
  const now = new Date().toISOString();
  
  return {
    id: legacy.id,
    title: legacy.title,
    description: legacy.description,
    thumbnail: legacy.thumbnail,
    tags: Array.isArray(legacy.tags) ? legacy.tags : [],
    link: legacy.link,
    has_detail_page: !!legacy.blocks || !!legacy.pageContent,
    template_type: undefined,
    blocks: legacy.blocks || [],
    published: false,
    published_at: null,
    pageContent: legacy.pageContent,
    sections: legacy.sections,
    created_at: now,
    updated_at: now,
    order_index: 0,
  };
}

/**
 * Convert new format to legacy
 */
export function convertToLegacy(item: ProjectItem): Project {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    thumbnail: item.thumbnail || null,
    tags: item.tags,
    pageContent: item.pageContent || '',
    link: item.link,
    sections: item.sections,
    blocks: item.blocks,
  };
}

