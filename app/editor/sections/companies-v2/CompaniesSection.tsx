/**
 * CompaniesSection Component (V2 - Using Core Architecture)
 * 
 * Companies section for the scrolling company slider.
 */

'use client';

import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useSectionManager } from '@/app/editor/core/hooks';
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
  
  // Parse companies from either sliderCompanies string or companies array
  const companiesString = data.sliderCompanies || data.companies || '';
  const companiesArray = typeof companiesString === 'string' 
    ? companiesString.split(',').map(c => c.trim()).filter(Boolean)
    : Array.isArray(companiesString) 
      ? companiesString 
      : [];

  const initialData = convertFromStringArray(companiesArray);

  // Use shared hook for state management
  const {
    items: companies,
    add,
    update,
    remove,
    saveStatus,
    itemCount,
  } = useSectionManager<CompanyItem>({
    initialData,
    onSave: async (items) => {
      // Convert back to string array
      const companiesArray = convertToStringArray(items);
      const companiesString = companiesArray.join(', ');
      
      // Update parent state
      onChange(prev => ({
        ...prev,
        companies: companiesString, // For new format
        sliderCompanies: companiesString, // For legacy format
      }));
      
      console.log('[CompaniesSection] 💾 Saved companies:', items.length);
    },
    autoSave: true,
    autoSaveDelay: 100, // Instant sync for live preview
    localStorageKey: `companies-${userId}`,
  });

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
    if (companies.length === 0) {
      return null;
    }

    const isMobile = previewMode === 'mobile';
    // Duplicate companies for seamless infinite scroll
    const duplicatedCompanies = [...companies, ...companies];

    return (
      <div className={`w-full bg-white ${isMobile ? 'px-4 py-6' : 'px-4 sm:px-6 lg:px-8 py-8 sm:py-12'}`}>
        {/* Section Header - Uppercase, centered */}
        <h2 className={`text-center font-semibold tracking-wider text-gray-600 uppercase ${
          isMobile ? 'text-xs mb-5' : 'text-xs sm:text-sm mb-6 sm:mb-8'
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

      {/* Company chips */}
      {companies.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {companies.map((company) => (
            <CompanyChip
              key={company.id}
              company={company}
              onUpdate={update}
              onDelete={remove}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No companies yet</p>
          <p className="text-sm">Add companies you've worked with</p>
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
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddCompany}
            disabled={!newCompanyName.trim()}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewCompanyName('');
            }}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <span>+ Add Company</span>
        </button>
      )}
    </div>
  );
}

