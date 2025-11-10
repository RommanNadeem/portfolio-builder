/**
 * V3 Template System - Main Exports
 * 
 * Entry point for the V3 template system.
 */

// Core
export { EntityDocumentManager, entityDocumentManager } from './core/EntityDocumentManager';
export type { EntityDocument, SyncResult, LoadResult, ValidationResult } from './core/types';

// Adapters
export { 
  ProjectTemplateInitializer,
  CareerTemplateInitializer,
  TemplateInitializerFactory,
  templateInitializerFactory,
} from './adapters/EntityToTemplateAdapter';
export type { TemplateInitializer } from './adapters/EntityToTemplateAdapter';

// Hooks
export { useEntityDocument } from './hooks/useEntityDocument';
export type { UseEntityDocumentOptions, UseEntityDocumentReturn } from './hooks/useEntityDocument';

