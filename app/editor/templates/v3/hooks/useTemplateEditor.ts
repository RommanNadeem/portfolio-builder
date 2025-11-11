/**
 * useTemplateEditor - Production-Ready V3 Hook
 * 
 * Clean, type-safe hook for template editing using V3 architecture.
 * Replaces the broken useEntityDocument with a working implementation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { entityDocumentManager } from '../core/EntityDocumentManager';
import { templateInitializerFactory } from '../adapters/EntityToTemplateAdapter';
import type { EntityDocument, SyncResult } from '../core/types';
import type { TemplateBlock, TemplateType } from '../../types';

interface UseTemplateEditorOptions {
  entityId: string;
  entityType: 'project' | 'career';
  autoSave?: boolean;
  autoSaveDelay?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
}

interface UseTemplateEditorReturn {
  // State
  document: EntityDocument | null;
  blocks: TemplateBlock[];
  templateType: TemplateType | null;
  loading: boolean;
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: string | null;
  
  // Actions
  updateBlocks: (newBlocks: TemplateBlock[]) => void;
  setTemplateType: (template: TemplateType) => void;
  initializeTemplate: (template: TemplateType) => Promise<void>;
  save: () => Promise<void>;
}

export function useTemplateEditor(
  options: UseTemplateEditorOptions
): UseTemplateEditorReturn {
  const {
    entityId,
    entityType,
    autoSave = true,
    autoSaveDelay = 2500,
    onSaveSuccess,
    onSaveError,
  } = options;

  // State
  const [document, setDocument] = useState<EntityDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Refs
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitialLoad = useRef(true);

  // Load document on mount
  useEffect(() => {
    async function loadDocument() {
      try {
        setLoading(true);
        console.log('[useTemplateEditor] Loading document:', { entityId, entityType });

        const result = await entityDocumentManager.loadFromPortfolio(entityId, entityType);

        if (!result.success || !result.document) {
          throw new Error(result.error || 'Failed to load document');
        }

        setDocument(result.document);
        setError(null);
        console.log('[useTemplateEditor] ✅ Document loaded:', {
          id: result.document.id,
          blocks: result.document.template.blocks.length,
        });
      } catch (err: any) {
        console.error('[useTemplateEditor] ❌ Load failed:', err);
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }

    loadDocument();
  }, [entityId, entityType]);

  // Get current blocks
  const blocks = document?.template.blocks || [];
  const templateType = (document?.template.template_type as TemplateType) || null;

  // Save function (define first so other callbacks can use it)
  const save = useCallback(async () => {
    if (!document) return;

    try {
      setSaveStatus('saving');
      console.log('[useTemplateEditor] 💾 Saving document...');
      console.log('[useTemplateEditor] 📊 Document state:', {
        id: document.id,
        entityType: document.entity_type,
        template_type: document.template.template_type,
        blocks_count: document.template.blocks.length,
        entity_template_type: (document.entity_data as any).template_type,
      });

      const result: SyncResult = await entityDocumentManager.saveToPortfolio(document);

      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date().toLocaleTimeString());
        console.log('[useTemplateEditor] ✅ Saved successfully');
        console.log('[useTemplateEditor] 📦 Updated entity:', {
          template_type: result.updated_entity?.template_type,
          has_blocks: !!result.updated_entity?.blocks,
          blocks_count: result.updated_entity?.blocks?.length || 0,
        });
        onSaveSuccess?.();
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (err: any) {
      console.error('[useTemplateEditor] ❌ Save failed:', err);
      setSaveStatus('error');
      setError(err.message || 'Save failed');
      onSaveError?.(err.message || 'Save failed');
    }
  }, [document, entityType, onSaveSuccess, onSaveError]);

  // Update blocks
  const updateBlocks = useCallback((newBlocks: TemplateBlock[]) => {
    if (!document) return;

    console.log('[useTemplateEditor] 🔄 Updating blocks:', {
      oldCount: document.template.blocks.length,
      newCount: newBlocks.length,
      template_type: document.template.template_type,
    });

    setDocument(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        template: {
          ...prev.template,
          blocks: newBlocks,
        },
      };
    });

    // Trigger auto-save
    if (autoSave && !isInitialLoad.current) {
      console.log('[useTemplateEditor] ⏰ Scheduling auto-save in', autoSaveDelay, 'ms');
      setSaveStatus('saving');
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        console.log('[useTemplateEditor] 💾 Auto-save triggered for blocks update');
        await save();
      }, autoSaveDelay);
    } else if (!autoSave) {
      console.log('[useTemplateEditor] ⚠️ Auto-save is disabled');
    } else if (isInitialLoad.current) {
      console.log('[useTemplateEditor] ⏭️ Skipping save (initial load)');
    }
  }, [document, autoSave, autoSaveDelay, save]);

  // Set template type
  const setTemplateType = useCallback(async (template: TemplateType) => {
    if (!document) return;

    console.log('[useTemplateEditor] 🎨 Setting template type:', template);
    console.log('[useTemplateEditor] 📄 Document before:', {
      id: document.id,
      entityType: document.entity_type,
      currentTemplateType: document.template.template_type,
    });

    setDocument(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        template: {
          ...prev.template,
          template_type: template,
        },
      };
      console.log('[useTemplateEditor] ✅ Document updated with template_type:', updated.template.template_type);
      return updated;
    });

    // Save immediately to persist template_type
    setSaveStatus('saving');
    setTimeout(async () => {
      console.log('[useTemplateEditor] 💾 Saving template_type to database...');
      await save();
    }, 500);
  }, [document, save]);

  // Initialize template
  const initializeTemplate = useCallback(async (template: TemplateType) => {
    if (!document) return;

    console.log('[useTemplateEditor] Initializing template:', template);

    const initializer = templateInitializerFactory.getInitializer(entityType);
    const initializedBlocks = initializer.initializeBlocks(
      document.entity_data,
      template
    );

    console.log('[useTemplateEditor] Template initialized:', {
      template,
      blocksCreated: initializedBlocks.length,
    });

    // Create updated document
    const updatedDoc = {
      ...document,
      template: {
        ...document.template,
        template_type: template,
        blocks: initializedBlocks,
      },
    };

    // Update state
    setDocument(updatedDoc);

    // Save immediately to database
    setSaveStatus('saving');
    
    try {
      const result = await entityDocumentManager.saveToPortfolio(updatedDoc);
      
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date().toLocaleTimeString());
        console.log('[useTemplateEditor] ✅ Template initialization saved to database');
        onSaveSuccess?.();
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (err: any) {
      console.error('[useTemplateEditor] ❌ Template save failed:', err);
      setSaveStatus('error');
      onSaveError?.(err.message || 'Save failed');
    }
  }, [document, entityType, onSaveSuccess, onSaveError]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    document,
    blocks,
    templateType,
    loading,
    error,
    saveStatus,
    lastSaved,
    updateBlocks,
    setTemplateType,
    initializeTemplate,
    save,
  };
}

