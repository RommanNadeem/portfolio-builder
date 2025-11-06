'use client';

import { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useSection } from '../../hooks/useSection';
import { StrengthsEditor } from './StrengthsEditor';
import { StrengthsPreview } from './StrengthsPreview';
import { Strength } from './types';

interface StrengthsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function StrengthsSection({ data, onChange, viewMode, previewMode, renderMode }: StrengthsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (updatedStrengths: Strength[]) => {
    onChange(prev => ({
      ...prev,
      strengths: updatedStrengths,
    }));
  };

  const { items: strengths, addItem, updateItem, deleteItem } = useSection<Strength>(
    data.strengths || [],
    handleUpdate
  );

  const handleAdd = () => {
    addItem({
      title: '',
      description: '',
      icon: '⭐',
    });
  };

  if (renderMode === 'editor') {
    return (
      <div className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Strengths</h3>
              <p className="text-xs text-gray-500">Your key skills</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Content */}
        <div className="px-4 pb-4">
          <StrengthsEditor
            strengths={strengths}
            onAdd={handleAdd}
            onUpdate={updateItem}
            onDelete={deleteItem}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    );
  }

  return (
    <StrengthsPreview
      strengths={strengths}
      viewMode={viewMode}
      previewMode={previewMode}
    />
  );
}

