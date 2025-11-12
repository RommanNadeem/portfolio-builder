/**
 * ResumeSection Wrapper
 * 
 * Wraps the V2 section with the collapsible header UI for consistency
 */

'use client';

import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { ResumeSection as ResumeSectionCore } from './ResumeSection';

interface ResumeSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
}

export function ResumeSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId 
}: ResumeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Check both locations where resume can be stored
  const hasResume = Boolean(
    (data.resume && data.resume.trim().length > 0) || 
    (data.profile?.resume_url && data.profile.resume_url.trim().length > 0)
  );

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <ResumeSectionCore
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
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900">Resume</h3>
            <p className="text-xs text-gray-500">Your PDF resume</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {hasResume ? 'Uploaded' : 'Not uploaded'}
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
          <ResumeSectionCore
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

