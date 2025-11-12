/**
 * Block Catalog
 * 
 * Complete catalog of available block types that AI can use
 * to design custom case study structures
 */

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  fields: Record<string, any>;
  ai_instructions?: {
    generation_guide: string;
    field_hints: Record<string, string>;
    quality_rules: string[];
    extraction_patterns?: string[];
  };
}

export const BLOCK_CATALOG: BlockDefinition[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Project title and introduction with metadata',
    fields: {
      title: 'required',
      subtitle: 'optional',
      description: 'optional',
      imageUrl: 'optional',
      logoUrl: 'optional',
      'meta.role': 'optional',
      'meta.timeline': 'optional',
      'meta.team': 'optional',
      'meta.company': 'optional',
      'meta.projectYear': 'optional',
      'meta.stackTags': 'optional:array<string>',
    },
    ai_instructions: {
      generation_guide: 'Create a compelling hook. Extract project name for title. Use key achievement or impact in subtitle. Populate meta fields from actual data only.',
      field_hints: {
        title: 'Project name - keep under 60 characters, specific and memorable',
        subtitle: 'Impact-focused tagline - include a metric if available (e.g., "40% efficiency increase, 5K users")',
        description: 'Brief 1-2 sentence overview of the project',
        'meta.role': 'User\'s role (e.g., "Lead Designer", "Senior Engineer")',
        'meta.timeline': 'Project duration (e.g., "6 months", "Jan-June 2024")',
        'meta.team': 'Team composition (e.g., "5 engineers, 2 designers")',
        'meta.stackTags': 'Technologies used - array of strings',
      },
      quality_rules: [
        'Title must be actual project name from content, not generic',
        'Subtitle should highlight biggest achievement or impact',
        'Only populate meta fields if information is in content',
        'Don\'t fabricate team size or timeline'
      ],
      extraction_patterns: [
        'Title: Look for project name, product name, or first heading',
        'Timeline: "6 months", "Q3 2024", "Jan-June", "over X months"',
        'Team: "team of X", "X engineers", "led Y designers"',
        'Tech: Framework names, programming languages, platforms'
      ]
    }
  },
  {
    type: 'callout',
    name: 'Callout Box',
    description: 'Highlight key messages, quotes, or insights',
    fields: {
      body: 'required',
      title: 'optional',
      variant: 'optional:enum(info,success,warning,error)',
      quote: 'optional',
      author: 'optional',
    },
    ai_instructions: {
      generation_guide: 'Use for emphasis on key insights, client quotes, or standout achievements. Keep concise (100-150 words). Use "success" variant for positive outcomes, "info" for context.',
      field_hints: {
        body: 'Main message - 2-3 sentences max. Can be a quote or key insight.',
        title: 'Optional heading to introduce the callout',
        variant: 'Visual style: "info" (blue), "success" (green), "warning" (yellow), "error" (red)',
        quote: 'If this is a testimonial, extract the quote text here',
        author: 'Attribution for quote (e.g., "Sarah Chen, VP Product")',
      },
      quality_rules: [
        'Use sparingly - 1-2 per case study maximum',
        'Keep body under 150 words',
        'Quotes should be actual quotes from content, not fabricated',
        'Choose variant based on message tone'
      ]
    }
  },
  {
    type: 'richtext',
    name: 'Rich Text Content',
    description: 'Detailed paragraphs with markdown support',
    fields: {
      body: 'required',
      title: 'optional',
    },
    ai_instructions: {
      generation_guide: 'Use for detailed explanations, background context, problem statements, or solution descriptions. Support markdown formatting. Length varies based on target_length setting.',
      field_hints: {
        title: 'Section heading (e.g., "The Challenge", "Our Solution", "Background")',
        body: 'Markdown-formatted content. 2-4 paragraphs. Use **bold** for emphasis, lists if needed.',
      },
      quality_rules: [
        'Adjust length based on target_length: brief (150-200 words), standard (200-300 words), comprehensive (250-400 words)',
        'Use clear paragraphs with good flow',
        'Include markdown formatting for readability',
        'Stay focused on one aspect per richtext block'
      ]
    }
  },
  {
    type: 'bullets',
    name: 'Bullet List',
    description: 'Scannable list of key points',
    fields: {
      bullets: 'required:array<string>',
      title: 'optional',
    },
    ai_instructions: {
      generation_guide: 'Create concise, impactful bullet points. Each should be specific and actionable. Use for key features, challenges, learnings, or achievements.',
      field_hints: {
        bullets: 'Array of strings. Each bullet one sentence max. Start with strong verbs or nouns.',
        title: 'Optional list heading (e.g., "Key Achievements", "Challenges Faced")',
      },
      quality_rules: [
        'Include 3-8 bullets per list (adjust based on target_length)',
        'Each bullet should be one line (max 100 characters)',
        'Start with action verbs when possible',
        'Be specific - include numbers if available',
        'Avoid generic statements like "Made improvements"'
      ],
      extraction_patterns: [
        'Look for existing bullet points or numbered lists in content',
        'Extract achievement statements with metrics',
        'Identify key features or capabilities mentioned',
        'Find learning statements or takeaways'
      ]
    }
  },
  {
    type: 'steps',
    name: 'Process Steps',
    description: 'Sequential phases or methodology',
    fields: {
      steps: 'required:array<object>',
      'steps[].title': 'required',
      'steps[].description': 'optional',
      title: 'optional',
    },
    ai_instructions: {
      generation_guide: 'Show sequential workflow, project phases, or methodology. Each step should be a distinct phase with clear title and description.',
      field_hints: {
        title: 'Process heading (e.g., "Our Approach", "Development Phases")',
        'steps[].title': 'Phase name (e.g., "Discovery", "Design", "Build", "Launch")',
        'steps[].description': '1-2 sentences explaining what happened in this phase',
      },
      quality_rules: [
        'Include 3-6 steps (adjust based on target_length)',
        'Each step should be chronological',
        'Descriptions should be clear and specific',
        'Steps should tell a coherent story'
      ],
      extraction_patterns: [
        'Look for: "Phase 1", "Step 1", "First we", "Then we"',
        'Timeline markers: "Month 1-2", "Q1", "Sprint 1"',
        'Process words: Discovery, Design, Build, Test, Launch',
        'Sequential indicators in content'
      ]
    }
  },
  {
    type: 'feature_grid',
    name: 'Feature Grid',
    description: 'Grid of features or key aspects',
    fields: {
      items: 'required:array<object>',
      'items[].title': 'required',
      'items[].body': 'required',
      'items[].iconKey': 'optional',
      'items[].assetUrl': 'optional',
      title: 'optional',
    },
    ai_instructions: {
      generation_guide: 'Showcase key features, components, or aspects in grid format. Each item should be roughly equal weight.',
      field_hints: {
        title: 'Grid heading (e.g., "Key Features", "Core Components")',
        'items[].title': 'Feature/component name (2-4 words)',
        'items[].body': 'Description (2-3 sentences, 40-60 words)',
        'items[].iconKey': 'Optional icon identifier (leave empty for now)',
      },
      quality_rules: [
        'Include 3-6 items for visual balance',
        'Each item title should be clear and concise',
        'Body text should be roughly equal length across items',
        'Focus on most important features/aspects'
      ],
      extraction_patterns: [
        'Look for feature lists or capability descriptions',
        'Identify key components or system parts',
        'Find repeated patterns like "Feature 1", "Feature 2"',
        'Extract highlighted capabilities'
      ]
    }
  },
  {
    type: 'gallery',
    name: 'Image Gallery',
    description: 'Showcase images or visual work',
    fields: {
      images: 'required:array<object>',
      'images[].url': 'required',
      'images[].caption': 'optional',
      title: 'optional',
      layout: 'optional:enum(grid,carousel)',
    },
    ai_instructions: {
      generation_guide: 'Only use if images/URLs are explicitly mentioned in content. Leave images array empty if no visual assets available.',
      field_hints: {
        title: 'Gallery heading (e.g., "Screenshots", "Design Process")',
        'images[].url': 'Image URL - only if found in content, otherwise leave empty',
        'images[].caption': 'Descriptive caption for the image',
      },
      quality_rules: [
        'Do NOT use this block if no images mentioned in content',
        'Only populate if actual image URLs found',
        'Include descriptive captions',
        'If no images available, omit this block entirely'
      ]
    }
  },
  {
    type: 'metrics',
    name: 'Metrics & Results',
    description: 'Quantifiable outcomes and KPIs',
    fields: {
      metrics: 'required:array<object>',
      'metrics[].label': 'required',
      'metrics[].value': 'required',
      'metrics[].description': 'optional',
      title: 'optional',
    },
    ai_instructions: {
      generation_guide: 'Extract ALL quantifiable data. This is often the most impactful section. Look for percentages, dollar amounts, user counts, time savings, performance improvements.',
      field_hints: {
        title: 'Section heading (e.g., "Impact", "Results", "Key Metrics")',
        'metrics[].label': 'Metric name (e.g., "User Growth", "Revenue Increase", "Performance Gain")',
        'metrics[].value': 'The number with unit (e.g., "+275%", "$38K", "5,000 users", "80ms latency")',
        'metrics[].description': 'Context (e.g., "from 1,200 to 4,500 daily active users")',
      },
      quality_rules: [
        'Include 3-6 key metrics (adjust based on target_length)',
        'Use actual numbers from content - never estimate or fabricate',
        'Format values consistently: use +/- for changes, include units',
        'Provide context in description when possible',
        'Prioritize most impressive metrics first'
      ],
      extraction_patterns: [
        'Numbers with %: growth, change, improvement metrics',
        'Numbers with $, €, £: revenue, cost, financial metrics',
        'Large numbers (1K, 5M): user counts, reach, scale metrics',
        'Before/after comparisons in tables or text',
        'Words like: increased, decreased, improved, reduced, grew, reached',
        'Performance metrics: ms, seconds, requests/sec, uptime%'
      ]
    }
  },
  {
    type: 'embed',
    name: 'Embedded Content',
    description: 'External content like videos or Figma',
    fields: {
      url: 'required',
      embedType: 'required:enum(figma,video,pdf,loom,youtube,vimeo,document,other)',
      title: 'optional',
      caption: 'optional',
    },
    ai_instructions: {
      generation_guide: 'Only use if actual URLs to external content are found. Do not use if no embeddable content mentioned.',
      field_hints: {
        url: 'Full URL to embed (Figma, YouTube, etc.)',
        embedType: 'Type of content being embedded',
        caption: 'Descriptive text about the embedded content',
      },
      quality_rules: [
        'Only use if URLs are explicitly in content',
        'If no embeds available, omit this block entirely',
        'Match embedType to URL correctly'
      ]
    }
  },
];

