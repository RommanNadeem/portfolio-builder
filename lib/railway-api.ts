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
    achievements: string[]
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

