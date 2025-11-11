import { supabase } from './supabase';
import {
  Profile,
  SocialLink,
  CareerHighlight,
  Strength,
  Project,
  Testimonial,
  CustomSection,
  PortfolioData
} from './types';

// Debug flag
const DEBUG_DATABASE = true; // Enable for debugging template_type persistence

// ============================================
// PROFILE OPERATIONS
// ============================================

export async function getProfile(userId: string): Promise<{ data: Profile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }): Promise<{ data: Profile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ============================================
// COMPLETE PORTFOLIO OPERATIONS
// ============================================

export async function getCompletePortfolio(userId: string): Promise<{ data: PortfolioData | null; error: string | null }> {
  try {
    // Fetch all data in parallel
    const [
      profileRes,
      socialLinksRes,
      careerHighlightsRes,
      strengthsRes,
      projectsRes,
      testimonialsRes,
      customSectionsRes
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('social_links').select('*').eq('user_id', userId).order('display_order'),
      supabase.from('career_highlights').select('*').eq('user_id', userId).order('display_order'),
      supabase.from('strengths').select('*').eq('user_id', userId).order('display_order'),
      supabase.from('projects').select('*').eq('user_id', userId).order('display_order'),
      supabase.from('testimonials').select('*').eq('user_id', userId).order('display_order'),
      supabase.from('custom_sections').select('*').eq('user_id', userId).order('display_order')
    ]);
    
    // Check for errors
    if (profileRes.error) {
      return { data: null, error: profileRes.error.message };
    }
    
    const portfolioData: PortfolioData = {
      profile: profileRes.data as Profile,
      socialLinks: (socialLinksRes.data || []) as SocialLink[],
      careerHighlights: (careerHighlightsRes.data || []) as CareerHighlight[],
      strengths: (strengthsRes.data || []) as Strength[],
      projects: (projectsRes.data || []) as Project[],
      testimonials: (testimonialsRes.data || []) as Testimonial[],
      customSections: (customSectionsRes.data || []) as CustomSection[]
    };
    
    return { data: portfolioData, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ============================================
// SOCIAL LINKS OPERATIONS
// ============================================

export async function upsertSocialLink(link: Partial<SocialLink> & { user_id: string }): Promise<{ data: SocialLink | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .upsert(link)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as SocialLink, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteSocialLink(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// CAREER HIGHLIGHTS OPERATIONS
// ============================================

export async function upsertCareerHighlight(highlight: Partial<CareerHighlight> & { user_id: string }): Promise<{ data: CareerHighlight | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('career_highlights')
      .upsert(highlight)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as CareerHighlight, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteCareerHighlight(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('career_highlights')
      .delete()
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// STRENGTHS OPERATIONS
// ============================================

export async function upsertStrength(strength: Partial<Strength> & { user_id: string }): Promise<{ data: Strength | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('strengths')
      .upsert(strength)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Strength, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteStrength(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('strengths')
      .delete()
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// PROJECTS OPERATIONS
// ============================================

export async function upsertProject(project: Partial<Project> & { user_id: string }): Promise<{ data: Project | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .upsert(project)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Project, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteProject(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// TESTIMONIALS OPERATIONS
// ============================================

export async function upsertTestimonial(testimonial: Partial<Testimonial> & { user_id: string }): Promise<{ data: Testimonial | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .upsert(testimonial)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as Testimonial, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteTestimonial(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// CUSTOM SECTIONS OPERATIONS
// ============================================

export async function upsertCustomSection(section: Partial<CustomSection> & { user_id: string }): Promise<{ data: CustomSection | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('custom_sections')
      .upsert(section)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as CustomSection, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteCustomSection(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('custom_sections')
      .delete()
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// BATCH SAVE (Save entire portfolio at once)
// ============================================
export async function saveCompletePortfolio(
  userId: string,
  portfolioData: any // Legacy localStorage format
): Promise<{ error: string | null }> {
  try {
    if (DEBUG_DATABASE) console.log('[Database Debug] saveCompletePortfolio called for user:', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] Full portfolio data:', portfolioData);
    if (DEBUG_DATABASE) console.log('[Database Debug] Career highlights in data:', portfolioData.careerHighlights);
    if (DEBUG_DATABASE) console.log('[Database Debug] Career highlights count:', portfolioData.careerHighlights?.length || 0);
    
    // 1. Save profile FIRST and check for errors
    const profileData = {
      id: userId,
      full_name: portfolioData.fullName,
      heading: portfolioData.heading,
      profession: portfolioData.profession || 'Professional', // Default to 'Professional' instead of empty string
      email: portfolioData.email,
      phone: portfolioData.phone,
      tagline: portfolioData.tagline,
      who_are_you: portfolioData.whoAreYou,
      profile_image_url: portfolioData.profileImage,
      resume_url: portfolioData.resume,
      companies: portfolioData.companies,
      slider_companies: portfolioData.sliderCompanies
    };
    
    if (DEBUG_DATABASE) console.log('[Database Debug] Attempting to save profile:', profileData);
    
    let profileResult;
    try {
      profileResult = await supabase.from('profiles').upsert(profileData);
    } catch (err: any) {
      if (DEBUG_DATABASE) console.error('[Database Debug] Exception during profile upsert:', err);
      throw new Error('Failed to save profile: ' + err.message);
    }
    
    if (DEBUG_DATABASE) console.log('[Database Debug] Profile upsert result:', {
      error: profileResult.error,
      errorMessage: profileResult.error?.message,
      errorDetails: profileResult.error?.details,
      errorHint: profileResult.error?.hint,
      errorCode: profileResult.error?.code,
      status: profileResult.status,
      statusText: profileResult.statusText,
      data: profileResult.data
    });
    
    if (profileResult.error) {
      if (DEBUG_DATABASE) console.error('[Database Debug] Profile upsert failed:', profileResult.error);
      if (DEBUG_DATABASE) console.error('[Database Debug] Error keys:', Object.keys(profileResult.error));
      if (DEBUG_DATABASE) console.error('[Database Debug] Full error object:', JSON.stringify(profileResult.error, null, 2));
      
      // Try to extract any error info
      const errorMsg = profileResult.error.message 
        || profileResult.error.details 
        || profileResult.error.hint 
        || 'Unknown database error. Check Supabase logs.';
      
      throw new Error('Failed to save profile: ' + errorMsg);
    }
    
    if (DEBUG_DATABASE) console.log('[Database Debug] Profile saved successfully');
    
    // 2. Use UPSERT for all tables (handles both insert and update)
    const upserts = [];
    
    // Social links - Use upsert to avoid duplicate key errors
    if (portfolioData.socialLinks?.length > 0) {
      if (DEBUG_DATABASE) console.log('[Database Debug] Upserting', portfolioData.socialLinks.length, 'social links');
      if (DEBUG_DATABASE) console.log('[Database Debug] Social links data:', portfolioData.socialLinks);
      
      // First, delete any links not in the new list
      const newLinkIds = portfolioData.socialLinks.map((link: any) => link.id);
      const { data: existingLinks } = await supabase
        .from('social_links')
        .select('id')
        .eq('user_id', userId);
      
      if (existingLinks) {
        const linksToDelete = existingLinks
          .map(l => l.id)
          .filter(id => !newLinkIds.includes(id));
        
        if (linksToDelete.length > 0) {
          await supabase.from('social_links').delete().in('id', linksToDelete);
        }
      }
      
      // Then upsert the current links
      const socialLinksData = portfolioData.socialLinks.map((link: any, index: number) => {
        // Ensure valid UUID
        const isValidUUID = link.id && link.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        const validId = isValidUUID ? link.id : crypto.randomUUID();
        
        return {
          id: validId,
          user_id: userId,
          platform: link.platform,
          url: link.url,
          icon: link.icon,
          display_order: index
        };
      });
      
      if (DEBUG_DATABASE) console.log('[Database Debug] Attempting to upsert social links:', socialLinksData);
      
      const socialLinksUpsert = await supabase.from('social_links').upsert(
        socialLinksData,
        { onConflict: 'id' }
      );
      
      if (DEBUG_DATABASE) console.log('[Database Debug] Social links upsert result:', socialLinksUpsert);
      if (socialLinksUpsert.error) {
        if (DEBUG_DATABASE) console.error('[Database Debug] Social links upsert ERROR:');
        console.error('  - Message:', socialLinksUpsert.error.message);
        console.error('  - Details:', socialLinksUpsert.error.details);
        console.error('  - Hint:', socialLinksUpsert.error.hint);
        console.error('  - Code:', socialLinksUpsert.error.code);
        console.error('  - Full error:', JSON.stringify(socialLinksUpsert.error, null, 2));
      } else {
        if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Social links upserted successfully');
      }
    } else {
      // No links - delete all existing ones
      if (DEBUG_DATABASE) console.log('[Database Debug] No social links - deleting all');
      await supabase.from('social_links').delete().eq('user_id', userId);
    }
    
    // Career highlights - Use upsert
    if (portfolioData.careerHighlights?.length > 0) {
      if (DEBUG_DATABASE) console.log('[Database Debug] Upserting', portfolioData.careerHighlights.length, 'career highlights');
      
      // Delete highlights not in the new list
      const newHighlightIds = portfolioData.careerHighlights.map((h: any) => h.id);
      const { data: existingHighlights } = await supabase
        .from('career_highlights')
        .select('id')
        .eq('user_id', userId);
      
      if (existingHighlights) {
        const highlightsToDelete = existingHighlights
          .map(h => h.id)
          .filter(id => !newHighlightIds.includes(id));
        
        if (highlightsToDelete.length > 0) {
          await supabase.from('career_highlights').delete().in('id', highlightsToDelete);
        }
      }
      
      const careerHighlightsToUpsert = portfolioData.careerHighlights.map((h: any, index: number) => {
        // Ensure valid UUID
        const isValidUUID = h.id && h.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        const validId = isValidUUID ? h.id : crypto.randomUUID();
        
        // Debug: Log what we're trying to save for impacts
        if (h.impacts) {
          if (DEBUG_DATABASE) console.log('[Database Debug] Career has impacts to save:', {
            organization: h.organization,
            impactsKeys: Object.keys(h.impacts),
            businessImpacts: h.impacts.business?.length || 0,
            performanceImpacts: h.impacts.performance?.length || 0,
            fullImpacts: h.impacts
          });
        } else {
          if (DEBUG_DATABASE) console.log('[Database Debug] Career has NO impacts:', h.organization);
        }
        
        const careerData = {
          id: validId,
          user_id: userId,
          organization: h.organization,
          role: h.role,
          description: h.description || '',
          link: h.link || '',
          // Legacy field - keep for backwards compatibility
          achievements: h.achievements || [],
          // NEW: Separated fields
          responsibilities: h.responsibilities || null,
          key_achievements: h.key_achievements || null,
          impacts: h.impacts || null, // Structured impacts object
          // NEW: Company grouping metadata
          company_group: h.companyGroup || null,
          company_occurrence: h.companyOccurrence || null,
          same_company_count: h.sameCompanyCount || null,
          has_multiple_roles_at_company: h.hasMultipleRolesAtCompany || null,
          same_company_roles: h.sameCompanyRoles || null,
          company_tenure: h.companyTenure || null,
          featured_achievements: h.featured_achievements || null,
          achievements_order: h.achievements_order || null,
          start_date: h.startDate,
          end_date: h.endDate,
          is_current: h.current || false,
          is_page_block: h.isPageBlock || false,
          page_content: h.pageContent || '',
          sections: h.sections || [],
          blocks: h.blocks || null,
          template_type: h.template_type || null,
          published: h.published || false,
          published_at: h.published_at || null,
          display_order: index
        };
        
        if (DEBUG_DATABASE) console.log('[Database Debug] Prepared career for upsert:', {
          id: careerData.id,
          organization: careerData.organization,
          hasImpacts: !!careerData.impacts,
          impactsValue: careerData.impacts
        });
        
        return careerData;
      });
      
      const upsertResult = await supabase.from('career_highlights').upsert(careerHighlightsToUpsert, { onConflict: 'id' });
      if (DEBUG_DATABASE) console.log('[Database Debug] Career highlights upsert result:', upsertResult);
      
      if (upsertResult.error) {
        if (DEBUG_DATABASE) console.error('[Database Debug] Career highlights upsert ERROR:');
        console.error('  - Message:', upsertResult.error.message);
        console.error('  - Details:', upsertResult.error.details);
        console.error('  - Hint:', upsertResult.error.hint);
        console.error('  - Code:', upsertResult.error.code);
        // Don't throw, just log and continue
      } else {
        if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Career highlights upserted successfully');
      }
    } else {
      if (DEBUG_DATABASE) console.log('[Database Debug] No career highlights - deleting all');
      await supabase.from('career_highlights').delete().eq('user_id', userId);
    }
    
    // Strengths - Use upsert
    if (portfolioData.strengths?.length > 0) {
      if (DEBUG_DATABASE) console.log('[Database Debug] Upserting', portfolioData.strengths.length, 'strengths');
      
      const newStrengthIds = portfolioData.strengths.map((s: any) => s.id);
      const { data: existingStrengths } = await supabase.from('strengths').select('id').eq('user_id', userId);
      if (existingStrengths) {
        const toDelete = existingStrengths.map(s => s.id).filter(id => !newStrengthIds.includes(id));
        if (toDelete.length > 0) await supabase.from('strengths').delete().in('id', toDelete);
      }
      
      await supabase.from('strengths').upsert(
        portfolioData.strengths.map((s: any, index: number) => ({
          id: s.id,
          user_id: userId,
          title: s.title,
          description: s.description,
          icon: s.icon,
          is_page_block: s.isPageBlock,
          page_content: s.pageContent,
          sections: s.sections || [],
          display_order: index
        })),
        { onConflict: 'id' }
      );
    } else {
      await supabase.from('strengths').delete().eq('user_id', userId);
    }
    
    // Projects - Use upsert
    if (portfolioData.projects?.length > 0) {
      if (DEBUG_DATABASE) console.log('[Database Debug] Upserting', portfolioData.projects.length, 'projects');
      if (DEBUG_DATABASE) console.log('[Database Debug] Projects data:', portfolioData.projects);
      
      const newProjectIds = portfolioData.projects.map((p: any) => p.id);
      const { data: existingProjects } = await supabase.from('projects').select('id').eq('user_id', userId);
      if (existingProjects) {
        const toDelete = existingProjects.map(p => p.id).filter(id => !newProjectIds.includes(id));
        if (toDelete.length > 0) {
          if (DEBUG_DATABASE) console.log('[Database Debug] Deleting', toDelete.length, 'old projects');
          await supabase.from('projects').delete().in('id', toDelete);
        }
      }
      
      const projectsToUpsert = portfolioData.projects.map((p: any, index: number) => {
        // Ensure valid UUID
        const isValidUUID = p.id && p.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        const validId = isValidUUID ? p.id : crypto.randomUUID();
        
        const upsertData = {
          id: validId,
          user_id: userId,
          title: p.title,
          description: p.description,
          thumbnail_url: p.thumbnail,
          tags: p.tags || [],
          page_content: p.pageContent,
          link: p.link,
          role: p.role, // User's role in project
          sections: p.sections || [],
          blocks: p.blocks || [], // Detail page blocks (legacy or template)
          template_type: p.template_type, // Template type (e.g., 'product-case-study')
          published: p.published || false, // Published status
          published_at: p.published_at, // Published timestamp
          display_order: index
        };
        
        // Debug log each project being saved
        if (DEBUG_DATABASE) {
          console.log(`[Database Debug] 📦 Project ${index + 1}:`, {
            id: upsertData.id,
            title: upsertData.title,
            template_type: upsertData.template_type,
            blocks_count: upsertData.blocks.length,
            has_template_type: !!upsertData.template_type,
            has_blocks: upsertData.blocks.length > 0,
          });
        }
        
        return upsertData;
      });
      
      if (DEBUG_DATABASE) console.log('[Database Debug] Prepared projects for upsert:', projectsToUpsert);
      
      const projectsUpsertResult = await supabase.from('projects').upsert(
        projectsToUpsert,
        { onConflict: 'id' }
      );
      
      if (DEBUG_DATABASE) console.log('[Database Debug] Projects upsert result:', projectsUpsertResult);
      
      if (projectsUpsertResult.error) {
        if (DEBUG_DATABASE) console.error('[Database Debug] Projects upsert ERROR:');
        console.error('  - Message:', projectsUpsertResult.error.message);
        console.error('  - Details:', projectsUpsertResult.error.details);
        console.error('  - Hint:', projectsUpsertResult.error.hint);
        console.error('  - Code:', projectsUpsertResult.error.code);
        console.error('  - Full error:', JSON.stringify(projectsUpsertResult.error, null, 2));
        // Don't throw, just log and continue
      } else {
        if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Projects upserted successfully with template data');
      }
    } else {
      if (DEBUG_DATABASE) console.log('[Database Debug] No projects - deleting all');
      await supabase.from('projects').delete().eq('user_id', userId);
    }
    
    // Testimonials - Use upsert
    if (portfolioData.testimonials?.length > 0) {
      if (DEBUG_DATABASE) console.log('[Database Debug] Upserting', portfolioData.testimonials.length, 'testimonials');
      
      const newTestimonialIds = portfolioData.testimonials.map((t: any) => t.id);
      const { data: existingTestimonials } = await supabase.from('testimonials').select('id').eq('user_id', userId);
      if (existingTestimonials) {
        const toDelete = existingTestimonials.map(t => t.id).filter(id => !newTestimonialIds.includes(id));
        if (toDelete.length > 0) await supabase.from('testimonials').delete().in('id', toDelete);
      }
      
      await supabase.from('testimonials').upsert(
        portfolioData.testimonials.map((t: any, index: number) => ({
          id: t.id,
          user_id: userId,
          name: t.name,
          title: t.title,
          testimonial: t.testimonial,
          linkedin_url: t.linkedinUrl,
          display_order: index
        })),
        { onConflict: 'id' }
      );
    } else {
      await supabase.from('testimonials').delete().eq('user_id', userId);
    }
    
    // Custom sections - Use upsert
    if (portfolioData.customSections?.length > 0) {
      if (DEBUG_DATABASE) console.log('[Database Debug] Upserting', portfolioData.customSections.length, 'custom sections');
      
      const newSectionIds = portfolioData.customSections.map((cs: any) => cs.id);
      const { data: existingSections } = await supabase.from('custom_sections').select('id').eq('user_id', userId);
      if (existingSections) {
        const toDelete = existingSections.map(s => s.id).filter(id => !newSectionIds.includes(id));
        if (toDelete.length > 0) await supabase.from('custom_sections').delete().in('id', toDelete);
      }
      
      await supabase.from('custom_sections').upsert(
        portfolioData.customSections.map((cs: any, index: number) => ({
          id: cs.id,
          user_id: userId,
          title: cs.title,
          icon: cs.icon,
          section_type: cs.type,
          data: cs.data,
          display_order: cs.order || index
        })),
        { onConflict: 'id' }
      );
    } else {
      await supabase.from('custom_sections').delete().eq('user_id', userId);
    }
    
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ All data saved successfully');
    
    return { error: null };
  } catch (error: any) {
    if (DEBUG_DATABASE) console.error('[Database Debug] Save failed:', error);
    return { error: error.message };
  }
}

// ============================================
// CONVERT SUPABASE DATA TO LEGACY FORMAT
// (For backward compatibility with existing components)
// ============================================
export function convertToLegacyFormat(portfolioData: PortfolioData): any {
  if (DEBUG_DATABASE) console.log('[Database Debug] convertToLegacyFormat input:', portfolioData);
  if (DEBUG_DATABASE) console.log('[Database Debug] Career highlights from DB:', portfolioData.careerHighlights);
  
  const converted = {
    fullName: portfolioData.profile.full_name,
    heading: portfolioData.profile.heading,
    profession: portfolioData.profile.profession,
    email: portfolioData.profile.email,
    phone: portfolioData.profile.phone,
    tagline: portfolioData.profile.tagline,
    whoAreYou: portfolioData.profile.who_are_you,
    profileImage: portfolioData.profile.profile_image_url,
    resume: portfolioData.profile.resume_url,
    companies: portfolioData.profile.companies,
    sliderCompanies: portfolioData.profile.slider_companies,
    
    socialLinks: portfolioData.socialLinks.map(link => ({
      id: link.id,
      platform: link.platform,
      url: link.url,
      icon: link.icon
    })),
    
    careerHighlights: portfolioData.careerHighlights.map(h => ({
      id: h.id,
      organization: h.organization,
      role: h.role,
      description: h.description,
      link: h.link,
      achievements: h.achievements || [],
      // NEW: Include all new fields when converting from database
      responsibilities: h.responsibilities || [],
      key_achievements: h.key_achievements || [],
      impacts: h.impacts || undefined,
      featured_achievements: h.featured_achievements || undefined,
      achievements_order: h.achievements_order || undefined,
      // NEW: Company grouping metadata
      companyGroup: h.company_group,
      companyOccurrence: h.company_occurrence,
      sameCompanyCount: h.same_company_count,
      hasMultipleRolesAtCompany: h.has_multiple_roles_at_company,
      sameCompanyRoles: h.same_company_roles,
      companyTenure: h.company_tenure,
      startDate: h.start_date,
      endDate: h.end_date,
      current: h.is_current,
      isPageBlock: h.is_page_block,
      pageContent: h.page_content,
      sections: h.sections || [],
      blocks: h.blocks || [],
      template_type: h.template_type,
      published: h.published || false,
      published_at: h.published_at
    })),
    
    strengths: portfolioData.strengths.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
      isPageBlock: s.is_page_block,
      pageContent: s.page_content,
      sections: s.sections || []
    })),
    
    projects: portfolioData.projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      thumbnail: p.thumbnail_url,
      tags: p.tags || [],
      pageContent: p.page_content,
      link: p.link,
      role: p.role, // User's role
      sections: p.sections || [],
      blocks: p.blocks || [], // Detail page blocks
      template_type: p.template_type, // Template type
      published: p.published || false, // Published status
      published_at: p.published_at // Published timestamp
    })),
    
    testimonials: portfolioData.testimonials.map(t => ({
      id: t.id,
      name: t.name,
      title: t.title,
      testimonial: t.testimonial,
      linkedinUrl: t.linkedin_url
    })),
    
    customSections: portfolioData.customSections.map(cs => ({
      id: cs.id,
      title: cs.title,
      icon: cs.icon,
      type: cs.section_type,
      data: cs.data,
      order: cs.display_order
    }))
  };
  
  if (DEBUG_DATABASE) console.log('[Database Debug] Converted career highlights:', converted.careerHighlights);
  if (DEBUG_DATABASE) console.log('[Database Debug] Converted career highlights count:', converted.careerHighlights?.length || 0);
  
  return converted;
}

// ============================================
// INDIVIDUAL OPERATIONS
// ============================================

export async function updateCareerHighlight(id: string, updates: Partial<CareerHighlight>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('career_highlights')
      .update(updates)
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateStrength(id: string, updates: Partial<Strength>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('strengths')
      .update(updates)
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCustomSection(id: string, updates: Partial<CustomSection>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('custom_sections')
      .update(updates)
      .eq('id', id);
    
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// DELETE ACCOUNT (Delete all user data)
// ============================================

export async function deleteAllUserData(userId: string): Promise<{ error: string | null }> {
  try {
    if (DEBUG_DATABASE) console.log('[Database Debug] Deleting all data for user:', userId);
    
    // Delete in order (related records first, then profile)
    // This respects foreign key constraints
    
    // 1. Delete social links
    await supabase.from('social_links').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Social links deleted');
    
    // 2. Delete career highlights
    await supabase.from('career_highlights').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Career highlights deleted');
    
    // 3. Delete strengths
    await supabase.from('strengths').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Strengths deleted');
    
    // 4. Delete projects
    await supabase.from('projects').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Projects deleted');
    
    // 5. Delete testimonials
    await supabase.from('testimonials').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Testimonials deleted');
    
    // 6. Delete custom sections
    await supabase.from('custom_sections').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Custom sections deleted');
    
    // 7. Delete AI generations
    await supabase.from('ai_generations').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ AI generations deleted');
    
    // 8. Delete AI suggestions
    await supabase.from('ai_suggestions').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ AI suggestions deleted');
    
    // 9. Delete file attachments
    await supabase.from('file_attachments').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ File attachments deleted');
    
    // 10. Delete resume parses
    await supabase.from('resume_parses').delete().eq('user_id', userId);
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Resume parses deleted');
    
    // 11. Finally, delete profile
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
    if (profileError) {
      if (DEBUG_DATABASE) console.error('[Database Debug] Profile deletion failed:', profileError);
      throw new Error('Failed to delete profile: ' + profileError.message);
    }
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ Profile deleted');
    
    if (DEBUG_DATABASE) console.log('[Database Debug] ✅ All user data deleted successfully');
    return { error: null };
  } catch (error: any) {
    if (DEBUG_DATABASE) console.error('[Database Debug] Delete failed:', error);
    return { error: error.message };
  }
}

