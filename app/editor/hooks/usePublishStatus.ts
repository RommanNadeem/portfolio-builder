/**
 * usePublishStatus Hook
 * 
 * Manages publish status with automatic updates via events
 */

import { useState, useEffect } from 'react';
import { getPublishStatus } from '@/lib/publishing';
import { EVENTS, onPublishEvent } from '@/lib/events';

interface PublishStatus {
  isPublished: boolean;
  url: string | null;
  slug: string | null;
}

export function usePublishStatus(userId: string | undefined) {
  const [status, setStatus] = useState<PublishStatus>({
    isPublished: false,
    url: null,
    slug: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadStatus = async () => {
      try {
        const result = await getPublishStatus(userId);
        setStatus({
          isPublished: result.isPublished,
          url: result.url,
          slug: result.slug,
        });
      } catch (error) {
        console.error('[usePublishStatus] Failed to load status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();

    // Listen for publish events and auto-reload
    const unsubscribePublished = onPublishEvent(
      EVENTS.PORTFOLIO_PUBLISHED,
      () => {
        console.log('[usePublishStatus] Portfolio published, reloading status');
        loadStatus();
      }
    );

    const unsubscribeUnpublished = onPublishEvent(
      EVENTS.PORTFOLIO_UNPUBLISHED,
      () => {
        console.log('[usePublishStatus] Portfolio unpublished, reloading status');
        loadStatus();
      }
    );

    const unsubscribeStatusChange = onPublishEvent(
      EVENTS.PUBLISH_STATUS_CHANGED,
      () => {
        console.log('[usePublishStatus] Publish status changed, reloading');
        loadStatus();
      }
    );

    return () => {
      unsubscribePublished();
      unsubscribeUnpublished();
      unsubscribeStatusChange();
    };
  }, [userId]);

  return { status, loading };
}


