/**
 * SectionContainer Component
 * 
 * Wrapper component for portfolio sections with consistent styling,
 * header, and empty states.
 */

'use client';

import { ReactNode } from 'react';
import { SaveStatus } from '../../types';
import { SectionHeader } from './SectionHeader';
import { SectionEmpty } from './SectionEmpty';

interface SectionContainerProps {
  // Header
  title: string;
  icon?: string;
  description?: string;
  
  // Actions
  onAdd?: () => void;
  addLabel?: string;
  
  // Content
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  
  // Status
  status?: SaveStatus;
  itemCount?: number;
  maxItems?: number;
  
  // Styling
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function SectionContainer({
  title,
  icon,
  description,
  onAdd,
  addLabel = 'Add Item',
  children,
  isEmpty = false,
  emptyMessage,
  emptyIcon,
  status,
  itemCount,
  maxItems,
  className = '',
  collapsible = false,
  defaultCollapsed = false,
}: SectionContainerProps) {
  
  const canAddMore = !maxItems || !itemCount || itemCount < maxItems;

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionHeader
        title={title}
        icon={icon}
        description={description}
        onAdd={canAddMore ? onAdd : undefined}
        addLabel={addLabel}
        status={status}
        itemCount={itemCount}
        maxItems={maxItems}
        collapsible={collapsible}
        defaultCollapsed={defaultCollapsed}
      />

      {isEmpty ? (
        <SectionEmpty
          message={emptyMessage || `No ${title.toLowerCase()} yet`}
          icon={emptyIcon || icon}
          onAdd={onAdd}
          addLabel={addLabel}
        />
      ) : (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

