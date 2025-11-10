'use client';

import { Sparkles } from 'lucide-react';
import { BlockType } from '../types';

interface BlockSuggestion {
  field: string;
  value: string;
  label: string;
}

// Context-aware suggestions for different block types
const BLOCK_SUGGESTIONS: Record<BlockType, Record<string, BlockSuggestion[]>> = {
  hero: {
    title: [
      { field: 'title', value: 'Redesigning the Mobile Experience', label: 'Design project' },
      { field: 'title', value: 'Building a Scalable API Platform', label: 'Engineering project' },
      { field: 'title', value: 'Launching Our Brand Identity', label: 'Creative project' },
    ],
    subtitle: [
      { field: 'subtitle', value: 'How we increased user engagement by 40%', label: 'Impact-focused' },
      { field: 'subtitle', value: 'A comprehensive redesign from research to launch', label: 'Process-focused' },
      { field: 'subtitle', value: 'Solving complex problems with elegant solutions', label: 'Problem-focused' },
    ],
    role: [
      { field: 'role', value: 'Lead Product Designer', label: 'Design' },
      { field: 'role', value: 'Full-stack Developer', label: 'Engineering' },
      { field: 'role', value: 'Creative Director', label: 'Creative' },
      { field: 'role', value: 'Product Manager', label: 'Product' },
    ],
  },
  richtext: {
    problem: [
      { field: 'body', value: 'Users were struggling to complete the checkout process, with 65% abandoning their carts before completion. Through user research, we identified three key pain points: confusing navigation, lack of progress indicators, and unclear error messages.', label: 'Problem statement' },
    ],
    solution: [
      { field: 'body', value: 'We implemented a three-step approach: simplified the user interface, added real-time validation, and created clear progress indicators. This solution balanced user needs with business requirements while maintaining technical feasibility.', label: 'Solution description' },
    ],
  },
  callout: {
    quote: [
      { field: 'quote', value: '"This redesign transformed how our team works. We\'re 2x more productive."', label: 'User testimonial' },
      { field: 'quote', value: 'Key Insight: Users prioritize speed over features when completing transactions', label: 'Key insight' },
    ],
  },
  bullets: {
    takeaways: [
      { field: 'bullets', value: 'Start with user research to validate assumptions\nPrioritize accessibility from day one\nIterate based on real user feedback\nMeasure impact with concrete metrics', label: 'Key takeaways' },
    ],
  },
  steps: {},
  feature_grid: {},
  gallery: {},
  metrics: {
    results: [
      { field: 'metrics', value: '40%\nIncrease in conversion rate\nMeasured over 3 months', label: 'Conversion metrics' },
      { field: 'metrics', value: '2.5x\nFaster load time\nCompared to previous version', label: 'Performance metrics' },
    ],
  },
  embed: {},
};

interface SmartSuggestionsProps {
  blockType: BlockType;
  context?: string; // e.g., 'problem', 'solution', 'results'
  onApplySuggestion: (field: string, value: string) => void;
}

export function SmartSuggestions({ blockType, context = 'default', onApplySuggestion }: SmartSuggestionsProps) {
  const suggestions = BLOCK_SUGGESTIONS[blockType]?.[context] || [];

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 text-sm font-medium text-purple-900">
        <Sparkles className="w-4 h-4" />
        <span>Smart Suggestions</span>
      </div>
      
      <p className="text-xs text-gray-700">
        Get started quickly with these example templates:
      </p>

      <div className="space-y-2">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onApplySuggestion(suggestion.field, suggestion.value)}
            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {suggestion.label}
                </div>
                <div className="text-xs text-gray-600 line-clamp-2">
                  {suggestion.value}
                </div>
              </div>
              <div className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                Use →
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 italic">
        💡 Tip: Click any suggestion to use it as a starting point, then customize it to match your project.
      </p>
    </div>
  );
}

// Helper component for empty state with contextual hints
interface EmptyBlockHintProps {
  blockType: BlockType;
  context?: string;
  children: React.ReactNode;
}

export function EmptyBlockHint({ blockType, context, children }: EmptyBlockHintProps) {
  const hints: Record<string, string> = {
    hero: 'Add your project title, subtitle, and key details to make a strong first impression.',
    richtext: 'Write detailed paragraphs to explain this section. You can format your text and add emphasis.',
    callout: 'Highlight important information like key quotes, insights, or objectives.',
    bullets: 'List your key points and takeaways. Each bullet should be clear and concise.',
    steps: 'Break down your process into clear, sequential steps.',
    feature_grid: 'Showcase multiple features or elements in a grid layout.',
    gallery: 'Add images, screenshots, or visuals to illustrate your work.',
    metrics: 'Display impactful numbers that demonstrate your results.',
    embed: 'Embed external content like Figma designs, videos, or PDFs.',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-2xl">💡</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 mb-1">
            What to include:
          </div>
          <p className="text-xs text-gray-600">
            {hints[blockType] || 'Add content for this section'}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

