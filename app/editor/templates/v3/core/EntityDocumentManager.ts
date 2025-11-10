/**
 * V3 Template System - Entity Document Manager
 * 
 * Handles all data flow between V2 portfolio entities and V3 template blocks.
 * Ensures bidirectional sync and maintains data consistency.
 */

import { ProjectItem, CareerItem, CareerImpacts, Impact } from '@/app/editor/core/types';
import { EntityDocument, SyncResult, LoadResult, ValidationResult } from './types';

/**
 * Data Flow Manager
 * Handles all transformations between V2 and V3
 */
export class EntityDocumentManager {
  private debug = true; // Enable detailed logging
  
  /**
   * Load entity from portfolio and convert to document
   */
  async loadFromPortfolio(
    entityId: string,
    entityType: 'project' | 'career'
  ): Promise<LoadResult> {
    try {
      this.log(`Loading ${entityType} with ID: ${entityId}`);
      
      // 1. Load from localStorage (instant)
      const portfolioData = this.loadPortfolioData();
      
      // 2. Find entity
      const storageKey = entityType === 'project' ? 'projects' : 'careerHighlights';
      const entity = portfolioData[storageKey]?.find((item: any) => item.id === entityId);
      
      if (!entity) {
        return {
          success: false,
          error: `${entityType} not found with ID: ${entityId}`,
        };
      }
      
      this.log(`Found ${entityType}:`, {
        title: entity.title || entity.organization,
        has_blocks: !!entity.blocks,
        blocks_count: entity.blocks?.length || 0,
        template_type: entity.template_type,
      });
      
      // 3. Create document
      const document: EntityDocument = {
        id: entityId,
        entity_type: entityType,
        entity_data: entity,
        template: {
          template_type: entity.template_type || null,
          blocks: entity.blocks || [],
          last_synced: new Date().toISOString(),
        },
        metadata: {
          created_at: entity.created_at || entity.createdAt || new Date().toISOString(),
          updated_at: entity.updated_at || entity.updatedAt || new Date().toISOString(),
          version: 1,
        },
        sync_state: {
          is_synced: true,
          pending_changes: [],
        },
      };
      
      this.log(`Document created successfully`);
      
      return {
        success: true,
        document,
      };
    } catch (error: any) {
      console.error('[EntityDocumentManager] Load failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to load entity',
      };
    }
  }
  
