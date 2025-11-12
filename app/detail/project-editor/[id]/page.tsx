'use client';

/**
 * Project Editor - V3 Implementation with AI Generation
 * 
 * Clean rewrite using V3 architecture.
 * Now includes AI-powered case study generation!
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { TemplateSelector, TEMPLATE_CONFIGS } from '@/app/editor/templates';
import { TemplateEditorHeader, TemplateEditorContent } from '@/app/detail/components';
import { useTemplateEditor } from '@/app/editor/templates/v3';
import { hasBlockContent } from '@/app/editor/templates/shared-utils';
import { buildTemplateSchema, buildTemplateAIHints } from '@/app/editor/templates/schema-builder';
import { buildBlockCatalog, getGenerationGuide, getToneOption, getLengthOption } from '@/app/editor/templates/block-catalog';
import { AIFlowWizard, AIGenerationData } from '@/app/editor/components/AIFlowWizard';
import { generateCustomCaseStudy, prepareFilesForUpload, getUserFriendlyError } from '@/lib/railway-api';
import type { TemplateBlock, TemplateType } from '@/app/editor/templates/types';

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
    save: forceSave,
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
  const [flowState, setFlowState] = useState<'select-template' | 'ai-prompt' | 'ai-upload' | 'ai-processing' | 'ai-preview' | 'editing'>(
    templateType && blocks.length > 0 ? 'editing' : 'select-template'
  );
  const [isLoading, setIsLoading] = useState(true);

  // AI Generation State
  const [showAIWizard, setShowAIWizard] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiCurrentStep, setAiCurrentStep] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);

  // Initialize from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode) setViewMode(mode);
  }, []);

  // Sync UI state with document (only on initial load)
  useEffect(() => {
    if (!loading && document && isLoading) {
      console.log('[ProjectEditor V3] 🔍 Determining flow state:', {
        documentId: document.id,
        templateType: templateType,
        blocksLength: blocks.length,
        hasBlocks: blocks.length > 0,
        entityTemplateType: (document.entity_data as any).template_type,
        entityBlocksCount: (document.entity_data as any).blocks?.length || 0,
      });

      // Check if we should show template selector or editor
      if (blocks.length > 0) {
        // Has blocks - go to editing mode
        console.log('[ProjectEditor V3] ✅ Has blocks, showing editor');
        setFlowState('editing');
      } else if (templateType) {
        // Has template_type but no blocks - initialize
        console.log('[ProjectEditor V3] 🎨 Has template_type, initializing blocks');
        console.log('[ProjectEditor V3] Template to initialize:', templateType);
        initializeTemplate(templateType);
        setFlowState('editing');
      } else {
        // No blocks and no template - show selector
        console.log('[ProjectEditor V3] 🆕 No blocks or template, showing selector');
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
  }, [loading, document]); // ← Run only on initial load, not when blocks change

  // Handle template selection
  const handleTemplateSelect = useCallback(async (template: TemplateType | 'ai') => {
    console.log('[ProjectEditor V3] Template selected:', template);
    
    if (template === 'ai') {
      // User selected AI mode - show wizard
      setShowAIWizard(true);
    } else {
      // Traditional template - initialize and go to editing
      await setTemplateType(template);
      await initializeTemplate(template);
      setFlowState('editing');
      setViewMode('edit');
    }
  }, [setTemplateType, initializeTemplate]);

  // Check if AI generation in progress from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isGenerating = urlParams.get('ai') === 'generating';
    if (isGenerating && !aiGenerating) {
      setAiGenerating(true);
      setViewMode('preview');
    }
  }, []);

  // Force re-render when blocks change after AI generation
  useEffect(() => {
    if (!aiGenerating && blocks.length > 0 && flowState === 'editing') {
      console.log('[ProjectEditor] Blocks updated, count:', blocks.length);
    }
  }, [blocks, aiGenerating, flowState]);

  // Handle AI Generation from Wizard
  const handleAIGenerateFromWizard = useCallback(async (data: AIGenerationData) => {
    if (!document) {
      setAiError('Missing project data');
      return;
    }

    try {
      // Close wizard
      setShowAIWizard(false);
      
      // Start generating in editor
      setAiGenerating(true);
      setAiProgress(0);
      setAiCurrentStep('Processing uploaded files...');
      setAiError(null);
      setFlowState('editing');
      setViewMode('preview');

      // Prepare files
      setAiProgress(10);
      setAiCurrentStep('Extracting content and data...');
      const preparedFiles = await prepareFilesForUpload(data.files);

      setAiProgress(30);
      setAiCurrentStep('AI is analyzing and designing structure...');
      
      // Build request
      const blockCatalog = buildBlockCatalog();
      const generationGuide = getGenerationGuide();
      const toneOption = getToneOption(data.tone);
      const lengthOption = getLengthOption(data.target_length);

      if (!toneOption || !lengthOption) {
        throw new Error('Invalid tone or length option');
      }

      const { data: result, error } = await generateCustomCaseStudy({
        category: data.category,
        available_blocks: blockCatalog,
        content: {
          files: preparedFiles,
          user_notes: data.user_notes,
          project_metadata: {
            title: (document.entity_data as any).title,
            description: (document.entity_data as any).description,
            tags: (document.entity_data as any).tags,
          },
        },
        generation_options: {
          tone: data.tone,
          tone_description: toneOption.description,
          tone_characteristics: toneOption.characteristics,
          target_length: data.target_length,
          length_details: lengthOption.details,
          auto_extract_metrics: data.auto_extract_metrics,
          include_technical_details: data.include_technical_details,
          prefer_variety: true,
        },
        ai_generation_guide: generationGuide,
        metadata: {
          frontend_version: '3.0',
          timestamp: new Date().toISOString(),
          request_id: crypto.randomUUID(),
        },
      });

      setAiProgress(90);
      setAiCurrentStep('Formatting and validating...');

      if (error || !result) {
        const errorMsg = error?.message || 'Generation failed';
        console.error('[AI Generation] Detailed error:', error);
        
        // Check if it's a 404 (endpoint not implemented)
        if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
          throw new Error('AI generation endpoint not yet implemented. Please use template-based mode or contact support.');
        }
        
        throw new Error(getUserFriendlyError(error || new Error('Generation failed')));
      }

      // Success! Update blocks directly
      setAiProgress(100);
      setAiCurrentStep('Complete!');
      
      console.log('[AI Generation] Success! Generated blocks:', result.blocks.length);
      if (result.structure_info) {
        console.log('[AI Generation] Structure:', result.structure_info);
      }

      // Ensure unique IDs for all blocks (backend might generate duplicates)
      const blocksWithUniqueIds = result.blocks.map((block, index) => ({
        ...block,
        id: `${block.type}_${index}_${crypto.randomUUID().slice(0, 8)}`,
      }));

      console.log('[AI Generation] Blocks with unique IDs:', blocksWithUniqueIds.map(b => b.id));

      // Apply blocks to editor - use skipAutoSave to prevent immediate save
      updateBlocks(blocksWithUniqueIds as TemplateBlock[], false);
      
      // Wait a moment for state to update, then finish
      setTimeout(() => {
        console.log('[AI Generation] Displaying content...');
        setAiGenerating(false);
        setViewMode('preview');
        setFlowState('editing');
        
        // Expand first section for better UX
        setExpandedSections(new Set([0]));
      }, 800);

    } catch (err: any) {
      console.error('[AI Generation] Error:', err);
      setAiError(err.message || 'Failed to generate case study');
      setAiGenerating(false);
      setShowAIWizard(true); // Reopen wizard to try again
    }
  }, [document, updateBlocks, setExpandedSections]);

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

        {/* AI Flow Wizard */}
        <AIFlowWizard
          isOpen={showAIWizard}
          projectTitle={(document.entity_data as any).title}
          onClose={() => setShowAIWizard(false)}
          onGenerate={handleAIGenerateFromWizard}
        />
      </div>
    );
  }

  // Main Editor
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show Loading State During AI Generation */}
      {aiGenerating ? (
        <>
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {(document.entity_data as any).title || 'Untitled Project'}
                  </h1>
                  <p className="text-sm text-gray-500">AI-Designed Case Study</p>
                </div>
                <div className="text-sm text-gray-500">
                  Generating...
                </div>
              </div>
            </div>
          </header>

          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center max-w-lg">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-ping opacity-20"></div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                AI is crafting your case study
              </h3>
              <p className="text-gray-600 mb-8">
                This usually takes 30-40 seconds
              </p>

              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${aiProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{aiProgress}% complete</p>
              </div>

              <p className="text-sm text-gray-600">{aiCurrentStep}</p>

              {aiError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {aiError}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <TemplateEditorHeader
            title={(document.entity_data as any).title || 'Untitled Project'}
            templateName={templateType ? (TEMPLATE_CONFIGS.find(t => t.id === templateType)?.name || 'AI-Designed Case Study') : 'Template'}
            saveStatus={saveStatus}
            lastSaved={lastSaved}
            viewMode={viewMode}
            deviceMode={deviceMode}
            onBack={() => router.push('/editor?mode=edit')}
            onViewModeChange={setViewMode}
            onDeviceModeChange={setDeviceMode}
          />

          <TemplateEditorContent
            key={`blocks-${blocks.length}-${blocks.map(b => b.id).join(',')}`}
            blocks={blocks}
            viewMode={viewMode}
            deviceMode={deviceMode}
            expandedSections={expandedSections}
            savedBlockIds={savedBlockIds}
            onBlocksChange={updateBlocks}
            onBlockChange={handleBlockChange}
            onBlockDelete={handleBlockDelete}
            onToggleSection={handleToggleSection}
            onSave={forceSave}
            entityType="project"
          />
        </>
      )}
    </div>
  );
}
