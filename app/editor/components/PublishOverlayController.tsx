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
      console.log('[PublishOverlay] Claiming slug:', slug);
      
      // Claim the slug
      const result = await claimSlug(userId, slug);
      
      if (!result.success) {
        console.error('[PublishOverlay] Failed to claim slug:', result.error);
        alert(result.error || 'Failed to claim URL. Please try another.');
        return;
      }

      console.log('[PublishOverlay] Slug claimed successfully:', result);

      // Update state and transition to status view
      // Note: We pass the slug directly to publishPortfolio() to avoid race conditions
      // So we don't need strict verification here
      setCurrentSlug(slug);
      setPortfolioUrl(result.url || '');
      setPublishButtonState('ready');
      setView('status');
    } catch (error) {
      console.error('[PublishOverlay] Error claiming slug:', error);
      alert('An error occurred while claiming your URL. Please try again.');
    }
  };

  const handlePublish = async () => {
    if (publishButtonState === 'loading') return;

    // Safety check: Ensure slug exists before publishing
    if (!currentSlug) {
      console.error('[PublishOverlay] No slug available, cannot publish');
      alert('Please claim your portfolio URL first');
      setView('slug');
      return;
    }

    setPublishButtonState('loading');

    try {
      console.log('[PublishOverlay] Publishing portfolio...', {
        userId,
        currentSlug,
        portfolioDataKeys: Object.keys(portfolioData),
      });

      // Pass the slug directly to avoid race condition where DB query doesn't see the just-saved slug
      const result = await publishPortfolio(userId, portfolioData, currentSlug || undefined);

      if (!result.success) {
        console.error('[PublishOverlay] Publish failed:', result.error);
        
        // If slug is missing, redirect back to slug creation
        if (result.error?.includes('portfolio URL')) {
          alert(result.error);
          setView('slug');
          setPublishButtonState('ready');
          return;
        }
        
        setPublishButtonState('error');
        setTimeout(() => {
          setPublishButtonState(isPublished ? 'update' : 'ready');
        }, 3000);
        return;
      }

      // Success! Transition through states
      setPublishButtonState('published');
      setIsPublished(true);
      
      // Update URL if it changed
      if (result.url) {
        setPortfolioUrl(result.url);
      }
      
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


