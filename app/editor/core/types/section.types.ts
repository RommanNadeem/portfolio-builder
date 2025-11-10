/**
 * Section-Specific Type Definitions
 * 
 * Defines the data structure for each portfolio section.
 * All types extend the base types for consistency.
 */

import { BaseItem, DetailableItem } from './base.types';

// ============================================
// PROJECTS
// ============================================

export interface ProjectItem extends DetailableItem {
  // Card data
  title: string;
  description: string;
  thumbnail: string | null;
  tags: string[];
  link?: string;
  
  // Detail page
  role?: string;
  template_type?: string;
  blocks?: any[];
  
  // Metadata
  year?: string;
  team_size?: string;
  duration?: string;
  company?: string;
  
  // Publishing
  published: boolean;
  published_at?: string | null;
}

// ============================================
// CAREER
// ============================================

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
  first_started: string;
  last_ended: string;
  is_continuous: boolean;
  total_roles: number;
}

export interface CareerItem extends DetailableItem {
  // Card data
  organization: string;
  role: string;
  description: string;
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
  
  // Publishing
  published: boolean;
  published_at?: string | null;
}

// ============================================
// TESTIMONIALS (Simple, no detail page)
// ============================================

export interface TestimonialItem extends BaseItem {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string | null;
  relationship: string; // "Manager", "Colleague", "Client"
}

// ============================================
// STRENGTHS (Simple, no detail page)
// ============================================

export interface StrengthItem extends BaseItem {
  title: string;
  description: string;
  icon?: string;
  category?: 'skill' | 'tool' | 'soft-skill';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// ============================================
// SOCIAL LINKS (Simple, no detail page)
// ============================================

export interface SocialLinkItem extends BaseItem {
  platform: string;
  url: string;
  username?: string;
  icon?: string;
}

// ============================================
// PERSONAL (Single item, no detail page)
// ============================================

export interface PersonalInfo {
  full_name: string;
  profession: string;
  tagline: string;
  about: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string | null;
  resume_url?: string;
  website?: string;
}

// ============================================
// NAVIGATION
// ============================================

export interface NavigationSettings {
  logo?: string;
  logo_text?: string;
  show_logo: boolean;
  show_navigation: boolean;
  links: NavigationLink[];
}

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

// ============================================
// FOOTER
// ============================================

export interface FooterData {
  text?: string;
  show_social_links: boolean;
  show_copyright: boolean;
  copyright_text?: string;
  additional_links?: FooterLink[];
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

