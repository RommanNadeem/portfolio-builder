'use client';

import { ArrowLeft, Check, Eye, Pencil, Monitor, Smartphone, Plus } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { TemplateType, TemplateBlock } from './types';
import { getTemplateConfig } from './configs';
import { TemplateSelector } from './TemplateSelector';
import { SlashCommandMenu } from './SlashCommandMenu';
import { NotionStyleSection } from './NotionStyleSection';
import { ViewMode, DeviceMode, FlowState } from './hooks/useTemplateState';

interface BaseTemplateEditorProps {
  // Data
  entityId: string;
  entityData: any;
  
  // State
  flowState: FlowState;
  selectedTemplate: TemplateType | null;
  blocks: TemplateBlock[];
  expandedSections: Set<number>;
  savedBlockIds: Set<string>;
  viewMode: ViewMode;
  deviceMode: DeviceMode;
  showSlashMenu: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  
  // Actions
  onFlowStateChange: (state: FlowState) => void;
  onTemplateSelect: (template: TemplateType) => void;
  onBlocksChange: (blocks: TemplateBlock[]) => void;
  onBlockChange: (index: number, block: TemplateBlock) => void;
  onBlockDelete: (index: number) => void;
  onBlockAdd: (blockType: string) => void;
  onToggleSection: (index: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onSlashMenuToggle: (show: boolean) => void;
  onBack: () => void;
  
  // Labels
  entityTypeName: string; // e.g., "Project", "Career Experience"
  entityType?: 'project' | 'career'; // Optional entity type for block customization
  backLabel?: string; // e.g., "Back to Projects"
  breadcrumbs?: string[]; // e.g., ["Portfolio", "Projects", "My Project"]
}

export function BaseTemplateEditor({
  entityId,
  entityData,
  flowState,
  selectedTemplate,
  blocks,
  expandedSections,
  savedBlockIds,
  viewMode,
  deviceMode,
  showSlashMenu,
  saveStatus,
  onFlowStateChange,
  onTemplateSelect,
  onBlocksChange,
  onBlockChange,
  onBlockDelete,
  onBlockAdd,
  onToggleSection,
  onViewModeChange,
  onDeviceModeChange,
  onSlashMenuToggle,
  onBack,
  entityTypeName,
  entityType,
  backLabel = 'Back to editor',
  breadcrumbs,
}: BaseTemplateEditorProps) {
  
  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex(b => b.id === active.id);
    const newIndex = blocks.findIndex(b => b.id === over.id);

    if (oldIndex === 0 || newIndex === 0) return; // Prevent moving hero

    const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
    console.log('[BaseTemplateEditor] 🔄 Blocks reordered:', {
      from: oldIndex,
      to: newIndex,
      movedBlock: blocks[oldIndex].sectionLabel || blocks[oldIndex].type,
      newOrder: reorderedBlocks.map(b => b.sectionLabel || b.type)
    });
    
    onBlocksChange(reorderedBlocks);
  };

  const templateConfig = selectedTemplate ? getTemplateConfig(selectedTemplate) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Top Bar - Always Visible */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Breadcrumb + Title + Template Badge */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={backLabel}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {breadcrumbs ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {breadcrumbs.map((crumb, idx) => (
                    <span key={idx} className={idx === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''}>
                      {crumb}
                      {idx < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-600">{entityTypeName}</span>
              )}
              
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
                        onFlowStateChange('select-template');
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
                {saveStatus === 'unsaved' && (
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
                    onClick={() => onViewModeChange('edit')}
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
                    onClick={() => onViewModeChange('preview')}
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
                    onClick={() => onDeviceModeChange('desktop')}
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
                    onClick={() => onDeviceModeChange('mobile')}
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
        {/* STEP 1: Select Template */}
        {flowState === 'select-template' && (
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
              onSelectTemplate={onTemplateSelect}
            />
          </div>
        )}

        {/* STEP 2: Editing */}
        {flowState === 'editing' && (
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
                        <NotionStyleSection
                          block={block}
                          index={index}
                          isExpanded={expandedSections.has(index)}
                          isSaved={savedBlockIds.has(block.id)}
                          viewMode={viewMode}
                          onToggle={() => onToggleSection(index)}
                          onChange={(updated) => onBlockChange(index, updated)}
                          onDelete={() => onBlockDelete(index)}
                          entityType={entityType}
                        />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add Block Button - Minimal */}
              {viewMode === 'edit' && (
                <button
                  onClick={() => onSlashMenuToggle(true)}
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
        onClose={() => onSlashMenuToggle(false)}
        onSelect={(blockType) => {
          onBlockAdd(blockType);
          onSlashMenuToggle(false);
        }}
      />
    </div>
  );
}

