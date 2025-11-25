'use client';

import { Plus, X, Sparkles } from 'lucide-react';
import { FeatureGridBlock as FeatureGridBlockType } from '../types';

interface FeatureGridBlockProps {
  block: FeatureGridBlockType;
  onChange: (block: FeatureGridBlockType) => void;
  mode: 'edit' | 'preview';
  deviceMode?: 'desktop' | 'mobile';
}

const ICON_OPTIONS = ['✨', '🚀', '💡', '🎯', '⚡', '🔥', '💪', '🎨', '📊', '🔍', '⚙️', '🌟'];

export function FeatureGridBlock({ block, onChange, mode, deviceMode }: FeatureGridBlockProps) {
  const { data } = block;

  const addItem = () => {
    onChange({
      ...block,
      data: { ...data, items: [...data.items, { title: '', body: '', iconKey: '✨' }] },
    });
  };

  const updateItem = (index: number, field: 'title' | 'body' | 'iconKey' | 'assetUrl', value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...block, data: { ...data, items: newItems } });
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...block, data: { ...data, items: newItems } });
  };

  if (mode === 'preview') {
    // Determine title to display: use provided title, or default based on section label if items have content
    const hasContent = data.items.some(item => item.title);
    const displayTitle = data.title || (hasContent && block.sectionLabel ? block.sectionLabel : '');
    
    // Don't render empty blocks in preview mode
    if (!hasContent) {
      return null;
    }
    
    const gridColsClass =
      deviceMode === 'mobile'
        ? 'grid-cols-1'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
      <div>
        {displayTitle && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{displayTitle}</h2>
        )}
        <div className={`grid ${gridColsClass} gap-6`}>
          {data.items.filter(item => item.title).map((item, index) => (
            <div key={index} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              {item.assetUrl && (
                <img src={item.assetUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-4" />
              )}
              {item.iconKey && !item.assetUrl && (
                <div className="text-4xl mb-4">{item.iconKey}</div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Edit Mode - Notion-style document with exact typography spec
  return (
    <div className="space-y-3">
      {/* Title - Optional */}
      <input
        type="text"
        value={data.title || ''}
        onChange={(e) => onChange({ ...block, data: { ...data, title: e.target.value } })}
        placeholder="Heading (optional)"
        className="w-full text-[18px] font-medium tracking-[0.2px] text-gray-900 focus-underline bg-transparent focus:outline-none placeholder-italic px-0 py-2 focus:ring-0"
      />

      {/* Items Grid - Clean, no borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {data.items.map((item, index) => (
          <div key={index} className="relative group">
            {/* Icon */}
            <div className="text-2xl mb-3">
              {item.iconKey || '✨'}
            </div>

            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="Feature title"
              className="w-full text-[15px] leading-7 font-medium text-gray-900 border-0 bg-transparent focus:outline-none placeholder-italic px-0 py-0 mb-2 focus:ring-0"
            />
            <textarea
              value={item.body}
              onChange={(e) => updateItem(index, 'body', e.target.value)}
              placeholder="Description…"
              rows={3}
              className="w-full text-[15px] leading-7 text-gray-800 border-0 bg-transparent focus:outline-none placeholder-italic resize-none px-0 py-0 focus:ring-0"
            />

            {data.items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                className="absolute -top-1 -right-1 p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button
        onClick={addItem}
        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors mt-6 flex items-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add item
      </button>
    </div>
  );
}

