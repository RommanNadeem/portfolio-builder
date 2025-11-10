'use client';

import { Plus, X } from 'lucide-react';
import { BulletsBlock as BulletsBlockType } from '../types';

interface BulletsBlockProps {
  block: BulletsBlockType;
  onChange: (block: BulletsBlockType) => void;
  mode: 'edit' | 'preview';
}

export function BulletsBlock({ block, onChange, mode }: BulletsBlockProps) {
  const { data } = block;

  const addBullet = () => {
    onChange({
      ...block,
      data: { ...data, bullets: [...data.bullets, ''] },
    });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...data.bullets];
    newBullets[index] = value;
    onChange({ ...block, data: { ...data, bullets: newBullets } });
  };

  const removeBullet = (index: number) => {
    if (data.bullets.length <= 1) return;
    const newBullets = data.bullets.filter((_, i) => i !== index);
    onChange({ ...block, data: { ...data, bullets: newBullets } });
  };

  if (mode === 'preview') {
    return (
      <div>
        {data.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{data.title}</h2>
        )}
        <ul className="space-y-3">
          {data.bullets.filter(b => b.trim()).map((bullet, index) => (
            <li key={index} className="flex gap-3 items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 text-lg">{bullet}</span>
            </li>
          ))}
        </ul>
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

      {/* Bullets - Clean list with body typography */}
      <ul className="space-y-2 mt-6">
        {data.bullets.map((bullet, index) => (
          <li key={index} className="flex gap-3 items-start group">
            <span className="w-1 h-1 bg-gray-400 rounded-full mt-3 flex-shrink-0" />
            <input
              type="text"
              value={bullet}
              onChange={(e) => updateBullet(index, e.target.value)}
              placeholder="List item"
              className="flex-1 text-[15px] leading-7 text-gray-800 border-0 bg-transparent focus:outline-none placeholder-italic px-0 py-1 focus:ring-0"
            />
            {data.bullets.length > 1 && (
              <button
                onClick={() => removeBullet(index)}
                className="p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      
      <button
        onClick={addBullet}
        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors mt-3 flex items-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add item
      </button>
    </div>
  );
}

