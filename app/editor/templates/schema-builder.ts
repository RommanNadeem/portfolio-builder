/**
 * Template Schema Builder
 * 
 * Converts frontend template configs into structured schemas
 * that the backend can understand and adapt to.
 */

import { TemplateConfig, BlockType } from './types';
import { getTemplateConfig } from './configs';

// Block field specifications
const BLOCK_FIELD_SPECS: Record<BlockType, any> = {
  hero: {
    title: { type: 'string', required: true },
    subtitle: { type: 'string', required: false },
    description: { type: 'string', required: false },
    imageUrl: { type: 'string', required: false },
    logoUrl: { type: 'string', required: false },
    meta: {
      type: 'object',
      required: false,
      fields: {
        projectYear: { type: 'string', required: false },
        year: { type: 'string', required: false },
        channels: { type: 'array<string>', required: false },
        stackTags: { type: 'array<string>', required: false },
        team: { type: 'string', required: false },
        timeline: { type: 'string', required: false },
        role: { type: 'string', required: false },
        company: { type: 'string', required: false },
        startDate: { type: 'string', required: false },
        endDate: { type: 'string', required: false },
        currentlyWorking: { type: 'boolean', required: false },
        Website: { type: 'string', required: false },
      }
    }
  },
  callout: {
    title: { type: 'string', required: false },
    body: { type: 'string', required: true },
    variant: { type: "'info' | 'success' | 'warning' | 'error'", required: false },
    quote: { type: 'string', required: false },
    author: { type: 'string', required: false },
  },
  richtext: {
    title: { type: 'string', required: false },
    body: { type: 'string', required: true },
  },
  bullets: {
    title: { type: 'string', required: false },
    bullets: { type: 'array<string>', required: true },
  },
  steps: {
    title: { type: 'string', required: false },
    steps: {
      type: 'array<object>',
      required: true,
      item_schema: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: false },
      }
    }
  },
  feature_grid: {
    title: { type: 'string', required: false },
    items: {
      type: 'array<object>',
      required: true,
      item_schema: {
        title: { type: 'string', required: true },
        body: { type: 'string', required: true },
        iconKey: { type: 'string', required: false },
        assetUrl: { type: 'string', required: false },
      }
    }
  },
  gallery: {
    title: { type: 'string', required: false },
    images: {
      type: 'array<object>',
      required: true,
      item_schema: {
        url: { type: 'string', required: true },
        caption: { type: 'string', required: false },
      }
    },
    layout: { type: "'grid' | 'carousel'", required: false },
  },
  metrics: {
    title: { type: 'string', required: false },
    metrics: {
      type: 'array<object>',
      required: true,
      item_schema: {
        label: { type: 'string', required: true },
        value: { type: 'string', required: true },
        description: { type: 'string', required: false },
      }
    }
  },
  embed: {
    title: { type: 'string', required: false },
    url: { type: 'string', required: true },
    embedType: { type: "'figma' | 'video' | 'pdf' | 'loom' | 'youtube' | 'vimeo' | 'document' | 'other'", required: true },
    caption: { type: 'string', required: false },
    fileName: { type: 'string', required: false },
  },
};

// AI hints for each block type
const BLOCK_AI_HINTS: Record<BlockType, string> = {
  hero: 'Focus on creating a compelling hook. Extract project name, role, and key achievement for subtitle. Look for metrics and technologies to populate meta fields.',
  callout: 'Summarize the key message in 2-3 sentences. Use "info" variant for overview/context, "success" for positive outcomes, "warning" for challenges.',
  richtext: 'Generate detailed paragraphs with good flow. Look for contextual information, background, or detailed explanations. Support markdown formatting.',
  bullets: 'Extract or generate 3-6 concise bullet points. Each should be specific and action-oriented. Look for lists, achievements, or key points.',
  steps: 'Identify sequential processes or phases. Each step should have a clear title and optional description. Look for timelines, methodologies, or workflows.',
  feature_grid: 'Extract 3-6 key features, aspects, or components. Each needs a title and body. Look for product features, design principles, or key elements.',
  gallery: 'Note: Images are not processed. Mark as [IMAGES_NEEDED] or leave empty for user to add later.',
  metrics: 'Extract quantifiable data: numbers, percentages, growth figures. Look for before/after comparisons, KPIs, and measurable results. Each metric needs label and value.',
  embed: 'Note: Embeds need URLs. If URLs are found in content, extract them. Otherwise mark as [EMBED_NEEDED].',
};

