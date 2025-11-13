'use client';

import { useState } from 'react';
import { Eye, Pencil, Monitor, Smartphone, LogOut, Settings, LayoutDashboard, ArrowLeft, Copy, ExternalLink, RefreshCw, Upload, MoreVertical, Check, EyeOff, AlertTriangle } from 'lucide-react';
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
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

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
    
    setUnpublishing(true);
    const result = await unpublishPortfolio(userId);
    if (result.success) {
      setShowMenu(false);
      setShowUnpublishConfirm(false);
    } else {
      alert(result.error || 'Failed to unpublish');
    }
    setUnpublishing(false);
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
          
          <h1 className="text-xl font-bold text-gray-900">BuildSpace</h1>
          
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

        {/* CENTER: Empty (reserved for future use) */}
        <div></div>

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
                    className="px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden lg:inline">Publish Changes</span>
                    <span className="lg:hidden">Update</span>
                  </button>

                  {/* Live Indicator */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">Live</span>
                  </div>

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
                              setShowUnpublishConfirm(true);
                            }}
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
                /* Publish Portfolio Button + Unpublished Indicator */
                <>
                  <button
                    onClick={onPublishClick}
                    className="px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden lg:inline">Publish Portfolio</span>
                    <span className="lg:hidden">Publish</span>
                  </button>

                  {/* Not Published Indicator */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-semibold text-amber-700">Not Published</span>
                  </div>
                </>
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
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Sections
                </h2>
                {/* Save Status Indicator */}
                <div className="flex items-center gap-1">
                  {isSaving ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs text-emerald-700 font-semibold">Saving</span>
                    </div>
                  ) : isDirty ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-xs text-amber-700 font-semibold">Unsaved</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-emerald-700 font-semibold">Saved</span>
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

      {/* Unpublish Confirmation Modal */}
      {showUnpublishConfirm && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[200] p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.18)' }}
          onClick={() => setShowUnpublishConfirm(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Unpublish Your Portfolio?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your portfolio will no longer be accessible at its public URL. You can republish it anytime.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-blue-800">
                💡 <strong>Good to know:</strong> Your work won't be deleted—it'll still be safe in your editor. You can republish whenever you're ready.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnpublishConfirm(false)}
                disabled={unpublishing}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Keep Published
              </button>
              <button
                onClick={handleUnpublish}
                disabled={unpublishing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                {unpublishing ? 'Unpublishing...' : 'Unpublish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

