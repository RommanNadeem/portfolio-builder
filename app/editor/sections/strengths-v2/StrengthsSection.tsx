/**
 * StrengthsSection Component (V2 - Using Core Architecture)
 * 
 * Strengths section built with the unified core architecture.
 */

'use client';

import { useSectionManager } from '@/app/editor/core/hooks';
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
}

export function StrengthsSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
}: StrengthsSectionProps) {
  
  // Convert legacy data to new format
  const legacyStrengths = data.strengths || [];
  const initialData: StrengthItem[] = legacyStrengths.map((s: Strength) => 
    convertFromLegacy(s)
  );

  // Use shared hook for state management
  const {
    items: strengths,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    saveStatus,
    itemCount,
  } = useSectionManager<StrengthItem>({
    initialData,
    onSave: async (items) => {
      // Convert back to legacy format for compatibility
      const legacy = items.map(convertToLegacy);
      
      // Update parent state
      onChange(prev => ({
        ...prev,
        strengths: legacy,
      }));
      
      console.log('[StrengthsSection] 💾 Saved strengths:', items.length);
    },
    autoSave: true,
    autoSaveDelay: 100, // Instant sync for live preview
    localStorageKey: `strengths-${userId}`,
  });

  const handleAdd = () => {
    add({
      title: '',
      description: '',
      icon: '⭐',
      category: undefined,
      proficiency: undefined,
    });
  };

  // In preview renderMode, render the preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Strengths</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {strengths.map((strength) => (
            <div
              key={strength.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{strength.icon || '⭐'}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{strength.title}</h3>
              {strength.proficiency && (
                <span className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full mb-2 capitalize">
                  {strength.proficiency}
                </span>
              )}
              <p className="text-sm text-gray-600">{strength.description}</p>
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
        items={strengths}
        onReorder={reorderByIndex}
        renderItem={(strength, index) => (
          <StrengthCard
            strength={strength}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={() => reorder(strength.id, 'up')}
            onMoveDown={() => reorder(strength.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < strengths.length - 1}
          />
        )}
      />
      
      {/* Add button */}
      {strengths.length === 0 && (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <span className="text-3xl mb-2">⭐</span>
          <div className="text-center">
            <p className="font-medium">No strengths yet</p>
            <p className="text-sm">Showcase your skills!</p>
          </div>
        </button>
      )}
    </div>
  );
}

