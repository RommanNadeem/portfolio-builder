import { useState, useRef, useCallback } from 'react';
import { TemplateBlock } from './types';
import { hasBlockContent } from './shared-utils';

export function useTemplateEditor() {
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set());

  const toggleSection = useCallback((index: number) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      return newExpanded;
    });
  }, []);

  const markSectionAsSaved = useCallback((sectionId: string, templateBlocks: TemplateBlock[]) => {
    setSavedSections(prev => new Set([...prev, sectionId]));
    setEditingSectionId(null);
    
    // Automatically open the next unsaved section
    const currentIndex = templateBlocks.findIndex(b => b.id === sectionId);
    if (currentIndex !== -1) {
      for (let i = currentIndex + 1; i < templateBlocks.length; i++) {
        if (!savedSections.has(templateBlocks[i].id)) {
          setExpandedSections(new Set([i]));
          setEditingSectionId(templateBlocks[i].id);
          setTimeout(() => {
            document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
          break;
        }
      }
    }
  }, [savedSections]);

  const initializeSavedSections = useCallback((blocks: TemplateBlock[]) => {
    const savedIds = new Set<string>(
      blocks
        .filter(hasBlockContent)
        .map(block => block.id)
    );
    setSavedSections(savedIds);
  }, []);

  return {
    // State
    templateBlocks,
    expandedSections,
    viewMode,
    previewMode,
    saveStatus,
    saveTimeoutRef,
    showBlockSelector,
    editingSectionId,
    savedSections,
    
    // Setters
    setTemplateBlocks,
    setExpandedSections,
    setViewMode,
    setPreviewMode,
    setSaveStatus,
    setShowBlockSelector,
    setEditingSectionId,
    setSavedSections,
    
    // Actions
    toggleSection,
    markSectionAsSaved,
    initializeSavedSections,
  };
}

