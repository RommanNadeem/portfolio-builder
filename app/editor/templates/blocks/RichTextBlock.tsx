'use client';

import { RichTextBlock as RichTextBlockType } from '../types';
import { SmartSuggestions, EmptyBlockHint } from './BlockSuggestions';

interface RichTextBlockProps {
  block: RichTextBlockType;
  onChange: (block: RichTextBlockType) => void;
  mode: 'edit' | 'preview';
  context?: string; // 'problem', 'solution', etc.
  deviceMode?: 'desktop' | 'mobile';
}

export function RichTextBlock({ block, onChange, mode, context }: RichTextBlockProps) {
  const { data } = block;
  const isEmpty = !data.body || data.body.trim().length === 0;

  if (mode === 'preview') {
    // Determine title to display: use provided title, or default based on section label if body has content
    const hasBodyContent = data.body && data.body.trim().length > 0;
    const displayTitle = data.title || (hasBodyContent && block.sectionLabel ? block.sectionLabel : '');
    
    // Don't render empty blocks in preview mode
    if (!hasBodyContent) {
      return null;
    }
    
    return (
      <div className="prose prose-lg max-w-none">
        {displayTitle && (
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{displayTitle}</h2>
        )}
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {data.body}
        </div>
      </div>
    );
  }

  const handleApplySuggestion = (field: string, value: string) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  // Edit Mode - Notion-style document with exact typography spec
  return (
    <div className="space-y-3">
      {/* Title - Optional h2 section title */}
      {(data.title || isEmpty) && (
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ ...block, data: { ...data, title: e.target.value } })}
          placeholder="Heading (optional)"
          className="w-full text-[18px] font-medium tracking-[0.2px] text-gray-900 focus-underline bg-transparent focus:outline-none placeholder-italic px-0 py-2 focus:ring-0"
        />
      )}

      {/* Body - body per spec: text-[15px] leading-7 text-gray-800 */}
      <textarea
        value={data.body}
        onChange={(e) => onChange({ ...block, data: { ...data, body: e.target.value } })}
        placeholder="Type something…"
        rows={isEmpty ? 4 : 8}
        className="w-full text-[15px] leading-7 text-gray-800 border-0 bg-transparent focus:outline-none placeholder-italic resize-none px-0 py-0 focus:ring-0"
      />
    </div>
  );
}

