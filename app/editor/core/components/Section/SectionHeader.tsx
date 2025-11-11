/**
 * SectionHeader Component
 * 
 * Header for portfolio sections with title, count, add button, and status.
 */

'use client';

import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { SaveStatus } from '../../types';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  status?: SaveStatus;
  itemCount?: number;
  maxItems?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function SectionHeader({
  title,
  icon,
  description,
  onAdd,
  addLabel = 'Add',
  status,
  itemCount,
  maxItems,
  collapsible = false,
  defaultCollapsed = false,
}: SectionHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const statusStyles = {
    idle: '',
    saving: 'text-blue-600',
    saved: 'text-green-600',
    unsaved: 'text-orange-600',
    error: 'text-red-600',
  };

  const statusText = {
    idle: '',
    saving: 'Saving...',
    saved: 'Saved',
    unsaved: 'Unsaved changes',
    error: 'Save failed',
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          
          {itemCount !== undefined && (
            <span className="text-sm text-gray-500">
              ({itemCount}{maxItems ? `/${maxItems}` : ''})
            </span>
          )}

          {status && status !== 'idle' && (
            <span className={`text-xs ${statusStyles[status]}`}>
              {statusText[status]}
            </span>
          )}

          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-2 p-1 hover:bg-gray-100 rounded-lg"
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>

      {onAdd && !isCollapsed && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

