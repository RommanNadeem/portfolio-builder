'use client';

import { useState } from 'react';
import { Eye, Pencil, Monitor, Smartphone, LogOut, Settings, LayoutDashboard, ArrowLeft, Copy, ExternalLink, RefreshCw, Upload, MoreVertical, Check, EyeOff, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabase';
import { unpublishPortfolio } from '@/lib/publishing';
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
  // Publish-related props
  userId?: string;
  onPublishClick?: () => void;
  publishStatus?: {
    isPublished: boolean;
    url: string | null;
    slug: string | null;
  };
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
  userId,
  onPublishClick,
  publishStatus,
}: EditorLayoutProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  const handleCopyUrl = () => {
    if (publishStatus?.url) {
      navigator.clipboard.writeText(publishStatus.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnpublish = async () => {
    if (!userId) return;
    if (!confirm('Are you sure you want to unpublish your portfolio?')) return;

    const result = await unpublishPortfolio(userId);
    if (result.success) {
      setShowMenu(false);
    } else {
      alert(result.error || 'Failed to unpublish');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Unified Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        {/* LEFT: Dashboard + Branding + Save Status */}
        <div className="flex items-center gap-4">
          {/* Dashboard Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          <div className="h-6 w-px bg-gray-300" /> {/* Divider */}
          
          <h1 className="text-xl font-bold text-gray-900">Portfolio Builder</h1>
          
          {/* Save Status */}
          <div className="text-xs text-gray-500">
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Saving...
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Unsaved
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            ) : null}
          </div>
        </div>

        {/* CENTER: Publish Status */}
        {userId && publishStatus && (
          <>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                publishStatus.isPublished ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {publishStatus.isPublished ? 'Live' : 'Draft'}
              </span>
            </div>
          </>
        )}

        {/* RIGHT: Controls + Publish Actions + Settings */}
        <div className="flex items-center gap-2">
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

          {/* PUBLISH ACTIONS */}
          {userId && publishStatus && onPublishClick && (
            <>
              <div className="h-6 w-px bg-gray-300" /> {/* Divider */}
              
              {publishStatus.isPublished ? (
                <>
                  {/* Copy URL */}
                  <button
                    onClick={handleCopyUrl}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title={copied ? 'Copied!' : 'Copy URL'}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* View Site */}
                  <a
                    href={publishStatus.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Live Site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Publish Changes Button */}
                  <button
                    onClick={onPublishClick}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Publish Changes</span>
                    <span className="lg:hidden">Update</span>
                  </button>

                  {/* More Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-[100]"
                          onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[101]">
                          <button
                            onClick={() => {
                              setShowMenu(false);
                              // TODO: Implement change URL
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Change URL
                          </button>
                          <div className="border-t border-gray-200 my-1" />
                          <button
                            onClick={handleUnpublish}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <EyeOff className="w-4 h-4" />
                            Unpublish Portfolio
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                /* Publish Portfolio Button */
                <button
                  onClick={onPublishClick}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden lg:inline">Publish Portfolio</span>
                  <span className="lg:hidden">Publish</span>
                </button>
              )}
            </>
          )}

          <div className="h-6 w-px bg-gray-300" /> {/* Divider */}

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
                  : 'w-full max-w-6xl mx-auto rounded-3xl overflow-hidden'
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
                : 'w-full max-w-6xl mx-auto rounded-3xl overflow-hidden'
            }`}>
              {previewPanel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

