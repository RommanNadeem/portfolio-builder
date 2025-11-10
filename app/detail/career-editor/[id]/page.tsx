'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BaseTemplateEditor } from '@/app/editor/templates/BaseTemplateEditor';
import { useTemplateState } from '@/app/editor/templates/hooks/useTemplateState';
import { useTemplatePersistence } from '@/app/editor/templates/hooks/useTemplatePersistence';
import { getTemplateConfig, createEmptyBlock } from '@/app/editor/templates/configs';
import { TemplateType, TemplateBlock } from '@/app/editor/templates/types';
import { hasBlockContent } from '@/app/editor/templates/shared-utils';

// ============================================
// TYPES
// ============================================

interface Impact {
  value: string;
  metric: string;
  description: string;
  category: string;
}

interface CareerImpacts {
  business?: Impact[];
  performance?: Impact[];
  growth?: Impact[];
  quality?: Impact[];
  team?: Impact[];
  scale?: Impact[];
}

interface CareerData {
  id: string;
  organization: string;
  role: string;
  description?: string;
  link?: string;
  // Legacy field
  achievements?: string[];
  // NEW: Separated fields
  responsibilities?: string[];
  key_achievements?: string[];
  // NEW: Structured impacts
  impacts?: CareerImpacts;
  // NEW: Company grouping metadata
  companyGroup?: string;
  companyOccurrence?: number;
  sameCompanyCount?: number;
  hasMultipleRolesAtCompany?: boolean;
  sameCompanyRoles?: string[];
  companyTenure?: any;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  template_type?: TemplateType;
  blocks?: TemplateBlock[];
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CareerTemplateEditor() {
  const params = useParams();
  const router = useRouter();
  const careerId = params?.id as string;

  // Use shared state management hook
  const {
    flowState,
    selectedTemplate,
    blocks,
    expandedSections,
    savedBlockIds,
    viewMode,
    deviceMode,
    showSlashMenu,
    setFlowState,
    setSelectedTemplate,
    setBlocks,
    setExpandedSections,
    setSavedBlockIds,
    setViewMode,
    setDeviceMode,
    setShowSlashMenu,
    toggleSection,
    initializeSavedBlocks,
  } = useTemplateState();

  // Use shared persistence hook
  const { saveStatus, debouncedSave } = useTemplatePersistence({
    entityType: 'career',
    entityId: careerId,
    storageKey: 'careerHighlights',
    autoSaveDelay: 2500,
  });

  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const isInitialLoadRef = useRef(true);

  // Initialize viewMode from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode === 'preview' || mode === 'edit') {
      setViewMode(mode);
      console.log('[Career Editor] View mode from URL:', mode);
    }
  }, [setViewMode]);

  // Load career data
  useEffect(() => {
    const loadCareer = async () => {
      const portfolioDataStr = localStorage.getItem('portfolioData');
      if (portfolioDataStr) {
        const portfolioData = JSON.parse(portfolioDataStr);
        const career = portfolioData.careerHighlights?.find((c: any) => c.id === careerId);
        
        if (career) {
          // Normalize career data - preserve ALL fields including new ones
          const normalizedCareer: CareerData = {
            ...career,
            description: career.description || '',
            link: career.link || '',
            achievements: career.achievements || [],
            responsibilities: career.responsibilities || [],
            key_achievements: career.key_achievements || [],
            impacts: career.impacts || undefined,
            // Company grouping metadata
            companyGroup: career.companyGroup,
            companyOccurrence: career.companyOccurrence,
            sameCompanyCount: career.sameCompanyCount,
            hasMultipleRolesAtCompany: career.hasMultipleRolesAtCompany,
            sameCompanyRoles: career.sameCompanyRoles,
            companyTenure: career.companyTenure,
            startDate: career.startDate || '',
            endDate: career.endDate || '',
            current: career.current || false,
          };
          
          console.log('[Career Template] Loaded career data:', {
            id: normalizedCareer.id,
            organization: normalizedCareer.organization,
            role: normalizedCareer.role,
            link: normalizedCareer.link || '(empty)',
            responsibilities: normalizedCareer.responsibilities?.length,
            key_achievements: normalizedCareer.key_achievements?.length,
            impacts: normalizedCareer.impacts ? 'Present' : 'Not present',
            impactCategories: normalizedCareer.impacts ? Object.keys(normalizedCareer.impacts) : [],
            hasMultipleRoles: normalizedCareer.hasMultipleRolesAtCompany,
            companyTenure: normalizedCareer.companyTenure
          });
          
          console.log('[Career Template] Link field status:', {
            rawCareerLink: career.link,
            normalizedLink: normalizedCareer.link,
            hasLink: !!normalizedCareer.link
          });
          
          setCareerData(normalizedCareer);
          
          // Career always uses career-experience template
          setSelectedTemplate('career-experience');
          
          if (career.blocks && Array.isArray(career.blocks) && career.blocks.length > 0) {
            console.log('[Career Template] Loading existing blocks:', {
              blockCount: career.blocks.length,
              heroWebsite: career.blocks[0]?.data?.meta?.Website || '(none)'
            });
            setBlocks(career.blocks);
            initializeSavedBlocks(career.blocks);
            setFlowState('editing');
          } else {
            // Initialize template for first time
            console.log('[Career Template] Initializing new template');
            initializeTemplate(normalizedCareer);
          }
        } else {
          router.push('/editor');
        }
      } else {
        router.push('/editor');
      }
    };

    if (careerId) {
      loadCareer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerId]); // Only re-run when careerId changes, not on other dependency changes

  // Initialize template with career data
  const initializeTemplate = useCallback((careerData: CareerData) => {
    const templateConfig = getTemplateConfig('career-experience');
    if (templateConfig) {
      const newBlocks = templateConfig.sections.map(section => 
        createEmptyBlock(section.blockType, {
          label: section.label,
          description: section.description,
        })
      );

      // Pre-fill hero block with career data
      const heroIndex = newBlocks.findIndex(b => b?.type === 'hero');
      if (heroIndex !== -1 && newBlocks[heroIndex]) {
        const heroBlock = newBlocks[heroIndex] as any;
        
        // Build comprehensive meta information
        const metaFields: any = {};
        
        // Add timeline
        if (careerData.startDate || careerData.endDate) {
          const timeline = `${careerData.startDate || ''} - ${careerData.current ? 'Present' : (careerData.endDate || '')}`;
          metaFields.Timeline = timeline.trim();
        }
        
        // Add company tenure if available
        if (careerData.companyTenure && careerData.companyTenure.firstStarted) {
          const tenure = `${careerData.companyTenure.firstStarted} - ${careerData.companyTenure.lastEnded}`;
          metaFields['Company Tenure'] = tenure;
        }
        
        // Add role information if multiple roles at company
        if (careerData.hasMultipleRolesAtCompany && careerData.sameCompanyCount) {
          metaFields['Roles at Company'] = `${careerData.sameCompanyCount} roles`;
        }
        
        newBlocks[heroIndex] = {
          ...heroBlock,
          data: {
            ...heroBlock.data,
            title: careerData.organization || '',
            subtitle: careerData.role || '',
            description: careerData.description || '',
            meta: {
              ...metaFields,
              ...(careerData.link && { Website: careerData.link }),
            },
          },
        };
        
        console.log('[Career Template] ✅ Pre-filled hero block with metadata:', metaFields);
      }

      // Pre-fill Context section (index 1) - Company and team context
      const contextIndex = newBlocks.findIndex(
        (b, idx) => b?.type === 'callout' && idx === 1
      );
      
      if (contextIndex !== -1 && newBlocks[contextIndex]) {
        const calloutBlock = newBlocks[contextIndex] as any;
        
        // Build context text with company metadata
        let contextBody = '';
        
        if (careerData.hasMultipleRolesAtCompany && careerData.sameCompanyRoles && careerData.sameCompanyRoles.length > 0) {
          contextBody += `Multiple roles at ${careerData.organization}:\n`;
          contextBody += careerData.sameCompanyRoles.map(r => `• ${r}`).join('\n');
          contextBody += '\n\n';
        }
        
        if (careerData.companyTenure) {
          const tenure = careerData.companyTenure;
          contextBody += `Overall tenure: ${tenure.firstStarted} - ${tenure.lastEnded}`;
          if (tenure.totalRoles > 1) {
            contextBody += ` (${tenure.totalRoles} roles)`;
          }
          if (tenure.isContinuous) {
            contextBody += ' • Continuous employment';
          }
        }
        
        // Only update if we have context to add
        if (contextBody.trim()) {
          newBlocks[contextIndex] = {
            ...calloutBlock,
            data: {
              ...calloutBlock.data,
              title: 'Company Context',
              body: contextBody.trim(),
              variant: 'info',
            },
          };
          console.log('[Career Template] ✅ Pre-filled context section with company metadata');
        }
      }

      // Pre-fill Responsibilities section (index 2) - Generic duties
      const responsibilitiesData = careerData.responsibilities || [];
      const responsibilitiesIndex = newBlocks.findIndex(
        (b, idx) => b?.type === 'bullets' && idx === 2
      );
      
      if (responsibilitiesIndex !== -1 && newBlocks[responsibilitiesIndex]) {
        const bulletsBlock = newBlocks[responsibilitiesIndex] as any;
        newBlocks[responsibilitiesIndex] = {
          ...bulletsBlock,
          data: {
            ...bulletsBlock.data,
            title: bulletsBlock.data?.title || 'Responsibilities',  // ⭐ Add default heading
            bullets: responsibilitiesData.filter(r => r.trim().length > 0),
          },
        };
        console.log('[Career Template] Pre-filled responsibilities:', responsibilitiesData.length);
      }

      // Pre-fill Key Achievements section (index 3) - Impact-focused accomplishments
      const keyAchievementsData = careerData.key_achievements || [];
      const achievementsIndex = newBlocks.findIndex(
        (b, idx) => b?.type === 'bullets' && idx === 3
      );
      
      if (achievementsIndex !== -1 && newBlocks[achievementsIndex]) {
        const bulletsBlock = newBlocks[achievementsIndex] as any;
        newBlocks[achievementsIndex] = {
          ...bulletsBlock,
          data: {
            ...bulletsBlock.data,
            title: bulletsBlock.data?.title || 'Key Achievements',  // ⭐ Add default heading
            bullets: keyAchievementsData.filter(a => a.trim().length > 0),
          },
        };
        console.log('[Career Template] Pre-filled key achievements:', keyAchievementsData.length);
      }

      // Pre-fill Impact & Results section (index 4) - Structured metrics
      console.log('[Career Template] Checking impacts...', {
        hasImpacts: !!careerData.impacts,
        impactData: careerData.impacts
      });
      
      if (careerData.impacts) {
        const impactIndex = newBlocks.findIndex(
          (b, idx) => b?.type === 'metrics' && idx === 4
        );
        
        console.log('[Career Template] Looking for metrics block at index 4, found at:', impactIndex);
        
        if (impactIndex !== -1 && newBlocks[impactIndex]) {
          const metricsBlock = newBlocks[impactIndex] as any;
          
          // Convert structured impacts to metrics format
          const allImpacts: any[] = [];
          
          // Process each category
          Object.entries(careerData.impacts).forEach(([category, impacts]) => {
            console.log('[Career Template] Processing category:', category, 'with', impacts?.length, 'impacts');
            
            if (impacts && Array.isArray(impacts)) {
              impacts.forEach((impact: Impact) => {
                allImpacts.push({
                  label: impact.metric,
                  value: impact.value,
                  description: impact.description,
                  category: category
                });
              });
            }
          });
          
          console.log('[Career Template] All impacts converted:', allImpacts);
          
          newBlocks[impactIndex] = {
            ...metricsBlock,
            data: {
              ...metricsBlock.data,
              title: metricsBlock.data.title || '', // Preserve existing title
              metrics: allImpacts.length > 0 ? allImpacts : [{ label: '', value: '', description: '' }],
            },
          };
          console.log('[Career Template] ✅ Pre-filled impacts:', allImpacts.length, 'metrics');
        } else {
          console.warn('[Career Template] ⚠️ Could not find metrics block at expected index');
        }
      } else {
        console.log('[Career Template] ℹ️ No impacts data available');
      }

      // BACKWARDS COMPATIBILITY: Fall back to achievements if new fields don't exist
      if (responsibilitiesData.length === 0 && keyAchievementsData.length === 0 && careerData.achievements && careerData.achievements.length > 0) {
        console.log('[Career Template] Using legacy achievements field');
        
        // Put all achievements in Key Achievements section
        if (achievementsIndex !== -1 && newBlocks[achievementsIndex]) {
          const bulletsBlock = newBlocks[achievementsIndex] as any;
          newBlocks[achievementsIndex] = {
            ...bulletsBlock,
            data: {
              ...bulletsBlock.data,
              bullets: careerData.achievements.filter(a => a.trim().length > 0),
            },
          };
        }
      }
      
      const filteredBlocks = newBlocks.filter(Boolean);
      setBlocks(filteredBlocks);
      
      // Mark pre-populated blocks as saved so they show in preview mode
      initializeSavedBlocks(filteredBlocks);
      
      const allIndexes = filteredBlocks.map((_, i) => i);
      setExpandedSections(new Set(allIndexes));
      setFlowState('editing');
    }
  }, [setBlocks, setExpandedSections, setFlowState, initializeSavedBlocks]);

  // Auto-save when blocks change (but NOT on initial load)
  useEffect(() => {
    if (flowState !== 'editing') return;
    // Allow saving even with just 1 block (hero only) - user may have deleted all other sections
    if (blocks.length === 0) {
      console.log('[Career Template] ⚠️ No blocks to save, skipping');
      return;
    }

    // Skip save on initial load/navigation
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      console.log('[Career Template] 📌 Initial blocks loaded, skipping save');
      return;
    }

    console.log('[Career Template] 🔄 Blocks changed, scheduling save...', {
      blocksCount: blocks.length,
      blockOrder: blocks.map((b, i) => `${i}: ${b.sectionLabel || b.type}`),
      heroWebsite: blocks[0]?.data?.meta?.Website,
      careerDataLink: careerData?.link
    });
    debouncedSave(careerData, blocks, 'career-experience');
  }, [blocks, flowState, debouncedSave, careerData]);

  // Handle block changes
  const handleBlockChange = useCallback((index: number, updatedBlock: TemplateBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);

    // Mark as saved if has content
    if (hasBlockContent(updatedBlock)) {
      setSavedBlockIds(prev => new Set([...prev, updatedBlock.id]));
    }

    // If hero block changed, update career data in real-time
    if (index === 0 && updatedBlock.type === 'hero' && careerData) {
      const updatedCareerData = {
        ...careerData,
        organization: updatedBlock.data.title || careerData.organization,
        role: updatedBlock.data.subtitle || careerData.role,
        description: updatedBlock.data.description || careerData.description,
        link: updatedBlock.data.meta?.Website || careerData.link, // Sync website in real-time
      };
      
      console.log('[Career Template] Updated careerData with hero changes:', {
        organization: updatedCareerData.organization,
        role: updatedCareerData.role,
        link: updatedCareerData.link
      });
      
      setCareerData(updatedCareerData);
    }

    // Sync responsibilities and key achievements back to career data
    if (careerData) {
      let responsibilities: string[] | null = null;
      let keyAchievements: string[] | null = null;
      
      // Check if this is the Responsibilities bullets section (index 2)
      if (index === 2 && updatedBlock.type === 'bullets' && updatedBlock.data?.bullets) {
        responsibilities = updatedBlock.data.bullets.filter((b: string) => b.trim().length > 0);
        console.log('[Career Template] Responsibilities updated:', responsibilities.length);
      }
      
      // Check if this is the Key Achievements bullets section (index 3)
      if (index === 3 && updatedBlock.type === 'bullets' && updatedBlock.data?.bullets) {
        keyAchievements = updatedBlock.data.bullets.filter((b: string) => b.trim().length > 0);
        console.log('[Career Template] Key achievements updated:', keyAchievements.length);
      }
      
      // Update career data with new responsibilities and/or key achievements
      if (responsibilities !== null || keyAchievements !== null) {
        const updatedCareerData = { ...careerData };
        
        if (responsibilities !== null) {
          updatedCareerData.responsibilities = responsibilities;
        }
        if (keyAchievements !== null) {
          updatedCareerData.key_achievements = keyAchievements;
        }
        
        // Also update legacy achievements field (combine both for backwards compatibility)
        if (responsibilities !== null || keyAchievements !== null) {
          const allAchievements = [
            ...(keyAchievements || careerData.key_achievements || []),
            ...(responsibilities || careerData.responsibilities || [])
          ];
          updatedCareerData.achievements = allAchievements;
        }
        
        setCareerData(updatedCareerData);
        
        // Sync back to localStorage (main editor)
        const portfolioDataStr = localStorage.getItem('portfolioData');
        if (portfolioDataStr) {
          const portfolioData = JSON.parse(portfolioDataStr);
          const careerIndex = portfolioData.careerHighlights?.findIndex((c: any) => c.id === careerId);
          
          if (careerIndex !== -1) {
            portfolioData.careerHighlights[careerIndex] = {
              ...portfolioData.careerHighlights[careerIndex],
              ...(responsibilities !== null && { responsibilities }),
              ...(keyAchievements !== null && { key_achievements: keyAchievements }),
              // Update legacy field too
              achievements: updatedCareerData.achievements,
            };
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
            console.log('[Career Template] Synced back to main editor - Responsibilities:', responsibilities?.length, 'Key Achievements:', keyAchievements?.length);
          }
        }
      }
    }
  }, [blocks, careerData, careerId, setBlocks, setSavedBlockIds]);

  // Handle template selection (not used for career, but required by BaseTemplateEditor)
  const handleTemplateSelect = useCallback((templateType: TemplateType) => {
    // Career always uses career-experience, but this is here for consistency
    if (templateType === 'career-experience' && careerData) {
      initializeTemplate(careerData);
    }
  }, [careerData, initializeTemplate]);

  // Add new block
  const handleAddBlock = useCallback((blockType: string) => {
    const newBlock = createEmptyBlock(blockType, {
      label: blockType.charAt(0).toUpperCase() + blockType.slice(1).replace('_', ' '),
      description: 'Custom section',
    });
    if (newBlock) {
      setBlocks([...blocks, newBlock]);
      setExpandedSections(prev => new Set([...prev, blocks.length]));
    }
  }, [blocks, setBlocks, setExpandedSections]);

  // Delete block
  const handleDeleteBlock = useCallback((index: number) => {
    if (index === 0) {
      alert('Cannot delete the overview section');
      return;
    }
    
    if (confirm('Are you sure you want to delete this section?')) {
      const newBlocks = blocks.filter((_, i) => i !== index);
      setBlocks(newBlocks);
    }
  }, [blocks, setBlocks]);

  if (!careerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BaseTemplateEditor
      entityId={careerId}
      entityData={careerData}
      flowState={flowState}
      selectedTemplate={selectedTemplate}
      blocks={blocks}
      expandedSections={expandedSections}
      savedBlockIds={savedBlockIds}
      viewMode={viewMode}
      deviceMode={deviceMode}
      showSlashMenu={showSlashMenu}
      saveStatus={saveStatus}
      onFlowStateChange={setFlowState}
      onTemplateSelect={handleTemplateSelect}
      onBlocksChange={setBlocks}
      onBlockChange={handleBlockChange}
      onBlockDelete={handleDeleteBlock}
      onBlockAdd={handleAddBlock}
      onToggleSection={toggleSection}
      onViewModeChange={setViewMode}
      onDeviceModeChange={setDeviceMode}
      onSlashMenuToggle={setShowSlashMenu}
      onBack={() => router.push(`/editor?mode=${viewMode}`)}
      entityTypeName="Career Experience"
      entityType="career"
      backLabel="Back to Editor"
      breadcrumbs={[
        'Portfolio',
        'Career Highlights',
        `${careerData.organization} - ${careerData.role}`,
      ]}
    />
  );
}
