import { TemplateConfig } from './types';

export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  {
    id: 'blank',
    name: 'Blank Template',
    description: 'Start from scratch with a blank canvas',
    icon: '📄',
    color: 'gray',
    sections: [],
    tags: ['flexible', 'custom', 'minimal'],
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    usageCount: 1250,
    category: 'General',
  },
  {
    id: 'product-case-study',
    name: 'Product Case Study',
    description: 'Perfect for showcasing product development and launch',
    icon: '🚀',
    color: 'blue',
    sections: [
      { id: 'hero', label: 'Hero', blockType: 'hero', required: true, description: 'Main title and introduction' },
      { id: 'overview', label: 'Overview', blockType: 'callout', description: 'Project overview callout' },
      { id: 'problem', label: 'Problem', blockType: 'richtext', description: 'Problem statement' },
      { id: 'strategy', label: 'Strategy', blockType: 'bullets', description: 'Strategic approach' },
      { id: 'process', label: 'Process', blockType: 'feature_grid', description: 'Development process' },
      { id: 'launch', label: 'Launch', blockType: 'gallery', description: 'Launch assets and materials' },
      { id: 'results', label: 'Results', blockType: 'metrics', description: 'Key metrics and results' },
      { id: 'learnings', label: 'Learnings', blockType: 'bullets', description: 'Key takeaways' },
    ],
    tags: ['product', 'metrics', 'launch', 'business'],
    difficulty: 'Intermediate',
    estimatedTime: '30 min',
    usageCount: 2840,
    category: 'Business',
  },
  {
    id: 'product-design-case-study',
    name: 'Product Design Case Study',
    description: 'Showcase your design process from research to final design',
    icon: '🎨',
    color: 'purple',
    sections: [
      { id: 'hero', label: 'Hero', blockType: 'hero', required: true, description: 'Project title and overview' },
      { id: 'context', label: 'Context', blockType: 'callout', description: 'Design context' },
      { id: 'problem', label: 'Problem', blockType: 'richtext', description: 'Design challenge' },
      { id: 'research', label: 'Research', blockType: 'feature_grid', description: 'User research findings' },
      { id: 'ideation', label: 'Ideation', blockType: 'gallery', description: 'Ideation and sketches' },
      { id: 'wireframes', label: 'Wireframes', blockType: 'gallery', description: 'Wireframe designs' },
      { id: 'final', label: 'Final Design', blockType: 'gallery', description: 'Final design mockups' },
      { id: 'impact', label: 'Impact', blockType: 'metrics', description: 'Design impact metrics' },
      { id: 'reflection', label: 'Reflection', blockType: 'bullets', description: 'Design reflections' },
    ],
    tags: ['design', 'UX', 'UI', 'research', 'wireframes'],
    difficulty: 'Intermediate',
    estimatedTime: '45 min',
    usageCount: 3920,
    category: 'Design',
  },
  {
    id: 'creative-branding',
    name: 'Creative / Branding Project',
    description: 'Perfect for branding and creative projects',
    icon: '✨',
    color: 'pink',
    sections: [
      { id: 'hero', label: 'Hero', blockType: 'hero', required: true, description: 'Brand introduction' },
      { id: 'brief', label: 'Brief', blockType: 'richtext', description: 'Project brief' },
      { id: 'concept', label: 'Concept', blockType: 'feature_grid', description: 'Brand concept' },
      { id: 'process', label: 'Process', blockType: 'gallery', description: 'Creative process' },
      { id: 'final', label: 'Final Work', blockType: 'gallery', description: 'Final brand assets' },
      { id: 'feedback', label: 'Feedback', blockType: 'callout', description: 'Client feedback' },
      { id: 'outcome', label: 'Outcome', blockType: 'metrics', description: 'Project outcomes' },
    ],
    tags: ['branding', 'creative', 'visual', 'identity'],
    difficulty: 'Beginner',
    estimatedTime: '25 min',
    usageCount: 1680,
    category: 'Creative',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Campaign',
    description: 'Showcase marketing campaigns and their results',
    icon: '📊',
    color: 'green',
    sections: [
      { id: 'hero', label: 'Hero', blockType: 'hero', required: true, description: 'Campaign overview' },
      { id: 'objective', label: 'Objective', blockType: 'callout', description: 'Campaign objectives' },
      { id: 'strategy', label: 'Strategy', blockType: 'steps', description: 'Marketing strategy' },
      { id: 'execution', label: 'Execution', blockType: 'feature_grid', description: 'Campaign execution' },
      { id: 'results', label: 'Results', blockType: 'metrics', description: 'Campaign metrics' },
      { id: 'insights', label: 'Insights', blockType: 'bullets', description: 'Key insights' },
    ],
    tags: ['marketing', 'campaign', 'ROI', 'analytics'],
    difficulty: 'Intermediate',
    estimatedTime: '35 min',
    usageCount: 2130,
    category: 'Marketing',
  },
  {
    id: 'user-research',
    name: 'User Research Project',
    description: 'Document research findings and recommendations',
    icon: '🔍',
    color: 'indigo',
    sections: [
      { id: 'hero', label: 'Hero', blockType: 'hero', required: true, description: 'Research overview' },
      { id: 'context', label: 'Context', blockType: 'richtext', description: 'Research context' },
      { id: 'plan', label: 'Research Plan', blockType: 'steps', description: 'Research methodology' },
      { id: 'findings', label: 'Findings', blockType: 'feature_grid', description: 'Key findings' },
      { id: 'themes', label: 'Themes', blockType: 'bullets', description: 'Research themes' },
      { id: 'recommendations', label: 'Recommendations', blockType: 'callout', description: 'Actionable recommendations' },
    ],
    tags: ['research', 'UX research', 'insights', 'methodology'],
    difficulty: 'Advanced',
    estimatedTime: '40 min',
    usageCount: 890,
    category: 'Research',
  },
  {
    id: 'engineering-technical',
    name: 'Engineering / Technical Project',
    description: 'Document technical projects and solutions',
    icon: '⚙️',
    color: 'slate',
    sections: [
      { id: 'hero', label: 'Hero', blockType: 'hero', required: true, description: 'Project overview' },
      { id: 'overview', label: 'Overview', blockType: 'richtext', description: 'Technical overview' },
      { id: 'architecture', label: 'Architecture', blockType: 'gallery', description: 'System architecture' },
      { id: 'challenges', label: 'Challenges', blockType: 'bullets', description: 'Technical challenges' },
      { id: 'solutions', label: 'Solutions', blockType: 'steps', description: 'Solution approach' },
      { id: 'performance', label: 'Performance', blockType: 'metrics', description: 'Performance metrics' },
      { id: 'outcomes', label: 'Outcomes', blockType: 'callout', description: 'Project outcomes' },
    ],
    tags: ['engineering', 'technical', 'architecture', 'performance'],
    difficulty: 'Advanced',
    estimatedTime: '50 min',
    usageCount: 1420,
    category: 'Engineering',
  },
  {
    id: 'startup-side-project',
    name: 'Startup / Side Project',
    description: 'Share your entrepreneurial journey',
    icon: '💡',
    color: 'amber',
    sections: [
      { id: 'hero', label: 'Hero', blockType: 'hero', required: true, description: 'Project introduction' },
      { id: 'idea', label: 'Idea', blockType: 'richtext', description: 'The big idea' },
      { id: 'mvp', label: 'MVP', blockType: 'steps', description: 'Building the MVP' },
      { id: 'growth', label: 'Growth', blockType: 'metrics', description: 'Growth metrics' },
      { id: 'stack', label: 'Stack', blockType: 'feature_grid', description: 'Technology stack' },
      { id: 'learnings', label: 'Learnings', blockType: 'bullets', description: 'Key learnings' },
    ],
    tags: ['startup', 'side project', 'entrepreneurship', 'MVP'],
    difficulty: 'Beginner',
    estimatedTime: '20 min',
    usageCount: 2560,
    category: 'Business',
  },
  {
    id: 'career-experience',
    name: 'Career Experience',
    description: 'Showcase what you accomplished at a company',
    icon: '💼',
    color: 'blue',
    sections: [
      { id: 'hero', label: 'Overview', blockType: 'hero', required: true, description: 'Role and company overview' },
      { id: 'context', label: 'Context', blockType: 'callout', description: 'Company and team context' },
      { id: 'responsibilities', label: 'Responsibilities', blockType: 'bullets', description: 'Key responsibilities' },
      { id: 'achievements', label: 'Key Achievements', blockType: 'bullets', description: 'Impact-focused accomplishments with metrics' },
      { id: 'impact', label: 'Impact & Results', blockType: 'metrics', description: 'Measurable impact' },
      { id: 'projects', label: 'Notable Projects', blockType: 'steps', description: 'Key projects delivered' },
      { id: 'skills', label: 'Skills & Growth', blockType: 'bullets', description: 'Skills developed' },
      { id: 'reflection', label: 'Reflection', blockType: 'richtext', description: 'Key learnings and takeaways' },
    ],
    tags: ['career', 'work experience', 'achievements', 'impact'],
    difficulty: 'Beginner',
    estimatedTime: '25 min',
    usageCount: 0,
    category: 'Business',
  },
];

