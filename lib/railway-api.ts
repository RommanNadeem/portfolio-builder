/**
 * Railway Backend API Client
 * Connects to Python FastAPI backend deployed on Railway
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_RAILWAY_BACKEND_URL || 'https://portfoliobuilder-backend-production.up.railway.app'

interface APIResponse<T> {
  data: T | null
  error: Error | null
}

/**
 * Generic API caller with retry logic
 */
async function callAPI<T = any>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries = 2
): Promise<APIResponse<T>> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[Railway API] Calling ${endpoint}`, attempt > 0 ? `(retry ${attempt})` : '')
      
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.detail || `HTTP ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.error || 'Request failed')
      }

      console.log(`[Railway API] Success:`, endpoint)

      return {
        data: data.data || data,
        error: null
      }
    } catch (error) {
      console.error(`[Railway API] Error on ${endpoint}:`, error)
      lastError = error instanceof Error ? error : new Error('Unknown error occurred')
      
      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        break
      }

      // Exponential backoff for retries
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  return {
    data: null,
    error: lastError || new Error('Request failed')
  }
}

// ==================== Resume Parsing ====================

export interface ParsedResume {
  fullName: string
  profession: string
  email: string
  phone: string
  location: string
  companies: string
  whoAreYou?: string
  careerHighlights: Array<{
    id: string
    organization: string
    role: string
    description: string
    // Legacy field - all bullets combined
    achievements: string[]
    // NEW: Separated fields
    responsibilities?: string[]  // Generic duties/tasks
    key_achievements?: string[]  // Impact-focused with metrics
    // NEW: Structured impacts
    impacts?: {
      business?: Array<{
        value: string
        metric: string
        description: string
        category: string
      }>
      performance?: Array<{
        value: string
        metric: string
        description: string
        category: string
      }>
      growth?: Array<{
        value: string
        metric: string
        description: string
        category: string
      }>
      quality?: Array<{
        value: string
        metric: string
        description: string
        category: string
      }>
      team?: Array<{
        value: string
        metric: string
        description: string
        category: string
      }>
      scale?: Array<{
        value: string
        metric: string
        description: string
        category: string
      }>
    }
    startDate: string
    endDate: string
    current: boolean
    link: string
    isPageBlock: boolean
    pageContent: string
    sections: any[]
  }>
  socialLinks: Array<{
    id: string
    platform: string
    url: string
    icon: string
  }>
  skills: string[]
  education: string[]
  strengths?: any[]
  projects?: any[]
  testimonials?: any[]
  customSections?: any[]
  profileImage?: string | null
  resume?: string | null
  heading?: string
}

/**
 * Parse resume from uploaded file
 * @param file - Resume file (PDF, DOC, DOCX)
 * @returns Parsed resume data
 */
export async function parseResume(
  file: File
): Promise<APIResponse<ParsedResume>> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    return await callAPI<ParsedResume>('/api/parse-resume', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - browser will set it with boundary for multipart
    })
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to parse resume')
    }
  }
}

// ==================== LinkedIn Parsing ====================

export interface ParsedLinkedIn {
  name: string
  headline: string
  location: string
  about?: string
  experiences: Array<{
    company: string
    title: string
    startDate: string
    endDate: string
    location: string
    highlights: string[]
  }>
  profileUrl: string
}

/**
 * Parse LinkedIn profile from URL
 * @param url - LinkedIn profile URL (must be public)
 * @returns Parsed LinkedIn data
 */
export async function parseLinkedIn(
  url: string
): Promise<APIResponse<ParsedLinkedIn>> {
  return callAPI<ParsedLinkedIn>('/api/parse-linkedin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url })
  })
}

// ==================== Copy Generation ====================

export interface TaglineResponse {
  taglines: string[]
}

export interface AboutResponse {
  about: string
}

export interface RefineResponse {
  refined: string
}

/**
 * Generate tagline suggestions
 * @param context - User context (name, role, companies, experiences)
 * @returns 5 tagline suggestions
 */
