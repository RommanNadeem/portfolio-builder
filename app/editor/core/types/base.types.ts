/**
 * Base Types for Unified Portfolio Architecture
 * 
 * These types form the foundation for all portfolio sections.
 * Every section and item extends these base types for consistency.
 */

// ============================================
// BASE ITEM TYPES
// ============================================

/**
 * Base interface that all items in sections must extend
 */
export interface BaseItem {
  id: string;
  created_at: string;
  updated_at: string;
  order_index: number;
}

/**
 * Items that can have rich detail pages with templates
 */
export interface DetailableItem extends BaseItem {
  // Card-level data (shown in lists/grids)
  title: string;
  description: string;
  thumbnail?: string | null;
  
  // Detail page configuration
  has_detail_page: boolean;
  template_type?: string;
  blocks?: any[]; // TemplateBlock[] from templates/types.ts
  
  // Publishing
  published: boolean;
  published_at?: string | null;
}

// ============================================
// SECTION TYPES
// ============================================

/**
 * All available section types in the portfolio
 */
export type SectionType =
  | 'personal'
  | 'projects'
  | 'career'
  | 'testimonials'
  | 'strengths'
  | 'companies'
  | 'social-links'
  | 'navigation'
  | 'footer';

/**
 * Base section configuration
 */
export interface BaseSection<T extends BaseItem> {
  type: SectionType;
  title: string;
  description?: string;
  items: T[];
  settings?: SectionSettings;
}

/**
 * Section display and behavior settings
 */
export interface SectionSettings {
  visible: boolean;
  collapsed: boolean;
  max_items?: number;
  allow_reorder?: boolean;
  allow_delete?: boolean;
}

// ============================================
// CRUD OPERATION TYPES
// ============================================

/**
 * Standard CRUD operations for section items
 */
export interface CRUDOperations<T extends BaseItem> {
  add: (item: Omit<T, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => void;
  update: (id: string, updates: Partial<T>) => void;
  remove: (id: string) => void;
  reorder: (id: string, direction: 'up' | 'down') => void;
  reorderByIndex: (fromIndex: number, toIndex: number) => void;
}

/**
 * Save status for auto-save functionality
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

// ============================================
// PORTFOLIO ROOT TYPE
// ============================================

/**
 * Portfolio settings and configuration
 */
export interface PortfolioSettings {
  theme: 'light' | 'dark' | 'auto';
  primary_color: string;
  section_order: SectionType[];
  section_visibility: Record<SectionType, boolean>;
}

/**
 * Root portfolio data structure
 */
export interface Portfolio {
  id: string;
  user_id: string;
  
  // Settings
  settings: PortfolioSettings;
  
  // Metadata
  created_at: string;
  updated_at: string;
  published: boolean;
  published_url?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Makes all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract the item type from a section
 */
export type ItemType<T> = T extends BaseSection<infer U> ? U : never;

