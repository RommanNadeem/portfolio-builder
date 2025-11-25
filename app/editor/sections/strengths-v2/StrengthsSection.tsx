/**
 * StrengthsSection Component (Controlled Version)
 * 
 * Fully controlled component with no internal state.
 * Real-time sync between editor and preview.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Plus, Star } from 'lucide-react';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { ItemList } from '@/app/editor/core/components';
import { StrengthItem, convertFromLegacy, convertToLegacy, Strength } from './types';
import { StrengthCard } from './StrengthCard';

interface StrengthsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function StrengthsSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
  onScrollToSection,
}: StrengthsSectionProps) {
  
  // Convert legacy data to new format (memoized)
  const strengths = useMemo(() => {
    const legacyStrengths = data.strengths || [];
    return legacyStrengths.map((s: Strength) => convertFromLegacy(s));
  }, [data.strengths]);

  // Handle changes - update parent immediately
  const handleStrengthsChange = useCallback((newStrengths: StrengthItem[]) => {
    const legacy = newStrengths.map(convertToLegacy);
    onChange(prev => ({
      ...prev,
      strengths: legacy,
    }));
  }, [onChange]);

  // Use controlled hook
  const {
    items: currentStrengths,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<StrengthItem>({
    items: strengths,
    onChange: handleStrengthsChange,
  });

  const handleAdd = () => {
    // Check if there's already an empty strength
    const hasEmptyStrength = currentStrengths.some(s => 
      s.title.trim().length === 0
    );
    
    if (hasEmptyStrength) {
      return; // Don't add new one, user should fill existing
    }
    
    add({
      title: '',
      description: '',
      icon: '',
    });
  };

  // In preview renderMode, render the preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    // Filter out empty strengths (title required)
    const validStrengths = currentStrengths.filter(s => 
      s.title.trim().length > 0
    );
    const isMobile = previewMode === 'mobile';

    // Show empty state only in Edit mode (right preview), hide in full Preview mode
    if (validStrengths.length === 0) {
      if (viewMode === 'preview') {
        return null;
      }

      return (
        <div id="strengths" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
          {/* Section Header - match Projects section */}
          <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`}>
              <Star className={isMobile ? 'w-3.5 h-3.5 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
            </div>
            <h2 className={`font-bold text-gray-900 ${
              isMobile ? 'text-lg' : 'text-3xl'
            }`}>Strengths</h2>
          </div>

          {/* Empty State - consistent with Projects section */}
          <div
            className={`bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl flex flex-col items-center justify-center ${
              isMobile ? 'p-6' : 'p-8'
            }`}
          >
            <Star className={`text-emerald-600 ${isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'}`} />
            <p className={`text-gray-600 mb-3 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
              No strengths added yet
            </p>
            <button
              onClick={() => {
                handleAdd();
                onScrollToSection?.('strengths');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              <Plus className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>Add Your First Strength</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div id="strengths" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
        {/* Section Header - match Projects section */}
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          }`}>
            <Star className={isMobile ? 'w-3.5 h-3.5 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
          </div>
          <h2 className={`font-bold text-gray-900 ${
            isMobile ? 'text-lg' : 'text-3xl'
          }`}>Strengths</h2>
        </div>

        <div className={`grid gap-4 ${
          isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}>
          {validStrengths.map((strength) => (
            <div
              key={strength.id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                isMobile ? 'p-4' : 'p-6'
              }`}
            >
              {strength.icon && (
                <div className={isMobile ? 'text-2xl mb-2' : 'text-3xl mb-3'}>{strength.icon}</div>
              )}
              <h3 className={`font-semibold text-gray-900 ${
                isMobile ? 'text-sm mb-1.5' : 'text-base mb-2'
              }`}>{strength.title}</h3>
              <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>{strength.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-3">
      <ItemList
        items={currentStrengths}
        onReorder={reorderByIndex}
        renderItem={(strength, index) => (
          <StrengthCard
            strength={strength}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={() => reorder(strength.id, 'up')}
            onMoveDown={() => reorder(strength.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < currentStrengths.length - 1}
          />
        )}
      />
      
      {/* Add button - Always visible */}
      {currentStrengths.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-xl hover:bg-emerald-50 hover:border-emerald-500 hover:text-gray-900 transition-all"
        >
          <Star className="w-12 h-12 text-emerald-700 mb-1" />
          <div className="text-center">
            <p className="font-semibold text-gray-900">No strengths yet</p>
            <p className="text-sm text-gray-500">Click to add your first strength</p>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Strength</span>
        </button>
      )}
    </div>
  );
}

