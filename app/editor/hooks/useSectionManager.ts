import { useState, useCallback } from 'react';
import { DEFAULT_SECTION_ORDER, LAYOUT_PRESETS } from '../lib/sections-config';

export interface UseSectionManagerReturn {
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  setSectionOrder: (order: string[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  moveSectionUp: (index: number) => void;
  moveSectionDown: (index: number) => void;
  applyLayoutPreset: (presetName: keyof typeof LAYOUT_PRESETS) => void;
  resetToDefault: () => void;
  isSectionVisible: (sectionId: string) => boolean;
}

export function useSectionManager(): UseSectionManagerReturn {
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_SECTION_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    personal: true,
    links: true,
    companies: true,
    projects: true,
    experience: true,
    strengths: true,
    testimonials: true,
    resume: true,
    footer: true
  });

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const moveSectionUp = useCallback((index: number) => {
    if (index === 0) return;
    setSectionOrder(prev => {
      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return newOrder;
    });
  }, []);

  const moveSectionDown = useCallback((index: number) => {
    setSectionOrder(prev => {
      if (index === prev.length - 1) return prev;
      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return newOrder;
    });
  }, []);

  const applyLayoutPreset = useCallback((presetName: keyof typeof LAYOUT_PRESETS) => {
    const preset = LAYOUT_PRESETS[presetName];
    if (preset) {
      setSectionOrder(preset.sections);
      
      // Update visibility based on preset
      const newVisibility: Record<string, boolean> = {};
      DEFAULT_SECTION_ORDER.forEach(sectionId => {
        newVisibility[sectionId] = preset.sections.includes(sectionId);
      });
      setSectionVisibility(newVisibility);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setSectionVisibility({
      personal: true,
      links: true,
      companies: true,
      projects: true,
      experience: true,
      strengths: true,
      testimonials: true,
      resume: true,
      footer: true
    });
  }, []);

  const isSectionVisible = useCallback((sectionId: string) => {
    return sectionVisibility[sectionId] !== false;
  }, [sectionVisibility]);

  return {
    sectionOrder,
    sectionVisibility,
    setSectionOrder,
    toggleSectionVisibility,
    moveSectionUp,
    moveSectionDown,
    applyLayoutPreset,
    resetToDefault,
    isSectionVisible
  };
}


