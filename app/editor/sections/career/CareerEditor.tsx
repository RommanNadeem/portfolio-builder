'use client';

import { Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import MonthYearPicker from '../../components/MonthYearPicker';
import { CareerHighlight } from './types';

interface CareerEditorProps {
  highlights: CareerHighlight[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<CareerHighlight>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isExpanded: boolean;
}

export function CareerEditor({ 
  highlights, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onMove,
  isExpanded 
}: CareerEditorProps) {
  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {highlights.length} {highlights.length === 1 ? 'highlight' : 'highlights'}
      </div>
    );
  }

  const handleAchievementUpdate = (id: string, index: number, value: string) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight) return;
    
    const newAchievements = [...(highlight.achievements || [])];
    newAchievements[index] = value;
    onUpdate(id, { achievements: newAchievements });
  };

  const handleAddAchievement = (id: string) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight || (highlight.achievements || []).length >= 3) return;
    
    onUpdate(id, { achievements: [...(highlight.achievements || []), ''] });
  };

  const handleRemoveAchievement = (id: string, index: number) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight) return;
    
    const newAchievements = (highlight.achievements || []).filter((_, i) => i !== index);
    onUpdate(id, { achievements: newAchievements });
  };

  return (
    <div className="space-y-3">
      {highlights.map((highlight, index) => (
        <div key={highlight.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          {/* Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMove(highlight.id, 'up')}
              disabled={index === 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                value={highlight.organization}
                onChange={(e) => onUpdate(highlight.id, { organization: e.target.value })}
                placeholder="Google, Meta, Startup Inc"
                className="px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none placeholder:text-gray-500"
              />
              <input
                value={highlight.role}
                onChange={(e) => onUpdate(highlight.id, { role: e.target.value })}
                placeholder="Senior Product Designer"
                className="px-2 py-1 text-sm border-0 bg-transparent focus:outline-none placeholder:text-gray-500"
              />
            </div>
            <button
              onClick={() => onDelete(highlight.id)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <textarea
            value={highlight.description}
            onChange={(e) => onUpdate(highlight.id, { description: e.target.value })}
            placeholder="One sentence about what this company does or what you worked on (e.g., Leading AI research lab focused on consumer products)"
            rows={2}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none placeholder:text-gray-500"
          />

          {/* Link */}
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="url"
              value={highlight.link || ''}
              onChange={(e) => onUpdate(highlight.id, { link: e.target.value })}
              placeholder="https://company.com or LinkedIn post URL"
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-500"
            />
          </div>

          {/* Achievements */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Achievements (up to 3)</label>
              {(highlight.achievements || []).length < 3 && (
                <button
                  onClick={() => handleAddAchievement(highlight.id)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              )}
            </div>
            {(highlight.achievements || []).map((achievement, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={achievement}
                  onChange={(e) => handleAchievementUpdate(highlight.id, idx, e.target.value)}
                  placeholder={
                    idx === 0 
                      ? "Led redesign that increased user engagement by 40%" 
                      : idx === 1 
                      ? "Shipped 15+ features on time with 98% customer satisfaction"
                      : "Built design system adopted across 12 products"
                  }
                  className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-500"
                />
                <button
                  onClick={() => handleRemoveAchievement(highlight.id, idx)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
              <MonthYearPicker
                value={highlight.startDate || ''}
                onChange={(value) => onUpdate(highlight.id, { startDate: value })}
                placeholder="Select month"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">End Date</label>
              <MonthYearPicker
                value={highlight.current || highlight.endDate === 'Present' ? 'Present' : (highlight.endDate || '')}
                onChange={(value) => onUpdate(highlight.id, { 
                  endDate: value,
                  current: value === 'Present'
                })}
                placeholder={highlight.current ? 'Present' : 'Select month'}
                disabled={highlight.current}
              />
            </div>
          </div>

          {/* Current checkbox */}
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={highlight.current}
              onChange={(e) => onUpdate(highlight.id, { 
                current: e.target.checked,
                endDate: e.target.checked ? 'Present' : ''
              })}
              className="rounded border-gray-300"
            />
            Currently working here
          </label>
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Career Highlight</span>
      </button>
    </div>
  );
}

