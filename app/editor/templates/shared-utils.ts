// Shared utilities for template detail pages

export const BLOCK_TYPE_OPTIONS = [
  { type: 'richtext', label: 'Rich Text', icon: '📝', description: 'Long-form content and paragraphs' },
  { type: 'callout', label: 'Callout', icon: 'ℹ️', description: 'Highlighted information box' },
  { type: 'bullets', label: 'Bullet List', icon: '•', description: 'Key points and takeaways' },
  { type: 'steps', label: 'Steps', icon: '1️⃣', description: 'Sequential process or methodology' },
  { type: 'feature_grid', label: 'Feature Grid', icon: '⚡', description: 'Grid of features or highlights' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️', description: 'Image grid or carousel' },
  { type: 'metrics', label: 'Metrics', icon: '📊', description: 'Key numbers and statistics' },
  { type: 'embed', label: 'Embed', icon: '🎬', description: 'Videos, Figma, or PDFs' },
];

// Helper function to get icon for block type
export function getBlockIcon(blockType: string): string {
  const icons: Record<string, string> = {
    hero: '🎯',
    richtext: '📝',
    callout: '💡',
    bullets: '📋',
    steps: '🔢',
    feature_grid: '⚡',
    gallery: '🖼️',
    metrics: '📊',
    embed: '🎬',
  };
  return icons[blockType] || '📄';
}

// Helper function to get contextual hints for each block type
export function getBlockHint(blockType: string, label?: string, context: 'project' | 'career' = 'project'): string {
  const projectHints: Record<string, string> = {
    hero: 'Add your project title, subtitle, description, and key details to set the stage',
    richtext: 'Write detailed paragraphs to explain this section. You can format your text and add emphasis.',
    callout: 'Highlight important information like key quotes, insights, or objectives in a visually distinct box.',
    bullets: 'List key points, takeaways, or highlights. Great for summarizing important information.',
    steps: 'Break down your process into clear, sequential steps. Perfect for showing methodology or workflows.',
    feature_grid: 'Showcase multiple features, elements, or highlights in a grid layout with icons and descriptions.',
    gallery: 'Add images, screenshots, or visuals to illustrate your work. Supports both grid and carousel layouts.',
    metrics: 'Display impactful numbers and statistics that demonstrate results and outcomes.',
    embed: 'Embed external content like Figma designs, videos, or PDFs directly into your portfolio.',
  };

  const careerHints: Record<string, string> = {
    hero: 'Add your role, company, and key details about your experience',
    richtext: 'Write detailed paragraphs to explain this section. You can format your text and add emphasis.',
    callout: 'Highlight important information like key quotes, insights, or team context in a visually distinct box.',
    bullets: 'List key responsibilities, achievements, or highlights. Great for summarizing your impact.',
    steps: 'Break down your process or key projects into clear, sequential steps.',
    feature_grid: 'Showcase multiple achievements or projects in a grid layout with descriptions.',
    gallery: 'Add images, screenshots, or visuals to illustrate your work. Supports both grid and carousel layouts.',
    metrics: 'Display impactful numbers and statistics that demonstrate your results and outcomes.',
    embed: 'Embed external content like videos or PDFs directly into your career page.',
  };

  const hints = context === 'career' ? careerHints : projectHints;
  return hints[blockType] || `Add content for ${label || 'this section'}`;
}

// Check if a block has meaningful content
export function hasBlockContent(block: any): boolean {
  if (block.type === 'hero') return true;
  if (block.type === 'richtext') return !!(block.data?.body?.trim());
  if (block.type === 'callout') return !!(block.data?.body?.trim());
  if (block.type === 'bullets') return !!(block.data?.bullets?.some((b: string) => b.trim()));
  if (block.type === 'steps') return !!(block.data?.steps?.some((s: any) => s.title?.trim()));
  if (block.type === 'feature_grid') return !!(block.data?.items?.some((i: any) => i.title?.trim()));
  if (block.type === 'gallery') return !!(block.data?.images?.length > 0);
  if (block.type === 'metrics') return !!(block.data?.metrics?.some((m: any) => m.value?.trim()));
  if (block.type === 'embed') return !!(block.data?.url);
  return false;
}

// Calculate progress percentage
export function calculateProgress(templateBlocks: any[], savedSections: Set<string>): number {
  if (templateBlocks.length === 0) return 0;
  const totalSections = templateBlocks.length;
  const completedSections = savedSections.size;
  return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
}

// Auto-scroll to section
export function scrollToSection(index: number, behavior: 'smooth' | 'auto' = 'smooth') {
  setTimeout(() => {
    document.getElementById(`section-${index}`)?.scrollIntoView({ behavior, block: 'center' });
  }, 100);
}

// Find next unsaved section
export function findNextUnsavedSection(
  currentIndex: number,
  templateBlocks: any[],
  savedSections: Set<string>
): number | null {
  for (let i = currentIndex + 1; i < templateBlocks.length; i++) {
    if (!savedSections.has(templateBlocks[i].id)) {
      return i;
    }
  }
  return null;
}

