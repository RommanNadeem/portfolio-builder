'use client';

import { useState, useEffect } from 'react';
import { Copy, ExternalLink, RefreshCw, MoreVertical, EyeOff, Clock, Check, Upload, AlertTriangle } from 'lucide-react';
import { getPublishStatus, unpublishPortfolio } from '@/lib/publishing';
import { EVENTS, onPublishEvent } from '@/lib/events';

interface PublishingBarProps {
  userId: string;
  onPublishClick: () => void;
}

export function PublishingBar({ userId, onPublishClick }: PublishingBarProps) {
  const [status, setStatus] = useState<{
    isPublished: boolean;
    slug: string | null;
    url: string | null;
    lastPublishedAt: string | null;
  }>({
    isPublished: false,
    slug: null,
    url: null,
    lastPublishedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  // Load status on mount
  useEffect(() => {
    loadStatus();
  }, [userId]);

  // Listen for publish events and auto-reload
  useEffect(() => {
    const unsubscribePublished = onPublishEvent(
      EVENTS.PORTFOLIO_PUBLISHED,
      (detail) => {
        console.log('[PublishingBar] Portfolio published event received', detail);
        loadStatus();
        // Show success animation
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
      }
    );

    const unsubscribeUnpublished = onPublishEvent(
      EVENTS.PORTFOLIO_UNPUBLISHED,
      (detail) => {
        console.log('[PublishingBar] Portfolio unpublished event received', detail);
        loadStatus();
      }
    );

    const unsubscribeStatusChange = onPublishEvent(
      EVENTS.PUBLISH_STATUS_CHANGED,
      (detail) => {
        console.log('[PublishingBar] Status change event received', detail);
        loadStatus();
      }
    );

    return () => {
      unsubscribePublished();
      unsubscribeUnpublished();
      unsubscribeStatusChange();
    };
  }, [userId]);

  const loadStatus = async () => {
    setLoading(true);
    const result = await getPublishStatus(userId);
    setStatus(result);
    setLoading(false);
  };

  const handleCopyLink = () => {
    if (status.url) {
      navigator.clipboard.writeText(status.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnpublish = async () => {
    setUnpublishing(true);
    const result = await unpublishPortfolio(userId);
    if (result.success) {
      await loadStatus();
      setShowUnpublishConfirm(false);
      setShowMenu(false);
    } else {
      alert(result.error || 'Failed to unpublish');
    }
    setUnpublishing(false);
  };

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-40 relative">
      {/* Success animation overlay */}
      {showSuccessAnimation && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-5 animate-pulse pointer-events-none" />
      )}
      
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Status Section - Left */}
        <div className="flex items-center gap-3">
          {status.isPublished ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Draft</span>
            </>
          )}
        </div>

        {/* Actions Section - Right */}
        <div className="flex items-center gap-2">
          {status.isPublished ? (
            <>
              {/* Icon Buttons */}
              <button
                onClick={handleCopyLink}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={copied ? 'Copied!' : 'Copy URL'}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              
              <a
                href={status.url || '#'}
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
                <span className="hidden sm:inline">Publish Changes</span>
                <span className="sm:hidden">Update</span>
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
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          // TODO: Open version history
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Version History
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
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
            <button
              onClick={onPublishClick}
              className="px-6 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              <Upload className="w-4 h-4" />
              Publish Portfolio
            </button>
          )}
        </div>
      </div>

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

