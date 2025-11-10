'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Check, ChevronDown, ChevronUp, Eye, Pencil, 
  Monitor, Smartphone, Sparkles, GripVertical, Plus, Trash2
} from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  TemplateSelector,
  SlashCommandMenu,
  getTemplateConfig,
  createEmptyBlock,
  TemplateRenderer,
  EnhancedDragHandle,
  TEMPLATE_CONFIGS
} from '@/app/editor/templates';
import type { TemplateType, TemplateBlock, TemplateConfig } from '@/app/editor/templates/types';
import type { SaveStatus } from '@/app/editor/core/types';

// ============================================
// TYPES
// ============================================

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  link?: string;
  template_type?: TemplateType;
  blocks?: TemplateBlock[];
  createdAt: string;
  updatedAt: string;
}

type FlowState = 'select-template' | 'editing';
type ViewMode = 'edit' | 'preview';
type DeviceMode = 'desktop' | 'mobile';

// ============================================
// SORTABLE SECTION COMPONENT
// ============================================

interface SortableSectionProps {
  block: TemplateBlock;
  index: number;
  isExpanded: boolean;
  isSaved: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
  onChange: (block: TemplateBlock) => void;
  onDelete: () => void;
}

function SortableSection({
  block,
  index,
  isExpanded,
  isSaved,
  viewMode,
  onToggle,
  onChange,
  onDelete,
}: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: block.id,
    disabled: index === 0 // Disable dragging for Hero
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [hovering, setHovering] = useState(false);

  // In preview mode, hide empty sections
  const isEmpty = !isSaved;
  if (viewMode === 'preview' && isEmpty) {
    return null;
  }

  // In edit mode, always show content (no collapsing)
  const showContent = viewMode === 'edit' || isExpanded;

  // In preview mode, render without any wrapper - just the content
  if (viewMode === 'preview') {
    return (
      <div ref={setNodeRef} style={style} className="mt-12 first:mt-8">
        <TemplateRenderer
          blocks={[block]}
          onChange={(blocks) => onChange(blocks[0])}
          mode="preview"
        />
      </div>
    );
  }

  // Edit mode - Notion-style document layout with fixed left rail for drag handle
  return (
    <section 
      ref={setNodeRef} 
      style={style}
      className={`group/section mt-12 first:mt-8 hover-tint rounded-md -mx-2 px-2 py-3 ${
        isDragging ? 'scale-[0.98] opacity-60' : ''
      } transition-all duration-150`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Title Row with Fixed Left Rail for Alignment */}
      <div className="flex items-start gap-3 mb-3">
        {/* Left Rail - Fixed width for consistent alignment */}
        <div className="w-8 flex-shrink-0 pt-1">
          {index !== 0 && (
            <div {...attributes} {...listeners}>
              <button 
                className="inline-flex items-center justify-center w-8 h-8 opacity-40 hover:opacity-100 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 ring-gray-300 rounded transition-opacity"
                title="Drag to reorder"
              >
                <GripVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Title and Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            {/* Section Title - Exact spec */}
            <h2 className="text-[18px] font-medium tracking-[0.2px] text-gray-900">
              {block.sectionLabel || block.type}
            </h2>

            {/* Actions Row */}
            <div className="flex items-center gap-2">
              {/* Complete Indicator */}
              {isSaved && (
                <span className="text-xs text-green-600 font-medium">
                  ✓
                </span>
              )}

              {/* Delete Button */}
              {index !== 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="opacity-0 group-hover/section:opacity-100 p-1.5 text-gray-400 hover:text-red-500 rounded transition-all"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Section Description - Optional, per spec */}
          {block.sectionDescription && (
            <p className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px] mt-2">
              {block.sectionDescription}
            </p>
          )}
        </div>
      </div>

      {/* Section Content - Clean, no wrapper, aligned with title */}
      <div className="ml-11"> {/* 32px (w-8) + 12px (gap-3) = 44px offset */}
        <TemplateRenderer
          blocks={[block]}
          onChange={(blocks) => onChange(blocks[0])}
          mode="edit"
        />
      </div>

      {/* Subtle Divider */}
      <div className="section-divider" />
    </section>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function NotionLikeProjectEditor() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [flowState, setFlowState] = useState<FlowState>('select-template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [blocks, setBlocks] = useState<TemplateBlock[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [savedBlockIds, setSavedBlockIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showSlashMenu, setShowSlashMenu] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize viewMode from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode === 'preview' || mode === 'edit') {
      setViewMode(mode);
      console.log('[Project Editor] View mode from URL:', mode);
    }
  }, []);

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      console.log('[Template Editor] 🔍 Attempting to load project:', projectId);
      
      // Load from main portfolio data
      const portfolioDataStr = localStorage.getItem('portfolioData');
      
      if (!portfolioDataStr) {
        console.error('[Template Editor] ❌ No portfolioData in localStorage!');
        return;
      }
      
      const portfolioData = JSON.parse(portfolioDataStr);
      console.log('[Template Editor] 📊 Portfolio data loaded:', {
        total_projects: portfolioData.projects?.length || 0,
        project_ids: portfolioData.projects?.map((p: any) => p.id) || [],
      });
      
      const project = portfolioData.projects?.find((p: any) => p.id === projectId);
      
      if (project) {
        console.log('[Template Editor] ✅ Project found:', {
          id: project.id,
          title: project.title,
          template_type: project.template_type,
          blocks_count: project.blocks?.length || 0,
          has_detail_page: project.has_detail_page,
        });
        
        // Ensure all required fields exist
        const normalizedProject = {
          ...project,
          tags: project.tags || [],
          description: project.description || '',
          thumbnail: project.thumbnail || '',
          link: project.link || '',
        };
        setProjectData(normalizedProject);
        
        // Check if has template OR has existing blocks (skip selector if content exists)
        if (project.template_type || (project.blocks && project.blocks.length > 0)) {
          const templateToUse = project.template_type || 'blank'; // Fallback to blank if has blocks but no template_type
          
          console.log('[Template Editor] ✅ Has template or content, going directly to editing mode:', {
            template: templateToUse,
            blocks: project.blocks?.length || 0,
          });
          
          setSelectedTemplate(templateToUse);
          setBlocks(project.blocks || []);
          setSavedBlockIds(new Set(project.blocks?.map((b: TemplateBlock) => b.id) || []));
          setFlowState('editing');
        } else {
          console.log('[Template Editor] ℹ️ No template or content, showing selector');
          setFlowState('select-template');
        }
        setIsLoading(false);
      } else {
        console.error('[Template Editor] ❌ Project NOT FOUND in portfolio!', {
          looking_for: projectId,
          available_projects: portfolioData.projects?.length || 0,
        });
        
        // Wait a bit and try again (in case of race condition)
        console.log('[Template Editor] ⏳ Waiting 500ms and retrying...');
        setTimeout(() => {
          const retryData = localStorage.getItem('portfolioData');
          if (retryData) {
            const retryParsed = JSON.parse(retryData);
            const retryProject = retryParsed.projects?.find((p: any) => p.id === projectId);
            
            if (retryProject) {
              console.log('[Template Editor] ✅ Found on retry!');
              setProjectData({
                ...retryProject,
                tags: retryProject.tags || [],
                description: retryProject.description || '',
                thumbnail: retryProject.thumbnail || '',
                link: retryProject.link || '',
              });
              
              // Check if has template OR has existing blocks
              if (retryProject.template_type || (retryProject.blocks && retryProject.blocks.length > 0)) {
                const templateToUse = retryProject.template_type || 'blank';
                setSelectedTemplate(templateToUse);
                setBlocks(retryProject.blocks || []);
                setSavedBlockIds(new Set(retryProject.blocks?.map((b: TemplateBlock) => b.id) || []));
                setFlowState('editing');
              } else {
                setFlowState('select-template');
              }
              setIsLoading(false);
            } else {
              console.error('[Template Editor] ❌ Still not found after retry');
              setIsLoading(false);
            }
          }
        }, 500);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  // Auto-save
  const saveProject = useCallback(() => {
    if (!projectData) {
      console.log('[Template Editor] ❌ No projectData, skipping save');
      return;
    }

    if (!selectedTemplate) {
      console.log('[Template Editor] ❌ No selectedTemplate, skipping save');
      return;
    }

    if (blocks.length === 0) {
      console.log('[Template Editor] ❌ No blocks, skipping save');
      return;
    }

    console.log('[Template Editor] 🔄 Starting save...', {
      selectedTemplate,
      blocksCount: blocks.length,
      projectId
    });

    setSaveStatus('saving');
    
    // Load entire portfolio first to get the current project state
    const portfolioDataStr = localStorage.getItem('portfolioData');
    if (!portfolioDataStr) {
      console.error('[Template Editor] ❌ No portfolioData in localStorage');
      setSaveStatus('saved');
      return;
    }

    const portfolioData = JSON.parse(portfolioDataStr);
    const projectIndex = portfolioData.projects?.findIndex((p: any) => p.id === projectId);
    
    if (projectIndex === undefined || projectIndex === -1) {
      console.error('[Template Editor] ❌ Project not found in portfolio');
      setSaveStatus('saved');
      return;
    }

    // Get the current project from portfolio to preserve all fields
    const currentProject = portfolioData.projects[projectIndex];
    
    // Extract hero block data to sync with project metadata
    const heroBlock = blocks.find(b => b.type === 'hero');
    
    console.log('[Template Editor] Hero block in save:', heroBlock ? {
      title: heroBlock.data?.title,
      subtitle: heroBlock.data?.subtitle,
      description: heroBlock.data?.description,
      imageUrl: heroBlock.data?.imageUrl,
    } : 'No hero block found');
    
    // Build updated project preserving ALL existing fields
    const updatedProject = {
      ...currentProject, // Preserve all existing fields (tags, link, etc.)
      template_type: selectedTemplate,  // ⭐ This should be saved
      blocks: blocks,                   // ⭐ This should be saved
      updatedAt: new Date().toISOString(),
      // Sync hero block data to project metadata (for card display)
      ...(heroBlock && heroBlock.type === 'hero' && heroBlock.data.title ? {
        title: heroBlock.data.title,
      } : {}),
      ...(heroBlock && heroBlock.type === 'hero' && (heroBlock.data.subtitle || heroBlock.data.description) ? {
        description: heroBlock.data.subtitle || heroBlock.data.description,
      } : {}),
      // ⭐ Sync hero image to project thumbnail (always, even if empty to allow removal)
      thumbnail: heroBlock && heroBlock.type === 'hero' ? (heroBlock.data.imageUrl || null) : currentProject.thumbnail,
    };
    
    console.log('[Template Editor] ⭐ About to save:', {
      template_type: updatedProject.template_type,
      blocks_count: updatedProject.blocks?.length,
      title: updatedProject.title,
      description: updatedProject.description,
      thumbnail: updatedProject.thumbnail ? `✅ ${updatedProject.thumbnail.substring(0, 50)}...` : '❌ No image'
    });

    // Update project in array
    portfolioData.projects[projectIndex] = updatedProject;
    
    // Save entire portfolio back
    try {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      console.log('[Template Editor] ✅ Saved successfully to localStorage');
      
      // Verify it was saved
      const verification = JSON.parse(localStorage.getItem('portfolioData') || '{}');
      const savedProject = verification.projects?.find((p: any) => p.id === projectId);
      console.log('[Template Editor] ✅ Verification after save:', {
        template_type: savedProject?.template_type,
        blocks_count: savedProject?.blocks?.length,
        thumbnail: savedProject?.thumbnail ? `✅ ${savedProject.thumbnail.substring(0, 50)}...` : '❌ No thumbnail',
        hero_imageUrl: savedProject?.blocks?.[0]?.data?.imageUrl ? `✅ ${savedProject.blocks[0].data.imageUrl.substring(0, 50)}...` : '❌ No hero image'
      });
    } catch (error) {
      console.error('[Template Editor] ❌ Save failed:', error);
      setSaveStatus('error');
      return;
    }
    
    // Save to database as well
    (async () => {
      try {
        const { getCurrentUser } = await import('@/lib/supabase');
        const { saveProjectMetadata, saveProjectBlocks } = await import('@/lib/detail-page-db');
        const user = await getCurrentUser();
        
        if (user) {
          // Save template metadata (including thumbnail)
          const metadataResult = await saveProjectMetadata(user.id, projectId, {
            title: updatedProject.title,
            description: updatedProject.description,
            tags: updatedProject.tags,
            link: updatedProject.link,
            template_type: updatedProject.template_type,
            thumbnail_url: updatedProject.thumbnail,  // ⭐ Save thumbnail to database
          });
          
          if (metadataResult.success) {
            console.log('[Template Editor] ✅ Metadata saved to database');
          }
          
          // Save template blocks
          const blocksResult = await saveProjectBlocks(user.id, projectId, updatedProject.blocks);
          
          if (blocksResult.success) {
            console.log('[Template Editor] ✅ Blocks saved to database');
          }
        }
      } catch (error) {
        console.warn('[Template Editor] ⚠️ Database save failed (data saved locally):', error);
      }
    })();
    
    // Also update local state
    setProjectData(updatedProject);
    
    setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
  }, [projectData, selectedTemplate, blocks, projectId]);

  // Track previous data to detect actual changes
  const previousBlocksRef = useRef<string>('');
  const previousTemplateRef = useRef<string | null>(null);

  // Debounced auto-save
  useEffect(() => {
    if (flowState !== 'editing') return;
    if (!selectedTemplate) return; // Don't save if no template selected
    if (blocks.length === 0) return; // Don't save if no blocks yet

    // Only trigger save if blocks OR template actually changed
    const currentBlocksStr = JSON.stringify(blocks);
    const blockChanged = currentBlocksStr !== previousBlocksRef.current;
    const templateChanged = selectedTemplate !== previousTemplateRef.current;
    
    if (!blockChanged && !templateChanged) {
      return; // No actual change, skip save
    }

    console.log('[Template Editor] Data changed, scheduling save...', {
      blockChanged,
      templateChanged,
      selectedTemplate
    });
    
    previousBlocksRef.current = currentBlocksStr;
    previousTemplateRef.current = selectedTemplate;
    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProject();
    }, 500); // 500ms for faster saves

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, flowState, selectedTemplate]); // Added selectedTemplate to dependencies

  // Handle template selection - go directly to editing
  const handleTemplateSelect = (templateType: TemplateType) => {
    const previousTemplate = selectedTemplate;
    setSelectedTemplate(templateType);
    
    // Get template config and create all blocks immediately
    const templateConfig = getTemplateConfig(templateType);
    if (templateConfig) {
      let newBlocks: TemplateBlock[];
      
      // If changing template and have existing blocks, try to preserve content
      if (previousTemplate && blocks.length > 0) {
        newBlocks = templateConfig.sections.map(section => {
          // Try to find matching block from existing blocks
          const existingBlock = blocks.find(b => b.type === section.blockType);
          
          if (existingBlock) {
            // Reuse existing block with content, but update section metadata
            return {
              ...existingBlock,
              sectionLabel: section.label,
              sectionDescription: section.description,
            };
          } else {
            // Create new empty block with section metadata
            return createEmptyBlock(section.blockType, {
              label: section.label,
              description: section.description,
            });
          }
        });
      } else {
        // First time selecting template - create all new blocks with section metadata
        newBlocks = templateConfig.sections.map(section => 
          createEmptyBlock(section.blockType, {
            label: section.label,
            description: section.description,
          })
        );

        // Pre-fill hero block with project data from the card
        const heroIndex = newBlocks.findIndex(b => b?.type === 'hero');
        if (heroIndex !== -1 && projectData && newBlocks[heroIndex]) {
          const heroBlock = newBlocks[heroIndex] as any;
          newBlocks[heroIndex] = {
            ...heroBlock,
            data: {
              ...heroBlock.data,
              title: projectData.title || '',
              subtitle: projectData.description || '',
              imageUrl: projectData.thumbnail || '',  // ⭐ Card thumbnail → Hero image
              // Pre-fill link in meta if available
              ...(projectData.link ? {
                meta: {
                  ...heroBlock.data.meta,
                }
              } : {}),
            },
          };
          
          console.log('[Template Editor] ✅ Pre-filled hero block with project data:', {
            title: projectData.title,
            subtitle: projectData.description,
            thumbnail: projectData.thumbnail,
            heroImageUrl: (newBlocks[heroIndex] as any).data?.imageUrl
          });
        }
      }
      
      setBlocks(newBlocks.filter(Boolean));
      
      // In edit mode, all sections are always visible, so we can set all as expanded for preview mode
      const allIndexes = newBlocks.map((_, i) => i);
      setExpandedSections(new Set(allIndexes));
      
      // Go directly to editing
      setFlowState('editing');
      
      console.log('[Template Editor] ✅ Template selected:', templateType);
      console.log('[Template Editor] 📝 Created blocks:', newBlocks.length);
      
      // Auto-save will trigger automatically via useEffect watching blocks and selectedTemplate
    }
  };

  // Handle block changes
  const handleBlockChange = (index: number, updatedBlock: TemplateBlock) => {
    console.log('[Project Editor] Block changed at index', index, ':', updatedBlock.type);
    if (updatedBlock.type === 'hero') {
      console.log('[Project Editor] Hero block data:', {
        title: updatedBlock.data.title,
        subtitle: updatedBlock.data.subtitle,
        description: updatedBlock.data.description,
        imageUrl: updatedBlock.data.imageUrl,
      });
    }
    
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);

    // Mark as saved if has content
    const hasContent = checkBlockHasContent(updatedBlock);
    if (hasContent) {
      setSavedBlockIds(prev => new Set([...prev, updatedBlock.id]));
    }

    // If hero block changed, sync hero data to project metadata in real-time
    if (index === 0 && updatedBlock.type === 'hero' && projectData) {
      console.log('[Project Editor] 🔄 Syncing hero to project metadata:', {
        title: updatedBlock.data.title,
        thumbnail: updatedBlock.data.imageUrl
      });
      
      setProjectData({
        ...projectData,
        title: updatedBlock.data.title || projectData.title,
        thumbnail: updatedBlock.data.imageUrl || undefined,  // ⭐ Sync hero image to thumbnail immediately
      });
    }
  };

  // Check if block has content
  const checkBlockHasContent = (block: TemplateBlock): boolean => {
    switch (block.type) {
      case 'hero':
        return !!block.data.title;
      case 'richtext':
        return !!block.data.body;
      case 'callout':
        return !!block.data.body;
      case 'bullets':
        return block.data.bullets.some((b: string) => b.trim().length > 0);
      case 'steps':
        return block.data.steps.some((s: any) => s.title.trim().length > 0);
      case 'feature_grid':
        return block.data.items.some((i: any) => i.title.trim().length > 0);
      case 'gallery':
        return block.data.images.length > 0;
      case 'metrics':
        return block.data.metrics.some((m: any) => m.value.trim().length > 0);
      case 'embed':
        return !!block.data.url;
      default:
        return false;
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex(b => b.id === active.id);
    const newIndex = blocks.findIndex(b => b.id === over.id);

    if (oldIndex === 0 || newIndex === 0) return; // Prevent moving hero

    setBlocks(arrayMove(blocks, oldIndex, newIndex));
  };

  // Toggle section
  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  // Add new block
  const handleAddBlock = (blockType: string) => {
    const newBlock = createEmptyBlock(blockType, {
      label: blockType.charAt(0).toUpperCase() + blockType.slice(1).replace('_', ' '),
      description: 'Custom section',
    });
    if (newBlock) {
      setBlocks([...blocks, newBlock]);
      setExpandedSections(prev => new Set([...prev, blocks.length]));
    }
  };

  // Delete block
  const handleDeleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  const templateConfig = selectedTemplate ? getTemplateConfig(selectedTemplate) : undefined;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Top Bar - Always Visible */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Breadcrumb + Title + Template Badge */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => router.push(`/editor?mode=${viewMode}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to editor"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Portfolio</span>
                <span>/</span>
                <input
                  type="text"
                  value={projectData?.title || ''}
                  onChange={(e) => setProjectData(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="font-medium text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                  placeholder="Project Name"
                />
                <span>/</span>
                <span>Editor</span>
              </div>
              
              {/* Template Badge with Change Button */}
              {selectedTemplate && templateConfig && (
                <div className="flex items-center gap-2 ml-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg">
                    <span className="text-lg">{templateConfig.icon}</span>
                    <span className="text-xs font-medium text-purple-900">{templateConfig.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Change template? Your content will be preserved where possible.')) {
                        setFlowState('select-template');
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Center: Save Status */}
            {flowState === 'editing' && (
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === 'saved' && (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Saved</span>
                  </>
                )}
                {saveStatus === 'saving' && (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Saving...</span>
                  </>
                )}
                {(saveStatus === 'idle' || saveStatus === 'error') && (
                  <span className="text-gray-400">Unsaved changes</span>
                )}
              </div>
            )}

            {/* Right: View Controls */}
            {flowState === 'editing' && (
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'edit'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'preview'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>

                {/* Device Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setDeviceMode('desktop')}
                    className={`p-1.5 rounded-md transition-all ${
                      deviceMode === 'desktop'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Desktop"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeviceMode('mobile')}
                    className={`p-1.5 rounded-md transition-all ${
                      deviceMode === 'mobile'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Mobile"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State - Prevents flash of template selector */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading project...</p>
            </div>
          </div>
        )}

        {/* STEP 1: Select Template */}
        {!isLoading && flowState === 'select-template' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {blocks.length > 0 ? 'Change Template' : 'Choose a Template'}
              </h1>
              <p className="text-lg text-gray-600">
                {blocks.length > 0 
                  ? 'Select a new template - your existing content will be preserved where possible'
                  : 'Start with a professional template or build from scratch'
                }
              </p>
            </div>
            
            {/* Info Banner when changing template */}
            {blocks.length > 0 && (
              <div className="mb-6 max-w-2xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  💡 Content Preservation
                </p>
                <p className="text-xs text-blue-700">
                  When you select a new template, we'll keep your existing content and match it to similar sections in the new template.
                </p>
              </div>
            )}
            
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
            />
          </div>
        )}

        {/* STEP 2: Editing */}
        {!isLoading && flowState === 'editing' && (
          <div className="animate-in fade-in duration-500">
            {/* Main Editor Area - Notion-style document layout */}
            <div className={`${deviceMode === 'mobile' ? 'max-w-md mx-auto' : 'max-w-[960px]'} mx-auto w-full bg-white px-8 py-12 min-h-screen`}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map(b => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div>
                    {blocks.map((block, index) => (
                      <div key={block.id}>
                        <SortableSection
                          block={block}
                          index={index}
                          isExpanded={expandedSections.has(index)}
                          isSaved={savedBlockIds.has(block.id)}
                          viewMode={viewMode}
                          onToggle={() => toggleSection(index)}
                          onChange={(updated) => handleBlockChange(index, updated)}
                          onDelete={() => handleDeleteBlock(index)}
                        />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add Block Button - Minimal */}
              {viewMode === 'edit' && (
                <button
                  onClick={() => setShowSlashMenu(true)}
                  className="mt-8 py-2 w-full text-left text-gray-400 hover:text-gray-600 text-sm transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add block or type <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">/</kbd></span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slash Command Menu */}
      <SlashCommandMenu
        isOpen={showSlashMenu}
        onClose={() => setShowSlashMenu(false)}
        onSelect={(blockType) => {
          handleAddBlock(blockType);
          setShowSlashMenu(false);
        }}
      />
    </div>
  );
}

