'use client';

import { Eye, Pencil, Monitor, Smartphone, Save, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabase';
import { ResizablePanes } from './ResizablePanes';

interface EditorLayoutProps {
  editorPanel: React.ReactNode;
  previewPanel: React.ReactNode;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'edit' | 'preview') => void;
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  onForceSave: () => void;
}

export function EditorLayout({
  editorPanel,
  previewPanel,
  viewMode,
  previewMode,
  onViewModeChange,
  onPreviewModeChange,
  isDirty,
  isSaving,
  lastSaved,
  onForceSave,
}: EditorLayoutProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  const handlePreview = () => {
    router.push('/home');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Portfolio Builder</h1>
          
          {/* Save Status */}
          <div className="text-xs text-gray-500">
            {isSaving ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Saving...
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Unsaved changes
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('edit')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                viewMode === 'edit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onViewModeChange('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* Preview Mode Toggle - Only show in preview mode */}
          {viewMode === 'preview' && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onPreviewModeChange('desktop')}
                className={`p-2 rounded transition-all ${
                  previewMode === 'desktop'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPreviewModeChange('mobile')}
                className={`p-2 rounded transition-all ${
                  previewMode === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Force Save Button */}
          {isDirty && (
            <button
              onClick={onForceSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              Save Now
            </button>
          )}

          {/* Dashboard */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            title="Go to Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          {/* Preview Portfolio */}
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
          >
            <Eye className="w-4 h-4" />
            View Portfolio
          </button>

          {/* Settings */}
          <button
            onClick={() => router.push('/settings')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            title="Account Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'edit' ? (
        <ResizablePanes
          defaultLeftWidth={25}
          minLeftWidth={280}
          maxLeftWidth={600}
          leftPane={
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                  Sections
                </h2>
                {/* Save Status Indicator */}
                <div className="flex items-center gap-1">
                  {isSaving ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-xs text-blue-700 font-medium">Saving</span>
                    </div>
                  ) : isDirty ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-xs text-orange-700 font-medium">Unsaved</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-700 font-medium">Saved</span>
                    </div>
                  )}
                </div>
              </div>
              {editorPanel}
            </div>
          }
          rightPane={
            <div className={`min-h-full ${previewMode === 'mobile' ? 'flex justify-center py-8' : 'py-12'}`}>
              {/* Container with white background */}
              <div className={`bg-white shadow-lg ${
                previewMode === 'mobile' 
                  ? 'w-full max-w-md mx-4 rounded-2xl overflow-hidden' 
                  : 'w-full max-w-6xl mx-auto rounded-3xl overflow-hidden px-16'
              }`}>
                {previewPanel}
              </div>
            </div>
          }
        />
      ) : (
        // Preview mode - Full width, no left panel
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className={`min-h-full ${previewMode === 'mobile' ? 'flex justify-center py-8' : 'py-12'}`}>
            <div className={`bg-white shadow-lg ${
              previewMode === 'mobile' 
                ? 'w-full max-w-md mx-4 rounded-2xl overflow-hidden' 
                : 'w-full max-w-6xl mx-auto rounded-3xl overflow-hidden px-16'
            }`}>
              {previewPanel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

