import { useState, useCallback } from 'react';
import { TemplateType, TemplateBlock } from '../types';
import { hasBlockContent } from '../shared-utils';

export type FlowState = 'select-template' | 'editing';
export type ViewMode = 'edit' | 'preview';
export type DeviceMode = 'desktop' | 'mobile';

export function useTemplateState() {
  const [flowState, setFlowState] = useState<FlowState>('select-template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [blocks, setBlocks] = useState<TemplateBlock[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [savedBlockIds, setSavedBlockIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [showSlashMenu, setShowSlashMenu] = useState(false);

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

  const markBlockAsSaved = useCallback((blockId: string) => {
    setSavedBlockIds(prev => new Set([...prev, blockId]));
  }, []);

  const initializeSavedBlocks = useCallback((blocks: TemplateBlock[]) => {
    const savedIds = new Set<string>(
      blocks.filter(hasBlockContent).map(b => b.id)
    );
    setSavedBlockIds(savedIds);
  }, []);

  return {
    // State
    flowState,
    selectedTemplate,
    blocks,
    expandedSections,
    savedBlockIds,
    viewMode,
    deviceMode,
    showSlashMenu,
    
    // Setters
    setFlowState,
    setSelectedTemplate,
    setBlocks,
    setExpandedSections,
    setSavedBlockIds,
    setViewMode,
    setDeviceMode,
    setShowSlashMenu,
    
    // Actions
    toggleSection,
    markBlockAsSaved,
    initializeSavedBlocks,
  };
}

