/**
 * V3 Template System - useEntityDocument Hook
 * 
 * React hook for managing entity documents in template editors.
 * Handles loading, saving, and syncing between V2 and V3 data structures.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { EntityDocument, LoadResult, SyncResult } from '../core/types';
import { entityDocumentManager } from '../core/EntityDocumentManager';
import { templateInitializerFactory } from '../adapters/EntityToTemplateAdapter';

export interface UseEntityDocumentOptions {
  entityId: string;
  entityType: 'project' | 'career';
  autoSave?: boolean;
  autoSaveDelay?: number;
  onSaveSuccess?: (result: SyncResult) => void;
  onSaveError?: (error: string) => void;
  onLoadError?: (error: string) => void;
}

export interface UseEntityDocumentReturn {
  // State
  document: EntityDocument | null;
  loading: boolean;
  error: string | null;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSaved: string | null;
  
  // Actions
  updateBlocks: (blocks: any[]) => void;
  setTemplateType: (templateType: string) => void;
  initializeTemplate: (templateType: string) => void;
  save: () => Promise<SyncResult>;
  reload: () => Promise<void>;
  
  // Getters
  getBlocks: () => any[];
  getTemplateType: () => string | null;
  getEntityData: () => any;
}

/**
 * Hook for managing entity documents
 */
export function useEntityDocument(options: UseEntityDocumentOptions): UseEntityDocumentReturn {
  const {
    entityId,
    entityType,
    autoSave = true,
    autoSaveDelay = 2500,
    onSaveSuccess,
    onSaveError,
    onLoadError,
  } = options;
  
  const [document, setDocument] = useState<EntityDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const documentRef = useRef<EntityDocument | null>(null);
  
  // Keep ref in sync
  useEffect(() => {
    documentRef.current = document;
  }, [document]);
  
  /**
   * Load document
   */
  const loadDocument = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[useEntityDocument] Loading document:', { entityId, entityType });
      
      const result: LoadResult = await entityDocumentManager.loadFromPortfolio(
        entityId,
        entityType
      );
      
      if (!result.success || !result.document) {
        const errorMsg = result.error || 'Failed to load document';
        setError(errorMsg);
        onLoadError?.(errorMsg);
        return;
      }
      
      console.log('[useEntityDocument] Document loaded:', {
        id: result.document.id,
        blocks_count: result.document.template.blocks.length,
        template_type: result.document.template.template_type,
      });
      
      setDocument(result.document);
      setSaveStatus('saved');
      setLastSaved(result.document.template.last_synced);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load document';
      console.error('[useEntityDocument] Load error:', err);
      setError(errorMsg);
      onLoadError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, onLoadError]);
  
  /**
   * Save document
   */
  const save = useCallback(async (): Promise<SyncResult> => {
    const currentDoc = documentRef.current;
    
    if (!currentDoc) {
      const result: SyncResult = {
        success: false,
        error: 'No document to save',
        timestamp: new Date().toISOString(),
      };
      setSaveStatus('error');
      onSaveError?.(result.error!);
      return result;
    }
    
    setSaveStatus('saving');
    
    try {
      console.log('[useEntityDocument] Saving document:', currentDoc.id);
      
      const result = await entityDocumentManager.saveToPortfolio(currentDoc);
      
      if (result.success) {
        console.log('[useEntityDocument] ✅ Save successful');
        setSaveStatus('saved');
        setLastSaved(result.timestamp);
        setError(null);
        onSaveSuccess?.(result);
      } else {
        console.error('[useEntityDocument] ❌ Save failed:', result.error);
        setSaveStatus('error');
        setError(result.error || 'Save failed');
        onSaveError?.(result.error || 'Save failed');
      }
      
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Save failed';
      console.error('[useEntityDocument] Save error:', err);
      setSaveStatus('error');
      setError(errorMsg);
      onSaveError?.(errorMsg);
      
      return {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      };
    }
  }, [onSaveSuccess, onSaveError]);
  
  /**
   * Update blocks
   */
  const updateBlocks = useCallback((blocks: any[]) => {
    setDocument(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        template: {
          ...prev.template,
          blocks,
        },
        metadata: {
          ...prev.metadata,
          updated_at: new Date().toISOString(),
        },
        sync_state: {
          ...prev.sync_state,
          is_synced: false,
          pending_changes: ['template'],
        },
      };
    });
    
    setSaveStatus('unsaved');
    
    // Auto-save if enabled
    if (autoSave) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        save();
      }, autoSaveDelay);
    }
  }, [autoSave, autoSaveDelay, save]);
  
  /**
   * Set template type
   */
  const setTemplateType = useCallback((templateType: string) => {
    setDocument(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        template: {
          ...prev.template,
          template_type: templateType,
        },
      };
    });
    
    setSaveStatus('unsaved');
  }, []);
  
  /**
   * Initialize template with entity data
   */
  const initializeTemplate = useCallback((templateType: string) => {
    if (!document) return;
    
    console.log('[useEntityDocument] Initializing template:', templateType);
    
    try {
      const blocks = templateInitializerFactory.initializeTemplate(
        entityType,
        document.entity_data,
        templateType
      );
      
      console.log('[useEntityDocument] Template initialized with', blocks.length, 'blocks');
      
      setDocument(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          template: {
            ...prev.template,
            template_type: templateType,
            blocks,
          },
        };
      });
      
      setSaveStatus('unsaved');
    } catch (err: any) {
      console.error('[useEntityDocument] Template initialization failed:', err);
      setError(err.message || 'Failed to initialize template');
    }
  }, [document, entityType]);
  
  /**
   * Reload document from portfolio
   */
  const reload = useCallback(async () => {
    await loadDocument();
  }, [loadDocument]);
  
  /**
   * Getters
   */
  const getBlocks = useCallback(() => {
    return document?.template.blocks || [];
  }, [document]);
  
  const getTemplateType = useCallback(() => {
    return document?.template.template_type || null;
  }, [document]);
  
  const getEntityData = useCallback(() => {
    return document?.entity_data || null;
  }, [document]);
  
  // Load on mount and when entityId changes
  useEffect(() => {
    if (entityId) {
      loadDocument();
    }
  }, [entityId, loadDocument]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    // State
    document,
    loading,
    error,
    saveStatus,
    lastSaved,
    
    // Actions
    updateBlocks,
    setTemplateType,
    initializeTemplate,
    save,
    reload,
    
    // Getters
    getBlocks,
    getTemplateType,
    getEntityData,
  };
}