/**
 * Build a complete schema from a template configuration
 */
export function buildTemplateSchema(templateType: string) {
  const config = getTemplateConfig(templateType);
  
  if (!config) {
    throw new Error(`Template config not found for: ${templateType}`);
  }

  return {
    template_type: config.id,
    template_name: config.name,
    template_description: config.description,
    sections: config.sections.map(section => ({
      id: section.id,
      label: section.label,
      blockType: section.blockType,
      required: section.required || false,
      description: section.description,
      expected_fields: BLOCK_FIELD_SPECS[section.blockType as BlockType],
      ai_hints: BLOCK_AI_HINTS[section.blockType as BlockType],
    })),
    block_definitions: BLOCK_FIELD_SPECS,
  };
}

/**
 * Build AI hints specific to a template
 */
export function buildTemplateAIHints(templateType: string): string {
  const config = getTemplateConfig(templateType);
  
  if (!config) {
    return '';
  }

  const hints: string[] = [
    `This is a ${config.name} case study.`,
    config.description,
  ];

  // Add template-specific guidance
  switch (config.id) {
    case 'product-case-study':
      hints.push(
        'Focus on: product goals, challenges solved, metrics/results, user impact.',
        'Look for: launch dates, user growth, revenue, engagement metrics.',
        'Structure: Problem → Solution → Results'
      );
      break;
    case 'product-design-case-study':
      hints.push(
        'Focus on: design process, user research, iterations, final designs.',
        'Look for: user insights, design decisions, usability metrics.',
        'Structure: Research → Ideation → Design → Impact'
      );
      break;
    case 'engineering-technical':
      hints.push(
        'Focus on: technical challenges, architecture, solutions, performance.',
        'Look for: tech stack, system design, scalability, performance metrics.',
        'Structure: Problem → Architecture → Implementation → Results'
      );
      break;
    case 'digital-marketing':
      hints.push(
        'Focus on: campaign goals, strategy, execution, measurable results.',
        'Look for: ROI, engagement rates, conversion metrics, audience reach.',
        'Structure: Objective → Strategy → Execution → Results'
      );
      break;
    case 'startup-side-project':
      hints.push(
        'Focus on: the idea, MVP journey, growth, learnings.',
        'Look for: user acquisition, revenue, tech stack, key milestones.',
        'Structure: Idea → Build → Grow → Learn'
      );
      break;
    case 'user-research':
      hints.push(
        'Focus on: research methodology, findings, insights, recommendations.',
        'Look for: participant data, key themes, actionable insights.',
        'Structure: Context → Method → Findings → Recommendations'
      );
      break;
    case 'creative-branding':
      hints.push(
        'Focus on: brand concept, creative process, final deliverables.',
        'Look for: brand values, design rationale, client feedback.',
        'Structure: Brief → Concept → Process → Outcome'
      );
      break;
  }

  return hints.join(' ');
}

/**
 * Validate that generated blocks match the schema
 */
export function validateBlocksAgainstSchema(
  blocks: any[],
  schema: ReturnType<typeof buildTemplateSchema>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (blocks.length !== schema.sections.length) {
    errors.push(`Expected ${schema.sections.length} blocks but got ${blocks.length}`);
  }

  blocks.forEach((block, index) => {
    const section = schema.sections[index];
    if (!section) return;

    // Check block type matches
    if (block.type !== section.blockType) {
      errors.push(`Block ${index}: Expected type '${section.blockType}' but got '${block.type}'`);
    }

    // Check required fields
    const expectedFields = section.expected_fields;
    Object.entries(expectedFields).forEach(([field, spec]: [string, any]) => {
      if (spec.required && !(field in block.data)) {
        errors.push(`Block ${index} (${section.label}): Missing required field '${field}'`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

