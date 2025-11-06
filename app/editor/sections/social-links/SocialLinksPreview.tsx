'use client';

import { SocialLink } from './types';

interface SocialLinksPreviewProps {
  links: SocialLink[];
  email: string;
  phone: string;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  onUpdateLink?: (id: string, updates: Partial<SocialLink>) => void;
  onUpdateContact?: (field: 'email' | 'phone', value: string) => void;
}

export function SocialLinksPreview({ 
  links, 
  email,
  phone,
  viewMode, 
  previewMode,
  onUpdateLink,
  onUpdateContact
}: SocialLinksPreviewProps) {
  // Social links now appear in the Personal section as chips
  // This preview component is hidden since the links are integrated into the hero section
  return null;
}
