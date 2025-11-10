import { useState, useRef, useCallback, useEffect } from 'react';
import { TemplateBlock } from '../types';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface PersistenceOptions {
  entityType: 'project' | 'career';
  entityId: string;
  storageKey: 'projects' | 'careerHighlights';
  onSave?: (data: any) => void;
  autoSaveDelay?: number;
}

export function useTemplatePersistence(options: PersistenceOptions) {
  const { entityType, entityId, storageKey, onSave, autoSaveDelay = 2500 } = options;
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const saveToLocalStorage = useCallback((data: any, blocks: TemplateBlock[], templateType: string | null) => {
    setSaveStatus('saving');
    
    const portfolioDataStr = localStorage.getItem('portfolioData');
    if (!portfolioDataStr) {
      setSaveStatus('saved');
      return;
    }

    const portfolioData = JSON.parse(portfolioDataStr);
    const entityIndex = portfolioData[storageKey]?.findIndex((item: any) => item.id === entityId);
    
    if (entityIndex === undefined || entityIndex === -1) {
      setSaveStatus('saved');
      return;
    }

    const currentEntity = portfolioData[storageKey][entityIndex];
    
    // Extract hero block data
    const heroBlock = blocks.find(b => b.type === 'hero');
    
    console.log('[Persistence] Hero block found:', {
      hasHero: !!heroBlock,
      heroType: heroBlock?.type,
      metaFields: heroBlock?.data?.meta ? Object.keys(heroBlock.data.meta) : [],
      website: (heroBlock?.data?.meta as any)?.Website
    });
    
    // Build updated entity preserving ALL existing fields
    const updatedEntity = {
      ...currentEntity,
      template_type: templateType,
      blocks,
      updatedAt: new Date().toISOString(),
      ...data, // Merge any additional data passed in
    };

    // For projects, sync hero data to project metadata
    if (entityType === 'project' && heroBlock && heroBlock.type === 'hero') {
      if (heroBlock.data.title) updatedEntity.title = heroBlock.data.title;
      if (heroBlock.data.subtitle || heroBlock.data.description) {
        updatedEntity.description = heroBlock.data.subtitle || heroBlock.data.description;
      }
      if (heroBlock.data.imageUrl) updatedEntity.thumbnail = heroBlock.data.imageUrl;
    }

    // For career, sync hero data to career metadata
    if (entityType === 'career' && heroBlock && heroBlock.type === 'hero') {
      console.log('[Persistence] Syncing career hero data:', {
        title: heroBlock.data.title,
        subtitle: heroBlock.data.subtitle,
        metaWebsite: (heroBlock.data.meta as any)?.Website,
        currentLink: currentEntity.link
      });
      
      if (heroBlock.data.title) updatedEntity.organization = heroBlock.data.title;
      if (heroBlock.data.subtitle) updatedEntity.role = heroBlock.data.subtitle;
      if (heroBlock.data.description) updatedEntity.description = heroBlock.data.description;
      
      // Sync company website from hero meta to career highlight link
      if ((heroBlock.data.meta as any)?.Website) {
        updatedEntity.link = (heroBlock.data.meta as any).Website;
        console.log('[Persistence] ✅ Synced company website to career card:', (heroBlock.data.meta as any).Website);
      } else {
        console.log('[Persistence] ⚠️ No website in hero meta to sync');
      }
      
      // Also sync achievements from the blocks back to the career card
      // Check Responsibilities section (bullets at index 2) or Key Achievements (feature_grid at index 3)
      const responsibilitiesBlock = blocks[2];
      const achievementsBlock = blocks[3];
      
      if (responsibilitiesBlock?.type === 'bullets' && responsibilitiesBlock.data?.bullets) {
        updatedEntity.achievements = responsibilitiesBlock.data.bullets.filter((b: string) => b.trim());
      } else if (achievementsBlock?.type === 'feature_grid' && achievementsBlock.data?.items) {
        updatedEntity.achievements = achievementsBlock.data.items
          .filter((item: any) => item.title?.trim())
          .map((item: any) => item.title);
      }
      
      console.log('[Persistence] Synced achievements to career card:', updatedEntity.achievements);
    }

    portfolioData[storageKey][entityIndex] = updatedEntity;
    
    // Log what we're saving for career
    if (entityType === 'career') {
      console.log('[Persistence] Final career data being saved to localStorage:', {
        id: updatedEntity.id,
        organization: updatedEntity.organization,
        role: updatedEntity.role,
        link: updatedEntity.link || '(empty)',
        hasBlocks: !!updatedEntity.blocks,
        blocksCount: updatedEntity.blocks?.length || 0,
        heroWebsite: (updatedEntity.blocks?.[0]?.data?.meta as any)?.Website || '(none in blocks)'
      });
    }
    
    try {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      console.log(`[${entityType} Template] ✅ Saved successfully`);
    } catch (error) {
      console.error(`[${entityType} Template] ❌ Save failed:`, error);
      setSaveStatus('unsaved');
      return;
    }

    if (onSave) {
      onSave(updatedEntity);
    }
    
    setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
  }, [entityType, entityId, storageKey, onSave]);

  const debouncedSave = useCallback((data: any, blocks: TemplateBlock[], templateType: string | null) => {
    setSaveStatus('unsaved');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage(data, blocks, templateType);
    }, autoSaveDelay);
  }, [saveToLocalStorage, autoSaveDelay]);

  const saveImmediately = useCallback((data: any, blocks: TemplateBlock[], templateType: string | null) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveToLocalStorage(data, blocks, templateType);
  }, [saveToLocalStorage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    debouncedSave,
    saveImmediately,
  };
}

