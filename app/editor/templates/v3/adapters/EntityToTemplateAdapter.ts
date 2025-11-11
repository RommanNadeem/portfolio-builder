/**
 * V3 Template System - Entity to Template Adapter
 * 
 * Converts V2 portfolio entities into V3 template blocks.
 * Handles pre-filling and initialization logic.
 */

import { ProjectItem, CareerItem, CareerImpacts } from '@/app/editor/core/types';
import { getTemplateConfig, createEmptyBlock } from '../../configs';

/**
 * Template Initializer Interface
 */
export interface TemplateInitializer {
  entityType: 'project' | 'career';
  initializeBlocks(entity: any, templateType: string): any[];
}

/**
 * Project Template Initializer
 */
export class ProjectTemplateInitializer implements TemplateInitializer {
  entityType = 'project' as const;
  
  initializeBlocks(entity: ProjectItem, templateType: string): any[] {
    console.log('[ProjectInitializer] Initializing template:', templateType);
    
    const config = getTemplateConfig(templateType);
    if (!config) {
      console.error('[ProjectInitializer] Template config not found:', templateType);
      return [];
    }
    
    // Create base blocks from template config
    const blocks = config.sections.map((section) => 
      createEmptyBlock(section.blockType, {
        label: section.label,
        description: section.description,
      })
    ).filter(Boolean);
    
    console.log('[ProjectInitializer] Created', blocks.length, 'base blocks');
    
    // Pre-fill hero block (always index 0)
    if (blocks[0]?.type === 'hero') {
      blocks[0] = this.prefillHeroBlock(blocks[0], entity);
    }
    
    // Pre-fill based on template type
    switch (templateType) {
      case 'product-case-study':
        return this.initializeProductCaseStudy(blocks, entity);
      case 'engineering-technical':
        return this.initializeEngineeringProject(blocks, entity);
      case 'creative-branding':
        return this.initializeCreativeProject(blocks, entity);
      default:
        return blocks;
    }
  }
  
  private prefillHeroBlock(block: any, entity: ProjectItem): any {
    console.log('[ProjectInitializer] Pre-filling hero block');
    
    return {
      ...block,
      data: {
        title: entity.title || '',
        subtitle: entity.description || '',
        description: entity.description || '',
        imageUrl: entity.thumbnail || '',
        logoUrl: '',
        meta: {
          ...(entity.year && { year: entity.year }),
          ...(entity.role && { role: entity.role }),
          ...(entity.team_size && { team: entity.team_size }),
          ...(entity.duration && { timeline: entity.duration }),
          ...(entity.company && { company: entity.company }),
        },
      },
    };
  }
  
  private initializeProductCaseStudy(blocks: any[], entity: ProjectItem): any[] {
    // Pre-fill overview callout (index 1)
    if (blocks[1]?.type === 'callout') {
      blocks[1] = {
        ...blocks[1],
        data: {
          title: 'Overview',
          body: entity.description || 'Add a compelling overview of your product...',
          variant: 'info',
        },
      };
    }
    
    return blocks;
  }
  
  private initializeEngineeringProject(blocks: any[], entity: ProjectItem): any[] {
    // Pre-fill overview with technical context
    if (blocks[1]?.type === 'richtext') {
      blocks[1] = {
        ...blocks[1],
        data: {
          title: 'Technical Overview',
          body: entity.description || 'Describe the technical challenge and solution...',
        },
      };
    }
    
    return blocks;
  }
  
  private initializeCreativeProject(blocks: any[], entity: ProjectItem): any[] {
    // Pre-fill brief
    if (blocks[1]?.type === 'richtext') {
      blocks[1] = {
        ...blocks[1],
        data: {
          title: 'Project Brief',
          body: entity.description || 'Describe the creative brief and objectives...',
        },
      };
    }
    
    return blocks;
  }
}

/**
 * Career Template Initializer
 */
export class CareerTemplateInitializer implements TemplateInitializer {
  entityType = 'career' as const;
  
  initializeBlocks(entity: CareerItem, templateType: string): any[] {
    console.log('[CareerInitializer] Initializing career template');
    
    // Career always uses 'career-experience' template
    const config = getTemplateConfig('career-experience');
    if (!config) {
      console.error('[CareerInitializer] Career template config not found');
      return [];
    }
    
    // Create base blocks
    const blocks = config.sections.map((section) =>
      createEmptyBlock(section.blockType, {
        label: section.label,
        description: section.description,
      })
    ).filter(Boolean);
    
    console.log('[CareerInitializer] Created', blocks.length, 'base blocks');
    
    // Pre-fill all blocks with entity data
    return this.prefillCareerBlocks(blocks, entity);
  }
  