export function getTemplateConfig(templateType: string): TemplateConfig | undefined {
  return TEMPLATE_CONFIGS.find(t => t.id === templateType);
}

export function createEmptyBlock(blockType: string, sectionConfig?: { label?: string; description?: string }): any {
  const id = crypto.randomUUID();
  
  const baseBlock = {
    sectionLabel: sectionConfig?.label,
    sectionDescription: sectionConfig?.description,
  };
  
  switch (blockType) {
    case 'hero':
      return {
        type: 'hero',
        id,
        ...baseBlock,
        data: { title: '', subtitle: '', description: '', imageUrl: '', meta: {} },
      };
    case 'callout':
      return {
        type: 'callout',
        id,
        ...baseBlock,
        data: { 
          title: sectionConfig?.label || '',  // ⭐ Use section label as default
          body: '', 
          variant: 'info' 
        },
      };
    case 'richtext':
      return {
        type: 'richtext',
        id,
        ...baseBlock,
        data: { 
          title: sectionConfig?.label || '',  // ⭐ Use section label as default
          body: '' 
        },
      };
    case 'bullets':
      return {
        type: 'bullets',
        id,
        ...baseBlock,
        data: { 
          title: sectionConfig?.label || '',  // ⭐ Use section label as default title
          bullets: [''] 
        },
      };
    case 'steps':
      return {
        type: 'steps',
        id,
        ...baseBlock,
        data: { 
          title: sectionConfig?.label || '',  // ⭐ Use section label as default
          steps: [{ title: '', description: '' }] 
        },
      };
    case 'feature_grid':
      return {
        type: 'feature_grid',
        id,
        ...baseBlock,
        data: { 
          title: sectionConfig?.label || '',  // ⭐ Use section label as default
          items: [{ title: '', body: '', iconKey: '' }] 
        },
      };
    case 'gallery':
      return {
        type: 'gallery',
        id,
        ...baseBlock,
        data: { title: '', images: [], layout: 'grid' },
      };
    case 'metrics':
      return {
        type: 'metrics',
        id,
        ...baseBlock,
        data: { title: '', metrics: [{ label: '', value: '', description: '' }] },
      };
    case 'embed':
      return {
        type: 'embed',
        id,
        ...baseBlock,
        data: { title: '', url: '', embedType: 'other', caption: '', fileName: '' },
      };
    default:
      return null;
  }
}

