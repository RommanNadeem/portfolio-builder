'use client';

/**
 * Career Editor - V3 Implementation
 * 
 * Clean rewrite using V3 architecture.
 * Same UI/UX, 70% less code, better maintainability.
 * 
 * From: 599 lines
 * To: ~200 lines (67% reduction)
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TEMPLATE_CONFIGS } from '@/app/editor/templates';
import { TemplateEditorHeader, TemplateEditorContent } from '@/app/detail/components';
import { useTemplateEditor } from '@/app/editor/templates/v3';
import type { TemplateBlock } from '@/app/editor/templates/types';

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

export default function CareerEditor() {
  const params = useParams();
  const router = useRouter();
  const careerId = params?.id as string;

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
    initializeTemplate,
    save: forceSave,
  } = useTemplateEditor({
    entityId: careerId,
    entityType: 'career',
    autoSave: true,
    autoSaveDelay: 2500,
  });

  // UI State
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [savedBlockIds, setSavedBlockIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode) setViewMode(mode);
  }, []);

  // Sync UI state with document (run once on load only)
  useEffect(() => {
    if (!loading && document && isLoading) {
          // Career always uses career-experience template
      // Initialize if blocks are empty (even if template_type is set)
      if (blocks.length === 0) {
        console.log('[CareerEditor V3] Auto-initializing career template (blocks empty)');
        // Small delay to ensure document state is ready
        setTimeout(() => {
          initializeTemplate('career-experience');
          setIsLoading(false);
        }, 100);
      } else {
        // Initialize saved blocks from existing data
        const saved = new Set<string>();
        blocks.forEach((block) => {
          if (hasBlockContent(block)) {
            saved.add(block.id);
          }
        });
        setSavedBlockIds(saved);
        setIsLoading(false);
      }
    }
  }, [loading, document, isLoading]); // ← Only run when loading state changes

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
  if (loading || (isLoading && blocks.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 mb-2">Loading career highlight...</div>
          <div className="text-xs text-gray-400">Initializing template...</div>
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
            Failed to load career highlight
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {error || 'Career highlight not found'}
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

  // Main Editor (career always uses career-experience template)
  const careerData = document.entity_data as any;
  const title = `${careerData.role} at ${careerData.organization}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateEditorHeader
        title={title}
        templateName={TEMPLATE_CONFIGS['career-experience']?.name || 'Career Template'}
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
        onSave={forceSave}
        entityType="career"
      />
    </div>
  );
}
