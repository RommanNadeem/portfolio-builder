/**
 * CareerSection Component (V2 - Using Core Architecture)
 * 
 * Career section built with the unified core architecture.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { ItemList } from '@/app/editor/core/components';
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
  
  // Convert legacy data to new format (memoized)
  const highlights = useMemo(() => {
    const legacyHighlights = data.careerHighlights || [];
    return legacyHighlights.map((h: CareerHighlight) => convertFromLegacy(h));
  }, [data.careerHighlights]);

  // Handle changes - update parent immediately
  const handleCareerChange = useCallback((newHighlights: CareerItem[]) => {
    const legacy = newHighlights.map(convertToLegacy);
    onChange(prev => ({
      ...prev,
      careerHighlights: legacy,
    }));
  }, [onChange]);

  // Use controlled hook
  const {
    items: currentHighlights,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<CareerItem>({
    items: highlights,
    onChange: handleCareerChange,
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
      {/* Drag-and-drop list */}
      <ItemList
        items={currentHighlights}
        onReorder={reorderByIndex}
        renderItem={(career, index) => (
          <CareerCard
            career={career}
            index={index}
            totalCount={currentHighlights.length}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={index > 0 ? () => reorder(career.id, 'up') : undefined}
            onMoveDown={index < currentHighlights.length - 1 ? () => reorder(career.id, 'down') : undefined}
            viewMode={viewMode}
          />
        )}
      />
      
      {/* Add button */}
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Career Highlight</span>
      </button>
    </div>
  );
}

