'use client';

import { useState } from 'react';
import { AlignLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { FooterEditor } from './FooterEditor';
import { FooterPreview } from './FooterPreview';
import { FooterData } from './types';

interface FooterSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function FooterSection({ data, onChange, viewMode, previewMode, renderMode }: FooterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const footerData: FooterData = {
    footerText: data.footerText,
    footerSignature: data.footerSignature,
  };

  const handleChange = (updates: Partial<FooterData>) => {
    onChange(prev => ({
      ...prev,
      ...updates,
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
              <AlignLeft className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Footer</h3>
              <p className="text-xs text-gray-500">Bottom CTA and signature</p>
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
          <FooterEditor
            data={footerData}
            fullName={data.fullName || 'You'}
            onChange={handleChange}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    );
  }

  return (
    <FooterPreview
      data={footerData}
      fullName={data.fullName || 'You'}
      previewMode={previewMode}
    />
  );
}

