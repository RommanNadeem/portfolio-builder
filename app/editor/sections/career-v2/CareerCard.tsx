/**
 * CareerCard Component (V2 - Simplified)
 * 
 * Progressive disclosure: Start with just organization and role, add details in template editor.
 * Now with drag-and-drop support.
 */

'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileEdit, GripVertical, Trash2, AlertCircle } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MonthYearPicker from '../../components/MonthYearPicker';
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Drag-and-drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: career.id });
  
  // Validate dates
  useEffect(() => {
    const errors: string[] = [];
    
    // If not current, end date is required
    if (!career.current && !career.end_date?.trim()) {
      errors.push('End date is required when not currently employed');
    }
    
    // Start date is always required if there's any data
    if ((career.end_date || career.current) && !career.start_date?.trim()) {
      errors.push('Start date is required');
    }
    
    setValidationErrors(errors);
  }, [career.start_date, career.end_date, career.current]);
  
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow"
    >
      {/* Header with drag, edit, company/role, and delete */}
      <div className="flex items-center gap-2 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing flex-shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        {/* Edit Icon - Always visible */}
        <button
          onClick={navigateToDetail}
          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
          title="Edit career"
        >
          <FileEdit className="w-4 h-4" />
        </button>
        
        <div className="flex-1 space-y-1 min-w-0">
          {/* Organization - Now first */}
          <input
            value={career.organization}
            onChange={(e) => handleUpdate('organization', e.target.value)}
            placeholder="Company (e.g., Google)"
            className="w-full px-2 py-1 text-sm font-medium text-gray-900 border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500"
          />
          
          {/* Role - Now second */}
          <input
            value={career.role}
            onChange={(e) => handleUpdate('role', e.target.value)}
            placeholder="Role (e.g., Senior Product Manager)"
            className="w-full px-2 py-1 text-xs text-gray-600 border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500"
          />
        </div>
        
        <button
          onClick={() => onDelete(career.id)}
          className="p-1 text-gray-500 hover:text-red-600 transition-colors flex-shrink-0"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dates */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1">
            <MonthYearPicker
              value={career.start_date || ''}
              onChange={(value) => handleUpdate('start_date', value)}
              placeholder="Start date"
            />
          </div>
          <span className="text-gray-400">—</span>
          {career.current ? (
            <div className="flex-1 px-2 py-1.5 text-blue-600 font-medium bg-blue-50 border border-blue-200 rounded-lg text-center">
              Present
            </div>
          ) : (
            <div className="flex-1">
              <MonthYearPicker
                value={career.end_date || ''}
                onChange={(value) => handleUpdate('end_date', value)}
                placeholder="End date"
              />
            </div>
          )}
        </div>
        
        {/* Current checkbox - below date fields */}
        <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded-lg transition-colors w-fit">
          <input
            type="checkbox"
            checked={career.current}
            onChange={(e) => handleUpdate('current', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600 cursor-pointer"
          />
          <span className="text-xs text-gray-700 font-medium">Currently working here</span>
        </label>
        
        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="flex items-start gap-1.5 px-2 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              {validationErrors.map((error, idx) => (
                <p key={idx} className="text-xs text-red-700">{error}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
