/**
 * CareerCard Component (V2 - Simplified)
 * 
 * Progressive disclosure: Start with just organization and role, add details in template editor.
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FileEdit, GripVertical, Trash2 } from 'lucide-react';
import { CareerItem } from './types';

interface CareerCardProps {
  career: CareerItem;
  index: number;
  totalCount: number;
  onUpdate: (id: string, updates: Partial<CareerItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSave?: () => Promise<void>; // Force immediate save
  viewMode?: 'edit' | 'preview';
}

export function CareerCard({
  career,
  index,
  totalCount,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSave,
  viewMode = 'edit',
}: CareerCardProps) {
  const router = useRouter();
  
  /**
   * Navigate to detail page with verification
   * Forces immediate save before navigation to prevent race conditions
   */
  const navigateToDetail = useCallback(async () => {
    console.log('[CareerCard] Preparing to navigate for career:', career.id);
    
    // Force immediate save to ensure career is in localStorage
    if (onSave) {
      console.log('[CareerCard] 🔄 Forcing immediate save before navigation...');
      await onSave();
      console.log('[CareerCard] ✅ Save completed');
    }
    
    setTimeout(() => {
      const portfolioData = localStorage.getItem('portfolioData');
      if (portfolioData) {
        const parsed = JSON.parse(portfolioData);
        const careerExists = parsed.careerHighlights?.some((c: any) => c.id === career.id);
        
        if (careerExists) {
          console.log('[CareerCard] ✅ Career verified in localStorage, navigating...');
          router.push(`/detail/career-editor/${career.id}?mode=${viewMode}`);
        } else {
          console.error('[CareerCard] ❌ Career not found in localStorage after save!');
          console.log('[CareerCard] Available careers:', parsed.careerHighlights?.map((c: any) => ({ id: c.id, org: c.organization })));
          router.push(`/detail/career-editor/${career.id}?mode=${viewMode}`);
        }
      } else {
        console.error('[CareerCard] ❌ No portfolioData in localStorage!');
        router.push(`/detail/career-editor/${career.id}?mode=${viewMode}`);
      }
    }, 200);
  }, [career.id, router, viewMode, onSave]);

  const handleUpdate = (field: keyof CareerItem, value: any) => {
    onUpdate(career.id, { [field]: value });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow group">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-move"
          title="Reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1 flex items-start gap-2">
          <div className="flex-1 space-y-1">
            {/* Role */}
            <input
              value={career.role}
              onChange={(e) => handleUpdate('role', e.target.value)}
              placeholder="Role (e.g., Senior Product Manager)"
              className="w-full px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-400"
            />
            
            {/* Organization */}
            <input
              value={career.organization}
              onChange={(e) => handleUpdate('organization', e.target.value)}
              placeholder="Company (e.g., Google)"
              className="w-full px-2 py-1 text-xs text-gray-600 border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-400"
            />
          </div>
          
          {/* Quick Edit Icon */}
          <button
            onClick={navigateToDetail}
            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            title={career.template_type ? 'Continue editing' : 'Start editing'}
          >
            <FileEdit className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={() => onDelete(career.id)}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
        <input
          type="text"
          value={career.start_date}
          onChange={(e) => handleUpdate('start_date', e.target.value)}
          placeholder="Start (e.g., Jan 2020)"
          className="flex-1 px-2 py-1 border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
        />
        <span>—</span>
        {career.current ? (
          <span className="flex-1 px-2 py-1 text-blue-600 font-medium">Present</span>
        ) : (
          <input
            type="text"
            value={career.end_date}
            onChange={(e) => handleUpdate('end_date', e.target.value)}
            placeholder="End (e.g., Dec 2022)"
            className="flex-1 px-2 py-1 border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
          />
        )}
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={career.current}
            onChange={(e) => handleUpdate('current', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <span className="text-xs">Current</span>
        </label>
      </div>

      {/* Start Editing Button */}
      <button
        onClick={navigateToDetail}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
      >
        <FileEdit className="w-4 h-4" />
        {career.template_type ? 'Continue Editing' : 'Start Editing'}
      </button>
      
      {/* Helper text */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Add achievements, responsibilities, and impact in the editor
      </p>
    </div>
  );
}
