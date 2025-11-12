/**
 * PublishOverlayController - Main controller for publish flow
 * 
 * Manages state and transitions between slug creation and publish views
 */

'use client';

import { useState, useEffect } from 'react';
import { PublishOverlay, OverlayHeader, OverlayBody, OverlayFooter } from './PublishOverlay';
import { SlugCreationView } from './SlugCreationView';
import { PublishStatusView } from './PublishStatusView';
import { type PublishButtonState } from './PublishButton';
import { getPublishStatus, claimSlug, publishPortfolio } from '@/lib/publishing';

interface PublishOverlayControllerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  portfolioData: any;
}

export function PublishOverlayController({
  isOpen,
  onClose,
  userId,
  portfolioData,
}: PublishOverlayControllerProps) {
  const [view, setView] = useState<'slug' | 'status'>('slug');
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [publishButtonState, setPublishButtonState] = useState<PublishButtonState>('ready');
  const [loading, setLoading] = useState(true);

  // Load current status on open
  useEffect(() => {
    if (isOpen && userId) {
      loadStatus();
    }
  }, [isOpen, userId]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const status = await getPublishStatus(userId);
      
      if (status.slug) {
        // User already has a slug, skip to status view
        setCurrentSlug(status.slug);
        setPortfolioUrl(status.url || '');
        setIsPublished(status.isPublished);
        setPublishButtonState(status.isPublished ? 'update' : 'ready');
        setView('status');
      } else {
        // No slug, start with slug creation
        setView('slug');
      }
    } catch (error) {
      console.error('[PublishOverlay] Failed to load status:', error);
      setView('slug');
    } finally {
      setLoading(false);
    }
  };

  const handleSlugClaimed = async (slug: string) => {
    try {
      // Claim the slug
      const result = await claimSlug(userId, slug);
      
      if (!result.success) {
        console.error('[PublishOverlay] Failed to claim slug:', result.error);
        return;
      }

      // Update state and transition to status view
      setCurrentSlug(slug);
      setPortfolioUrl(result.url || '');
      setPublishButtonState('ready');
      setView('status');
    } catch (error) {
      console.error('[PublishOverlay] Error claiming slug:', error);
    }
  };

  const handlePublish = async () => {
    if (publishButtonState === 'loading') return;

    setPublishButtonState('loading');

    try {
      console.log('[PublishOverlay] Publishing portfolio...', {
        userId,
        portfolioDataKeys: Object.keys(portfolioData),
      });

      const result = await publishPortfolio(userId, portfolioData);

      if (!result.success) {
        console.error('[PublishOverlay] Publish failed:', result.error);
        setPublishButtonState('error');
        setTimeout(() => {
          setPublishButtonState(isPublished ? 'update' : 'ready');
        }, 3000);
        return;
      }

      // Success! Transition through states
      setPublishButtonState('published');
      setIsPublished(true);
      
      // Auto-transition to update state after 2 seconds
      setTimeout(() => {
        setPublishButtonState('update');
      }, 2000);

      // Optional: Auto-close after success
      // setTimeout(() => {
      //   onClose();
      // }, 3000);

    } catch (error: any) {
      console.error('[PublishOverlay] Publish error:', error);
      setPublishButtonState('error');
      setTimeout(() => {
        setPublishButtonState(isPublished ? 'update' : 'ready');
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <PublishOverlay isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <OverlayHeader
        title={view === 'slug' ? 'Choose Your Portfolio URL' : 'Your Portfolio'}
        onClose={onClose}
        badge={
          isPublished && view === 'status' ? (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              Published
            </span>
          ) : null
        }
      />

      {/* Body */}
      <OverlayBody>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        ) : view === 'slug' ? (
          <SlugCreationView
            userId={userId}
            currentSlug={currentSlug || undefined}
            onSlugClaimed={handleSlugClaimed}
          />
        ) : (
          <PublishStatusView
            userId={userId}
            portfolioUrl={portfolioUrl}
            portfolioData={portfolioData}
            isPublished={isPublished}
            onPublish={handlePublish}
            publishButtonState={publishButtonState}
          />
        )}
      </OverlayBody>
    </PublishOverlay>
  );
}


