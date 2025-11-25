'use client';

import { useEffect, useRef } from 'react';
import { Mail, Phone, Linkedin, Github, Twitter, Instagram, Globe, Calendar } from 'lucide-react';

// Updated layout: horizontal with profile on left, content on right
// Profile: 136x136px, Heading: 72px, Tagline: 24px
// Last updated: 2025-11-06

interface PreviewData {
  heading?: string;
  tagline?: string;
  whoAreYou?: string;
  profileImage?: string | null;
  socialLinks?: Array<{
    id: string;
    platform: string;
    url: string;
    icon: string;
  }>;
  careerHighlights?: Array<{
    id: string;
    organization: string;
    role: string;
    description?: string;
    achievements: string[];
    startDate?: string;
    endDate?: string;
    current?: boolean;
  }>;
  email?: string;
  phone?: string;
}

interface PortfolioPreviewProps {
  data: PreviewData;
  focusSection?: 'heading' | 'tagline' | 'about' | 'career' | 'links' | 'contact' | 'image' | null;
}

export function PortfolioPreview({ data, focusSection = null }: PortfolioPreviewProps) {
  // Refs for each section
  const imageRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const careerRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);

  // Track which section is currently highlighted - persists while on that step
  const highlightedSection = focusSection;

  // Scroll to focused section when it changes
  useEffect(() => {
    if (!focusSection) return;

    let targetRef: React.RefObject<HTMLDivElement | null> | null = null;

    switch (focusSection) {
      case 'image':
        targetRef = imageRef;
        break;
      case 'heading':
        targetRef = headingRef;
        break;
      case 'tagline':
        targetRef = taglineRef;
        break;
      case 'about':
        targetRef = aboutRef;
        break;
      case 'career':
        targetRef = careerRef;
        break;
      case 'links':
      case 'contact':
        targetRef = linksRef;
        break;
    }

    if (targetRef?.current) {
      // Small delay to ensure rendering is complete before scrolling
      setTimeout(() => {
        targetRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [focusSection]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail': return <Mail className="w-3.5 h-3.5" />;
      case 'phone': return <Phone className="w-3.5 h-3.5" />;
      case 'linkedin': return <Linkedin className="w-3.5 h-3.5" />;
      case 'github': return <Github className="w-3.5 h-3.5" />;
      case 'twitter': return <Twitter className="w-3.5 h-3.5" />;
      case 'instagram': return <Instagram className="w-3.5 h-3.5" />;
      case 'globe': return <Globe className="w-3.5 h-3.5" />;
      case 'calendar': return <Calendar className="w-3.5 h-3.5" />;
      default: return <Globe className="w-3.5 h-3.5" />;
    }
  };

  const hasContent = data.heading || data.tagline || data.whoAreYou || data.socialLinks?.length || data.profileImage;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-sm text-gray-300">Empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white space-y-8">
      <style jsx>{`
        @keyframes gentlePulse {
          0% {
            box-shadow: inset 0 0 0 2px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.4);
            background-color: rgba(16, 185, 129, 0.05);
          }
          50% {
            box-shadow: inset 0 0 0 2px rgba(16, 185, 129, 0.4), 0 0 0 8px rgba(16, 185, 129, 0);
            background-color: rgba(16, 185, 129, 0.1);
          }
          100% {
            box-shadow: inset 0 0 0 2px rgba(16, 185, 129, 0.3), 0 0 0 0 rgba(16, 185, 129, 0);
            background-color: rgba(16, 185, 129, 0.08);
          }
        }
        
        .highlight-pulse {
          animation: gentlePulse 1.5s ease-out;
          border-radius: 12px;
          padding: 12px;
          box-shadow: inset 0 0 0 2px rgba(16, 185, 129, 0.3);
          background-color: rgba(16, 185, 129, 0.08);
          transition: all 0.3s ease;
        }

        .highlight-pulse-image {
          animation: gentlePulse 1.5s ease-out;
          border: 3px solid rgba(16, 185, 129, 0.4) !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
      `}</style>

      {/* Profile Image */}
      <div 
        ref={imageRef}
        className={`w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center transition-all duration-300 ${
          highlightedSection === 'image' ? 'highlight-pulse-image' : ''
        }`}
      >
        {data.profileImage ? (
          <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>

      {/* Heading */}
      {data.heading && (
        <div 
          ref={headingRef}
          className={highlightedSection === 'heading' ? 'highlight-pulse' : ''}
        >
          <h1 className="text-3xl font-medium text-black leading-tight">
            {data.heading}
          </h1>
        </div>
      )}

      {/* Tagline */}
      {data.tagline && (
        <div 
          ref={taglineRef}
          className={highlightedSection === 'tagline' ? 'highlight-pulse' : ''}
        >
          <p className="text-base text-gray-600 leading-relaxed">
            {data.tagline}
          </p>
        </div>
      )}

      {/* Social Links + Contact Info */}
      {data.socialLinks && data.socialLinks.length > 0 && (
        <div 
          ref={linksRef}
          className={highlightedSection === 'links' || highlightedSection === 'contact' ? 'highlight-pulse' : ''}
        >
          <div className="flex flex-wrap gap-3">
            {/* Social Links (including Email/Phone) */}
            {data.socialLinks.map((link) => (
              <div
                key={link.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-xs text-gray-700 transition-colors hover:border-gray-400"
              >
                {getIcon(link.icon)}
                <span>{link.platform}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Who Are You */}
      {data.whoAreYou && (
        <div 
          ref={aboutRef}
          className={`mt-8 ${highlightedSection === 'about' ? 'highlight-pulse' : ''}`}
        >
          <p className="text-base text-gray-600 leading-relaxed">
            {data.whoAreYou}
          </p>
        </div>
      )}

      {/* Career Highlights */}
      {data.careerHighlights && data.careerHighlights.length > 0 && (
        <div 
          ref={careerRef}
          className={`mt-10 ${highlightedSection === 'career' ? 'highlight-pulse' : ''}`}
        >
          <div className="space-y-6">
            {data.careerHighlights.map((highlight) => (
              <div key={highlight.id} className="space-y-2">
                <div>
                  <h3 className="text-lg font-medium text-black">{highlight.role}</h3>
                  <p className="text-sm text-gray-600">{highlight.organization}</p>
                  {highlight.startDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      {highlight.startDate} - {highlight.current ? 'Present' : highlight.endDate}
                    </p>
                  )}
                </div>
                
                {highlight.achievements && highlight.achievements.length > 0 && (
                  <ul className="space-y-1.5">
                    {highlight.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

