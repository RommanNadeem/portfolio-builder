'use client';

import { useState } from 'react';
import { Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useSection } from '../../hooks/useSection';
import { SocialLinksEditor } from './SocialLinksEditor';
import { SocialLinksPreview } from './SocialLinksPreview';
import { SocialLink } from './types';

interface SocialLinksSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function SocialLinksSection({ data, onChange, viewMode, previewMode, renderMode }: SocialLinksSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (updatedLinks: SocialLink[]) => {
    onChange(prev => ({
      ...prev,
      socialLinks: updatedLinks,
    }));
  };

  const { items: links, addItem, updateItem, deleteItem } = useSection<SocialLink>(
    data.socialLinks || [],
    handleUpdate
  );

  const handleAddLink = (platform: string, icon: string, url: string) => {
    addItem({
      platform,
      url,
      icon,
    });
  };

  const handleUpdateContact = (field: 'email' | 'phone', value: string) => {
    onChange(prev => ({
      ...prev,
      [field]: value,
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
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Social Links</h3>
              <p className="text-xs text-gray-500">Contact & social profiles</p>
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
          <SocialLinksEditor
            links={links}
            email={data.email}
            phone={data.phone}
            onAddLink={handleAddLink}
            onUpdateLink={updateItem}
            onDeleteLink={deleteItem}
            onUpdateContact={handleUpdateContact}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    );
  }

  return (
    <SocialLinksPreview
      links={links}
      email={data.email}
      phone={data.phone}
      viewMode={viewMode}
      previewMode={previewMode}
      onUpdateLink={viewMode === 'edit' ? updateItem : undefined}
      onUpdateContact={viewMode === 'edit' ? handleUpdateContact : undefined}
    />
  );
}

