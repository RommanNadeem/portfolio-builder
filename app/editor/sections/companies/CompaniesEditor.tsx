'use client';

import { Plus, X } from 'lucide-react';

interface CompaniesEditorProps {
  companies: string[];
  onAdd: (company: string) => void;
  onRemove: (company: string) => void;
  isExpanded: boolean;
}

export function CompaniesEditor({ companies, onAdd, onRemove, isExpanded }: CompaniesEditorProps) {
  const handleAddCompany = () => {
    const companyName = prompt('Enter company name (e.g., Google, Meta, Apple):');
    if (companyName?.trim()) {
      onAdd(companyName.trim());
    }
  };

  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {companies.length} {companies.length === 1 ? 'company' : 'companies'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-500 mb-2">
        Companies will appear as a scrolling slider at the top of your portfolio
      </div>

      {/* Company Tags */}
      <div className="flex flex-wrap gap-2">
        {companies.map((company, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-sm"
          >
            <span>{company}</span>
            <button
              onClick={() => onRemove(company)}
              className="text-gray-500 hover:text-red-600 transition-colors"
              title="Remove company"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddCompany}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Company</span>
      </button>
    </div>
  );
}

