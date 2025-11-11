/**
 * SocialLinkCard Component (V2)
 * 
 * Card component for displaying and editing a single social link.
 */

'use client';

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
  Link as LinkIcon,
} from 'lucide-react';
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
  const iconClass = "w-5 h-5";
  const icons: Record<string, React.ReactNode> = {
    linkedin: <Linkedin className={iconClass} />,
    github: <Github className={iconClass} />,
    twitter: <Twitter className={iconClass} />,
    instagram: <Instagram className={iconClass} />,
    globe: <Globe className={iconClass} />,
    calendar: <Calendar className={iconClass} />,
    mail: <Mail className={iconClass} />,
    phone: <Phone className={iconClass} />,
    youtube: <Youtube className={iconClass} />,
    behance: <Palette className={iconClass} />,
    dribbble: <DribbbleIcon className={iconClass} />,
    medium: <Edit3 className={iconClass} />,
  };
  return icons[iconName] || <LinkIcon className={iconClass} />;
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
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
          {getIcon(link.icon)}
        </div>

        {/* Content - Compact Single Row */}
        <div className="flex-1 flex flex-col gap-1.5">
          {/* Platform name - small text */}
          <div className="text-xs font-medium text-gray-600">{link.platform}</div>
          
          {/* URL Input - main field */}
          <input
            type="url"
            value={link.url}
            onChange={(e) => handleUpdate('url', e.target.value)}
            placeholder="https://..."
            className="w-full px-2 py-1.5 text-sm text-gray-900 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 font-mono text-xs"
          />
        </div>
      </div>
    </ItemCard>
  );
}

