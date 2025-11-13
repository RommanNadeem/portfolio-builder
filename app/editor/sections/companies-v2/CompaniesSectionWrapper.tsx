/**
 * CompaniesSection Wrapper
 * 
 * Wraps the V2 section with the old collapsible header UI for compatibility
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { CompaniesSection as CompaniesSectionCore } from './CompaniesSection';

interface CompaniesSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
  userId?: string;
}

export function CompaniesSection({ 
  data, 
  onChange, 
  viewMode, 
  previewMode, 
  renderMode,
  userId 
}: CompaniesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Track company count from the string/array (memoized)
  const { companiesArray, companyCount } = useMemo(() => {
    const companiesString = data.sliderCompanies || data.companies || '';
    const arr = typeof companiesString === 'string' 
      ? companiesString.split(',').map((c: string) => c.trim()).filter(Boolean)
      : Array.isArray(companiesString) 
        ? companiesString 
        : [];
    return {
      companiesArray: arr,
      companyCount: arr.length,
    };
  }, [data.sliderCompanies, data.companies]);
  
  const prevCountRef = useRef(companyCount);

  // Auto-expand when new company is added
  useEffect(() => {
    if (companyCount > prevCountRef.current) {
      console.log('[CompaniesSection] 🏢 New company added, expanding section');
      setIsExpanded(true);
    }
    prevCountRef.current = companyCount;
  }, [companyCount]);

  // In preview renderMode, pass through to core component
  if (renderMode === 'preview') {
    return (
      <CompaniesSectionCore
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
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900">Companies Slider</h3>
            <p className="text-xs text-gray-600">Show trusted companies</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-sm text-gray-700 font-medium">
              {companiesArray.length} {companiesArray.length === 1 ? 'company' : 'companies'}
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
          <CompaniesSectionCore
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

