/**
 * CareerSection Component (V2 - Using Core Architecture)
 * 
 * Career section built with the unified core architecture.
 */

'use client';

import { Plus } from 'lucide-react';
import { useSectionManager } from '@/app/editor/core/hooks';
import { CareerItem, convertFromLegacy, convertToLegacy, CareerHighlight } from './types';
import { CareerCard } from './CareerCard';
import { CareerPreview } from './CareerPreview';

interface CareerSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
}

export function CareerSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
}: CareerSectionProps) {
  
  // Convert legacy data to new format
  const legacyHighlights = data.careerHighlights || [];
  const initialData: CareerItem[] = legacyHighlights.map((h: CareerHighlight) => 
    convertFromLegacy(h)
  );

  // Use shared hook for state management
  const {
    items: highlights,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    saveStatus,
    itemCount,
    save: forceSave,
  } = useSectionManager<CareerItem>({
    initialData,
    onSave: async (items) => {
      // Convert back to legacy format for compatibility
      const legacy = items.map(convertToLegacy);
      
      // Update parent state IMMEDIATELY for live sync
      onChange(prev => ({
        ...prev,
        careerHighlights: legacy,
      }));
      
      console.log('[CareerSection] 💾 Synced to parent:', items.length);
    },
    autoSave: true,
    autoSaveDelay: 100, // ← Very short delay for instant sync across UI
    localStorageKey: `career-${userId}`,
  });

  const handleAdd = () => {
    add({
      title: 'New Role',
      description: '',
      thumbnail: null,
      organization: '',
      role: '',
      start_date: '',
      end_date: 'Present',
      current: true,
      link: undefined,
      achievements: [],
      key_achievements: [],
      responsibilities: [],
      featured_achievements: [],
      has_detail_page: true,
      template_type: 'career-experience',
      blocks: [],
      published: false,
      published_at: null,
    });
  };

  // In preview renderMode, use dedicated preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    return (
      <CareerPreview
        highlights={highlights}
        viewMode={viewMode}
        previewMode={previewMode}
        onUpdate={update}
      />
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-3">
      {highlights.map((career, index) => (
        <CareerCard
          key={career.id}
          career={career}
          index={index}
          totalCount={highlights.length}
          onUpdate={update}
          onDelete={remove}
          onMoveUp={index > 0 ? () => reorder(career.id, 'up') : undefined}
          onMoveDown={index < highlights.length - 1 ? () => reorder(career.id, 'down') : undefined}
          onSave={forceSave}
          viewMode={viewMode}
        />
      ))}
      
      {/* Add button */}
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Career Highlight</span>
      </button>
    </div>
  );
}

