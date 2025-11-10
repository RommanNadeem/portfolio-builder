'use client';

import { useState } from 'react';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useSection } from '../../hooks/useSection';
import { CareerEditor } from './CareerEditor';
import { CareerPreview } from './CareerPreview';
import { CareerHighlight } from './types';

interface CareerSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function CareerSection({ data, onChange, viewMode, previewMode, renderMode }: CareerSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (updatedHighlights: CareerHighlight[]) => {
    onChange(prev => ({
      ...prev,
      careerHighlights: updatedHighlights,
    }));
  };

  const { items: highlights, addItem, updateItem, deleteItem, moveItem } = useSection<CareerHighlight>(
    data.careerHighlights || [],
    handleUpdate
  );

  // Debug logging
  console.log('[CareerSection] Rendering with:', {
    renderMode,
    viewMode,
    highlightsCount: highlights.length,
    rawDataCount: data.careerHighlights?.length || 0,
  });

  const handleAdd = () => {
    addItem({
      organization: '',
      role: '',
      description: '',
      link: '',
      achievements: [],
      startDate: '',
      endDate: '',
      current: false,
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
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Career Highlights</h3>
              <p className="text-xs text-gray-500">Your work experience</p>
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
          <CareerEditor
            highlights={highlights}
            onAdd={handleAdd}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onMove={moveItem}
            isExpanded={isExpanded}
            viewMode={viewMode}
          />
        </div>
      </div>
    );
  }

  return (
    <CareerPreview
      highlights={highlights}
      viewMode={viewMode}
      previewMode={previewMode}
      onUpdate={viewMode === 'edit' ? updateItem : undefined}
    />
  );
}

