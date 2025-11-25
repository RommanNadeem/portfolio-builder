// ============================================
// SECTION ORDER RECONCILIATION
// ============================================
// This ensures all users automatically get new sections when they're added,
// without requiring database migrations.

/**
 * Master list of all available sections in the portfolio.
 * This is the SINGLE SOURCE OF TRUTH for what sections exist.
 * 
 * TO ADD A NEW SECTION IN THE FUTURE:
 * 1. Add the section name to this array
 * 2. Deploy
 * 3. All users automatically get the new section on their next load
 */
export const AVAILABLE_SECTIONS = [
  'career',
  'projects',
  'strengths',
  'services',
  'testimonials',
  'faqs',
  'resume'
] as const;

export type SectionType = typeof AVAILABLE_SECTIONS[number];

/**
 * Reconciles a user's stored section_order with the master list.
 * 
 * Behavior:
 * - Preserves the user's custom ordering of existing sections
 * - Adds any new sections they don't have (appends to end)
 * - Removes any deprecated sections (in case sections are removed in future)
 * 
 * Example:
 * User has: ["career", "projects", "strengths", "testimonials"]
 * Master list: ["career", "projects", "strengths", "services", "testimonials", "faqs", "resume"]
 * Result: ["career", "projects", "strengths", "testimonials", "services", "faqs", "resume"]
 * 
 * @param userSectionOrder - The user's stored section order (may be null or outdated)
 * @returns Reconciled section order including all available sections
 */
export function reconcileSectionOrder(
  userSectionOrder: string[] | null | undefined
): string[] {
  // If user has no section order, return the master list
  if (!userSectionOrder || userSectionOrder.length === 0) {
    return [...AVAILABLE_SECTIONS];
  }
  
  // Start with user's existing order (preserving their preference)
  const reconciledOrder = [...userSectionOrder];
  
  // Find sections in master list that user doesn't have
  const missingSections = AVAILABLE_SECTIONS.filter(
    section => !reconciledOrder.includes(section)
  );
  
  // Append missing sections to the end
  reconciledOrder.push(...missingSections);
  
  // Optional: Remove sections that are no longer in the master list
  // (in case you deprecate sections in the future)
  const validOrder = reconciledOrder.filter(
    section => AVAILABLE_SECTIONS.includes(section as SectionType)
  );
  
  return validOrder;
}






