'use client';

/**
 * Project Editor - V3 Implementation
 * 
 * Clean rewrite using V3 architecture.
 * Same UI/UX, 70% less code, better maintainability.
 * 
 * From: 962 lines
 * To: ~250 lines (74% reduction)
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TemplateSelector, TEMPLATE_CONFIGS } from '@/app/editor/templates';
import { TemplateEditorHeader, TemplateEditorContent } from '@/app/detail/components';
import { useTemplateEditor } from '@/app/editor/templates/v3';
import type { TemplateBlock, TemplateType } from '@/app/editor/templates/types';

// ============================================
// HELPERS
// ============================================

function hasBlockContent(block: TemplateBlock): boolean {
  if (block.type === 'hero') return true;
  
  const data = (block as any).data || (block as any).content;
  if (!data) return false;

  if (typeof data === 'string') return data.trim().length > 0;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') {
    return Object.values(data).some(val => {
      if (typeof val === 'string') return val.trim().length > 0;
      if (Array.isArray(val)) return val.length > 0;
      return false;
    });
  }
  return false;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProjectEditor() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  // V3 Hook - Handles all data management
  const {
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
  } = useTemplateEditor({
    entityId: projectId,
    entityType: 'project',
    autoSave: true,
    autoSaveDelay: 2500,
  });

  // UI State
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [savedBlockIds, setSavedBlockIds] = useState<Set<string>>(new Set());
  const [flowState, setFlowState] = useState<'select-template' | 'editing'>(
    templateType && blocks.length > 0 ? 'editing' : 'select-template'
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode) setViewMode(mode);
  }, []);

  // Sync UI state with document
  useEffect(() => {
    if (!loading && document) {
      // Check if we should show template selector or editor
      if (templateType && blocks.length > 0) {
        setFlowState('editing');
      } else if (blocks.length > 0) {
        // Has blocks but no template_type - use blank
        setFlowState('editing');
      } else {
        setFlowState('select-template');
      }

      // Initialize saved blocks
      const saved = new Set<string>();
      blocks.forEach((block) => {
        if (hasBlockContent(block)) {
          saved.add(block.id);
        }
      });
      setSavedBlockIds(saved);
      setIsLoading(false);
    }
  }, [loading, document, blocks, templateType]);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: TemplateType) => {
    console.log('[ProjectEditor V3] Template selected:', template);
    setTemplateType(template);
    initializeTemplate(template);
    setFlowState('editing');
  }, [setTemplateType, initializeTemplate]);

  // Handle block changes
  const handleBlockChange = useCallback((index: number, updatedBlock: TemplateBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    updateBlocks(newBlocks);

    if (hasBlockContent(updatedBlock)) {
      setSavedBlockIds(prev => new Set(prev).add(updatedBlock.id));
    }
  }, [blocks, updateBlocks]);

  // Handle block deletion
  const handleBlockDelete = useCallback((index: number) => {
    if (index === 0) return; // Can't delete hero
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  // Handle section toggle
  const handleToggleSection = useCallback((index: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 mb-2">Loading project...</div>
          <div className="text-xs text-gray-400">V3 Architecture</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load project
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {error || 'Project not found'}
          </p>
          <button
            onClick={() => router.push('/editor?mode=edit')}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Editor
          </button>
        </div>
      </div>
    );
  }

  // Template Selector
  if (flowState === 'select-template') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/editor?mode=edit')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {(document.entity_data as any).title || 'Untitled Project'}
                </h1>
                <p className="text-sm text-gray-500">
                  Choose a template to get started
                </p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-6 py-12">
          <TemplateSelector
            selectedTemplate={null}
            onSelectTemplate={handleTemplateSelect}
          />
        </div>
      </div>
    );
  }

  // Main Editor
  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateEditorHeader
        title={(document.entity_data as any).title || 'Untitled Project'}
        templateName={TEMPLATE_CONFIGS[templateType as TemplateType]?.name || 'Template'}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        viewMode={viewMode}
        deviceMode={deviceMode}
        onBack={() => router.push('/editor?mode=edit')}
        onViewModeChange={setViewMode}
        onDeviceModeChange={setDeviceMode}
      />

      <TemplateEditorContent
        blocks={blocks}
        viewMode={viewMode}
        deviceMode={deviceMode}
        expandedSections={expandedSections}
        savedBlockIds={savedBlockIds}
        onBlocksChange={updateBlocks}
        onBlockChange={handleBlockChange}
        onBlockDelete={handleBlockDelete}
        onToggleSection={handleToggleSection}
      />
    </div>
  );
}
