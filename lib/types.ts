// ============================================
// SUPABASE DATABASE TYPES
// Matches the database schema exactly
// ============================================

export interface Profile {
  id: string;
  full_name: string;
  heading?: string;
  profession: string;
  email: string;
  phone?: string;
  tagline?: string;
  who_are_you?: string;
  profile_image_url?: string;
  resume_url?: string;
  resume_file_name?: string;  // Original filename for download
  companies?: string;
  slider_companies?: string;
  section_order?: string[];  // JSONB array - order of draggable sections
  navigation?: any;  // JSONB object - navigation settings (e.g., ctaUrl)
  footer_text?: string;
  footer_signature?: string;
  
  // Publishing fields
  portfolio_slug?: string;  // Globally unique slug for public URL
  is_portfolio_published?: boolean;  // Whether portfolio is currently published
  last_published_at?: string;  // Timestamp of last publish
  
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  icon?: string;
  display_order?: number;
  created_at?: string;
}

export interface CareerHighlight {
  id: string;
  user_id: string;
  organization: string;
  role: string;
  description?: string;
  link?: string;
  
  // Legacy field - kept for backwards compatibility
  achievements: string[];  // JSONB array - all achievements
  
  // NEW: Separate responsibilities and achievements
  responsibilities?: string[];  // JSONB array - Generic duties/tasks
  key_achievements?: string[];  // JSONB array - Impact-focused accomplishments with metrics
  
  // NEW: Structured impacts from backend
  impacts?: any;  // JSONB object - Categorized impacts (business, performance, growth, etc.)
  
  // NEW: Company grouping metadata
  company_group?: string;  // Normalized company name for grouping
  company_occurrence?: number;  // Which occurrence (1, 2, 3)
  same_company_count?: number;  // Total roles at this company
  has_multiple_roles_at_company?: boolean;  // Multiple roles flag
  same_company_roles?: string[];  // JSONB array - Other roles at same company
  company_tenure?: any;  // JSONB object - Overall tenure info
  
  featured_achievements?: number[];  // JSONB array - indices of KEY_ACHIEVEMENTS to show on card
  achievements_order?: number[];  // JSONB array - custom ordering of achievements
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  is_page_block?: boolean;
  page_content?: string;
  sections?: any[];  // JSONB array
  blocks?: any[];  // JSONB array - for template blocks
  template_type?: string;  // Template type (e.g., 'career-experience')
  published?: boolean;  // Whether career page is published
  published_at?: string;  // When career page was published
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Strength {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  icon?: string;
  is_page_block?: boolean;
  page_content?: string;
  sections?: any[];  // JSONB array
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  tags: string[];  // JSONB array
  page_content?: string;
  link?: string;
  role?: string;  // User's role in the project
  sections?: any[];  // JSONB array
  blocks?: any[];  // JSONB array - for template blocks
  template_type?: string;  // Template type (e.g., 'product-case-study')
  published?: boolean;  // Whether project is published
  published_at?: string;  // When project was published
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  user_id: string;
  name: string;
  title?: string;
  testimonial: string;
  linkedin_url?: string;
  avatar_url?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  duration?: string;
  features?: string[];  // JSONB array
  cta_text?: string;
  cta_url?: string;
  display_order?: number;
  is_featured?: boolean;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomSection {
  id: string;
  user_id: string;
  title: string;
  icon?: string;
  section_type: 'text' | 'textarea' | 'list' | 'cards' | 'grid';
  data: any;  // JSONB
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FileAttachment {
  id: string;
  user_id: string;
  bucket_name: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  entity_type?: string;
  entity_id?: string;
  attachment_type: string;
  display_name?: string;
  description?: string;
  display_order?: number;
  is_public?: boolean;
  metadata?: any;  // JSONB
  created_at?: string;
  updated_at?: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  prompt: string;
  generated_content: string;
  model?: string;
  tokens_used?: number;
  generation_type: string;
  entity_type?: string;
  entity_id?: string;
  was_accepted?: boolean;
  metadata?: any;  // JSONB
  created_at?: string;
}

export interface AISuggestion {
  id: string;
  user_id: string;
  suggestion_type: string;
  title: string;
  description?: string;
  suggested_content?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'accepted' | 'rejected' | 'implemented';
  entity_type?: string;
  entity_id?: string;
  metadata?: any;  // JSONB
  created_at?: string;
  updated_at?: string;
}

export interface ResumeParse {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  parse_status?: 'pending' | 'processing' | 'completed' | 'failed';
  parser_service?: string;
  parsed_data: any;  // JSONB
  confidence_scores?: any;  // JSONB
  auto_filled_fields?: string[];
  processing_time_ms?: number;
  tokens_used?: number;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// CLIENT-SIDE DATA TYPES (For app state)
// ============================================

export interface PortfolioData {
  profile: Profile;
  socialLinks: SocialLink[];
  careerHighlights: CareerHighlight[];
  strengths: Strength[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  services: Service[];
  customSections: CustomSection[];
  sectionOrder?: string[];
  navigation?: {
    ctaUrl?: string;
  };
}

// ============================================
// PUBLISHING TYPES
// ============================================

export interface PublishedPortfolio {
  id: string;
  user_id: string;
  portfolio_slug: string;
  published_data: PortfolioData;  // Complete portfolio snapshot
  version: number;
  is_active: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface PublishResult {
  success: boolean;
  error?: string;
  url?: string;
  slug?: string;
}

export interface SlugAvailability {
  available: boolean;
  error?: string;
  takenByCurrentUser?: boolean;
  suggestions?: string[];
}

export interface ValidationResult {
  canPublish: boolean;
  errors: string[];
  warnings: string[];
}

