'use client';

import { Plus, X } from 'lucide-react';
import { StepsBlock as StepsBlockType } from '../types';

interface StepsBlockProps {
  block: StepsBlockType;
  onChange: (block: StepsBlockType) => void;
  mode: 'edit' | 'preview';
}

export function StepsBlock({ block, onChange, mode }: StepsBlockProps) {
  const { data } = block;

  const addStep = () => {
    onChange({
      ...block,
      data: { ...data, steps: [...data.steps, { title: '', description: '' }] },
    });
  };

  const updateStep = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onChange({ ...block, data: { ...data, steps: newSteps } });
  };

  const removeStep = (index: number) => {
    if (data.steps.length <= 1) return;
    const newSteps = data.steps.filter((_, i) => i !== index);
    onChange({ ...block, data: { ...data, steps: newSteps } });
  };

  if (mode === 'preview') {
    return (
      <div>
        {data.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{data.title}</h2>
        )}
        <div className="space-y-6">
          {data.steps.filter(s => s.title.trim()).map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                {step.description && (
                  <p className="text-gray-700">{step.description}</p>
                )}
              </div>
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

      {/* Steps - Clean numbered list with body typography */}
      <div className="space-y-6 mt-6">
        {data.steps.map((step, index) => (
          <div key={index} className="flex gap-3 group">
            <div className="flex-shrink-0 pt-1">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStep(index, 'title', e.target.value)}
                placeholder="Step title"
                className="w-full text-[15px] leading-7 font-medium text-gray-900 border-0 bg-transparent focus:outline-none placeholder-italic px-0 py-0 focus:ring-0"
              />
              <textarea
                value={step.description || ''}
                onChange={(e) => updateStep(index, 'description', e.target.value)}
                placeholder="Add description…"
                rows={2}
                className="w-full text-[15px] leading-7 text-gray-800 border-0 bg-transparent focus:outline-none placeholder-italic resize-none px-0 py-0 focus:ring-0"
              />
            </div>
            {data.steps.length > 1 && (
              <button
                onClick={() => removeStep(index)}
                className="p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity self-start"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button
        onClick={addStep}
        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors mt-3 flex items-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add step
      </button>
    </div>
  );
}

