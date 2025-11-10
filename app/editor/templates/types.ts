// ============================================
// TEMPLATE SYSTEM TYPES
// ============================================

// Base block types
export type BlockType =
  | 'hero'
  | 'callout'
  | 'richtext'
  | 'bullets'
  | 'steps'
  | 'feature_grid'
  | 'gallery'
  | 'metrics'
  | 'embed';

// Template types
export type TemplateType =
  | 'blank'
  | 'product-case-study'
  | 'product-design-case-study'
  | 'creative-branding'
  | 'digital-marketing'
  | 'user-research'
  | 'engineering-technical'
  | 'startup-side-project'
  | 'career-experience';

// ============================================
// BLOCK DATA INTERFACES
// ============================================

export interface HeroBlock {
  type: 'hero';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    logoUrl?: string;
    meta?: {
      projectYear?: string;
      year?: string;
      channels?: string[];
      stackTags?: string[];
      team?: string;
      timeline?: string;
      role?: string;
    };
  };
}

export interface CalloutBlock {
  type: 'callout';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    body: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
    quote?: string;
    author?: string;
  };
}

export interface RichTextBlock {
  type: 'richtext';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    body: string;
  };
}

export interface BulletsBlock {
  type: 'bullets';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    bullets: string[];
  };
}

export interface StepsBlock {
  type: 'steps';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    steps: {
      title: string;
      description?: string;
    }[];
  };
}

export interface FeatureGridBlock {
  type: 'feature_grid';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    items: {
      title: string;
      body: string;
      iconKey?: string;
      assetUrl?: string;
    }[];
  };
}

export interface GalleryBlock {
  type: 'gallery';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    images: {
      url: string;
      caption?: string;
    }[];
    layout?: 'grid' | 'carousel';
  };
}

export interface MetricsBlock {
  type: 'metrics';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    metrics: {
      label: string;
      value: string;
      description?: string;
    }[];
  };
}

export interface EmbedBlock {
  type: 'embed';
  id: string;
  sectionLabel?: string;
  sectionDescription?: string;
  data: {
    title?: string;
    url: string;
    embedType: 'figma' | 'video' | 'pdf' | 'loom' | 'youtube' | 'vimeo' | 'document' | 'other';
    caption?: string;
    fileName?: string;
  };
}

// Union type for all blocks
export type TemplateBlock =
  | HeroBlock
  | CalloutBlock
  | RichTextBlock
  | BulletsBlock
  | StepsBlock
  | FeatureGridBlock
  | GalleryBlock
  | MetricsBlock
  | EmbedBlock;

// ============================================
// TEMPLATE CONFIGURATION
// ============================================

export interface TemplateSectionConfig {
  id: string;
  label: string;
  blockType: BlockType;
  required?: boolean;
  description?: string;
}

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  color: string;
  sections: TemplateSectionConfig[];
  // Enhanced metadata for better discovery
  thumbnail?: string;
  tags: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime?: string;
  usageCount?: number;
  category: 'Design' | 'Engineering' | 'Marketing' | 'Research' | 'Business' | 'Creative' | 'General';
}

// ============================================
// TEMPLATE PROJECT DATA
// ============================================

export interface TemplateProject {
  id: string;
  templateType: TemplateType;
  title: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  blocks: TemplateBlock[];
  createdAt: string;
  updatedAt: string;
}

