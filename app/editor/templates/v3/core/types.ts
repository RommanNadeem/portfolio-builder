/**
 * V3 Template System - Core Types
 * 
 * Defines the unified data structure that bridges V2 portfolio entities
 * with V3 template blocks.
 */

import { ProjectItem, CareerItem } from '@/app/editor/core/types';

// Re-export template types for convenience
export type { TemplateType, TemplateBlock } from '../../../templates/types';

/**
 * Unified Document Structure
 * Bridges V2 entities with V3 template system
 */
export interface EntityDocument {
  // Identity
  id: string;
  entity_type: 'project' | 'career';
  
  // V2 Entity Data (source of truth for cards)
  entity_data: ProjectItem | CareerItem;
  
  // V3 Template Data (rich content)
  template: {
    template_type: string | null;
    blocks: any[]; // TemplateBlock[]
    last_synced: string;
  };
  
  // Metadata
  metadata: {
    created_at: string;
    updated_at: string;
    last_edited_by?: string;
    version: number;
  };
  
  // Sync state
  sync_state: {
    is_synced: boolean;
    pending_changes: ('entity' | 'template')[];
    last_sync_error?: string;
  };
}

/**
 * Data sync result
 */
export interface SyncResult {
  success: boolean;
  error?: string;
  updated_entity?: any;
  timestamp: string;
}

/**
 * Load result
 */
export interface LoadResult {
  success: boolean;
  document?: EntityDocument;
  error?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

