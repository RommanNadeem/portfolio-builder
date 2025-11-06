import { useState, useEffect } from 'react';
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
          console.error('[Editor Debug] Error loading portfolio:', dbError);
          // Only set error if we don't have cached data
          if (!cachedData) {
            setError('Failed to load portfolio: ' + dbError);
            setLoading(false);
          }
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

        // Migrate achievements to array format
        if (parsedData.careerHighlights) {
          parsedData.careerHighlights = parsedData.careerHighlights.map((highlight: any) => {
            if (typeof highlight.achievements === 'string') {
              const achievementsArray = highlight.achievements
                .split('\n')
                .filter((a: string) => a.trim())
                .slice(0, 3);
              return { ...highlight, achievements: achievementsArray };
            }
            if (Array.isArray(highlight.achievements)) {
              return { ...highlight, achievements: highlight.achievements.slice(0, 3) };
            }
            return { ...highlight, achievements: [] };
          });
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
    
    return () => {
      isMounted = false;
    };
  }, [router]);

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
      return updated;
    });
  };

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

