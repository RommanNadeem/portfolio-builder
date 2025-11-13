import { supabase } from './supabase';
import { getCompletePortfolio, convertToLegacyFormat } from './database';
import { isReservedSlug, isValidSlugFormat, generateSlugFromName } from './reserved-slugs';
import { EVENTS, emitPublishEvent } from './events';
import { getBaseUrl, getPortfolioUrl } from './url-utils';
import type { 
  PublishResult, 
  SlugAvailability, 
  ValidationResult,
  PortfolioData,
  PublishedPortfolio 
} from './types';

const DEBUG = process.env.NODE_ENV === 'development';

// ============================================
// SLUG MANAGEMENT
// ============================================

/**
 * Check if a slug is available globally
 * Returns false if ANY user has claimed it
 */
export async function checkSlugAvailability(
  slug: string,
  currentUserId?: string
): Promise<SlugAvailability> {
  try {
    // Normalize slug
    const normalizedSlug = slug.toLowerCase().trim();

    // Format validation
    if (!isValidSlugFormat(normalizedSlug)) {
      return {
        available: false,
        error: 'Invalid format. Use 3-30 characters: lowercase letters, numbers, and hyphens only.',
      };
    }

    // Reserved check
    if (isReservedSlug(normalizedSlug)) {
      return {
        available: false,
        error: 'This URL is reserved and cannot be used.',
      };
    }

    // ⭐ CRITICAL: GLOBAL database check (across ALL users)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('portfolio_slug', normalizedSlug)
      .maybeSingle();

    if (error) {
      if (DEBUG) {
        console.error('Slug availability check error:', error.message);
      }
      return { available: false, error: error.message };
    }

    // If taken by current user, it's available to them
    if (data && data.id === currentUserId) {
      return { 
        available: true,
        takenByCurrentUser: true 
      };
    }

    // If taken by someone else
    if (data) {
      const suggestions = await generateSlugSuggestions(normalizedSlug);
      return {
        available: false,
        error: 'This URL is already taken by another user.',
        suggestions,
      };
    }

    return { available: true };
  } catch (error: any) {
    return { available: false, error: error.message };
  }
}

/**
 * Generate alternative slug suggestions
 */
async function generateSlugSuggestions(baseSlug: string): Promise<string[]> {
  const suggestions: string[] = [];

  // Try adding numbers
  for (let i = 1; i <= 5; i++) {
    const variant = `${baseSlug}-${i}`;
    const check = await checkSlugAvailability(variant);
    if (check.available) {
      suggestions.push(variant);
    }
    if (suggestions.length >= 3) break;
  }

  // Add a random string variant if needed
  if (suggestions.length < 3) {
    const randomStr = Math.random().toString(36).substring(2, 5);
    const variant = `${baseSlug}-${randomStr}`;
    suggestions.push(variant);
  }

  return suggestions;
}

/**
 * Claim a slug for a user (stores in profiles.portfolio_slug)
 */
