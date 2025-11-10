'use client';

import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useState } from 'react';
import { TemplateConfig, TemplateBlock } from './types';
import { createEmptyBlock } from './configs';

interface TemplateSectionEditorProps {
  templateConfig: TemplateConfig;
  blocks: TemplateBlock[];
  onChange: (blocks: TemplateBlock[]) => void;
}

export function TemplateSectionEditor({ templateConfig, blocks, onChange }: TemplateSectionEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['hero']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addSection = (sectionId: string, blockType: string, label?: string, description?: string) => {
    const newBlock = createEmptyBlock(blockType, {
      label: label,
      description: description,
    });
    if (newBlock) {
      onChange([...blocks, newBlock]);
      setExpandedSections(new Set([...expandedSections, sectionId]));
    }
  };

  const getSectionBlock = (sectionId: string, blockType: string) => {
    // Find the first block of this type (simple matching for now)
    return blocks.find(b => b.type === blockType);
  };

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
          Template Sections
        </h3>
        <p className="text-xs text-gray-500">
          Fill in each section to complete your project
        </p>
      </div>

      {templateConfig.sections.map((section) => {
        const isExpanded = expandedSections.has(section.id);
        const hasBlock = getSectionBlock(section.id, section.blockType);

        return (
          <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {section.label}
                    </h4>
                    {section.required && (
                      <span className="text-xs text-red-500">*</span>
                    )}
                    {hasBlock && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        ✓
                      </span>
                    )}
                  </div>
                  {section.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                  )}
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Section Content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-200">
                {!hasBlock ? (
                  <button
                    onClick={() => addSection(section.id, section.blockType, section.label, section.description)}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-800 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add {section.label} Section
                  </button>
                ) : (
                  <div className="mt-3 text-xs text-gray-600">
                    <p>✓ Section added. Edit details in the form above.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {templateConfig.sections.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>Blank template - Add any blocks you want!</p>
        </div>
      )}
    </div>
  );
}

