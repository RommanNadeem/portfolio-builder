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
  Edit3 
} from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface SocialLinksClientProps {
  socialLinks: SocialLink[];
}

export function SocialLinksClient({ socialLinks }: SocialLinksClientProps) {
  const getSocialIcon = (iconName: string) => {
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
      case 'dribbble': return <Palette className={className} />;
      case 'medium': return <Edit3 className={className} />;
      default: return <Globe className={className} />;
    }
  };

  const formatUrl = (url: string, icon: string) => {
    // If it's an email and doesn't have mailto:, add it
    if (icon === 'mail' && !url.startsWith('mailto:')) {
      return `mailto:${url}`;
    }
    // If it's a phone and doesn't have tel:, add it
    if (icon === 'phone' && !url.startsWith('tel:')) {
      // Remove any spaces, dashes, or parentheses for tel: link
      const cleanPhone = url.replace(/[\s\-\(\)]/g, '');
      return `tel:${cleanPhone}`;
    }
    // For other links, ensure they have a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://') && icon !== 'mail' && icon !== 'phone') {
      return `https://${url}`;
    }
    return url;
  };

  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {socialLinks.map((link: SocialLink) => {
        const formattedUrl = formatUrl(link.url, link.icon);
        const isEmailOrPhone = link.icon === 'mail' || link.icon === 'phone';
        
        return (
          <a
            key={link.id}
            href={formattedUrl}
            target={isEmailOrPhone ? undefined : "_blank"}
            rel={isEmailOrPhone ? undefined : "noopener noreferrer"}
            className="inline-flex items-center gap-1.5 sm:gap-2 border-2 border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            style={{ color: '#111111' }}
          >
            {getSocialIcon(link.icon)}
            <span className="font-medium">{link.platform}</span>
          </a>
        );
      })}
    </div>
  );
}

