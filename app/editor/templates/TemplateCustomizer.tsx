'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { TemplateConfig, TemplateSectionConfig } from './types';

interface TemplateCustomizerProps {
  template: TemplateConfig;
  onConfirm: (selectedSections: TemplateSectionConfig[]) => void;
  onBack: () => void;
}

export function TemplateCustomizer({ template, onConfirm, onBack }: TemplateCustomizerProps) {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(template.sections.filter(s => s.required).map(s => s.id))
  );

  const toggleSection = (sectionId: string, required: boolean) => {
    if (required) return; // Can't toggle required sections

    const newSelected = new Set(selectedSections);
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId);
    } else {
      newSelected.add(sectionId);
    }
    setSelectedSections(newSelected);
  };

  const handleConfirm = () => {
    const selected = template.sections.filter(s => selectedSections.has(s.id));
    onConfirm(selected);
  };

  const colorStyles: Record<string, string> = {
    gray: 'from-gray-400 to-gray-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    green: 'from-green-400 to-green-600',
    indigo: 'from-indigo-400 to-indigo-600',
    slate: 'from-slate-400 to-slate-600',
    amber: 'from-amber-400 to-amber-600',
  };

  const gradient = colorStyles[template.color] || colorStyles.gray;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to templates
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{template.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Customize Your {template.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {template.description}
              </p>
              <div className="flex items-center gap-3 text-sm">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {template.category}
                </span>
                {template.difficulty && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {template.difficulty}
                  </span>
                )}
                {template.estimatedTime && (
                  <span className="text-gray-500">
                    ⏱️ {template.estimatedTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-1">
            ✨ Select the sections you want to include
          </p>
          <p className="text-xs text-blue-700">
            Required sections are pre-selected. You can always add or remove sections later.
          </p>
        </div>

        {/* Section Selection */}
        <div className="space-y-3 mb-8">
          {template.sections.map((section) => {
            const isSelected = selectedSections.has(section.id);
            const isRequired = section.required || false;

            return (
              <label
                key={section.id}
                className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-purple-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                } ${isRequired ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSection(section.id, isRequired)}
                    disabled={isRequired}
                    className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {section.label}
                    </h3>
                    {isRequired && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        Required
                      </span>
                    )}
                    {isSelected && !isRequired && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  {section.description && (
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Block type: <span className="font-medium">{section.blockType}</span>
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Selection Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              <strong>{selectedSections.size}</strong> of {template.sections.length} sections selected
            </span>
            {selectedSections.size < template.sections.length && (
              <button
                onClick={() => setSelectedSections(new Set(template.sections.map(s => s.id)))}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Select all
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirm}
            disabled={selectedSections.size === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all ${
              selectedSections.size === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : `bg-gradient-to-r ${gradient} hover:shadow-lg hover:-translate-y-0.5`
            }`}
          >
            <span>Create Project with {selectedSections.size} Sections</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Start from Blank Option */}
        <div className="mt-4 text-center">
          <button
            onClick={() => onConfirm([template.sections.find(s => s.blockType === 'hero')!])}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Or start with just the Hero section and build from scratch →
          </button>
        </div>
      </div>
    </div>
  );
}

