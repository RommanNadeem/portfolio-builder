/**
 * V3 Template System - Example Project Editor Integration
 * 
 * This file demonstrates how to integrate the V3 template system
 * with existing detail pages. Copy this pattern to create or update
 * detail page editors.
 * 
 * Usage:
 * 1. Copy this file to your detail page location
 * 2. Update imports and styling as needed
 * 3. Customize the UI components
 * 4. Add template selector if needed
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Eye, Pencil, Monitor, Smartphone } from 'lucide-react';
import { useEntityDocument } from '../hooks/useEntityDocument';
import { BaseTemplateEditor } from '../../../templates/BaseTemplateEditor';
import { TemplateSelector } from '../../../templates/TemplateSelector';

export default function ProjectEditorV3Example() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  
  // Use the V3 hook
  const {
    document,
    loading,
    error,
    saveStatus,
    lastSaved,
    updateBlocks,
    setTemplateType,
    initializeTemplate,
    getBlocks,
    getTemplateType,
  } = useEntityDocument({
    entityId: projectId,
    entityType: 'project',
    autoSave: true,
    autoSaveDelay: 2500,
    onSaveSuccess: (result) => {
      console.log('[ProjectEditor] ✅ Save successful:', result);
    },
    onSaveError: (error) => {
      console.error('[ProjectEditor] ❌ Save failed:', error);
    },
    onLoadError: (error) => {
      console.error('[ProjectEditor] ❌ Load failed:', error);
    },
  });
  
  const blocks = getBlocks();
  const templateType = getTemplateType();
  const showTemplateSelector = !templateType || blocks.length === 0;
  
  /**
   * Handle template selection
   */
  const handleTemplateSelect = (selectedTemplate: string) => {
    console.log('[ProjectEditor] Template selected:', selectedTemplate);
    setTemplateType(selectedTemplate);
    initializeTemplate(selectedTemplate);
  };
  
  /**
   * Handle blocks change
   */
  const handleBlocksChange = (updatedBlocks: any[]) => {
    console.log('[ProjectEditor] Blocks updated:', updatedBlocks.length);
    updateBlocks(updatedBlocks);
  };
  
  /**
   * Navigate back to editor
   */
  const handleBack = () => {
    router.push('/editor?mode=edit');
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 mb-2">Loading project...</div>
          <div className="text-xs text-gray-400">Setting up your workspace</div>
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
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Editor
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Template selector state
  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Back to editor"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {document.entity_data.title || 'Untitled Project'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Choose a template to get started
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Template Selector */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <TemplateSelector
            onSelect={handleTemplateSelect}
            currentTemplate={null}
          />
        </div>
      </div>
    );
  }
  
  // Main editor with BaseTemplateEditor
  return (
    <BaseTemplateEditor
      // Data
      entityId={document.id}
      entityData={document.entity_data}
      
      // Template state (managed by V3)
      flowState="editing"
      selectedTemplate={templateType as any}
      blocks={blocks}
      expandedSections={new Set([0])}
      savedBlockIds={new Set(blocks.map((b: any) => b.id))}
      viewMode="edit"
      deviceMode="desktop"
      showSlashMenu={false}
      saveStatus={saveStatus === 'saved' ? 'saved' : saveStatus === 'saving' ? 'saving' : 'unsaved'}
      
      // Actions
      onFlowStateChange={(state) => {
        if (state === 'select-template') {
          setTemplateType('');
        }
      }}
      onTemplateSelect={handleTemplateSelect}
      onBlocksChange={handleBlocksChange}
      onBlockChange={(index, block) => {
        const newBlocks = [...blocks];
        newBlocks[index] = block;
        handleBlocksChange(newBlocks);
      }}
      onBlockDelete={(index) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        handleBlocksChange(newBlocks);
      }}
      onBlockAdd={(blockType) => {
        // Add new block logic here
        console.log('[ProjectEditor] Add block:', blockType);
      }}
      onToggleSection={(index) => {
        // Toggle section logic if needed
        console.log('[ProjectEditor] Toggle section:', index);
      }}
      onViewModeChange={(mode) => {
        console.log('[ProjectEditor] View mode changed:', mode);
      }}
      onDeviceModeChange={(mode) => {
        console.log('[ProjectEditor] Device mode changed:', mode);
      }}
      onSlashMenuToggle={(show) => {
        console.log('[ProjectEditor] Slash menu:', show);
      }}
      onBack={handleBack}
      
      // Labels
      entityTypeName="Project"
      entityType="project"
      backLabel="Back to Projects"
      breadcrumbs={['Portfolio', 'Projects', document.entity_data.title || 'Untitled']}
    />
  );
}

