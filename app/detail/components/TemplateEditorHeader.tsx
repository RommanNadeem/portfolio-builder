/**
 * TemplateEditorHeader - Reusable Header for Template Editors
 * 
 * Same UI as current implementation, extracted for reusability.
 */

'use client';

import { ArrowLeft, Eye, Pencil, Monitor, Smartphone, Check } from 'lucide-react';

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
}: TemplateEditorHeaderProps) {
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
                <span>{templateName}</span>
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

