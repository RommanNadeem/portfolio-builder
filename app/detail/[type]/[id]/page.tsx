'use client';

import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Plus, Check, X, ChevronRight, ChevronDown, ChevronUp,
  Eye, Pencil, Monitor, Smartphone, CheckCircle2, Link as LinkIcon, Trash2, GripVertical
} from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TemplateType, TemplateBlock, HeroBlock } from '@/app/editor/templates/types';
import { TEMPLATE_CONFIGS, getTemplateConfig, createEmptyBlock } from '@/app/editor/templates/configs';
import { TemplateRenderer } from '@/app/editor/templates/TemplateRenderer';

const COLOR_STYLES: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
  gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', hoverBg: 'hover:bg-gray-100' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hoverBg: 'hover:bg-blue-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hoverBg: 'hover:bg-purple-100' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', hoverBg: 'hover:bg-pink-100' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hoverBg: 'hover:bg-green-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hoverBg: 'hover:bg-indigo-100' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', hoverBg: 'hover:bg-slate-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hoverBg: 'hover:bg-amber-100' },
};

const BLOCK_TYPE_OPTIONS = [
  { type: 'richtext', label: 'Rich Text', icon: '📝', description: 'Long-form content and paragraphs' },
  { type: 'callout', label: 'Callout', icon: 'ℹ️', description: 'Highlighted information box' },
  { type: 'bullets', label: 'Bullet List', icon: '•', description: 'Key points and takeaways' },
  { type: 'steps', label: 'Steps', icon: '1️⃣', description: 'Sequential process or methodology' },
  { type: 'feature_grid', label: 'Feature Grid', icon: '⚡', description: 'Grid of features or highlights' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️', description: 'Image grid or carousel' },
  { type: 'metrics', label: 'Metrics', icon: '📊', description: 'Key numbers and statistics' },
  { type: 'embed', label: 'Embed', icon: '🎬', description: 'Videos, Figma, or PDFs' },
];

// Helper function to get icon for block type
function getBlockIcon(blockType: string): string {
  const icons: Record<string, string> = {
    hero: '🎯',
    richtext: '📝',
    callout: '💡',
    bullets: '📋',
    steps: '🔢',
    feature_grid: '⚡',
    gallery: '🖼️',
    metrics: '📊',
    embed: '🎬',
  };
  return icons[blockType] || '📄';
}

// Helper function to get contextual hints for each block type
function getBlockHint(blockType: string, label?: string): string {
  const hints: Record<string, string> = {
    hero: 'Add your project title, subtitle, description, and key details to set the stage',
    richtext: 'Write detailed paragraphs to explain this section. You can format your text and add emphasis.',
    callout: 'Highlight important information like key quotes, insights, or objectives in a visually distinct box.',
    bullets: 'List key points, takeaways, or highlights. Great for summarizing important information.',
    steps: 'Break down your process into clear, sequential steps. Perfect for showing methodology or workflows.',
    feature_grid: 'Showcase multiple features, elements, or highlights in a grid layout with icons and descriptions.',
    gallery: 'Add images, screenshots, or visuals to illustrate your work. Supports both grid and carousel layouts.',
    metrics: 'Display impactful numbers and statistics that demonstrate results and outcomes.',
    embed: 'Embed external content like Figma designs, videos, or PDFs directly into your portfolio.',
  };
  return hints[blockType] || `Add content for ${label || 'this section'}`;
}

// Memoized Sortable Section Component to prevent re-renders during typing
interface SortableSectionProps {
  block: TemplateBlock;
  index: number;
  selectedTemplate: TemplateType | null;
  expandedSections: Set<number>;
  editingSectionId: string | null;
  savedSections: Set<string>;
  viewMode: 'edit' | 'preview';
  detailData: any;
  heroBlock: HeroBlock | undefined;
  templateBlocks: TemplateBlock[];
  toggleSection: (index: number) => void;
  setEditingSectionId: (id: string | null) => void;
  deleteSection: (index: number) => void;
  updateHeroField: (field: string, value: string) => void;
  updateProjectData: (updates: any) => void;
  saveBlocks: (blocks: TemplateBlock[]) => void;
  markSectionAsSaved: (id: string) => void;
}

const SortableSection = memo(({ 
  block, 
  index, 
  selectedTemplate,
  expandedSections,
  editingSectionId,
  savedSections,
  viewMode,
  detailData,
  heroBlock,
  templateBlocks,
  toggleSection,
  setEditingSectionId,
  deleteSection,
  updateHeroField,
  updateProjectData,
  saveBlocks,
  markSectionAsSaved,
}: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: block.id,
    disabled: index === 0 // Disable dragging for Hero section
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionConfig = selectedTemplate ? getTemplateConfig(selectedTemplate)?.sections[index] : undefined;
  const isExpanded = expandedSections.has(index);
  const isHero = index === 0 && block.type === 'hero';
  const isEditing = editingSectionId === block.id;
  const isSaved = savedSections.has(block.id);
  const [hovering, setHovering] = useState(false);

  // Determine render mode: 
  // - If editing: show edit mode
  // - If saved and not editing: show preview mode
  // - If not saved and not editing: show empty/placeholder
  const shouldShowEditMode = isEditing;
  const shouldShowPreviewMode = isSaved && !isEditing && viewMode === 'edit';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      id={`section-${index}`} 
      className={`bg-white rounded-lg border ${
        isSaved ? 'border-green-200 bg-green-50/20' : 'border-gray-200'
      } overflow-hidden transition-all ${
        isDragging ? 'ring-2 ring-purple-500 shadow-lg' : 'shadow-sm hover:shadow-md'
      } ${
        !isExpanded ? 'hover:border-purple-300 cursor-pointer' : ''
      }`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Section Header */}
      <div 
        className={`flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors ${
          isSaved && !isExpanded ? 'bg-green-50/50' : ''
        }`}
        onClick={() => !isExpanded && toggleSection(index)}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Drag Handle - only show for non-hero sections */}
          {index !== 0 && (
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </div>
          )}
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
            {index + 1}
          </div>
          <button
            onClick={() => toggleSection(index)}
            className="flex-1 text-left"
          >
            {/* Show contextual hint based on section state */}
            {!isSaved ? (
              <>
                <h3 className="font-semibold text-gray-900">{sectionConfig?.label || block.type}</h3>
                <p className="text-sm text-blue-600 font-medium">✨ Click to add {sectionConfig?.description?.toLowerCase() || 'content'}</p>
              </>
            ) : !isEditing ? (
              <>
                <h3 className="font-medium text-gray-700">{sectionConfig?.label || block.type}</h3>
                <p className="text-xs text-green-600">✓ {sectionConfig?.description || 'Content added'}</p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900">{sectionConfig?.label || block.type}</h3>
                <p className="text-xs text-gray-500">{sectionConfig?.description || 'Custom section'}</p>
              </>
            )}
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Edit Button - Show when saved, not editing, hovering, and in editor view mode */}
          {isSaved && !isEditing && hovering && isExpanded && viewMode === 'edit' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingSectionId(block.id);
              }}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          
          {/* Delete (only for non-hero sections) */}
          {index !== 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSection(index);
              }}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => toggleSection(index)}
            className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-6 py-6 border-t border-gray-100">
          {isHero && heroBlock ? (
            // Hero section - same workflow as other sections
            <div className="relative">
              {isEditing ? (
                // Edit mode for Hero
                <>
                  <div className="space-y-6">
                    <input
                      type="text"
                      value={detailData?.title || ''}
                      onChange={(e) => updateHeroField('title', e.target.value)}
                      placeholder="Untitled"
                      className="w-full text-5xl font-bold text-gray-900 border-0 bg-transparent focus:outline-none placeholder:text-gray-300 px-0 py-0"
                      style={{ lineHeight: '1.1' }}
                    />

                    <input
                      type="text"
                      value={heroBlock.data?.subtitle || ''}
                      onChange={(e) => updateHeroField('subtitle', e.target.value)}
                      placeholder="Add a subtitle..."
                      className="w-full text-2xl text-gray-600 border-0 bg-transparent focus:outline-none placeholder:text-gray-300 px-0 py-0"
                    />

                    <textarea
                      value={detailData?.description || ''}
                      onChange={(e) => updateHeroField('description', e.target.value)}
                      placeholder="Add a description..."
                      rows={3}
                      className="w-full text-lg text-gray-700 border-0 bg-transparent focus:outline-none placeholder:text-gray-300 resize-none px-0 py-0"
                    />

                    {/* Hero Image */}
                    {heroBlock.data?.imageUrl ? (
                      <div className="relative group">
                        <img src={heroBlock.data.imageUrl} alt="Hero" className="w-full rounded-lg" />
                        <button
                          onClick={() => updateHeroField('imageUrl', '')}
                          className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="url"
                          value={heroBlock.data?.imageUrl || ''}
                          onChange={(e) => updateHeroField('imageUrl', e.target.value)}
                          placeholder="Paste image URL..."
                          className="w-full text-sm text-gray-500 text-center border-0 bg-transparent focus:outline-none placeholder:text-gray-400"
                        />
                      </div>
                    )}

                    {/* Metadata Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={detailData?.role || ''}
                        onChange={(e) => updateHeroField('meta.role', e.target.value)}
                        placeholder="Your role..."
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                      />
                      <input
                        type="url"
                        value={detailData?.link || ''}
                        onChange={(e) => updateProjectData({ link: e.target.value })}
                        placeholder="Project link..."
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                      />
                    </div>

                    <input
                      type="text"
                      value={(detailData?.tags || []).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                        updateProjectData({ tags });
                      }}
                      placeholder="Tags (comma separated)..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                    />
                    
                    {detailData?.tags && detailData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {detailData.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Additional Hero Meta */}
                    <div className="flex flex-wrap gap-3 text-sm pt-4 border-t border-gray-100">
                      <input
                        type="text"
                        value={heroBlock.data?.meta?.timeline || ''}
                        onChange={(e) => updateHeroField('meta.timeline', e.target.value)}
                        placeholder="Timeline..."
                        className="border-0 border-b border-transparent hover:border-gray-300 focus:border-purple-500 bg-transparent focus:outline-none px-0 py-1 text-sm placeholder:text-gray-400"
                      />
                      <span className="text-gray-300">•</span>
                      <input
                        type="text"
                        value={heroBlock.data?.meta?.year || ''}
                        onChange={(e) => updateHeroField('meta.year', e.target.value)}
                        placeholder="Year..."
                        className="border-0 border-b border-transparent hover:border-gray-300 focus:border-purple-500 bg-transparent focus:outline-none px-0 py-1 text-sm placeholder:text-gray-400"
                      />
                      <span className="text-gray-300">•</span>
                      <input
                        type="text"
                        value={heroBlock.data?.meta?.team || ''}
                        onChange={(e) => updateHeroField('meta.team', e.target.value)}
                        placeholder="Team..."
                        className="border-0 border-b border-transparent hover:border-gray-300 focus:border-purple-500 bg-transparent focus:outline-none px-0 py-1 text-sm placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Add to Page Button for Hero */}
                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setEditingSectionId(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => markSectionAsSaved(block.id)}
                      className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      {isSaved ? 'Update Section' : 'Add to Page'}
                    </button>
                  </div>
                </>
              ) : (
                // Preview mode for Hero - show rendered content
                <div>
                  {heroBlock.data?.logoUrl && (
                    <img src={heroBlock.data.logoUrl} alt="Logo" className="h-12 mb-4" />
                  )}
                  {detailData?.title && (
                    <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ lineHeight: '1.1' }}>
                      {detailData.title}
                    </h1>
                  )}
                  {heroBlock.data?.subtitle && (
                    <p className="text-2xl text-gray-600 mb-4">{heroBlock.data.subtitle}</p>
                  )}
                  {detailData?.description && (
                    <p className="text-lg text-gray-700 mb-4">{detailData.description}</p>
                  )}
                  {heroBlock.data?.imageUrl && (
                    <img src={heroBlock.data.imageUrl} alt="Hero" className="w-full rounded-lg mb-4" />
                  )}
                  {(detailData?.role || heroBlock.data?.meta?.timeline || heroBlock.data?.meta?.year || heroBlock.data?.meta?.team) && (
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      {detailData?.role && <span>{detailData.role}</span>}
                      {heroBlock.data?.meta?.timeline && (
                        <>
                          {detailData?.role && <span className="text-gray-300">•</span>}
                          <span>{heroBlock.data.meta.timeline}</span>
                        </>
                      )}
                      {heroBlock.data?.meta?.year && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>{heroBlock.data.meta.year}</span>
                        </>
                      )}
                      {heroBlock.data?.meta?.team && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>{heroBlock.data.meta.team}</span>
                        </>
                      )}
                    </div>
                  )}
                  {detailData?.tags && detailData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {detailData.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Other sections
            <div className="relative">
              {!isSaved && !isEditing ? (
                // Empty state - show helpful hints
                <div className="text-center py-12 px-6">
                  <div className="max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">{getBlockIcon(block.type)}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {sectionConfig?.description || 'Add Content'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-6">
                      {getBlockHint(block.type, sectionConfig?.label)}
                    </p>
                    <button
                      onClick={() => setEditingSectionId(block.id)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
                    >
                      Start Adding Content
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <TemplateRenderer
                    blocks={[block]}
                    onChange={(newBlocks) => {
                      console.log('[Detail Page] 📝 Block updated:', block.type, 'at index', index);
                      console.log('[Detail Page] 🔍 New block data:', newBlocks[0]);
                      const updatedBlocks = [...templateBlocks];
                      updatedBlocks[index] = newBlocks[0];
                      console.log('[Detail Page] 💾 Saving all blocks...');
                      saveBlocks(updatedBlocks);
                    }}
                    mode={shouldShowEditMode ? 'edit' : 'preview'}
                  />
                  
                  {/* Add to Page Button - Show when editing (not saved yet or clicked edit) */}
                  {isEditing && (
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setEditingSectionId(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => markSectionAsSaved(block.id)}
                        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        {isSaved ? 'Update Section' : 'Add to Page'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SortableSection.displayName = 'SortableSection';

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as string;
  const id = params.id as string;
  
  const [detailData, setDetailData] = useState<any>(null);
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<TemplateType | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null); // Track which section is being edited
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set()); // Track which sections have been "saved" to show preview style

  const isUsingTemplates = selectedTemplate !== null;
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );
  
  // Calculate completion progress based on saved sections
  const calculateProgress = () => {
    if (!isUsingTemplates || templateBlocks.length === 0) return 0;
    const totalSections = templateBlocks.length;
    const completedSections = savedSections.size;
    return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
  };

  const progress = calculateProgress();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode === 'preview' || mode === 'edit') {
      setViewMode(mode);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
    const storedData = localStorage.getItem('portfolioData');
    if (storedData) {
      const data = JSON.parse(storedData);
      let item: any = null;
      
          if (type === 'project') {
        item = (data.projects || []).find((p: any) => p.id === id);
      }
      
      if (item) {
        setDetailData(item);
            
            if (item.template_type) {
              setSelectedTemplate(item.template_type as TemplateType);
              if (item.blocks && Array.isArray(item.blocks)) {
                setTemplateBlocks(item.blocks);
                // Mark existing blocks with content as "saved"
                const savedIds = new Set<string>(
                  (item.blocks as TemplateBlock[])
                    .filter((block) => {
                      // Check if block has meaningful content
                      if (block.type === 'hero') return true;
                      if (block.type === 'richtext') return block.data?.body?.trim();
                      if (block.type === 'callout') return block.data?.body?.trim();
                      if (block.type === 'bullets') return block.data?.bullets?.some((b: string) => b.trim());
                      if (block.type === 'steps') return block.data?.steps?.some((s: any) => s.title?.trim());
                      if (block.type === 'feature_grid') return block.data?.items?.some((i: any) => i.title?.trim());
                      if (block.type === 'gallery') return block.data?.images?.length > 0;
                      if (block.type === 'metrics') return block.data?.metrics?.some((m: any) => m.value?.trim());
                      if (block.type === 'embed') return block.data?.url;
                      return false;
                    })
                    .map((block) => block.id)
                );
                setSavedSections(savedIds);
              }
            }
          }
        }

        // Load from Supabase
        if (type === 'project') {
          try {
            const { getCurrentUser } = await import('@/lib/supabase');
            const { supabase } = await import('@/lib/supabase');
            const user = await getCurrentUser();
            
            if (user) {
              const { data: projectData, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

              if (projectData && !error) {
                const freshItem = {
                  id: projectData.id,
                  title: projectData.title,
                  description: projectData.description,
                  tags: projectData.tags || [],
                  link: projectData.link,
                  role: projectData.role,
                  template_type: projectData.template_type,
                  blocks: projectData.blocks || []
                };

                setDetailData(freshItem);
                
                if (freshItem.template_type) {
                  setSelectedTemplate(freshItem.template_type as TemplateType);
                  setTemplateBlocks(freshItem.blocks);
                  // Mark existing blocks with content as "saved"
                  const savedIds = new Set<string>(
                    (freshItem.blocks as TemplateBlock[])
                      .filter((block) => {
                        // Check if block has meaningful content
                        if (block.type === 'hero') return true;
                        if (block.type === 'richtext') return block.data?.body?.trim();
                        if (block.type === 'callout') return block.data?.body?.trim();
                        if (block.type === 'bullets') return block.data?.bullets?.some((b: string) => b.trim());
                        if (block.type === 'steps') return block.data?.steps?.some((s: any) => s.title?.trim());
                        if (block.type === 'feature_grid') return block.data?.items?.some((i: any) => i.title?.trim());
                        if (block.type === 'gallery') return block.data?.images?.length > 0;
                        if (block.type === 'metrics') return block.data?.metrics?.some((m: any) => m.value?.trim());
                        if (block.type === 'embed') return block.data?.url;
                        return false;
                      })
                      .map((block) => block.id)
                  );
                  setSavedSections(savedIds);
                }

                if (storedData) {
                  const data = JSON.parse(storedData);
                  data.projects = (data.projects || []).map((p: any) =>
                    p.id === id ? freshItem : p
                  );
                  localStorage.setItem('portfolioData', JSON.stringify(data));
                }
              }
            }
          } catch (error) {
            console.warn('Could not load from Supabase:', error);
          }
        }
        
        if (!storedData) {
        router.push('/editor');
      }
      } catch (error) {
        console.error('Error loading:', error);
        router.push('/editor');
    }
    };
    
    loadData();
  }, [type, id, router]);

  const debouncedSaveToDatabase = useCallback(async (data: any, itemType: 'metadata' | 'blocks', payload: any) => {
    if (type !== 'project') return;
    
    try {
      const { getCurrentUser } = await import('@/lib/supabase');
      const { saveProjectMetadata, saveProjectBlocks } = await import('@/lib/detail-page-db');
      const user = await getCurrentUser();
      
      if (user) {
        if (itemType === 'metadata') {
          console.log('[Detail Page] 💾 Saving metadata to database:', payload);
          const result = await saveProjectMetadata(user.id, id, payload);
          if (result.success) {
            console.log('[Detail Page] ✅ Metadata saved to database');
          } else {
            console.error('[Detail Page] ❌ Metadata save failed:', result.error);
          }
        } else {
          console.log('[Detail Page] 💾 Saving blocks to database. Count:', payload.length);
          const result = await saveProjectBlocks(user.id, id, payload);
          if (result.success) {
            console.log('[Detail Page] ✅ Blocks saved to database');
          } else {
            console.error('[Detail Page] ❌ Blocks save failed:', result.error);
          }
        }
      }
    } catch (error) {
      console.warn('[Detail Page] ⚠️ Database sync failed (data saved locally):', error);
    }
  }, [type, id]);

  const updateProjectData = async (updates: any) => {
    setSaveStatus('saving');
    const storedData = localStorage.getItem('portfolioData');
    if (storedData && detailData) {
      const data = JSON.parse(storedData);
      
      if (type === 'project') {
        data.projects = (data.projects || []).map((p: any) =>
          p.id === id ? { ...p, ...updates } : p
        );
      }
      
      localStorage.setItem('portfolioData', JSON.stringify(data));
      setDetailData((prev: any) => ({ ...prev, ...updates }));
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        await debouncedSaveToDatabase(data, 'metadata', updates);
        setSaveStatus('saved');
      }, 500);
    }
  };

  const saveBlocks = async (newBlocks: TemplateBlock[]) => {
    setSaveStatus('saving');
    const storedData = localStorage.getItem('portfolioData');
    if (storedData && detailData) {
      const data = JSON.parse(storedData);
      
      if (type === 'project') {
        data.projects = (data.projects || []).map((p: any) =>
          p.id === id ? { ...p, blocks: newBlocks } : p
        );
      }
      
      localStorage.setItem('portfolioData', JSON.stringify(data));
      setTemplateBlocks(newBlocks);
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        await debouncedSaveToDatabase(data, 'blocks', newBlocks);
        setSaveStatus('saved');
      }, 500);
    }
  };

  const handleTemplateExpand = (templateType: TemplateType) => {
    setExpandedTemplate(expandedTemplate === templateType ? null : templateType);
  };

  const handleUseTemplate = (templateType: TemplateType) => {
    setSelectedTemplate(templateType);
    setExpandedTemplate(null);
    
    const config = getTemplateConfig(templateType);
    if (config && config.sections.length > 0) {
      const initialBlocks: TemplateBlock[] = [];
      
      config.sections.forEach((section, index) => {
        const block = createEmptyBlock(section.blockType);
      if (block) {
          // If it's the hero section, populate it with existing project data
          if (index === 0 && block.type === 'hero') {
            block.data = {
              ...block.data,
              title: detailData?.title || '',
              description: detailData?.description || '',
              meta: {
                ...block.data.meta,
                role: detailData?.role || '',
              }
            };
          }
          initialBlocks.push(block);
        }
      });
      
      setTemplateBlocks(initialBlocks);
      saveBlocks(initialBlocks);
      
      // Start with Hero in edit mode, mark nothing as saved initially
      if (initialBlocks.length > 0) {
        setEditingSectionId(initialBlocks[0].id); // Hero starts in edit mode
        setExpandedSections(new Set([0])); // Expand Hero section
        setSavedSections(new Set()); // Nothing saved yet
      }
    }
    
    updateProjectData({ template_type: templateType });
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      await updateProjectData({ published: true, published_at: new Date().toISOString() });
      alert('🎉 Your project has been published successfully!');
      setTimeout(() => {
        router.push(`/editor?mode=${viewMode}`);
      }, 1000);
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const updateHeroField = (field: string, value: string) => {
    console.log('[Detail Page] 📝 Updating hero field:', field, '=', value);
    const updatedBlocks = [...templateBlocks];
    const heroBlock = updatedBlocks[0] as HeroBlock;
    
    if (field === 'title' || field === 'description') {
      heroBlock.data = { ...heroBlock.data, [field]: value };
      updateProjectData({ [field]: value });
    } else if (field.startsWith('meta.')) {
      const metaField = field.split('.')[1];
      heroBlock.data = {
        ...heroBlock.data,
        meta: { ...heroBlock.data.meta, [metaField]: value }
      };
      if (metaField === 'role') {
        updateProjectData({ role: value });
      }
    } else {
      // Handle all other fields including subtitle
      heroBlock.data = { ...heroBlock.data, [field]: value };
      console.log('[Detail Page] ✏️ Hero block updated with', field, ':', value);
    }
    
    console.log('[Detail Page] 💾 Saving blocks with updated hero data...');
    saveBlocks(updatedBlocks);
  };

  // Drag and drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = templateBlocks.findIndex(b => b.id === active.id);
    const newIndex = templateBlocks.findIndex(b => b.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    const updatedBlocks = [...templateBlocks];
    const [movedBlock] = updatedBlocks.splice(oldIndex, 1);
    updatedBlocks.splice(newIndex, 0, movedBlock);
    
    saveBlocks(updatedBlocks);
    
    // Update expanded sections
    const newExpanded = new Set<number>();
    expandedSections.forEach(idx => {
      if (idx === oldIndex) newExpanded.add(newIndex);
      else if (idx > oldIndex && idx <= newIndex) newExpanded.add(idx - 1);
      else if (idx < oldIndex && idx >= newIndex) newExpanded.add(idx + 1);
      else newExpanded.add(idx);
    });
    setExpandedSections(newExpanded);
  };

  // Add new section
  const addSection = (blockType: string) => {
    const newBlock = createEmptyBlock(blockType);
    if (newBlock) {
      const updatedBlocks = [...templateBlocks, newBlock];
      saveBlocks(updatedBlocks);
      setShowBlockSelector(false);
      
      // Expand the newly added section and set it to edit mode (not saved yet)
      setExpandedSections(new Set([...expandedSections, templateBlocks.length]));
      setEditingSectionId(newBlock.id);
    }
  };

  // Mark section as saved (switches to preview-style render)
  const markSectionAsSaved = (sectionId: string) => {
    setSavedSections(prev => new Set([...prev, sectionId]));
    setEditingSectionId(null);
    
    // Automatically open the next unsaved section
    const currentIndex = templateBlocks.findIndex(b => b.id === sectionId);
    if (currentIndex !== -1) {
      // Find the next unsaved section
      for (let i = currentIndex + 1; i < templateBlocks.length; i++) {
        if (!savedSections.has(templateBlocks[i].id)) {
          setExpandedSections(new Set([i]));
          setEditingSectionId(templateBlocks[i].id);
          // Scroll to the next section
          setTimeout(() => {
            document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
          break;
        }
      }
    }
  };

  // Delete section
  const deleteSection = (index: number) => {
    if (index === 0) {
      alert('Cannot delete the Hero section');
      return;
    }
    
    if (confirm('Are you sure you want to delete this section?')) {
      const updatedBlocks = templateBlocks.filter((_, i) => i !== index);
      saveBlocks(updatedBlocks);
      
      // Update expanded sections
      const newExpanded = new Set<number>();
      expandedSections.forEach(idx => {
        if (idx < index) newExpanded.add(idx);
        else if (idx > index) newExpanded.add(idx - 1);
      });
      setExpandedSections(newExpanded);
    }
  };

  const isMobile = previewMode === 'mobile';

  if (!detailData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const heroBlock = templateBlocks[0] as HeroBlock | undefined;

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex">
      {/* Left Sidebar - Progress Checklist */}
      {viewMode === 'edit' && isUsingTemplates && (
        <div className="w-80 border-r border-gray-200 bg-white/80 backdrop-blur-sm flex-shrink-0 flex flex-col h-screen overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {progress}%
              </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Setup Progress</h2>
                  <p className="text-xs text-gray-500">Complete your project</p>
            </div>
          </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
        </div>
      </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Template Sections
              </h3>
              {getTemplateConfig(selectedTemplate)?.sections.map((section, idx) => {
                const block = templateBlocks[idx];
                const isComplete = block && savedSections.has(block.id);

                return (
                  <div
                    key={section.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isComplete
                        ? 'bg-green-50 border-green-300 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      setExpandedSections(new Set([idx]));
                      const element = document.getElementById(`section-${idx}`);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold leading-tight ${isComplete ? 'text-gray-900' : 'text-gray-700'}`}>
                          {section.label}
                        </h4>
                        <p className={`text-xs mt-0.5 leading-tight ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
                          {isComplete ? '✓ Content added' : `Click to add ${section.description?.toLowerCase()}`}
                        </p>
                        {section.required && !isComplete && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Breadcrumbs */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <button
                onClick={() => router.push(`/editor?mode=${viewMode}`)}
                className="hover:text-gray-900 transition-colors"
              >
                Portfolio
              </button>
              <ChevronRight className="w-4 h-4" />
            <button
                onClick={() => router.push(`/editor?mode=${viewMode}`)}
                className="hover:text-gray-900 transition-colors"
                >
                Projects
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{detailData?.title || 'Untitled'}</span>
          </div>

          <div className="flex items-center justify-between">
              {/* Left - Back + Template Badge */}
            <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/editor?mode=${viewMode}`)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </button>
                
                {isUsingTemplates && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full">
                    <div className="text-sm">{getTemplateConfig(selectedTemplate)?.icon}</div>
                    <span className="text-xs font-medium text-purple-700">
                      {getTemplateConfig(selectedTemplate)?.name}
                    </span>
            </div>
                )}
            </div>

              {/* Right - Save Status + View Toggles */}
              <div className="flex items-center gap-4">
                {/* Save Status */}
                <div className="text-xs">
              {saveStatus === 'saving' ? (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-blue-700 font-medium">Saving</span>
                    </span>
        ) : (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-green-700 font-medium">Saved</span>
                    </span>
                  )}
                </div>
                
                {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    viewMode === 'edit'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                    </button>
                    <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    viewMode === 'preview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                    </button>
                </div>
                
                {/* Preview Mode Toggle */}
              {viewMode === 'preview' && (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded transition-all ${
                      previewMode === 'desktop'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded transition-all ${
                      previewMode === 'mobile'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
              )}
                </div>
                  </div>
                </div>
              </div>
              
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
        {viewMode === 'edit' ? (
            <div className="max-w-6xl mx-auto px-8 py-12">
              {isUsingTemplates ? (
                // Template Editor with Drag & Drop
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={templateBlocks.map(b => b.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-6">
                      {templateBlocks.map((block, index) => (
                        <SortableSection 
                          key={block.id} 
                          block={block} 
                          index={index}
                          selectedTemplate={selectedTemplate}
                          expandedSections={expandedSections}
                          editingSectionId={editingSectionId}
                          savedSections={savedSections}
                          viewMode={viewMode}
                          detailData={detailData}
                          heroBlock={heroBlock}
                          templateBlocks={templateBlocks}
                          toggleSection={toggleSection}
                          setEditingSectionId={setEditingSectionId}
                          deleteSection={deleteSection}
                          updateHeroField={updateHeroField}
                          updateProjectData={updateProjectData}
                          saveBlocks={saveBlocks}
                          markSectionAsSaved={markSectionAsSaved}
                        />
                      ))}

                      {/* Add Section Button */}
                      <div className="mt-6">
                  <button
                          onClick={() => setShowBlockSelector(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white border-2 border-dashed border-gray-300 text-gray-700 font-medium rounded-2xl hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 transition-all shadow-sm hover:shadow-md"
                    >
                          <Plus className="w-5 h-5" />
                          Add Section
                  </button>
                </div>
                
                      {/* Publish Section */}
                      {progress > 0 && (
                        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
                        <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {progress === 100 ? '🎉 Ready to Publish!' : `${progress}% Complete - Keep Going!`}
              </h3>
              <p className="text-gray-600">
                {progress === 100 
                  ? 'Your project looks amazing! Click below to publish and make it visible.'
                  : `You've completed ${savedSections.size} of ${templateBlocks.length} sections. Add content to the remaining sections to publish.`
                }
              </p>
                            
                            {progress === 100 && (
                    <button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                              >
                                {isPublishing ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Publishing...
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-5 h-5" />
                                    Publish Project
                                  </>
                                )}
                    </button>
        )}
      </div>
          </div>
                    )}
            </div>
                  </SortableContext>
                </DndContext>
              ) : (
                // Template Selection
                <div>
                  {/* Project Info Card */}
                  <div className="mb-12 bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <input
              type="text"
                      value={detailData?.title || ''}
                      onChange={(e) => updateProjectData({ title: e.target.value })}
                      placeholder="Project Title"
                      className="w-full text-5xl font-bold text-gray-900 border-0 bg-transparent focus:outline-none placeholder:text-gray-300 px-0 py-0 mb-6"
                    />

                  <textarea
                    value={detailData?.description || ''}
                    onChange={(e) => updateProjectData({ description: e.target.value })}
                      placeholder="Add a brief description..."
                      rows={2}
                      className="w-full text-lg text-gray-700 border-0 bg-transparent focus:outline-none placeholder:text-gray-400 resize-none px-0 py-0 mb-4"
                    />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                        value={detailData?.role || ''}
                        onChange={(e) => updateProjectData({ role: e.target.value })}
                        placeholder="Your role..."
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                      />
            <input
                  type="url"
                        value={detailData?.link || ''}
                        onChange={(e) => updateProjectData({ link: e.target.value })}
                        placeholder="Project link..."
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                          />
          </div>

            <input
                type="text"
                      value={(detailData?.tags || []).join(', ')}
                  onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                        updateProjectData({ tags });
                      }}
                      placeholder="Tags (comma separated)..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                    />
                    
                    {detailData?.tags && detailData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {detailData.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {tag}
                          </span>
            ))}
                      </div>
        )}
                          </div>
                      
                  {/* Template Grid */}
                  <div className="text-center mb-12">
                    <div className="text-6xl mb-4">✨</div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      Choose a Template
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Select a professional template to structure your project
                    </p>
                          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TEMPLATE_CONFIGS.map((template) => {
                      const colors = COLOR_STYLES[template.color] || COLOR_STYLES.gray;
                      const isExpanded = expandedTemplate === template.id;

                      return (
                        <div
                          key={template.id}
                          className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                            isExpanded 
                              ? `${colors.border} shadow-2xl ring-4 ring-purple-100 scale-105` 
                              : `border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1`
                          }`}
                        >
            <button
                            onClick={() => handleTemplateExpand(template.id)}
                            className="w-full p-6 text-left"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="text-4xl">{template.icon}</div>
                              {isExpanded && (
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {template.description}
                            </p>
                            {template.sections.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {template.sections.length} sections
                      </div>
                    )}
                            </button>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="border-t border-gray-200 p-6 bg-gray-50">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Sections Include:</h4>
                              <div className="space-y-2 mb-4">
                                {template.sections.slice(0, 5).map((section) => (
                                  <div key={section.id} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                    <span className="text-gray-700">{section.label}</span>
                                    {section.required && (
                                      <span className="text-xs text-red-500">(Required)</span>
                      )}
                    </div>
                ))}
                                {template.sections.length > 5 && (
                                  <div className="text-xs text-gray-500 pl-4">
                                    +{template.sections.length - 5} more sections
                  </div>
                )}
          </div>
                      
                <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUseTemplate(template.id);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                              >
                                <Check className="w-5 h-5" />
                                Use This Template
                </button>
          </div>
                    )}
          </div>
                      );
                    })}
            </div>
              </div>
            )}
          </div>
        ) : (
            // Preview Mode
            <div className="bg-gray-100 py-12">
              <div className={`bg-white shadow-lg mx-auto rounded-3xl overflow-hidden ${
                isMobile ? 'w-full max-w-md px-8 py-12' : 'w-full max-w-6xl px-16 py-16'
              }`}>
                {/* Project Header - Shows Hero section data */}
                <div className="mb-16">
                  {/* Logo if present */}
                  {heroBlock?.data?.logoUrl && (
                    <img src={heroBlock.data.logoUrl} alt="Logo" className="h-16 mb-6" />
                  )}
                  
                <h1 className="font-bold text-gray-900 mb-6" style={{ fontSize: '60px', lineHeight: '1.1' }}>
                    {detailData?.title || 'Untitled Project'}
                </h1>

                  {heroBlock?.data?.subtitle && (
                    <p className="text-2xl text-gray-600 mb-6">
                      {heroBlock.data.subtitle}
                    </p>
                  )}
                  
                {detailData?.description && (
                  <p className="text-gray-700 mb-6" style={{ fontSize: '30px', lineHeight: '1.4' }}>
                    {detailData.description}
                  </p>
                )}

                  {/* Hero Image if present */}
                  {heroBlock?.data?.imageUrl && (
                    <img src={heroBlock.data.imageUrl} alt="Hero" className="w-full rounded-lg mb-8" />
                  )}
                  
                  {/* Meta Information */}
                  {(detailData?.role || heroBlock?.data?.meta?.timeline || heroBlock?.data?.meta?.year || heroBlock?.data?.meta?.team) && (
                    <div className="flex flex-wrap gap-3 text-base text-gray-600 mb-6">
                      {detailData?.role && <span>{detailData.role}</span>}
                      {heroBlock?.data?.meta?.timeline && (
                        <>
                          {detailData?.role && <span className="text-gray-300">•</span>}
                          <span>{heroBlock.data.meta.timeline}</span>
                        </>
                      )}
                      {heroBlock?.data?.meta?.year && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>{heroBlock.data.meta.year}</span>
                        </>
                      )}
                      {heroBlock?.data?.meta?.team && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>{heroBlock.data.meta.team}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                {detailData?.tags && detailData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {detailData.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                ))}
              </div>
                )}

                {detailData?.link && (
                    <a href={detailData.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base text-blue-600 hover:text-blue-700">
                    <LinkIcon className="w-4 h-4" />
                    {detailData.link}
                  </a>
                )}

                  <div className="border-b border-gray-200 mt-8" />
              </div>

                {/* Template Content - Skip Hero block (already in header) */}
                {isUsingTemplates && templateBlocks.length > 0 ? (
                  <TemplateRenderer
                    blocks={templateBlocks.slice(1)}
                    onChange={(newBlocks) => {
                      const updatedBlocks = [templateBlocks[0], ...newBlocks];
                      saveBlocks(updatedBlocks);
                    }}
                    mode="preview"
                  />
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    No content yet. Add a template to get started.
          </div>
                    )}
              </div>
          </div>
                    )}
                    </div>
                  </div>

      {/* Block Selector Modal */}
      {showBlockSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add a Section</h3>
          <button
                onClick={() => setShowBlockSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
          </button>
      </div>

            <p className="text-gray-600 mb-6">
              Choose a block type to add to your project:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {BLOCK_TYPE_OPTIONS.map((option) => (
                  <button
                  key={option.type}
                  onClick={() => addSection(option.type)}
                  className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{option.label}</h4>
                  <p className="text-xs text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
          </div>
              </div>
            )}
          </div>
        );
}

