'use client';

import { useState } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { PersonalEditor } from './PersonalEditor';
import { PersonalPreview } from './PersonalPreview';
import { PersonalData } from './types';

interface PersonalSectionProps {
  data: any; // Full portfolio data
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function PersonalSection({ data, onChange, viewMode, previewMode, renderMode }: PersonalSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const personalData: PersonalData = {
    heading: data.heading,
    tagline: data.tagline,
    whoAreYou: data.whoAreYou,
    profileImage: data.profileImage,
  };

  const socialLinks = data.socialLinks || [];

  const handleChange = (updates: Partial<PersonalData>) => {
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
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Personal Info</h3>
              <p className="text-xs text-gray-500">Basic information and photo</p>
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
          <PersonalEditor
            data={personalData}
            onChange={handleChange}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    );
  }

  return (
    <PersonalPreview
      data={personalData}
      socialLinks={socialLinks}
      viewMode={viewMode}
      previewMode={previewMode}
    />
  );
}

