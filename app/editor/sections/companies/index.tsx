'use client';

import { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { CompaniesEditor } from './CompaniesEditor';
import { CompaniesPreview } from './CompaniesPreview';

interface CompaniesSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function CompaniesSection({ data, onChange, viewMode, previewMode, renderMode }: CompaniesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const companies = data.sliderCompanies 
    ? data.sliderCompanies.split(',').map((c: string) => c.trim()).filter((c: string) => c)
    : [];

  const handleAddCompany = (companyName: string) => {
    const currentCompanies = data.sliderCompanies 
      ? data.sliderCompanies.split(',').map((c: string) => c.trim()).filter((c: string) => c)
      : [];
    
    if (!currentCompanies.includes(companyName)) {
      currentCompanies.push(companyName);
      onChange(prev => ({
        ...prev,
        sliderCompanies: currentCompanies.join(', ')
      }));
    }
  };

  const handleRemoveCompany = (companyName: string) => {
    const currentCompanies = data.sliderCompanies 
      ? data.sliderCompanies.split(',').map((c: string) => c.trim()).filter((c: string) => c)
      : [];
    
    const filtered = currentCompanies.filter((c: string) => c !== companyName);
    onChange(prev => ({
      ...prev,
      sliderCompanies: filtered.join(', ')
    }));
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
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Companies Slider</h3>
              <p className="text-xs text-gray-500">Show trusted companies</p>
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
          <CompaniesEditor
            companies={companies}
            onAdd={handleAddCompany}
            onRemove={handleRemoveCompany}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    );
  }

  return (
    <CompaniesPreview
      companies={companies}
      viewMode={viewMode}
      previewMode={previewMode}
    />
  );
}