export async function generateTaglines(context: {
  name: string
  role: string
  companies: string[]
  experiences?: any[]
}): Promise<APIResponse<TaglineResponse>> {
  return callAPI<TaglineResponse>('/api/generate-copy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'tagline',
      context
    })
  })
}

/**
 * Generate about section
 * @param context - User context
 * @param targetLength - Target character length (default: 280-600)
 * @returns Generated about text
 */
export async function generateAbout(
  context: {
    name: string
    role: string
    companies: string[]
    experiences?: any[]
  },
  targetLength?: number
): Promise<APIResponse<AboutResponse>> {
  return callAPI<AboutResponse>('/api/generate-copy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'about',
      context: { ...context, targetLength }
    })
  })
}

/**
 * Refine/improve existing text
 * @param text - Text to refine
 * @returns Improved text
 */
export async function refineText(
  text: string
): Promise<APIResponse<RefineResponse>> {
  return callAPI<RefineResponse>('/api/generate-copy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'refine',
      context: { currentText: text }
    })
  })
}

/**
 * Improve job description
 * @param description - Job description to improve
 * @returns Improved description
 */
export async function improveJobDescription(
  description: string
): Promise<APIResponse<{ improved: string }>> {
  return callAPI('/api/generate-copy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'job-description',
      context: { currentText: description }
    })
  })
}

// ==================== Profile Enrichment ====================

export interface CompanyLogoResponse {
  logoUrl: string | null
  source: string
}

export interface ProjectMetaResponse {
  platform: string
  name: string
  description: string
  url: string
  stars?: number
  language?: string
  thumbnailUrl?: string
  [key: string]: any
}

/**
 * Fetch company logo
 * @param company - Company name
 * @param domain - Company domain (optional, improves accuracy)
 * @returns Logo URL and source
 */
export async function fetchCompanyLogo(
  company: string,
  domain?: string
): Promise<APIResponse<CompanyLogoResponse>> {
  return callAPI<CompanyLogoResponse>('/api/enrich-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'company-logo',
      data: { company, domain }
    })
  })
}

/**
 * Fetch project metadata from URL
 * @param url - Project URL (GitHub, Dribbble, Behance, YouTube, etc.)
 * @returns Project metadata
 */
export async function fetchProjectMeta(
  url: string
): Promise<APIResponse<ProjectMetaResponse>> {
  return callAPI<ProjectMetaResponse>('/api/enrich-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'project-meta',
      data: { url }
    })
  })
}

/**
 * Fetch company information
 * @param company - Company name
 * @param domain - Company domain (optional)
 * @returns Company info
 */
export async function fetchCompanyInfo(
  company: string,
  domain?: string
): Promise<APIResponse<any>> {
  return callAPI('/api/enrich-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'company-info',
      data: { company, domain }
    })
  })
}

// ==================== Batch Operations ====================

/**
 * Enrich all experiences with company logos
 * @param experiences - Array of experiences
 * @returns Experiences with logoUrl added
 */
export async function enrichExperiencesWithLogos(
  experiences: Array<{ company: string; [key: string]: any }>
): Promise<Array<{ company: string; logoUrl?: string; [key: string]: any }>> {
  const enriched = await Promise.all(
    experiences.map(async (exp) => {
      const { data } = await fetchCompanyLogo(exp.company)
      return {
        ...exp,
        logoUrl: data?.logoUrl || undefined
      }
    })
  )

  return enriched
}

/**
 * Fetch metadata for all project URLs
 * @param projects - Array of projects with URLs
 * @returns Projects with metadata added
 */
export async function enrichProjectsWithMeta(
  projects: Array<{ url: string; [key: string]: any }>
): Promise<Array<{ url: string; metadata?: ProjectMetaResponse; [key: string]: any }>> {
  const enriched = await Promise.all(
    projects.map(async (proj) => {
      const { data } = await fetchProjectMeta(proj.url)
      return {
        ...proj,
        metadata: data || undefined
      }
    })
  )

  return enriched
}

// ==================== Error Handling Utilities ====================

