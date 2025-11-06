/**
 * Telemetry system - tracks onboarding events and user behavior
 * Logs to console for now, can be extended to send to analytics services
 */

export type TelemetryEvent = 
  | { kind: 'onboarding_started'; payload: {} }
  | { kind: 'import_resume_started'; payload: { fileSize: number; fileType: string } }
  | { kind: 'import_resume_succeeded'; payload: { fieldsExtracted: number; duration: number } }
  | { kind: 'import_resume_failed'; payload: { error: string } }
  | { kind: 'import_linkedin_started'; payload: { url: string } }
  | { kind: 'import_linkedin_succeeded'; payload: { fieldsExtracted: number; duration: number } }
  | { kind: 'import_linkedin_failed'; payload: { error: string } }
  | { kind: 'preview_shown'; payload: { hasExperiences: boolean; hasProjects: boolean } }
  | { kind: 'field_edited'; payload: { field: string; value?: string } }
  | { kind: 'signup_shown'; payload: {} }
  | { kind: 'signup_completed'; payload: { method: string } }
  | { kind: 'published'; payload: { slug: string; theme: string; isPublic: boolean } };

/**
 * Track an event
 */
export function track(event: TelemetryEvent): void {
  const timestamp = new Date().toISOString();
  
  console.log('[Telemetry]', {
    ...event,
    timestamp,
  });
  
  // TODO: Send to analytics service (Mixpanel, Amplitude, PostHog, etc.)
  // Example:
  // await fetch('/api/telemetry', {
  //   method: 'POST',
  //   body: JSON.stringify({ ...event, timestamp })
  // });
}

/**
 * Track timing for async operations
 */
export async function trackTiming<T>(
  eventName: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    
    console.log(`[Timing] ${eventName}: ${duration}ms`);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Timing] ${eventName} failed after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Track page view
 */
export function trackPageView(page: string): void {
  console.log('[PageView]', page);
}

/**
 * Create a telemetry context for a session
 */
export class TelemetrySession {
  private sessionId: string;
  private startTime: number;
  
  constructor() {
    this.sessionId = Math.random().toString(36).substring(2);
    this.startTime = Date.now();
  }
  
  track(event: TelemetryEvent): void {
    const sessionData = {
      ...event,
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.startTime,
    };
    
    console.log('[Telemetry]', sessionData);
  }
  
  getSessionId(): string {
    return this.sessionId;
  }
  
  getDuration(): number {
    return Date.now() - this.startTime;
  }
}

