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
  companies?: string;
  slider_companies?: string;
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
  achievements: string[];  // JSONB array
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  is_page_block?: boolean;
  page_content?: string;
  sections?: any[];  // JSONB array
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
  sections?: any[];  // JSONB array
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
  customSections: CustomSection[];
}

