/**
 * URL utilities for handling production and development environments
 * 
 * Production URL: https://www.buildspace.me
 */

/**
 * Get the base URL for the application
 * Prioritizes:
 * 1. Explicit NEXT_PUBLIC_APP_URL env var (https://www.buildspace.me in production)
 * 2. Vercel URL (production/preview)
 * 3. window.location.origin (client-side)
 * 4. localhost fallback (development)
 */
export function getBaseUrl(): string {
  // 1. Check for explicit env var (highest priority)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 2. Vercel deployment URL (production & preview)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // 3. Client-side: use window.location.origin (works for any deployment)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 4. Fallback for local development
  return 'http://localhost:3000';
}

/**
 * Get a portfolio URL for a given slug
 */
export function getPortfolioUrl(slug: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${slug}`;
}

/**
 * Get the display URL (without protocol) for UI
 */
export function getDisplayUrl(): string {
  const baseUrl = getBaseUrl();
  return baseUrl.replace('https://', '').replace('http://', '');
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running on Vercel
 */
export function isVercel(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VERCEL_URL);
}