/**
 * Check if error is due to rate limiting
 */
export function isRateLimitError(error: Error): boolean {
  return error.message.includes('rate limit') || 
         error.message.includes('too many requests') ||
         error.message.includes('429')
}

/**
 * Check if error is due to API key issues
 */
export function isAPIKeyError(error: Error): boolean {
  return error.message.includes('API key') || 
         error.message.includes('not configured') ||
         error.message.includes('unauthorized')
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: Error): string {
  if (isRateLimitError(error)) {
    return 'You\'ve reached the rate limit. Please try again in a few minutes.'
  }
  
  if (isAPIKeyError(error)) {
    return 'Service temporarily unavailable. Please try again later.'
  }
  
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    return 'Network error. Please check your connection and try again.'
  }
  
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }
  
  return error.message || 'Something went wrong. Please try again.'
}

/**
 * Check backend health
 */
export async function checkBackendHealth(): Promise<{ healthy: boolean; error?: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`)
    if (response.ok) {
      return { healthy: true }
    }
    return { healthy: false, error: 'Backend is not responding' }
  } catch (error) {
    return { healthy: false, error: 'Cannot connect to backend' }
  }
}

// ==================== AI Case Study Generation ====================

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  file_data: string // base64 encoded
}

export interface TemplateSchema {
  template_type: string
  template_name: string
  template_description: string
  sections: Array<{
    id: string
    label: string
    blockType: string
    required: boolean
    description: string
    expected_fields: any
    ai_hints: string
  }>
  block_definitions: any
}

export interface GenerateCaseStudyRequest {
  template_schema: TemplateSchema
  files: UploadedFile[]
  user_context: {
    profile?: {
      profession?: string
      experience_level?: string
      industry?: string
    }
    project_data?: {
      id: string
      title?: string
      description?: string
      tags?: string[]
      role?: string
      company?: string
      link?: string
    }
  }
  user_notes: string
  generation_options?: {
    tone?: 'professional' | 'casual' | 'technical'
    auto_extract_metrics?: boolean
    include_technical_details?: boolean
    creativity_level?: 'conservative' | 'balanced' | 'creative'
    target_length?: 'brief' | 'standard' | 'comprehensive'
  }
  metadata?: {
    frontend_version?: string
    timestamp?: string
    user_id?: string
    request_id?: string
  }
}

export interface GeneratedBlock {
  type: string
  id: string
  data: any
  confidence: number
  sources: string[]
}

export interface GenerateCaseStudyResponse {
  blocks: GeneratedBlock[]
  overall_confidence: number
  suggestions?: string[]
  missing_data?: string[]
  processing_time_ms?: number
}

/**
 * Generate AI-powered case study from uploaded files
 * @param request - Complete generation request with template schema and files
 * @returns Generated blocks matching template structure
 */
export async function generateCaseStudy(
  request: GenerateCaseStudyRequest
): Promise<APIResponse<GenerateCaseStudyResponse>> {
  console.log('[Railway API] Generating case study:', {
    template: request.template_schema.template_type,
    files: request.files.length,
    notes_length: request.user_notes.length,
  })

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-case-study`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Railway API] Error response:', data)
      throw new Error(data.error || data.detail || `HTTP ${response.status}`)
    }

    console.log('[Railway API] Success: Case study generated')

    // Backend returns data directly (not wrapped in success object)
    return {
      data: data as GenerateCaseStudyResponse,
      error: null
    }
  } catch (error) {
    console.error('[Railway API] Case study generation failed:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * Convert File object to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

/**
 * Prepare files for upload
 */
export async function prepareFilesForUpload(files: File[]): Promise<UploadedFile[]> {
  const prepared: UploadedFile[] = []

  for (const file of files) {
    try {
      const base64 = await fileToBase64(file)
      prepared.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        file_data: base64,
      })
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error)
    }
  }

  return prepared
}

// ==================== AI-Designed Case Study (Custom Structure) ====================

