'use client';

import { useState } from 'react';
import { Plus, Trash2, Linkedin, Github, Twitter, Instagram, Globe, Calendar, Mail, Phone, Check, X } from 'lucide-react';
import { SocialLink } from './types';

interface SocialLinksEditorProps {
  links: SocialLink[];
  email: string;
  phone: string;
  onAddLink: (platform: string, icon: string, url: string) => void;
  onUpdateLink: (id: string, updates: Partial<SocialLink>) => void;
  onDeleteLink: (id: string) => void;
  onUpdateContact: (field: 'email' | 'phone', value: string) => void;
  isExpanded: boolean;
}

const AVAILABLE_PLATFORMS = [
  { platform: 'Email', icon: 'mail' },
  { platform: 'Phone', icon: 'phone' },
  { platform: 'LinkedIn', icon: 'linkedin' },
  { platform: 'GitHub', icon: 'github' },
  { platform: 'Twitter', icon: 'twitter' },
  { platform: 'Instagram', icon: 'instagram' },
  { platform: 'Website', icon: 'globe' },
  { platform: 'Schedule a Call', icon: 'calendar' },
];

export function SocialLinksEditor({ 
  links, 
  email,
  phone,
  onAddLink,
  onUpdateLink, 
  onDeleteLink,
  onUpdateContact,
  isExpanded 
}: SocialLinksEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLinkPlatform, setNewLinkPlatform] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleStartAdding = (platform: string, icon: string) => {
    setNewLinkPlatform(platform);
    setNewLinkIcon(icon);
    setNewLinkUrl('');
    setIsAdding(true);
  };

  const handleConfirmAdd = () => {
    if (newLinkUrl.trim()) {
      onAddLink(newLinkPlatform, newLinkIcon, newLinkUrl.trim());
      setIsAdding(false);
      setNewLinkPlatform('');
      setNewLinkIcon('');
      setNewLinkUrl('');
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewLinkPlatform('');
    setNewLinkIcon('');
    setNewLinkUrl('');
  };

  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {links.length} social {links.length === 1 ? 'link' : 'links'}
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'globe': return <Globe className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <p className="text-xs font-medium text-blue-900">
          💡 All links appear as chips in your hero section. Add Email and Phone here to display them!
        </p>
      </div>

      {/* Existing Links */}
      {links.map((link) => (
        <div key={link.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <div className="text-gray-700 flex-shrink-0">
              {getIcon(link.icon)}
            </div>
            <input
              value={link.platform}
              onChange={(e) => onUpdateLink(link.id, { platform: e.target.value })}
              placeholder="LinkedIn, GitHub, Email, etc."
              className="flex-1 px-2 py-1 text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none placeholder:text-gray-400"
            />
            <button
              onClick={() => onDeleteLink(link.id)}
              className="p-1 text-red-500 hover:text-red-700 flex-shrink-0"
              title="Delete link"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <input
            type="url"
            value={link.url}
            onChange={(e) => onUpdateLink(link.id, { url: e.target.value })}
            placeholder={
              link.icon === 'mail' ? 'your@email.com' :
              link.icon === 'phone' ? '+1 (555) 123-4567' :
              link.icon === 'linkedin' ? 'https://linkedin.com/in/yourname' :
              link.icon === 'github' ? 'https://github.com/username' :
              'https://yourwebsite.com'
            }
            className="w-full px-2 py-1.5 text-xs text-gray-700 border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white placeholder:text-gray-400"
          />
        </div>
      ))}

      {/* Add New Link Form */}
      {isAdding && (
        <div className="border-2 border-blue-300 rounded-lg p-3 space-y-3 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{getIcon(newLinkIcon)}</span>
              <span className="text-sm font-semibold text-gray-900">{newLinkPlatform}</span>
            </div>
          </div>

          <input
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder={
              newLinkIcon === 'mail' ? 'your@email.com' :
              newLinkIcon === 'phone' ? '+1 (555) 123-4567' :
              newLinkIcon === 'linkedin' ? 'https://linkedin.com/in/yourname' :
              newLinkIcon === 'github' ? 'https://github.com/username' :
              'https://yourwebsite.com'
            }
            autoFocus
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
          />

          <div className="flex gap-2">
            <button
              onClick={handleCancelAdd}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={handleConfirmAdd}
              disabled={!newLinkUrl.trim()}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Add Link
            </button>
          </div>
        </div>
      )}

      {/* Add Platform Buttons */}
      {!isAdding && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 mb-2">Add Platform</label>
          {(() => {
            // Filter out platforms that are already added
            const existingPlatforms = links.map(link => link.platform.toLowerCase());
            const availablePlatforms = AVAILABLE_PLATFORMS.filter(
              ({ platform }) => !existingPlatforms.includes(platform.toLowerCase())
            );

            if (availablePlatforms.length === 0) {
              return (
                <div className="text-center py-4 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  All platforms added! ✨
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 gap-2">
                {availablePlatforms.map(({ platform, icon }) => (
                  <button
                    key={platform}
                    onClick={() => handleStartAdding(platform, icon)}
                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    <span className="text-gray-600">{getIcon(icon)}</span>
                    <span>{platform}</span>
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