/**
 * Generation Guidelines (sent with every request)
 */
export const AI_GENERATION_GUIDE = {
  writing_quality: [
    'Use actual data from provided content - no fabrication or estimation',
    'Be specific and concrete, not generic or vague',
    'Include metrics and numbers whenever available',
    'Match the specified tone and writing style',
    'Follow the length guidelines (word counts per block type)',
  ],
  
  content_extraction: {
    metrics: 'Look for: percentages, dollar amounts, user counts, growth numbers, before/after comparisons, performance data',
    timeline: 'Extract: project duration, launch dates, quarters (Q1/Q2), milestones, date ranges',
    team: 'Find: team size, roles, composition, collaboration details',
    tech: 'Identify: frameworks, languages, tools, platforms, infrastructure, tech stack',
    challenges: 'Look for: problems, issues, pain points, obstacles mentioned',
    achievements: 'Find: improvements, successes, outcomes, accomplishments',
  },
  
  formatting: {
    titles: 'Keep under 60 characters, capitalize properly, no periods at end',
    bullets: 'One line each (max 100 chars), start with strong verbs or nouns, be specific',
    metrics_format: 'Value must include unit: "+275%", "$38K", "5,000 users", "80ms latency"',
    richtext_length: 'Adjust based on target_length setting - see length_details in options',
  },
  
  quality_checks: {
    no_hallucination: 'If data not found in content, mark required fields as "[DATA_NEEDED]" or omit optional fields',
    no_generic_content: 'Avoid vague phrases like "the project", "we did things", "it was successful"',
    specific_over_vague: 'Say "Increased revenue by 217%" not "significantly improved revenue"',
    use_provided_data: 'Always prefer extracting from content over generating new information',
  }
};

