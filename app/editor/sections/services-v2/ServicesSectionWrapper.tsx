/**
 * ServicesSection Wrapper
 * 
 * Wraps the V2 section with the collapsible header UI for consistency
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { ServicesSection as ServicesSectionCore } from './ServicesSection';

interface ServicesSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function ServicesSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId,
  onScrollToSection 
}: ServicesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const serviceCount = (data.services || []).length;
  const prevCountRef = useRef(serviceCount);

  // Auto-expand when new service is added
  useEffect(() => {
    if (serviceCount > prevCountRef.current) {
      console.log('[ServicesSection] 💼 New service added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = serviceCount;
  }, [serviceCount]);
  
  // Create wrapped onScrollToSection that also expands
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'services') {
      console.log('[ServicesSection] Expanding section before scroll');
      setIsExpanded(true);
    }
    onScrollToSection?.(sectionId);
  };

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <ServicesSectionCore
        data={data}
        onChange={onChange}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode={renderMode}
        userId={userId}
        onScrollToSection={handleScrollToSection}
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
          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900">Services</h3>
            <p className="text-xs text-gray-500">What you offer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
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
          <ServicesSectionCore
            data={data}
            onChange={onChange}
            viewMode={viewMode}
            previewMode={previewMode}
            renderMode="editor"
            userId={userId}
            onScrollToSection={handleScrollToSection}
          />
        </div>
      )}
    </div>
  );
}