  private prefillCareerBlocks(blocks: any[], entity: CareerItem): any[] {
    console.log('[CareerInitializer] Pre-filling career blocks:', {
      organization: entity.organization,
      role: entity.role,
      achievements_count: entity.achievements?.length || 0,
      has_impacts: !!entity.impacts,
    });
    
    // Hero (index 0)
    if (blocks[0]?.type === 'hero') {
      blocks[0] = this.prefillHeroBlock(blocks[0], entity);
    }
    
    // Context callout (index 1)
    if (blocks[1]?.type === 'callout') {
      blocks[1] = this.prefillContextBlock(blocks[1], entity);
    }
    
    // Responsibilities (index 2)
    if (blocks[2]?.type === 'bullets') {
      blocks[2] = {
        ...blocks[2],
        data: {
          title: '',  // No default title - let user add if needed
          bullets: entity.responsibilities || entity.achievements || [''],
        },
      };
      console.log('[CareerInitializer] Pre-filled responsibilities:', 
        (entity.responsibilities || entity.achievements || []).length);
    }
    
    // Key Achievements (index 3)
    if (blocks[3]?.type === 'bullets') {
      blocks[3] = {
        ...blocks[3],
        data: {
          title: '',  // No default title - let user add if needed
          bullets: entity.key_achievements || entity.achievements || [''],
        },
      };
      console.log('[CareerInitializer] Pre-filled key achievements:', 
        (entity.key_achievements || entity.achievements || []).length);
    }
    
    // Impact & Results (index 4)
    if (blocks[4]?.type === 'metrics' && entity.impacts) {
      blocks[4] = this.prefillImpactsBlock(blocks[4], entity.impacts);
      console.log('[CareerInitializer] Pre-filled impacts');
    }
    
    // Notable Projects (index 5) - optional, leave empty for user to fill
    
    // Skills & Growth (index 6) - optional, leave empty for user to fill
    
    // Reflection (index 7) - optional, leave empty for user to fill
    
    return blocks;
  }
  
  private prefillHeroBlock(block: any, entity: CareerItem): any {
    console.log('[CareerInitializer] Prefilling hero block with entity data:', {
      organization: entity.organization,
      role: entity.role,
      start_date: entity.start_date,
      end_date: entity.end_date,
      current: entity.current,
      link: entity.link,
    });
    
    const prefilledBlock = {
      ...block,
      data: {
        title: entity.organization || '',
        subtitle: '',  // Keep subtitle empty for career templates
        description: entity.description || '',
        imageUrl: '',
        logoUrl: '',
        meta: {
          role: entity.role || '',  // Role goes in meta, not subtitle
          startDate: entity.start_date || '',
          endDate: entity.current ? 'Present' : (entity.end_date || ''),
          ...(entity.location && { Location: entity.location }),
          ...(entity.employment_type && { Type: entity.employment_type }),
          ...(entity.link && { Website: entity.link }),
        },
      },
    };
    
    console.log('[CareerInitializer] Hero block prefilled:', {
      title: prefilledBlock.data.title,
      role: prefilledBlock.data.meta.role,
      startDate: prefilledBlock.data.meta.startDate,
      endDate: prefilledBlock.data.meta.endDate,
      Website: prefilledBlock.data.meta.Website,
    });
    
    return prefilledBlock;
  }
  
  private prefillContextBlock(block: any, entity: CareerItem): any {
    let contextBody = '';
    
    // Multiple roles at same company
    if (entity.has_multiple_roles_at_company && entity.same_company_roles && entity.same_company_roles.length > 0) {
      contextBody += `Multiple roles at ${entity.organization}:\n`;
      contextBody += entity.same_company_roles.map(r => `• ${r}`).join('\n');
      contextBody += '\n\n';
    }
    
    // Company tenure
    if (entity.company_tenure) {
      const { first_started, last_ended, total_roles, is_continuous } = entity.company_tenure;
      contextBody += `Overall tenure: ${first_started} - ${last_ended}`;
      if (total_roles > 1) {
        contextBody += ` (${total_roles} roles)`;
      }
      if (is_continuous) {
        contextBody += ' • Continuous employment';
      }
    }
    
    return {
      ...block,
      data: {
        title: '',  // No default title - let user add if needed
        body: contextBody.trim() || '',
        variant: 'info',
      },
    };
  }
  
  private prefillImpactsBlock(block: any, impacts: CareerImpacts): any {
    const metrics: any[] = [];
    
    // Flatten all impact categories into metrics
    Object.entries(impacts).forEach(([category, impactList]) => {
      if (impactList && impactList.length > 0) {
        impactList.forEach((impact: any) => {
          metrics.push({
            label: impact.metric || '',
            value: impact.value || '',
            description: impact.description || '',
            category: impact.category || category,
          });
        });
      }
    });
    
    return {
      ...block,
      data: {
        title: '',  // No default title - let user add if needed
        metrics: metrics.length > 0 ? metrics : [{ label: '', value: '', description: '' }],
      },
    };
  }
}

/**
 * Template Initializer Factory
 */
export class TemplateInitializerFactory {
  private initializers = new Map<string, TemplateInitializer>();
  
  constructor() {
    this.register(new ProjectTemplateInitializer());
    this.register(new CareerTemplateInitializer());
  }
  
  register(initializer: TemplateInitializer): void {
    this.initializers.set(initializer.entityType, initializer);
    console.log('[InitializerFactory] Registered initializer:', initializer.entityType);
  }
  
  getInitializer(entityType: 'project' | 'career'): TemplateInitializer | undefined {
    return this.initializers.get(entityType);
  }
  
  initializeTemplate(
    entityType: 'project' | 'career',
    entity: any,
    templateType: string
  ): any[] {
    console.log('[InitializerFactory] Initializing template:', { entityType, templateType });
    
    const initializer = this.getInitializer(entityType);
    if (!initializer) {
      throw new Error(`No initializer found for entity type: ${entityType}`);
    }
    
    const blocks = initializer.initializeBlocks(entity, templateType);
    console.log('[InitializerFactory] Initialized', blocks.length, 'blocks');
    
    return blocks;
  }
}

// Global instance
export const templateInitializerFactory = new TemplateInitializerFactory();

