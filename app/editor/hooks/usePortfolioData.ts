import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import { getCompletePortfolio, convertToLegacyFormat, saveCompletePortfolio } from '@/lib/database';

export interface PortfolioData {
  fullName: string;
  heading?: string;
  profession: string;
  email: string;
  phone: string;
  resume: string | null;
  companies: string;
  sliderCompanies: string;
  careerHighlights: any[];
  strengths: any[];
  projects: any[];
  tagline: string;
  whoAreYou: string;
  profileImage: string | null;
  socialLinks: any[];
  customSections: any[];
  testimonials: any[];
  footerText?: string;
  footerSignature?: string;
}

export function usePortfolioData() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const savePortfolioRef = useRef<((data: PortfolioData) => Promise<any>) | null>(null);

  // Load data on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        console.log('[Editor Debug] Starting to load portfolio data...');
        
        // STEP 1: Try localStorage first for instant display
        const cachedData = localStorage.getItem('portfolioData');
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            console.log('[Editor Debug] ⚡ Loaded from localStorage (instant)');
            if (isMounted) {
              setPortfolio(parsed);
              setLoading(false); // Hide loading immediately
            }
          } catch (e) {
            console.warn('[Editor Debug] Failed to parse localStorage data');
          }
        }

        // STEP 2: Then fetch from database in background
        const user = await getCurrentUser();
        
        if (!user) {
          console.log('[Editor Debug] No user found, redirecting to signin');
          router.push('/signin');
          return;
        }

        console.log('[Editor Debug] User found:', user.id);
        if (!isMounted) return;
        setCurrentUserId(user.id);
        
        const { data: portfolioData, error: dbError } = await getCompletePortfolio(user.id);
        
        if (dbError) {
          console.error('[Editor Debug] ⚠️ Database fetch error:', dbError);
          console.log('[Editor Debug] 💡 Using cached data from localStorage');
          
          // If we have cached data, continue using it (offline mode)
          if (cachedData) {
            console.log('[Editor Debug] ✅ Continuing with cached data (offline mode)');
            // Don't set error, don't change loading state
            // User can continue working with cached data
            return;
          }
          
          // No cached data and database failed - this is a real error
          console.error('[Editor Debug] ❌ No cached data available, cannot continue');
          setError('Failed to load portfolio: ' + dbError);
          setLoading(false);
          return;
        }
        
        if (!portfolioData) {
          console.log('[Editor Debug] No portfolio data found, redirecting to onboarding');
          router.push('/onboarding-v2/start');
          return;
        }

        console.log('[Editor Debug] Raw portfolio data from Supabase:', portfolioData);
        
        const parsedData = convertToLegacyFormat(portfolioData);
        
        // Initialize defaults
        if (!parsedData.socialLinks) parsedData.socialLinks = [];
        if (!parsedData.sliderCompanies && parsedData.companies) {
          parsedData.sliderCompanies = parsedData.companies;
        }
        if (!parsedData.sliderCompanies) parsedData.sliderCompanies = '';
        if (!parsedData.careerHighlights) parsedData.careerHighlights = [];
        if (!parsedData.strengths) parsedData.strengths = [];
        if (!parsedData.customSections) parsedData.customSections = [];
        if (!parsedData.testimonials) parsedData.testimonials = [];
        if (!parsedData.projects) parsedData.projects = [];

        // Migrate achievements to array format (DON'T limit to 3!)
        if (parsedData.careerHighlights) {
          parsedData.careerHighlights = parsedData.careerHighlights.map((highlight: any) => {
            if (typeof highlight.achievements === 'string') {
              const achievementsArray = highlight.achievements
                .split('\n')
                .filter((a: string) => a.trim());
              return { ...highlight, achievements: achievementsArray };
            }
            if (Array.isArray(highlight.achievements)) {
              return { ...highlight, achievements: highlight.achievements };
            }
            return { ...highlight, achievements: [] };
          });
        }

        // DON'T overwrite localStorage if database has less data than localStorage
        if (cachedData) {
          const cached = JSON.parse(cachedData);
          const cachedCareerCount = cached.careerHighlights?.length || 0;
          const dbCareerCount = parsedData.careerHighlights?.length || 0;
          
          if (dbCareerCount === 0 && cachedCareerCount > 0) {
            console.warn('[Editor Debug] ⚠️ Database has no career highlights but localStorage does. Keeping localStorage data to prevent data loss.');
            // Use localStorage data instead
            if (!isMounted) return;
            setPortfolio(cached);
            setLoading(false);
            return;
          }
        }

        if (!isMounted) return;
        setPortfolio(parsedData);
        localStorage.setItem('portfolioData', JSON.stringify(parsedData));
        console.log('[Editor Debug] ✅ Portfolio loaded from database and cached');
      } catch (err) {
        console.error('[Editor Debug] ❌ Error loading portfolio:', err);
        if (!isMounted) return;
        setError('Failed to load portfolio: ' + (err as Error).message);
      } finally {
        if (!isMounted) return;
        setLoading(false);
        console.log('[Editor Debug] Loading complete');
      }
    };

    loadData();

    // Reload when window gains focus (user returns from detail editor)
    const handleFocus = () => {
      const cachedData = localStorage.getItem('portfolioData');
      if (cachedData && isMounted) {
        try {
          const parsed = JSON.parse(cachedData);
          console.log('[Editor] ✅ Reloading portfolio on window focus', {
            projects: parsed.projects?.length || 0,
            careers: parsed.careerHighlights?.length || 0,
          });
          
          // Show what changed in projects (for debugging)
          if (portfolio?.projects && parsed.projects) {
            const changedProjects = parsed.projects.filter((p: any) => {
              const old = portfolio.projects.find((op: any) => op.id === p.id);
              return old && (
                old.title !== p.title || 
                old.thumbnail !== p.thumbnail || 
                old.description !== p.description
              );
            });
            
            if (changedProjects.length > 0) {
              console.log('[Editor] 🔄 Updated projects detected:', changedProjects.map((p: any) => ({
                id: p.id,
                title: p.title,
                hasThumbnail: !!p.thumbnail,
              })));
            }
          }
          
          setPortfolio(parsed);
        } catch (e) {
          console.error('[Editor] Failed to parse on focus:', e);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    
    // 🔔 Listen for portfolio updates from template editor (same tab)
    const handlePortfolioUpdate = async (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('[usePortfolioData] 🔔 Portfolio update event received:', customEvent.detail);
      
      const cachedData = localStorage.getItem('portfolioData');
      if (cachedData && isMounted) {
        try {
          const parsed = JSON.parse(cachedData);
          console.log('[usePortfolioData] ✅ Reloading portfolio after template save', {
            projects: parsed.projects?.length || 0,
            careers: parsed.careerHighlights?.length || 0,
          });
          
          // Log the actual project data to verify template_type and blocks
          if (customEvent.detail.entityType === 'project' && parsed.projects) {
            const updatedProject = parsed.projects.find((p: any) => p.id === customEvent.detail.entityId);
            console.log('[usePortfolioData] 📦 Updated project in localStorage:', {
              id: updatedProject?.id,
              title: updatedProject?.title,
              template_type: updatedProject?.template_type,
              blocks_count: updatedProject?.blocks?.length || 0,
              has_blocks: !!updatedProject?.blocks,
            });
          }
          
          setPortfolio(parsed);
          
          // 🔥 CRITICAL: Also trigger database save!
          // The template editor updated localStorage, now persist to database
          if (currentUserId && savePortfolioRef.current) {
            console.log('[usePortfolioData] 💾 Triggering database save after template update');
            console.log('[usePortfolioData] Current user ID:', currentUserId);
            const result = await savePortfolioRef.current(parsed);
            if (result?.error) {
              console.error('[usePortfolioData] ❌ Database save failed:', result.error);
            } else {
              console.log('[usePortfolioData] ✅ Database save completed after template update');
            }
          } else {
            console.warn('[usePortfolioData] ⚠️ No currentUserId or savePortfolio ref, skipping database save!', {
              hasUserId: !!currentUserId,
              hasSaveRef: !!savePortfolioRef.current,
            });
          }
        } catch (err) {
          console.error('[usePortfolioData] Failed to parse after update:', err);
        }
      }
    };
    
    window.addEventListener('portfolio-updated', handlePortfolioUpdate);
    
    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('portfolio-updated', handlePortfolioUpdate);
    };
  }, [router, currentUserId]); // currentUserId needed for event handler

  // Save to database
  const savePortfolio = async (updatedPortfolio: PortfolioData) => {
    if (!currentUserId) {
      console.warn('[usePortfolioData] No user ID - cannot save');
      return { error: 'No user ID' };
    }

    console.log('[usePortfolioData] 💾 Saving portfolio to database for user:', currentUserId);
    console.log('[usePortfolioData] Social links count:', updatedPortfolio.socialLinks?.length || 0);
    console.log('[usePortfolioData] Social links data:', updatedPortfolio.socialLinks);

    try {
      // Save to localStorage
      localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
      console.log('[usePortfolioData] ✅ Saved to localStorage');
      
      // Save to Supabase
      const result = await saveCompletePortfolio(currentUserId, updatedPortfolio);
      if (result.error) {
        console.error('[usePortfolioData] ❌ Database save error:', result.error);
        return { error: result.error };
      }
      
      console.log('[usePortfolioData] ✅ Successfully saved to Supabase database');
      return { success: true };
    } catch (err) {
      console.error('[usePortfolioData] ❌ Save failed:', err);
      return { error: err };
    }
  };

  // Update portfolio state and trigger save
  const updatePortfolio = (updater: (prev: PortfolioData) => PortfolioData) => {
    setPortfolio(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      
      // ⭐ Check if data actually changed (prevent infinite loops)
      const prevStr = JSON.stringify(prev);
      const updatedStr = JSON.stringify(updated);
      
      if (prevStr === updatedStr) {
        console.log('[usePortfolioData] ⏭️ No actual changes, skipping localStorage update');
        return prev; // Return original reference to prevent re-render
      }
      
      // ⭐ Immediately save to localStorage so detail pages can access the data
      try {
        localStorage.setItem('portfolioData', JSON.stringify(updated));
        console.log('[usePortfolioData] ⚡ Instant localStorage update:', {
          projects_count: updated.projects?.length || 0,
          career_count: updated.careerHighlights?.length || 0,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[usePortfolioData] ❌ Failed to update localStorage:', err);
      }
      
      return updated;
    });
  };

  // Update ref when savePortfolio changes
  useEffect(() => {
    savePortfolioRef.current = savePortfolio;
  }, [savePortfolio]);

  return {
    portfolio,
    setPortfolio,
    updatePortfolio,
    savePortfolio,
    loading,
    error,
    currentUserId,
  };
}

