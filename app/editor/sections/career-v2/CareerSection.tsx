/**
 * CareerSection Component (V2 - Using Core Architecture)
 * 
 * Career section built with the unified core architecture.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Plus, Award } from 'lucide-react';
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
  onScrollToSection?: (sectionId: string) => void;
}

export function CareerSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
  onScrollToSection,
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
    // Check if there's already an empty career highlight
    const hasEmptyCareer = currentHighlights.some(c => 
      c.organization.trim().length === 0 || c.role.trim().length === 0
    );
    
    if (hasEmptyCareer) {
      console.log('[CareerSection] Empty career highlight already exists, not adding new one');
      return; // Don't add new one, user should fill existing
    }
    
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
      
      {/* Add button - Always visible */}
      {currentHighlights.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-xl hover:bg-emerald-50 hover:border-emerald-500 hover:text-gray-900 transition-all"
        >
          <Award className="w-12 h-12 text-emerald-700 mb-1" />
          <div className="text-center">
            <p className="font-semibold text-gray-900">No career highlights yet</p>
            <p className="text-sm text-gray-500">Click to add your first highlight</p>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Highlight</span>
        </button>
      )}
    </div>
  );
}

