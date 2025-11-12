/**
 * Reserved slugs that cannot be claimed by users
 * to prevent conflicts with system routes
 */
export const RESERVED_SLUGS = new Set([
  // App routes
  'editor',
  'dashboard',
  'settings',
  'signin',
  'signup',
  'signout',
  'onboarding',
  'onboarding-v2',
  'preview',
  'publish',
  'detail',
  'project-editor',
  'career-editor',
  'home',
  'debug-data',
  'test-ai',
  
  // API routes
  'api',
  'auth',
  'callback',
  'webhook',
  
  // Admin/System
  'admin',
  'root',
  'system',
  'staff',
  'team',
  
  // Public pages
  'about',
  'contact',
  'help',
  'support',
  'faq',
  'terms',
  'privacy',
  'legal',
  'pricing',
  'blog',
  'docs',
  'documentation',
  
  // Technical
  'static',
  'assets',
  'public',
  '_next',
  'favicon',
  'robots',
  'sitemap',
  'manifest',
  
  // Brand protection
  'portfoliobuilder',
  'official',
  
  // Generic
  'test',
  'demo',
  'example',
  'www',
  'mail',
  'ftp',
  'null',
  'undefined',
  'project',
  'career',
  'strength',
  'testimonial',
]);

/**
 * Slug validation regex
 * - Must start and end with alphanumeric
 * - Can contain hyphens in the middle
 * - 3-30 characters total
 */
export const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

export const MIN_SLUG_LENGTH = 3;
export const MAX_SLUG_LENGTH = 30;

/**
 * Check if a slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

/**
 * Validate slug format
 */
export function isValidSlugFormat(slug: string): boolean {
  return (
    slug.length >= MIN_SLUG_LENGTH &&
    slug.length <= MAX_SLUG_LENGTH &&
    SLUG_REGEX.test(slug) &&
    !slug.includes('--') && // No consecutive hyphens
    !/^\d+$/.test(slug) // Not just numbers
  );
}

/**
 * Sanitize slug input as user types
 * Removes invalid characters and formats properly
 */
export function sanitizeSlugInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
    .replace(/^-+|-+$/g, '')    // Remove leading/trailing hyphens
    .replace(/-{2,}/g, '-')     // Replace multiple hyphens with single
    .slice(0, MAX_SLUG_LENGTH); // Max length
}

/**
 * Generate a slug from a name
 * Example: "John Doe" -> "john-doe"
 */
export function generateSlugFromName(name: string): string {
  return sanitizeSlugInput(
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
  );
}

/**
 * Get validation errors for a slug
 */
export function getSlugValidationErrors(slug: string): string[] {
  const errors: string[] = [];
  
  if (!slug || slug.length === 0) {
    errors.push('URL is required');
    return errors;
  }
  
  if (slug.length < MIN_SLUG_LENGTH) {
    errors.push(`URL must be at least ${MIN_SLUG_LENGTH} characters`);
  }
  
  if (slug.length > MAX_SLUG_LENGTH) {
    errors.push(`URL must be no more than ${MAX_SLUG_LENGTH} characters`);
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('URL can only contain lowercase letters, numbers, and hyphens');
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('URL cannot start or end with a hyphen');
  }
  
  if (slug.includes('--')) {
    errors.push('URL cannot contain consecutive hyphens');
  }
  
  if (/^\d+$/.test(slug)) {
    errors.push('URL cannot be only numbers');
  }
  
  if (isReservedSlug(slug)) {
    errors.push('This URL is reserved and cannot be used');
  }
  
  return errors;
}

