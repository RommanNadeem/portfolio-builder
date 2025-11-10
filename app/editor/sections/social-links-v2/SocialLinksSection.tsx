/**
 * SocialLinksSection Component (V2 - Using Core Architecture)
 * 
 * Social links section built with the unified core architecture.
 */

'use client';

import { useState } from 'react';
import { Linkedin, Github, Twitter, Instagram, Globe, Calendar } from 'lucide-react';
import { useSectionManager } from '@/app/editor/core/hooks';
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
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  
  // Convert legacy data to new format
  const legacyLinks = data.socialLinks || [];
  const initialData: SocialLinkItem[] = legacyLinks.map((l: SocialLink) => 
    convertFromLegacy(l)
  );

  // Use shared hook for state management
  const {
    items: links,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    saveStatus,
    itemCount,
  } = useSectionManager<SocialLinkItem>({
    initialData,
    onSave: async (items) => {
      // Convert back to legacy format for compatibility
      const legacy = items.map(convertToLegacy);
      
      // Update parent state
      onChange(prev => ({
        ...prev,
        socialLinks: legacy,
      }));
      
      console.log('[SocialLinksSection] 💾 Saved social links:', items.length);
    },
    autoSave: true,
    autoSaveDelay: 100, // Instant sync for live preview
    localStorageKey: `social-links-${userId}`,
  });

  const handleAddPlatform = (platform: string, icon: string) => {
    add({
      platform,
      icon,
      url: '',
      username: undefined,
    });
    setShowPlatformSelector(false);
  };

  // In preview renderMode, render the links
  if (renderMode === 'preview' || viewMode === 'preview') {
    const getIcon = (iconName: string) => {
      switch (iconName) {
        case 'linkedin': return <Linkedin className="w-5 h-5" />;
        case 'github': return <Github className="w-5 h-5" />;
        case 'twitter': return <Twitter className="w-5 h-5" />;
        case 'instagram': return <Instagram className="w-5 h-5" />;
        case 'globe': return <Globe className="w-5 h-5" />;
        case 'calendar': return <Calendar className="w-5 h-5" />;
        default: return <Globe className="w-5 h-5" />;
      }
    };

    return (
      <div className="flex justify-center gap-4 py-8">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-gray-700 hover:text-purple-600"
            title={link.platform}
          >
            {getIcon(link.icon)}
          </a>
        ))}
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-4">
      {/* Platform selector modal */}
      {showPlatformSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Choose Platform</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {AVAILABLE_PLATFORMS.map(({ platform, icon }) => (
                <button
                  key={platform}
                  onClick={() => handleAddPlatform(platform, icon)}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                >
                  <span className="text-2xl">{icon === 'linkedin' ? '💼' : icon === 'github' ? '💻' : icon === 'twitter' ? '🐦' : '🔗'}</span>
                  <span className="font-medium text-sm">{platform}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPlatformSelector(false)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links list */}
      {links.length > 0 ? (
        <ItemList
          items={links}
          onReorder={reorderByIndex}
          renderItem={(link, index) => (
            <SocialLinkCard
              link={link}
              onUpdate={update}
              onDelete={remove}
              onMoveUp={() => reorder(link.id, 'up')}
              onMoveDown={() => reorder(link.id, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < links.length - 1}
            />
          )}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No social links yet</p>
          <p className="text-sm">Add your first link!</p>
        </div>
      )}

      {/* Add button */}
      <button
        onClick={() => setShowPlatformSelector(true)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <span>+ Add Link</span>
      </button>
    </div>
  );
}