  /**
   * Save document back to portfolio
   */
  async saveToPortfolio(document: EntityDocument): Promise<SyncResult> {
    try {
      this.log(`Saving ${document.entity_type} to portfolio:`, document.id);
      
      // 1. Sync template data back to entity
      const syncedEntity = this.syncTemplateToEntity(document);
      
      this.log(`Synced entity data:`, {
        title: syncedEntity.title || syncedEntity.organization,
        template_type: syncedEntity.template_type,
        blocks_count: syncedEntity.blocks?.length || 0,
        has_detail_page: syncedEntity.has_detail_page,
      });
      
      // 2. Update in portfolio
      const portfolioData = this.loadPortfolioData();
      const storageKey = document.entity_type === 'project' 
        ? 'projects' 
        : 'careerHighlights';
      
      const index = portfolioData[storageKey]?.findIndex(
        (item: any) => item.id === document.id
      );
      
      if (index === -1 || index === undefined) {
        return {
          success: false,
          error: `${document.entity_type} not found in portfolio`,
          timestamp: new Date().toISOString(),
        };
      }
      
      // 3. Replace entity in portfolio
      portfolioData[storageKey][index] = syncedEntity;
      
      // 4. Save to localStorage (instant) - try both keys
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      
      // Also update user-specific key if it exists
      const keys = Object.keys(localStorage);
      const userPortfolioKey = keys.find(k => k.startsWith('portfolio-'));
      if (userPortfolioKey) {
        localStorage.setItem(userPortfolioKey, JSON.stringify(portfolioData));
      }
      
      this.log(`✅ Saved to localStorage successfully`);
      
      // 🔔 Dispatch custom event to notify portfolio page to reload
      // Note: StorageEvent only fires in OTHER tabs, so we use a custom event
      window.dispatchEvent(new CustomEvent('portfolio-updated', {
        detail: {
          entityType: document.entity_type,
          entityId: document.id,
          timestamp: new Date().toISOString()
        }
      }));
      
      this.log(`🔔 Portfolio update event dispatched`);
      
      // 5. Update document sync state
      document.sync_state.is_synced = true;
      document.sync_state.pending_changes = [];
      document.template.last_synced = new Date().toISOString();
      document.metadata.updated_at = new Date().toISOString();
      
      return {
        success: true,
        updated_entity: syncedEntity,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('[EntityDocumentManager] Save failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to save entity',
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  /**
   * Sync template blocks back to entity data
   * CRITICAL: Ensures card data stays in sync with template content
   */
  private syncTemplateToEntity(document: EntityDocument): any {
    const { entity_data, template, entity_type } = document;
    
    this.log(`Syncing template to ${entity_type} entity...`);
    
    // Find hero block (always first block, contains primary metadata)
    const heroBlock = template.blocks.find((b: any) => b.type === 'hero');
    
    if (entity_type === 'project') {
      return this.syncProjectEntity(
        entity_data as ProjectItem,
        template.template_type,
        template.blocks,
        heroBlock
      );
    } else {
      return this.syncCareerEntity(
        entity_data as CareerItem,
        template.template_type,
        template.blocks,
        heroBlock
      );
    }
  }
  
  /**
   * Sync project template to entity
   */
  private syncProjectEntity(
    entity: ProjectItem,
    templateType: string | null,
    blocks: any[],
    heroBlock?: any
  ): ProjectItem {
    const updated = { ...entity };
    
    this.log(`Syncing project entity from ${blocks.length} blocks`);
    
    // Sync from hero block
    if (heroBlock?.type === 'hero') {
      const heroData = heroBlock.data;
      
      this.log(`Hero block data:`, {
        title: heroData.title,
        subtitle: heroData.subtitle,
        hasImage: !!heroData.imageUrl,
        hasMeta: !!heroData.meta,
      });
      
      // Primary fields
      if (heroData.title) {
        updated.title = heroData.title;
      }
      
      if (heroData.subtitle || heroData.description) {
        updated.description = heroData.subtitle || heroData.description;
      }
      
      if (heroData.imageUrl !== undefined) {
        updated.thumbnail = heroData.imageUrl || null;
      }
      
      // Metadata from hero.meta
      if (heroData.meta) {
        if (heroData.meta.year || heroData.meta.projectYear) {
          updated.year = heroData.meta.year || heroData.meta.projectYear;
        }
        if (heroData.meta.role) {
          updated.role = heroData.meta.role;
        }
        if (heroData.meta.team) {
          updated.team_size = heroData.meta.team;
        }
        if (heroData.meta.timeline) {
          updated.duration = heroData.meta.timeline;
        }
      }
    }
    
    // Store template data
    updated.template_type = templateType || undefined;
    updated.blocks = blocks;
    updated.has_detail_page = blocks.length > 0;
    updated.updated_at = new Date().toISOString();
    
    this.log(`Project entity synced:`, {
      title: updated.title,
      has_thumbnail: !!updated.thumbnail,
      has_detail_page: updated.has_detail_page,
    });
    
    return updated;
  }
  
  /**
   * Sync career template to entity
   */
  private syncCareerEntity(
    entity: CareerItem,
    templateType: string | null,
    blocks: any[],
    heroBlock?: any
  ): CareerItem {
    const updated = { ...entity };
    
    this.log(`Syncing career entity from ${blocks.length} blocks`);
    
    // Sync from hero block
    if (heroBlock?.type === 'hero') {
      const heroData = heroBlock.data;
      
      this.log(`Hero block data:`, {
        title: heroData.title,
        subtitle: heroData.subtitle,
        hasMeta: !!heroData.meta,
      });
      
      if (heroData.title) {
        updated.organization = heroData.title;
      }
      
      if (heroData.subtitle) {
        updated.role = heroData.subtitle;
      }
      
      if (heroData.description) {
        updated.description = heroData.description;
      }
      
      // Extract dates from meta
      if (heroData.meta?.Timeline) {
        const timeline = heroData.meta.Timeline;
        const parts = timeline.split('-').map((s: string) => s.trim());
        
        if (parts[0]) {
          updated.start_date = parts[0];
        }
        
        if (parts[1]) {
          if (parts[1].toLowerCase() === 'present') {
            updated.current = true;
            updated.end_date = '';
          } else {
            updated.current = false;
            updated.end_date = parts[1];
          }
        }
      }
      
      // Extract link from meta
      if (heroData.meta?.Website) {
        updated.link = heroData.meta.Website;
      }
    }
    
    // Sync responsibilities from bullets block (typically index 2)
    const responsibilitiesBlock = blocks.find(
      (b: any, idx: number) => b.type === 'bullets' && idx === 2
    );
    
    if (responsibilitiesBlock?.type === 'bullets') {
      const bulletsData = responsibilitiesBlock.data;
      const filteredBullets = (bulletsData.bullets || []).filter((b: string) => b.trim());
      
      if (filteredBullets.length > 0) {
        updated.responsibilities = filteredBullets;
        this.log(`Synced ${filteredBullets.length} responsibilities`);
      }
    }
    
    // Sync achievements from bullets block (typically index 3)
    const achievementsBlock = blocks.find(
      (b: any, idx: number) => b.type === 'bullets' && idx === 3
    );
    
    if (achievementsBlock?.type === 'bullets') {
      const bulletsData = achievementsBlock.data;
      const filteredBullets = (bulletsData.bullets || []).filter((b: string) => b.trim());
      
      if (filteredBullets.length > 0) {
        updated.achievements = filteredBullets;
        updated.key_achievements = filteredBullets;
        this.log(`Synced ${filteredBullets.length} achievements`);
      }
    }
    
    // Sync impacts from metrics block (typically index 4)
    const impactsBlock = blocks.find(
      (b: any, idx: number) => b.type === 'metrics' && idx === 4
    );
    
    if (impactsBlock?.type === 'metrics') {
      const metricsData = impactsBlock.data;
      const impacts = this.convertMetricsToImpacts(metricsData.metrics || []);
      
      if (impacts) {
        updated.impacts = impacts;
        this.log(`Synced impacts from metrics`);
      }
    }
    
    // Store template data
    updated.template_type = templateType || undefined;
    updated.blocks = blocks;
    updated.has_detail_page = blocks.length > 0;
    updated.updated_at = new Date().toISOString();
    
    this.log(`Career entity synced:`, {
      organization: updated.organization,
      role: updated.role,
      achievements_count: updated.achievements?.length || 0,
      has_impacts: !!updated.impacts,
    });
    
    return updated;
  }
  
  /**
   * Convert metrics array to structured impacts
   */
  private convertMetricsToImpacts(metrics: any[]): CareerImpacts | undefined {
    if (!metrics || metrics.length === 0) return undefined;
    
    const impacts: CareerImpacts = {};
    
    metrics.forEach((metric: any) => {
      // Use category if provided, otherwise infer from content
      const category = metric.category || this.inferImpactCategory(
        metric.label || '',
        metric.description || ''
      );
      
      if (!impacts[category as keyof CareerImpacts]) {
        (impacts as any)[category] = [];
      }
      
      (impacts as any)[category]!.push({
        value: metric.value || '',
        metric: metric.label || '',
        description: metric.description || '',
        category: category as any,
      });
    });
    
    return impacts;
  }
  
  /**
   * Infer impact category from text content
   */
  private inferImpactCategory(label: string, description: string): string {
    const text = `${label} ${description}`.toLowerCase();
    
    if (text.match(/revenue|sales|business|roi|profit/)) return 'business';
    if (text.match(/performance|speed|latency|load time/)) return 'performance';
    if (text.match(/growth|user|customer|traffic|engagement/)) return 'growth';
    if (text.match(/quality|bug|error|defect|reliability/)) return 'quality';
    if (text.match(/team|people|hire|mentor|lead/)) return 'team';
    if (text.match(/scale|capacity|throughput|infrastructure/)) return 'scale';
    
    return 'business'; // default
  }
  
  /**
   * Validate entity document
   */
  validateDocument(document: EntityDocument): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check required fields
    if (!document.id) {
      errors.push('Document ID is required');
    }
    
    if (!document.entity_type) {
      errors.push('Entity type is required');
    }
    
    if (!document.entity_data) {
      errors.push('Entity data is required');
    }
    
    // Check template
    if (document.template.blocks.length === 0) {
      warnings.push('Template has no blocks');
    }
    
    // Check hero block exists
    const hasHeroBlock = document.template.blocks.some((b: any) => b.type === 'hero');
    if (document.template.blocks.length > 0 && !hasHeroBlock) {
      warnings.push('Template missing hero block');
    }
    
    // Entity-specific validation
    if (document.entity_type === 'project') {
      const project = document.entity_data as ProjectItem;
      if (!project.title) {
        errors.push('Project title is required');
      }
    } else if (document.entity_type === 'career') {
      const career = document.entity_data as CareerItem;
      if (!career.organization) {
        errors.push('Organization is required');
      }
      if (!career.role) {
        errors.push('Role is required');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
  
  /**
   * Load portfolio data from localStorage
   */
  private loadPortfolioData(): any {
    // Try both possible keys
    let data = localStorage.getItem('portfolioData');
    
    if (!data) {
      // Fallback to portfolio-${userId} pattern
      const keys = Object.keys(localStorage);
      const portfolioKey = keys.find(k => k.startsWith('portfolio-'));
      if (portfolioKey) {
        data = localStorage.getItem(portfolioKey);
      }
    }
    
    if (!data) {
      console.warn('[V3] No portfolio data found, will retry...');
      throw new Error('No portfolio data found in localStorage');
    }
    
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Failed to parse portfolio data');
    }
  }
  
  /**
   * Debug logging
   */
  private log(message: string, data?: any): void {
    if (this.debug) {
      if (data) {
        console.log(`[EntityDocumentManager] ${message}`, data);
      } else {
        console.log(`[EntityDocumentManager] ${message}`);
      }
    }
  }
}

// Global instance
export const entityDocumentManager = new EntityDocumentManager();