/**
 * Build minimal catalog for AI consumption (fields + instructions)
 */
export function buildBlockCatalog() {
  return BLOCK_CATALOG.map(block => ({
    type: block.type,
    description: block.description,
    fields: block.fields,
    ai_instructions: block.ai_instructions,
  }));
}

/**
 * Get generation guidelines
 */
export function getGenerationGuide() {
  return AI_GENERATION_GUIDE;
}

/**
 * Get block definition by type
 */
export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return BLOCK_CATALOG.find(block => block.type === type);
}

/**
 * Get all block types
 */
export function getAvailableBlockTypes(): string[] {
  return BLOCK_CATALOG.map(block => block.type);
}

/**
 * Tone options with descriptions
 */
export const TONE_OPTIONS = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Corporate, polished, business-focused',
    characteristics: 'Formal language, third-person perspective, business terminology'
  },
  {
    value: 'conversational',
    label: 'Conversational',
    description: 'Friendly, approachable, casual',
    characteristics: 'Natural language, first-person perspective, relatable tone'
  },
  {
    value: 'technical',
    label: 'Technical',
    description: 'Developer-focused, precise, detailed',
    characteristics: 'Technical jargon acceptable, specific terminology, code-aware'
  },
  {
    value: 'confident',
    label: 'Confident',
    description: 'Bold, assertive, results-oriented',
    characteristics: 'Strong declarative statements, achievement focus, impactful language'
  },
  {
    value: 'academic',
    label: 'Academic',
    description: 'Formal, research-oriented, analytical',
    characteristics: 'Scholarly language, objective tone, analytical approach'
  },
  {
    value: 'storytelling',
    label: 'Storytelling',
    description: 'Narrative-driven, engaging, journey-focused',
    characteristics: 'Story arc, emotional engagement, personal journey, narrative flow'
  },
];