export async function claimSlug(
  userId: string,
  slug: string
): Promise<PublishResult> {
  try {
    const normalizedSlug = slug.toLowerCase().trim();
    
    // Check availability
    const availability = await checkSlugAvailability(normalizedSlug, userId);
    if (!availability.available && !availability.takenByCurrentUser) {
      return {
        success: false,
        error: availability.error || 'Slug not available',
      };
    }

    // Claim the slug
    const { error } = await supabase
      .from('profiles')
      .update({ portfolio_slug: normalizedSlug })
      .eq('id', userId);

    if (error) {
      // Handle race condition
      if (error.code === '23505') {
        return {
          success: false,
          error: 'This URL was just claimed by another user. Please try another.',
        };
      }
      return { success: false, error: error.message };
    }

    if (DEBUG) console.log(`[Publishing] Slug claimed: ${normalizedSlug}`);

    // Emit event
    emitPublishEvent(EVENTS.SLUG_CLAIMED, {
      userId,
      slug: normalizedSlug,
      url: getPortfolioUrl(normalizedSlug),
    });

    return {
      success: true,
      slug: normalizedSlug,
      url: getPortfolioUrl(normalizedSlug),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Auto-suggest a slug from user's name
 */
export async function suggestSlugFromProfile(userId: string): Promise<string | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (!profile?.full_name) return null;

    const baseSlug = generateSlugFromName(profile.full_name);
    const availability = await checkSlugAvailability(baseSlug, userId);

    if (availability.available) {
      return baseSlug;
    }

    // Return first suggestion if base is taken
    return availability.suggestions?.[0] || null;
  } catch (error) {
    console.error('Error suggesting slug:', error);
    return null;
  }
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate portfolio data before publishing
 * Accepts both legacy format (from editor) and PortfolioData format
 */
export function validateBeforePublish(portfolio: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Handle both formats: legacy (editor) and PortfolioData (database)
  const fullName = portfolio.fullName || portfolio.profile?.full_name;
  const profession = portfolio.profession || portfolio.profile?.profession;
  const email = portfolio.email || portfolio.profile?.email;
  const profileImage = portfolio.profileImage || portfolio.profile?.profile_image_url;
  const projects = portfolio.projects || [];
  const careerHighlights = portfolio.careerHighlights || [];
  const strengths = portfolio.strengths || [];

  // CRITICAL: Must have basic profile info
  if (!fullName?.trim()) {
    errors.push('Full name is required');
  }

  if (!profession?.trim()) {
    errors.push('Profession/title is required');
  }

  if (!email?.trim()) {
    warnings.push('Email is recommended for contact');
  }

  // Check email format if provided
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  // CRITICAL: Must have at least some content
  const totalContent =
    projects.length +
    careerHighlights.length +
    strengths.length;

  if (totalContent === 0) {
    errors.push('Add at least one project, career highlight, or strength before publishing');
  }

  // Warn about empty sections
  if (projects.length === 0) {
    warnings.push('No projects added - consider adding at least one');
  }

  if (careerHighlights.length === 0) {
    warnings.push('No career highlights - consider adding your experience');
  }

  // Check profile image
  if (!profileImage) {
    warnings.push('Profile photo missing - adds professionalism');
  }

  return {
    canPublish: errors.length === 0,
    errors,
    warnings,
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// PUBLISHING OPERATIONS
// ============================================

/**
 * Publish a portfolio (creates snapshot in published_portfolios)
 * @param userId - User ID
 * @param portfolioData - Optional: Use provided data instead of fetching from DB
 * @param expectedSlug - Optional: Use this slug instead of querying DB (prevents race conditions)
 */
export async function publishPortfolio(
  userId: string, 
  portfolioData?: any,
  expectedSlug?: string
): Promise<PublishResult> {
  try {
    if (DEBUG) console.log(`[Publishing] Starting publish for user: ${userId}`, { expectedSlug });

    // Step 1: Check if user has claimed a slug
    const { data: profile } = await supabase
      .from('profiles')
      .select('portfolio_slug, is_portfolio_published, full_name')
      .eq('id', userId)
      .single();

    // If expectedSlug is provided, use it (trust the caller - prevents race conditions)
    // Otherwise, check the database
    const effectiveSlug = expectedSlug || profile?.portfolio_slug;
    
    if (!effectiveSlug) {
      return {
        success: false,
        error: 'Please choose your portfolio URL first',
      };
    }
    
    if (DEBUG && expectedSlug && expectedSlug !== profile?.portfolio_slug) {
      console.log(`[Publishing] ⚠️ Using expectedSlug "${expectedSlug}" (DB has: "${profile?.portfolio_slug || 'null'}")`);
    }

    let snapshotData: any;

    // If portfolio data is provided (from editor), use it directly
    if (portfolioData) {
      if (DEBUG) {
        console.log(`[Publishing] Using provided portfolio data:`, {
          projects: portfolioData.projects?.length || 0,
          careerHighlights: portfolioData.careerHighlights?.length || 0,
          strengths: portfolioData.strengths?.length || 0,
          testimonials: portfolioData.testimonials?.length || 0,
          faqs: portfolioData.faqs?.length || 0,
          services: portfolioData.services?.length || 0,
          resume: Boolean(portfolioData.resume || portfolioData.profile?.resume_url),
        });
      }

      // Validate content
      const validation = validateBeforePublish(portfolioData);
      if (!validation.canPublish) {
        return {
          success: false,
          error: validation.errors.join('; '),
        };
      }

      // Use the provided data directly (already in legacy format)
      snapshotData = portfolioData;
    } else {
      // Fallback: Fetch from database
      if (DEBUG) console.log(`[Publishing] No data provided, fetching from DB...`);
      
      const { data: dbPortfolioData, error: fetchError } = await getCompletePortfolio(userId);

      if (fetchError || !dbPortfolioData) {
        return {
          success: false,
          error: fetchError || 'Failed to fetch portfolio data',
        };
      }

      if (DEBUG) {
        console.log(`[Publishing] Raw portfolio data from DB:`, {
          profile: !!dbPortfolioData.profile,
          projects: dbPortfolioData.projects.length,
          careerHighlights: dbPortfolioData.careerHighlights.length,
          strengths: dbPortfolioData.strengths.length,
          testimonials: dbPortfolioData.testimonials.length,
          faqs: dbPortfolioData.faqs?.length || 0,
          services: dbPortfolioData.services?.length || 0,
          resume: Boolean(dbPortfolioData.profile?.resume_url),
        });
      }

      // Convert to legacy format (client-side format)
      const legacyPortfolio = convertToLegacyFormat(dbPortfolioData);
      
      if (DEBUG) {
        console.log(`[Publishing] After conversion to legacy:`, {
          fullName: legacyPortfolio.fullName,
          projects: legacyPortfolio.projects?.length || 0,
          careerHighlights: legacyPortfolio.careerHighlights?.length || 0,
          strengths: legacyPortfolio.strengths?.length || 0,
        });
      }

      // Validate content
      const validation = validateBeforePublish(legacyPortfolio);
      if (!validation.canPublish) {
        return {
          success: false,
          error: validation.errors.join('; '),
        };
      }

      snapshotData = legacyPortfolio;
    }

    if (DEBUG) {
      console.log(`[Publishing] Final snapshot prepared:`, {
        projects: snapshotData.projects?.length || 0,
        careers: snapshotData.careerHighlights?.length || 0,
        strengths: snapshotData.strengths?.length || 0,
        testimonials: snapshotData.testimonials?.length || 0,
        faqs: snapshotData.faqs?.length || 0,
        services: snapshotData.services?.length || 0,
        resume: Boolean(snapshotData.resume || snapshotData.profile?.resume_url),
        socialLinks: snapshotData.socialLinks?.length || 0,
      });
      
      // Debug career subpage data
      if (snapshotData.careerHighlights?.length > 0) {
        console.log(`[Publishing] 🔍 Career Highlights Detail Check:`);
        snapshotData.careerHighlights.forEach((career: any, idx: number) => {
          console.log(`[Publishing]   Career ${idx + 1}: ${career.organization} - ${career.role}`, {
            id: career.id,
            hasBlocks: !!career.blocks,
            blocksCount: career.blocks?.length || 0,
            blocks: career.blocks || [],
            template_type: career.template_type,
            achievements: career.achievements?.length || 0,
            key_achievements: career.key_achievements?.length || 0,
            responsibilities: career.responsibilities?.length || 0,
            hasDetailPage: (career.blocks?.length || 0) > 0,
          });
        });
      }
      
      // Debug project subpage data
      if (snapshotData.projects?.length > 0) {
        console.log(`[Publishing] 🔍 Projects Detail Check:`);
        snapshotData.projects.forEach((project: any, idx: number) => {
          console.log(`[Publishing]   Project ${idx + 1}: ${project.title}`, {
            id: project.id,
            hasBlocks: !!project.blocks,
            blocksCount: project.blocks?.length || 0,
            blocks: project.blocks || [],
            template_type: project.template_type,
            thumbnail: !!project.thumbnail,
            hasDetailPage: (project.blocks?.length || 0) > 0,
          });
        });
      }
    }

    // Step 6: Upsert published portfolio (handles both first publish and re-publish)
    const { error: upsertError } = await supabase
      .from('published_portfolios')
      .upsert(
        {
          user_id: userId,
          portfolio_slug: effectiveSlug,
          published_data: snapshotData,
          is_active: true,
          published_at: new Date().toISOString(),
          version: profile?.is_portfolio_published ? undefined : 1, // Only set version on first publish
        },
        {
          onConflict: 'user_id',
        }
      );

    if (upsertError) {
      console.error('[Publishing] Upsert error:', upsertError);
      return { success: false, error: upsertError.message };
    }

    // Step 7: Update profile flags
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_portfolio_published: true,
        last_published_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.error('[Publishing] Profile update error:', profileError);
      return { success: false, error: profileError.message };
    }

    if (DEBUG) console.log(`[Publishing] ✅ Portfolio published successfully`);

    const publishedUrl = getPortfolioUrl(effectiveSlug);

    // Emit publish event
    emitPublishEvent(EVENTS.PORTFOLIO_PUBLISHED, {
      userId,
      url: publishedUrl,
      slug: effectiveSlug,
    });

    return {
      success: true,
      url: publishedUrl,
      slug: effectiveSlug,
    };
  } catch (error: any) {
    console.error('[Publishing] Publish failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unpublish a portfolio (marks as inactive)
 */
export async function unpublishPortfolio(userId: string): Promise<PublishResult> {
  try {
    if (DEBUG) console.log(`[Publishing] Unpublishing portfolio for user: ${userId}`);

    // Mark published portfolio as inactive
    const { error: updateError } = await supabase
      .from('published_portfolios')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Update profile flags
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_portfolio_published: false })
      .eq('id', userId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    if (DEBUG) console.log(`[Publishing] ✅ Portfolio unpublished`);

    // Emit unpublish event
    emitPublishEvent(EVENTS.PORTFOLIO_UNPUBLISHED, {
      userId,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Publishing] Unpublish failed:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// RETRIEVAL OPERATIONS (for public routes)
// ============================================

/**
 * Get a published portfolio by slug (for public viewing)
 */
export async function getPublishedPortfolio(
  slug: string | undefined
): Promise<PortfolioData | null> {
  try {
    if (!slug) {
      console.error('[Publishing] No slug provided');
      return null;
    }

    const normalizedSlug = slug.toLowerCase().trim();
    
    if (DEBUG) {
      console.log(`[Publishing] 🔍 Looking up published portfolio for slug: "${normalizedSlug}"`);
    }

    const { data, error } = await supabase
      .from('published_portfolios')
      .select('published_data')
      .eq('portfolio_slug', normalizedSlug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('[Publishing] ❌ Database error fetching published portfolio:', error);
      console.error('[Publishing] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return null;
    }

    if (!data) {
      console.warn(`[Publishing] ⚠️ No published portfolio found for slug: "${normalizedSlug}"`);
      console.warn('[Publishing] Possible reasons:');
      console.warn('  1. Portfolio not published yet (run publish from editor)');
      console.warn('  2. Slug not claimed by any user');
      console.warn('  3. Portfolio was unpublished (is_active = false)');
      return null;
    }

    if (DEBUG) {
      console.log(`[Publishing] ✅ Found published portfolio for: "${normalizedSlug}"`);
    }

    return data.published_data as PortfolioData;
  } catch (error) {
    console.error('[Publishing] ❌ Unexpected error:', error);
    return null;
  }
}

/**
 * Get single career detail (optimized for subpages)
 */
export async function getPublishedCareer(
  slug: string,
  careerId: string
): Promise<{ career: any; portfolioName: string; footerData?: any } | null> {
  try {
    const { data, error } = await supabase
      .from('published_portfolios')
      .select('published_data')
      .eq('portfolio_slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      console.error('[Publishing] Error fetching career:', error);
      return null;
    }

    const portfolio = data.published_data;
    const career = portfolio.careerHighlights?.find((c: any) => c.id === careerId);
    
    if (!career) {
      console.log('[Publishing] Career not found:', careerId);
      return null;
    }

    return {
      career,
      portfolioName: portfolio.fullName || portfolio.profile?.full_name || 'Portfolio',
      footerData: {
        footerText: portfolio.footerText || portfolio.profile?.footer_text,
        footerSignature: portfolio.footerSignature || portfolio.profile?.footer_signature,
      },
    };
  } catch (error) {
    console.error('[Publishing] Error:', error);
    return null;
  }
}

/**
 * Get single project detail (optimized for subpages)
 */
export async function getPublishedProject(
  slug: string,
  projectId: string
): Promise<{ project: any; portfolioName: string; footerData?: any } | null> {
  try {
    const { data, error } = await supabase
      .from('published_portfolios')
      .select('published_data')
      .eq('portfolio_slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      console.error('[Publishing] Error fetching project:', error);
      return null;
    }

    const portfolio = data.published_data;
    const project = portfolio.projects?.find((p: any) => p.id === projectId);
    
    if (!project) {
      console.log('[Publishing] Project not found:', projectId);
      return null;
    }

    return {
      project,
      portfolioName: portfolio.fullName || portfolio.profile?.full_name || 'Portfolio',
      footerData: {
        footerText: portfolio.footerText || portfolio.profile?.footer_text,
        footerSignature: portfolio.footerSignature || portfolio.profile?.footer_signature,
      },
    };
  } catch (error) {
    console.error('[Publishing] Error:', error);
    return null;
  }
}

/**
 * Get publish status for a user
 */
export async function getPublishStatus(userId: string): Promise<{
  isPublished: boolean;
  slug: string | null;
  lastPublishedAt: string | null;
  url: string | null;
}> {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('portfolio_slug, is_portfolio_published, last_published_at')
      .eq('id', userId)
      .single();

    if (!data) {
      return {
        isPublished: false,
        slug: null,
        lastPublishedAt: null,
        url: null,
      };
    }

    return {
      isPublished: data.is_portfolio_published || false,
      slug: data.portfolio_slug || null,
      lastPublishedAt: data.last_published_at || null,
      url: data.portfolio_slug ? getPortfolioUrl(data.portfolio_slug) : null,
    };
  } catch (error) {
    console.error('[Publishing] Error getting status:', error);
    return {
      isPublished: false,
      slug: null,
      lastPublishedAt: null,
      url: null,
    };
  }
}

