'use client';

import { Plus, X } from 'lucide-react';
import { MetricsBlock as MetricsBlockType } from '../types';

interface MetricsBlockProps {
  block: MetricsBlockType;
  onChange: (block: MetricsBlockType) => void;
  mode: 'edit' | 'preview';
}

export function MetricsBlock({ block, onChange, mode }: MetricsBlockProps) {
  const { data } = block;

  const addMetric = () => {
    onChange({
      ...block,
      data: { ...data, metrics: [...data.metrics, { label: '', value: '', description: '' }] },
    });
  };

  const updateMetric = (index: number, field: 'label' | 'value' | 'description', value: string) => {
    const newMetrics = [...data.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    onChange({ ...block, data: { ...data, metrics: newMetrics } });
  };

  const removeMetric = (index: number) => {
    if (data.metrics.length <= 1) return;
    const newMetrics = data.metrics.filter((_, i) => i !== index);
    onChange({ ...block, data: { ...data, metrics: newMetrics } });
  };

  if (mode === 'preview') {
    // Determine title to display: use provided title, or default based on section label if metrics have content
    const hasContent = data.metrics.some(m => m.label && m.value);
    const displayTitle = data.title || (hasContent && block.sectionLabel ? block.sectionLabel : '');
    
    // Don't render empty blocks in preview mode
    if (!hasContent) {
      return null;
    }
    
    return (
      <div>
        {displayTitle && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{displayTitle}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.metrics.filter(m => m.label && m.value).map((metric, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {metric.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {metric.label}
              </div>
              {metric.description && (
                <div className="text-sm text-gray-600">
                  {metric.description}
                </div>
              )}
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

      {/* Metrics Grid - Clean, minimal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
        {data.metrics.map((metric, index) => (
          <div key={index} className="relative text-center group">
            {data.metrics.length > 1 && (
              <button
                onClick={() => removeMetric(index)}
                className="absolute -top-2 -right-2 p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <input
              type="text"
              value={metric.value}
              onChange={(e) => updateMetric(index, 'value', e.target.value)}
              placeholder="42%"
              className="w-full text-[40px] leading-tight font-semibold tracking-[0.2px] text-purple-600 border-0 bg-transparent focus:outline-none placeholder-italic text-center px-0 py-0 mb-2 focus:ring-0"
            />
            <input
              type="text"
              value={metric.label}
              onChange={(e) => updateMetric(index, 'label', e.target.value)}
              placeholder="Metric name"
              className="w-full text-[15px] leading-7 font-medium text-gray-900 border-0 bg-transparent focus:outline-none placeholder-italic text-center px-0 py-0 mb-1 focus:ring-0"
            />
            <input
              type="text"
              value={metric.description || ''}
              onChange={(e) => updateMetric(index, 'description', e.target.value)}
              placeholder="Description…"
              className="w-full text-[12px] text-gray-500 border-0 bg-transparent focus:outline-none placeholder-italic text-center px-0 py-0 focus:ring-0"
            />
          </div>
        ))}
      </div>
      
      <button
        onClick={addMetric}
        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors mt-6 flex items-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add metric
      </button>
    </div>
  );
}

