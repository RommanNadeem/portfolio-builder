/**
 * Career Types (V2 - Using Core Types)
 */

import { DetailableItem, Impact, CareerImpacts, CompanyTenure } from '@/app/editor/core/types';

export interface CareerItem extends DetailableItem {
  // Card data
  organization: string;
  role: string;
  start_date: string;
  end_date: string;
  current: boolean;
  link?: string;
  
  // Achievements (for card display)
  achievements: string[];
  key_achievements?: string[];
  responsibilities?: string[];
  featured_achievements?: number[]; // Indices of achievements to feature (max 3)
  
  // Structured impacts from backend
  impacts?: CareerImpacts;
  
  // Detail page
  template_type?: string;
  blocks?: any[];
  
  // Metadata
  location?: string;
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  company_group?: string;
  company_occurrence?: number;
  same_company_count?: number;
  has_multiple_roles_at_company?: boolean;
  same_company_roles?: string[];
  company_tenure?: CompanyTenure;
}

// Re-export for convenience
export type { Impact, CareerImpacts, CompanyTenure };

/**
 * Legacy type (matches old implementation exactly)
 */
export interface CareerHighlight {
  id: string;
  organization: string;
  role: string;
  description: string;
  link: string;
  
  // Legacy field
  achievements: string[];
  
  // Separated fields
  responsibilities?: string[];
  key_achievements?: string[];
  
  // Structured impacts
  impacts?: CareerImpacts;
  
  // Company grouping metadata
  companyGroup?: string;
  companyOccurrence?: number;
  sameCompanyCount?: number;
  hasMultipleRolesAtCompany?: boolean;
  sameCompanyRoles?: string[];
  companyTenure?: CompanyTenure;
  
  featured_achievements?: number[];
  achievements_order?: number[];
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

/**
 * Convert legacy to new format (with full metadata)
 */
export function convertFromLegacy(legacy: CareerHighlight): CareerItem {
  const now = new Date().toISOString();
  
  return {
    id: legacy.id,
    title: `${legacy.role} at ${legacy.organization}`,
    description: legacy.description || '',
    thumbnail: null,
    organization: legacy.organization,
    role: legacy.role,
    start_date: legacy.startDate,
    end_date: legacy.endDate,
    current: legacy.current,
    link: legacy.link,
    achievements: legacy.achievements || [],
    key_achievements: legacy.key_achievements,
    responsibilities: legacy.responsibilities,
    featured_achievements: legacy.featured_achievements,
    impacts: legacy.impacts,
    has_detail_page: !!legacy.blocks || !!legacy.pageContent,
    template_type: legacy.template_type,
    blocks: legacy.blocks || [],
    published: legacy.published || false,
    published_at: legacy.published_at || null,
    location: undefined,
    employment_type: undefined,
    company_group: legacy.companyGroup,
    company_occurrence: legacy.companyOccurrence,
    same_company_count: legacy.sameCompanyCount,
    has_multiple_roles_at_company: legacy.hasMultipleRolesAtCompany,
    same_company_roles: legacy.sameCompanyRoles,
    company_tenure: legacy.companyTenure,
    created_at: now,
    updated_at: now,
    order_index: 0,
  };
}

/**
 * Convert new format to legacy (with full metadata)
 */
export function convertToLegacy(item: CareerItem): CareerHighlight {
  return {
    id: item.id,
    organization: item.organization,
    role: item.role,
    description: item.description,
    link: item.link || '',
    achievements: item.achievements,
    responsibilities: item.responsibilities,
    key_achievements: item.key_achievements,
    featured_achievements: item.featured_achievements,
    impacts: item.impacts,
    companyGroup: item.company_group,
    companyOccurrence: item.company_occurrence,
    sameCompanyCount: item.same_company_count,
    hasMultipleRolesAtCompany: item.has_multiple_roles_at_company,
    sameCompanyRoles: item.same_company_roles,
    companyTenure: item.company_tenure,
    startDate: item.start_date,
    endDate: item.end_date,
    current: item.current,
    blocks: item.blocks,
    template_type: item.template_type,
    published: item.published,
    published_at: item.published_at || undefined,
  };
}

