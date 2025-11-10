/**
 * SocialLinkCard Component (V2)
 * 
 * Card component for displaying and editing a single social link.
 */

'use client';

import { Linkedin, Github, Twitter, Instagram, Globe, Calendar, Mail, Phone, Link as LinkIcon } from 'lucide-react';
import { ItemCard } from '@/app/editor/core/components';
import { SocialLinkItem } from './types';

interface SocialLinkCardProps {
  link: SocialLinkItem;
  onUpdate: (id: string, updates: Partial<SocialLinkItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    mail: <Mail className="w-5 h-5" />,
    phone: <Phone className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    github: <Github className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    globe: <Globe className="w-5 h-5" />,
    calendar: <Calendar className="w-5 h-5" />,
  };
  return icons[iconName] || <LinkIcon className="w-5 h-5" />;
};

export function SocialLinkCard({
  link,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SocialLinkCardProps) {
  
  const handleUpdate = (field: keyof SocialLinkItem, value: any) => {
    onUpdate(link.id, { [field]: value });
  };

  return (
    <ItemCard
      id={link.id}
      onDelete={() => onDelete(link.id)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      isDraggable={true}
      className="bg-gradient-to-br from-white to-purple-50"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
          {getIcon(link.icon)}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Platform */}
          <input
            type="text"
            value={link.platform}
            onChange={(e) => handleUpdate('platform', e.target.value)}
            placeholder="Platform name"
            className="w-full px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
          />

          {/* URL */}
          <input
            type="url"
            value={link.url}
            onChange={(e) => handleUpdate('url', e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 font-mono text-xs"
          />

          {/* Username (optional) */}
          <input
            type="text"
            value={link.username || ''}
            onChange={(e) => handleUpdate('username', e.target.value)}
            placeholder="@username (optional)"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
          />
        </div>
      </div>
    </ItemCard>
  );
}

