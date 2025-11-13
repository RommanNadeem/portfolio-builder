/**
 * SocialLinksSection Component (Controlled Version)
 * 
 * Fully controlled component with no internal state.
 * Parent component is the single source of truth.
 * Real-time sync between editor and preview.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Instagram, 
  Globe, 
  Calendar, 
  Mail, 
  Phone,
  Youtube,
  Palette,
  Dribbble as DribbbleIcon,
  Edit3,
} from 'lucide-react';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { ItemList } from '@/app/editor/core/components';
import { SocialLinkItem, convertFromLegacy, convertToLegacy, SocialLink, AVAILABLE_PLATFORMS } from './types';
import { SocialLinkCard } from './SocialLinkCard';

interface SocialLinksSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
}

export function SocialLinksSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
}: SocialLinksSectionProps) {
  // Convert legacy data to new format (memoized)
  const links = useMemo(() => {
    const legacyLinks = data.socialLinks || [];
    return legacyLinks.map((l: SocialLink) => convertFromLegacy(l));
  }, [data.socialLinks]);

  // Handle changes - update parent immediately
  const handleLinksChange = useCallback((newLinks: SocialLinkItem[]) => {
    const legacy = newLinks.map(convertToLegacy);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[SocialLinksSection] Updating parent state:', {
        prev: data.socialLinks?.length || 0,
        new: legacy.length,
      });
    }
    
    // Update parent immediately - no delay, no auto-save
    onChange(prev => ({
      ...prev,
      socialLinks: legacy,
    }));
  }, [onChange, data.socialLinks]);

  // Use controlled hook
  const {
    items: currentLinks,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<SocialLinkItem>({
    items: links,
    onChange: handleLinksChange,
  });

  // Get platforms that haven't been added yet
  const addedPlatforms = useMemo(() => 
    new Set(currentLinks.map(link => link.platform.toLowerCase())),
    [currentLinks]
  );
  
  const availablePlatforms = useMemo(() => 
    AVAILABLE_PLATFORMS.filter(p => !addedPlatforms.has(p.platform.toLowerCase())),
    [addedPlatforms]
  );

  const handleAddPlatform = (platform: string, icon: string) => {
    add({
      platform,
      icon,
      url: '',
    });
  };

  // Helper to get icon component for editor
  const getIcon = (iconName: string) => {
    const className = "w-4 h-4";
    switch (iconName) {
      case 'linkedin': return <Linkedin className={className} />;
      case 'github': return <Github className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'globe': return <Globe className={className} />;
      case 'calendar': return <Calendar className={className} />;
      case 'mail': return <Mail className={className} />;
      case 'phone': return <Phone className={className} />;
      case 'youtube': return <Youtube className={className} />;
      case 'behance': return <Palette className={className} />;
      case 'dribbble': return <DribbbleIcon className={className} />;
      case 'medium': return <Edit3 className={className} />;
      default: return <Globe className={className} />;
    }
  };

  // In preview renderMode, render the links
  if (renderMode === 'preview' || viewMode === 'preview') {
    const getPreviewIcon = (iconName: string) => {
      const className = "w-5 h-5";
      switch (iconName) {
        case 'linkedin': return <Linkedin className={className} />;
        case 'github': return <Github className={className} />;
        case 'twitter': return <Twitter className={className} />;
        case 'instagram': return <Instagram className={className} />;
        case 'globe': return <Globe className={className} />;
        case 'calendar': return <Calendar className={className} />;
        case 'mail': return <Mail className={className} />;
        case 'phone': return <Phone className={className} />;
        case 'youtube': return <Youtube className={className} />;
        case 'behance': return <Palette className={className} />;
        case 'dribbble': return <DribbbleIcon className={className} />;
        case 'medium': return <Edit3 className={className} />;
        default: return <Globe className={className} />;
      }
    };

    return (
      <div className="flex justify-center gap-4 py-8">
        {currentLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-gray-700 hover:text-purple-600"
            title={link.platform}
          >
            {getPreviewIcon(link.icon)}
          </a>
        ))}
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-4">
      {/* Active Links - Drag and Drop */}
      {currentLinks.length > 0 && (
        <div className="space-y-2">
          <ItemList
            items={currentLinks}
            onReorder={reorderByIndex}
            renderItem={(link, index) => (
              <SocialLinkCard
                link={link}
                onUpdate={update}
                onDelete={remove}
                onMoveUp={() => reorder(link.id, 'up')}
                onMoveDown={() => reorder(link.id, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < currentLinks.length - 1}
              />
            )}
          />
        </div>
      )}

      {/* Available Platforms - Show inline */}
      {availablePlatforms.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500 px-1">
            {currentLinks.length > 0 ? 'Add More:' : 'Available Platforms:'}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availablePlatforms.map(({ platform, icon }) => (
              <button
                key={platform}
                onClick={() => handleAddPlatform(platform, icon)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 bg-gray-50 rounded-md flex items-center justify-center text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors flex-shrink-0">
                  {getIcon(icon)}
                </div>
                <span className="font-medium text-xs text-gray-700 group-hover:text-emerald-700">{platform}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state - only show if no links at all */}
      {currentLinks.length === 0 && availablePlatforms.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-2 font-medium">All platforms added!</p>
          <p className="text-sm text-gray-500">You can edit or remove existing links</p>
        </div>
      )}
    </div>
  );
}