export interface BlockCatalogItem {
  type: string
  description: string
  fields: Record<string, any>
  ai_instructions?: {
    generation_guide: string
    field_hints: Record<string, string>
    quality_rules: string[]
    extraction_patterns?: string[]
  }
}

export interface GenerateCustomCaseStudyRequest {
  category: string  // NEW: Project category from dropdown
  available_blocks: BlockCatalogItem[]
  content: {
    files: UploadedFile[]
    user_notes: string
    project_metadata?: {
      title?: string
      description?: string
      tags?: string[]
      role?: string
      company?: string
    }
  }
  generation_options: {
    tone: string
    tone_description: string
    tone_characteristics: string
    target_length: string
    length_details: {
      reading_time: string
      block_count_range: { min: number; max: number; ideal: number }
      depth: string
      word_count_estimate: string
      content_focus: string
      block_content_guidance: Record<string, string>
      best_for: string
    }
    auto_extract_metrics?: boolean
    include_technical_details?: boolean
    prefer_variety?: boolean
  }
  ai_generation_guide: {  // NEW: Instructions for AI
    writing_quality: string[]
    content_extraction: Record<string, string>
    formatting: Record<string, string>
    quality_checks: Record<string, string>
  }
  metadata?: {
    frontend_version?: string
    timestamp?: string
    user_id?: string
    request_id?: string
  }
}

export interface CustomCaseStudyResponse {
  blocks: GeneratedBlock[]
  overall_confidence: number
  structure_info?: {
    total_blocks: number
    narrative_flow: string
    design_rationale: string
    estimated_reading_time?: string
  }
  suggestions?: string[]
  missing_data?: string[]
  processing_time_ms?: number
}

/**
 * Generate AI-designed custom case study
 * AI decides the structure and blocks to use
 * @param request - Block catalog and content
 * @returns Custom-designed blocks
 */
export async function generateCustomCaseStudy(
  request: GenerateCustomCaseStudyRequest
): Promise<APIResponse<CustomCaseStudyResponse>> {
  console.log('[Railway API] Generating custom AI-designed case study:', {
    available_blocks: request.available_blocks.length,
    files: request.content.files.length,
    notes_length: request.content.user_notes.length,
  })

  try {
    console.log('[Railway API] Request payload size:', JSON.stringify(request).length, 'bytes')
    
    const response = await fetch(`${BACKEND_URL}/api/generate-custom-case-study`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    console.log('[Railway API] Response status:', response.status)

    // Try to parse response
    let data;
    try {
      data = await response.json()
    } catch (parseError) {
      console.error('[Railway API] Failed to parse response as JSON')
      throw new Error(`Backend returned invalid JSON (HTTP ${response.status})`)
    }

    if (!response.ok) {
      console.error('[Railway API] Error response:', data)
      
      // Handle FastAPI validation errors (422)
      if (response.status === 422 && Array.isArray(data.detail)) {
        console.error('[Railway API] Validation errors:', data.detail)
        
        // Format validation errors nicely
        const validationErrors = data.detail.map((err: any) => {
          const field = Array.isArray(err.loc) ? err.loc.join(' → ') : 'unknown field';
          return `${field}: ${err.msg}`;
        }).join('\n');
        
        throw new Error(`Validation Error:\n${validationErrors}`)
      }
      
      // Handle other error formats
      const errorMessage = 
        data.error || 
        (typeof data.detail === 'string' ? data.detail : null) ||
        data.message ||
        `HTTP ${response.status}: ${response.statusText}`
      
      throw new Error(errorMessage)
    }

    console.log('[Railway API] Success: Custom case study generated')
    console.log('[Railway API] Blocks generated:', data.blocks?.length || 0)
    if (data.structure_info) {
      console.log('[Railway API] Structure:', data.structure_info)
    }

    return {
      data: data as CustomCaseStudyResponse,
      error: null
    }
  } catch (error) {
    console.error('[Railway API] Custom case study generation failed:', error)
    
    // Better error handling
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
      ? error 
      : 'Unknown error occurred'
    
    return {
      data: null,
      error: new Error(errorMessage)
    }
  }
}

