export interface Impact {
  value: string;
  metric: string;
  description: string;
  category: 'business' | 'performance' | 'growth' | 'quality' | 'team' | 'scale';
}

export interface CareerImpacts {
  business?: Impact[];
  performance?: Impact[];
  growth?: Impact[];
  quality?: Impact[];
  team?: Impact[];
  scale?: Impact[];
}

export interface CompanyTenure {
  firstStarted: string;
  lastEnded: string;
  isContinuous: boolean;
  totalRoles: number;
}

export interface CareerHighlight {
  id: string;
  organization: string;
  role: string;
  description: string;
  link: string;
  
  // Legacy field - kept for backwards compatibility
  achievements: string[];
  
  // NEW: Separate responsibilities and achievements
  responsibilities?: string[]; // Generic duties/tasks
  key_achievements?: string[]; // Impact-focused accomplishments with metrics
  
  // NEW: Structured impacts from backend
  impacts?: CareerImpacts; // Categorized, measurable impacts
  
  // NEW: Company grouping metadata from backend
  companyGroup?: string; // e.g., "google" - normalized company name
  companyOccurrence?: number; // Which occurrence this is (1, 2, 3)
  sameCompanyCount?: number; // Total roles at this company
  hasMultipleRolesAtCompany?: boolean; // Had multiple roles at same company
  sameCompanyRoles?: string[]; // Other roles at same company
  companyTenure?: CompanyTenure; // Overall tenure at company
  
  featured_achievements?: number[]; // Indices of KEY_ACHIEVEMENTS to show on card (max 3)
  achievements_order?: number[]; // Custom order of achievements (array of indices)
  startDate: string;
  endDate: string;
  current: boolean;
  isPageBlock?: boolean;
  pageContent?: string;
  sections?: any[];
  blocks?: any[];
  template_type?: string;
  published?: boolean;
  published_at?: string;
}

