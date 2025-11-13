/**
 * SectionEmpty Component
 * 
 * Empty state for sections with no items.
 */

'use client';

import { Plus } from 'lucide-react';

interface SectionEmptyProps {
  message: string;
  icon?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export function SectionEmpty({
  message,
  icon = '📄',
  onAdd,
  addLabel = 'Add First Item',
}: SectionEmptyProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-gray-600 mb-6">{message}</p>
      
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
        >
          <Plus className="w-5 h-5" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

