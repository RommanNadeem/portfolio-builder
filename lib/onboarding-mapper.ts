/**
 * Onboarding to Editor Data Mapper
 * Converts data collected during onboarding to the format expected by the editor
 */

interface OnboardingData {
  name: string;
  role: string;
  tagline: string;
  taglineSuggestions?: string[];
  about: string;
  email: string;
  phone: string;
  location: string;
  experiences: Array<{
    id: string;
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    highlights: string[];
  }>;
  projects?: any[];
  links?: Array<{
    platform: string;
    url: string;
  }>;
  source: string;
}

interface EditorData {
  fullName: string;
  heading?: string;
  profession: string;
  email: string;
  phone: string;
  resume: string | null;
  companies: string;
  sliderCompanies: string;
  careerHighlights: Array<{
    id: string;
    organization: string;
    role: string;
    description: string;
    link: string;
    achievements: string[];
    startDate: string;
    endDate: string;
    current: boolean;
    isPageBlock?: boolean;
    pageContent?: string;
    sections?: any[];
  }>;
  strengths: any[];
  projects: any[];
  tagline: string;
  whoAreYou: string;
  profileImage: string | null;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    icon: string;
  }>;
  customSections: any[];
  testimonials: any[];
}

/**
 * Map platform name to icon
 */
function getPlatformIcon(platform: string): string {
  const icons: { [key: string]: string } = {
    'LinkedIn': 'linkedin',
    'GitHub': 'github',
    'Twitter': 'twitter',
    'Personal Site': 'globe',
    'Portfolio': 'globe',
    'Website': 'globe',
    'Instagram': 'instagram',
    'Dribbble': 'dribbble',
    'Behance': 'behance'
  };
  return icons[platform] || 'link';
}

/**
 * Convert onboarding data to editor format
 */
export function convertOnboardingToEditor(onboardingData: OnboardingData): EditorData {
  // Extract company names from experiences
  const companies = onboardingData.experiences
    ?.slice(0, 3)
    .map(exp => exp.company)
    .join(', ') || '';

  // Convert experiences to career highlights
  const careerHighlights = (onboardingData.experiences || []).map(exp => ({
    id: exp.id,
    organization: exp.company,
    role: exp.title,
    description: exp.highlights?.[0] || '',
    link: '',
    achievements: exp.highlights || [],
    startDate: exp.startDate,
    endDate: exp.endDate,
    current: exp.endDate?.toLowerCase().includes('present') || false,
    isPageBlock: false,
    pageContent: '',
    sections: []
  }));

  // Convert links to socialLinks
  const socialLinks = (onboardingData.links || []).map((link, idx) => ({
    id: `link-${idx}`,
    platform: link.platform,
    url: link.url,
    icon: getPlatformIcon(link.platform)
  }));

  // Map onboarding format to editor format
  const editorData: EditorData = {
    fullName: onboardingData.name,
    heading: undefined,
    profession: onboardingData.role,
    email: onboardingData.email,
    phone: onboardingData.phone,
    resume: null,
    companies: companies,
    sliderCompanies: companies,
    careerHighlights: careerHighlights,
    strengths: [],
    projects: onboardingData.projects || [],
    tagline: onboardingData.tagline,
    whoAreYou: onboardingData.about, // Map 'about' to 'whoAreYou'
    profileImage: null,
    socialLinks: socialLinks,
    customSections: [],
    testimonials: []
  };

  return editorData;
}

/**
 * Merge editor data with onboarding updates
 * Useful when user already has portfolio data but goes through onboarding again
 */
export function mergeOnboardingData(
  existingData: Partial<EditorData>,
  onboardingData: OnboardingData
): EditorData {
  const converted = convertOnboardingToEditor(onboardingData);
  
  return {
    ...existingData,
    ...converted,
    // Keep existing data for fields not in onboarding
    strengths: existingData.strengths || converted.strengths,
    customSections: existingData.customSections || converted.customSections,
    testimonials: existingData.testimonials || converted.testimonials,
    profileImage: existingData.profileImage || converted.profileImage,
    resume: existingData.resume || converted.resume,
  } as EditorData;
}

