/**
 * CompaniesSection Component (Controlled Version)
 * 
 * Fully controlled component with no internal state.
 * Real-time sync between editor and preview.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, Building2, Check, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { CompanyItem, convertFromStringArray, convertToStringArray } from './types';
import { CompanyChip } from './CompanyChip';

interface CompaniesSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
}

export function CompaniesSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
}: CompaniesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  
  // Parse companies from either sliderCompanies string or companies array (memoized)
  const companies = useMemo(() => {
    const companiesString = data.sliderCompanies || data.companies || '';
    const companiesArray = typeof companiesString === 'string' 
      ? companiesString.split(',').map(c => c.trim()).filter(Boolean)
      : Array.isArray(companiesString) 
        ? companiesString 
        : [];
    return convertFromStringArray(companiesArray);
  }, [data.sliderCompanies, data.companies]);

  // Handle changes - update parent immediately
  const handleCompaniesChange = useCallback((newCompanies: CompanyItem[]) => {
    const companiesArray = convertToStringArray(newCompanies);
    const companiesString = companiesArray.join(', ');
    onChange(prev => ({
      ...prev,
      companies: companiesString,
      sliderCompanies: companiesString,
    }));
  }, [onChange]);

  // Use controlled hook
  const {
    items: currentCompanies,
    add,
    update,
    remove,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<CompanyItem>({
    items: companies,
    onChange: handleCompaniesChange,
  });

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentCompanies.findIndex((item) => item.id === active.id);
      const newIndex = currentCompanies.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderByIndex(oldIndex, newIndex);
      }
    }
  };

  const handleAddCompany = () => {
    if (newCompanyName.trim()) {
      add({
        name: newCompanyName.trim(),
      });
      setNewCompanyName('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCompany();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCompanyName('');
    }
  };

  // In preview renderMode, show as slider matching old UI
  if (renderMode === 'preview' || viewMode === 'preview') {
    if (currentCompanies.length === 0) {
      return null;
    }

    const isMobile = previewMode === 'mobile';
    // Duplicate companies for seamless infinite scroll
    const duplicatedCompanies = [...currentCompanies, ...currentCompanies];

    return (
      <div className={`w-full bg-white ${isMobile ? 'py-6' : 'py-8 sm:py-12'}`}>
        {/* Section Header - Uppercase, centered */}
        <h2 className={`text-center font-semibold tracking-wider text-gray-600 uppercase ${
          isMobile ? 'text-xs mb-5 px-4' : 'text-xs sm:text-sm mb-6 sm:mb-8'
        }`}>
          Companies and Teams I Have Worked With
        </h2>

        {/* Scrolling Company Slider - CSS-based marquee animation */}
        <div className="marquee-container">
          <div
            className="marquee-content"
            style={{
              gap: '3rem',
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className={`flex-shrink-0 flex items-center justify-center ${
                  isMobile ? 'text-sm px-6' : 'text-base sm:text-lg lg:text-xl px-8'
                } font-semibold text-gray-400 opacity-60 hover:opacity-100 hover:text-gray-600 transition-all duration-200`}
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-gray-700 mb-1">Company Slider</p>
          <p>Companies appear as a scrolling slider. Click to edit inline.</p>
        </div>
      </div>

      {/* Company chips with drag-and-drop */}
      {currentCompanies.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentCompanies.map(c => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {currentCompanies.map((company) => (
                <CompanyChip
                  key={company.id}
                  company={company}
                  onUpdate={update}
                  onDelete={remove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-2 font-medium">No companies yet</p>
          <p className="text-sm text-gray-500">Add companies you've worked with</p>
        </div>
      )}

      {/* Add new company */}
      {isAdding ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border-2 border-gray-300 rounded-lg">
          <input
            type="text"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Google, Meta, Apple..."
            className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
            autoFocus
          />
          <button
            onClick={handleAddCompany}
            disabled={!newCompanyName.trim()}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            title="Add company"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewCompanyName('');
            }}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <span>+ Add Company</span>
        </button>
      )}
    </div>
  );
}

