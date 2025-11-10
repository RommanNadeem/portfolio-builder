/**
 * SocialLinksSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { SocialLinksSection as SocialLinksSectionCore } from './SocialLinksSection';

interface SocialLinksSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
}

export function SocialLinksSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId 
}: SocialLinksSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const socialLinkCount = (data.socialLinks || []).length;
  const prevCountRef = useRef(socialLinkCount);

  // Auto-expand when new social link is added
  useEffect(() => {
    if (socialLinkCount > prevCountRef.current) {
      console.log('[SocialLinksSection] 🔗 New social link added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = socialLinkCount;
  }, [socialLinkCount]);

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <SocialLinksSectionCore
        data={data}
        onChange={onChange}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode={renderMode}
        userId={userId}
      />
    );
  }

  // In editor renderMode, wrap with collapsible header
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
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {(data.socialLinks || []).length} social {(data.socialLinks || []).length === 1 ? 'link' : 'links'}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content - only render when expanded */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <SocialLinksSectionCore
            data={data}
            onChange={onChange}
            viewMode={viewMode}
            previewMode={previewMode}
            renderMode="editor"
            userId={userId}
          />
        </div>
      )}
    </div>
  );
}

