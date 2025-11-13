/**
 * ProjectsSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectsSection as ProjectsSectionCore } from './ProjectsSection';

interface ProjectsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function ProjectsSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId,
  onScrollToSection 
}: ProjectsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const projectCount = (data.projects || []).length;
  const prevCountRef = useRef(projectCount);

  // Auto-expand when new project is added (count increases)
  useEffect(() => {
    if (projectCount > prevCountRef.current) {
      // New project added - expand to show it
      console.log('[ProjectsSection] 📦 New project added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = projectCount;
  }, [projectCount]);
  
  // Create wrapped onScrollToSection that also expands
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'projects') {
      console.log('[ProjectsSection] Expanding section before scroll');
      setIsExpanded(true);
    }
    onScrollToSection?.(sectionId);
  };

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <ProjectsSectionCore
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
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900">Projects</h3>
            <p className="text-xs text-gray-600">Showcase your work</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-700 font-medium">
              {projectCount} {projectCount === 1 ? 'project' : 'projects'}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Content - only render when expanded */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <ProjectsSectionCore
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

