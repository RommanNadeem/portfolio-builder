'use client';

import { User, Linkedin, Phone, Mail, Calendar, Github, Twitter, Instagram, Globe } from 'lucide-react';
import { PersonalData } from './types';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface PersonalPreviewProps {
  data: PersonalData;
  socialLinks?: SocialLink[];
  previewMode: 'desktop' | 'mobile';
}

export function PersonalPreview({ data, socialLinks = [], previewMode }: PersonalPreviewProps) {
  const isMobile = previewMode === 'mobile';

  const getIcon = (iconName: string) => {
    const className = "w-4 h-4";
    if (!iconName) return <Globe className={className} />;
    switch (iconName.toLowerCase()) {
      case 'mail':
      case 'email': return <Mail className={className} />;
      case 'phone': return <Phone className={className} />;
      case 'linkedin': return <Linkedin className={className} />;
      case 'github': return <Github className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'globe':
      case 'website': return <Globe className={className} />;
      case 'calendar': return <Calendar className={className} />;
      default: return <Globe className={className} />;
    }
  };

  return (
    <div id="overview" className="w-full bg-white">
      {/* Profile Image, Heading, Tagline, Social Links - Constrained Width */}
      <div className={`w-full ${isMobile ? 'py-8 pb-8' : 'pb-12'}`}>
        <div className={`max-w-6xl mx-auto flex ${isMobile ? 'items-start gap-4' : 'items-start gap-8 sm:gap-12'}`}>
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <div className={`rounded-full border-2 border-blue-200 bg-gray-100 flex items-center justify-center overflow-hidden ${
              isMobile ? 'w-20 h-20' : ''
            }`}
            style={!isMobile ? { width: '136px', height: '136px' } : {}}
            >
              {data.profileImage ? (
                <img 
                  src={data.profileImage} 
                  alt={(data as any).fullName || data.heading}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className={`text-gray-400 ${isMobile ? 'w-10 h-10' : 'w-20 h-20'}`} />
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
            {/* Main Heading - Blue/Purple Gradient */}
            {data.heading && (
              <h1
                className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
                  isMobile ? 'text-2xl mb-3' : 'text-5xl mb-4'
                }`}
                style={{ lineHeight: isMobile ? '1.2' : '1.1' }}
              >
                {data.heading}
              </h1>
            )}

            {/* Tagline with Purple Line Below */}
            {data.tagline && (
              <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
                {/* Tagline Text */}
                <p className={`text-gray-700 leading-relaxed ${isMobile ? 'text-base mb-2' : 'text-xl mb-3'}`}>
                  {data.tagline}
                </p>
                {/* Gradient Line Below Tagline */}
                <div className={`${isMobile ? 'w-12 h-0.5' : 'w-16 h-1'} bg-gradient-to-r from-blue-500 to-purple-500`} />
              </div>
            )}

            {/* Contact Pills Row - Below Tagline */}
            {socialLinks.length > 0 && (
              <div className={`flex flex-wrap gap-2`}>
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm ${
                      isMobile ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'
                    }`}
                  >
                    {getIcon(link.icon)}
                    <span>{link.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section - Full Width */}
      {data.whoAreYou && (
        <div className={`w-full ${isMobile ? 'pb-8' : 'pb-12'}`}>
          <div className={`bg-gray-50 rounded-2xl ${isMobile ? 'px-6 py-8' : 'px-12 py-10'}`}>
            <div className="max-w-6xl mx-auto">
              <p
                className={`text-gray-700 ${isMobile ? 'text-sm leading-relaxed' : 'text-base leading-relaxed'}`}
                style={{ lineHeight: isMobile ? '1.6' : '1.7' }}
              >
                {data.whoAreYou}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

