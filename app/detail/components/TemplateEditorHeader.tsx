/**
 * TemplateEditorHeader - Reusable Header for Template Editors
 * 
 * Same UI as current implementation, extracted for reusability.
 */

'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, Eye, Pencil, Monitor, Smartphone, Check, RefreshCw, ChevronDown } from 'lucide-react';
import { TEMPLATE_CONFIGS } from '@/app/editor/templates/configs';
import type { TemplateType } from '@/app/editor/templates/types';

interface TemplateEditorHeaderProps {
  title: string;
  templateName: string;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: string | null;
  viewMode: 'edit' | 'preview';
  deviceMode: 'desktop' | 'mobile';
  onBack: () => void;
  onViewModeChange: (mode: 'edit' | 'preview') => void;
  onDeviceModeChange: (mode: 'desktop' | 'mobile') => void;
  onChangeTemplate?: () => void; // Optional - for NonAI templates
  isAIGenerated?: boolean; // To hide change template for AI-generated content
  // Dropdown props
  showTemplateDropdown?: boolean;
  onCloseTemplateDropdown?: () => void;
  currentTemplateType?: TemplateType | null;
  onTemplateChange?: (template: TemplateType) => void;
}

export function TemplateEditorHeader({
  title,
  templateName,
  saveStatus,
  lastSaved,
  viewMode,
  deviceMode,
  onBack,
  onViewModeChange,
  onDeviceModeChange,
  onChangeTemplate,
  isAIGenerated = false,
  showTemplateDropdown = false,
  onCloseTemplateDropdown,
  currentTemplateType,
  onTemplateChange,
}: TemplateEditorHeaderProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showTemplateDropdown) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onCloseTemplateDropdown?.();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTemplateDropdown, onCloseTemplateDropdown]);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to editor"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {title || 'Untitled'}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {!isAIGenerated && onChangeTemplate ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={onChangeTemplate}
                      className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors border border-gray-200"
                      title="Change template"
                    >
                      <span className="text-base">{TEMPLATE_CONFIGS.find(t => t.id === currentTemplateType)?.icon || '📄'}</span>
                      <span>{templateName}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Template Dropdown */}
                    {showTemplateDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                        <div className="p-2">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Change Template
                          </div>
                          {TEMPLATE_CONFIGS.filter(t => t.id !== 'blank').map((template) => (
                            <button
                              key={template.id}
                              onClick={() => {
                                onTemplateChange?.(template.id as TemplateType);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                                currentTemplateType === template.id ? 'bg-purple-50 hover:bg-purple-100' : ''
                              }`}
                            >
                              <span className="text-xl flex-shrink-0 mt-0.5">{template.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 text-sm">{template.name}</span>
                                  {currentTemplateType === template.id && (
                                    <Check className="w-4 h-4 text-purple-600" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-0.5">{template.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 p-3 bg-gray-50">
                          <p className="text-xs text-gray-600">
                            💡 Your title and description will be preserved
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <span>{templateName}</span>
                )}
                <span>•</span>
                <span className={`${
                  saveStatus === 'saved' ? 'text-green-600' :
                  saveStatus === 'saving' ? 'text-gray-500' :
                  saveStatus === 'error' ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {saveStatus === 'saved' ? '✓ Saved' :
                   saveStatus === 'saving' ? 'Saving...' :
                   saveStatus === 'error' ? '✗ Error' : 'Unsaved'}
                </span>
                {lastSaved && saveStatus === 'saved' && (
                  <>
                    <span>•</span>
                    <span className="text-gray-400">{lastSaved}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewModeChange('edit')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'edit'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onViewModeChange('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            {viewMode === 'preview' && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button
                  onClick={() => onDeviceModeChange('desktop')}
                  className={`p-2 rounded-lg transition-colors ${
                    deviceMode === 'desktop'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Desktop preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeviceModeChange('mobile')}
                  className={`p-2 rounded-lg transition-colors ${
                    deviceMode === 'mobile'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Mobile preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