/**
 * Length options with complete details
 */
export const LENGTH_OPTIONS = [
  {
    value: 'brief',
    label: 'Brief',
    subtitle: '3-5 min read',
    details: {
      reading_time: '3-5 minutes',
      block_count_range: { min: 5, max: 7, ideal: 6 },
      depth: 'High-level overview focusing on key points and outcomes',
      word_count_estimate: '600-900 words',
      content_focus: 'Essential information only - problem, solution, key results',
      block_content_guidance: {
        richtext_blocks: '150-200 words each',
        bullets: '3-5 items per list',
        metrics: '3-4 key metrics only',
        steps: '3-4 phases maximum',
        feature_grid: '3-4 items',
      },
      best_for: 'Quick showcases, portfolio summaries, overview presentations',
    }
  },
  {
    value: 'standard',
    label: 'Standard',
    subtitle: '5-8 min read',
    details: {
      reading_time: '5-8 minutes',
      block_count_range: { min: 7, max: 10, ideal: 8 },
      depth: 'Balanced coverage with adequate context and detail',
      word_count_estimate: '1000-1400 words',
      content_focus: 'Complete story - context, problem, solution, process, results, learnings',
      block_content_guidance: {
        richtext_blocks: '200-300 words each',
        bullets: '4-6 items per list',
        metrics: '4-6 key metrics',
        steps: '4-6 phases',
        feature_grid: '4-6 items',
      },
      best_for: 'Most projects, portfolio pieces, job applications',
    }
  },
  {
    value: 'comprehensive',
    label: 'Comprehensive',
    subtitle: '8-15 min read',
    details: {
      reading_time: '8-15 minutes',
      block_count_range: { min: 10, max: 15, ideal: 12 },
      depth: 'In-depth coverage with comprehensive details, context, and reflection',
      word_count_estimate: '1500-2500 words',
      content_focus: 'Full narrative - extensive context, detailed problem, comprehensive solution, thorough process, complete results, deep learnings, future outlook',
      block_content_guidance: {
        richtext_blocks: '250-400 words each',
        bullets: '6-8 items per list',
        metrics: '6-8 detailed metrics with context',
        steps: '5-8 phases with full descriptions',
        feature_grid: '6-8 items',
        callouts: '2-3 callouts allowed',
      },
      best_for: 'Complex projects, flagship work, detailed case studies, thorough documentation',
    }
  },
];

/**
 * Get tone by value
 */
export function getToneOption(value: string) {
  return TONE_OPTIONS.find(t => t.value === value);
}

/**
 * Get length by value
 */
export function getLengthOption(value: string) {
  return LENGTH_OPTIONS.find(l => l.value === value);
}
