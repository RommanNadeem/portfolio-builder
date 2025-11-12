/**
 * Event System for Portfolio Publishing
 * 
 * Provides a simple event emitter/listener system for cross-component communication.
 * Used primarily for auto-updating PublishingBar when publish status changes.
 */

// Event types
export const EVENTS = {
  PORTFOLIO_PUBLISHED: 'portfolio-published',
  PORTFOLIO_UNPUBLISHED: 'portfolio-unpublished',
  PUBLISH_STATUS_CHANGED: 'publish-status-changed',
  SLUG_CLAIMED: 'slug-claimed',
} as const;

export type PublishEventType = typeof EVENTS[keyof typeof EVENTS];

interface PublishEventDetail {
  userId?: string;
  url?: string;
  slug?: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Emit a publish-related event
 */
export function emitPublishEvent(type: PublishEventType, detail?: Partial<PublishEventDetail>) {
  if (typeof window === 'undefined') return;

  const eventDetail: PublishEventDetail = {
    timestamp: new Date().toISOString(),
    ...detail,
  };

  window.dispatchEvent(
    new CustomEvent(type, {
      detail: eventDetail,
    })
  );

  console.log(`[PublishEvent] Emitted: ${type}`, eventDetail);
}

/**
 * Listen for publish-related events
 * Returns cleanup function
 */
export function onPublishEvent(
  type: PublishEventType,
  callback: (detail: PublishEventDetail) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<PublishEventDetail>;
    callback(customEvent.detail);
  };

  window.addEventListener(type, handler);

  return () => {
    window.removeEventListener(type, handler);
  };
}

/**
 * Listen for multiple event types
 */
export function onPublishEvents(
  types: PublishEventType[],
  callback: (type: PublishEventType, detail: PublishEventDetail) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handlers = types.map((type) => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<PublishEventDetail>;
      callback(type, customEvent.detail);
    };

    window.addEventListener(type, handler);

    return () => window.removeEventListener(type, handler);
  });

  return () => {
    handlers.forEach((cleanup) => cleanup());
  };
}


