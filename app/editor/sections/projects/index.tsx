/**
 * Projects Section - Now using V2 architecture
 * 
 * This file now exports from projects-v2 by default.
 * The wrapper preserves the collapsible header UI while using the new core logic.
 */

export { ProjectsSection } from '../projects-v2/ProjectsSectionWrapper';
export type { ProjectItem as Project } from '../projects-v2';
