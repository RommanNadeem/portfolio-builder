/**
 * ProjectCard Component (V2 - Simplified)
 * 
 * Progressive disclosure: Start with just title, add details in template editor.
 * Now with drag-and-drop support.
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FileEdit, GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProjectItem } from './types';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  totalCount: number;
  onUpdate: (id: string, updates: Partial<ProjectItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSave?: () => Promise<void>; // Force immediate save
  viewMode?: 'edit' | 'preview';
}

export function ProjectCard({
  project,
  index,
  totalCount,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSave,
  viewMode = 'edit',
}: ProjectCardProps) {
  const router = useRouter();
  
  // Drag-and-drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });
  
  /**
   * Navigate to detail page with verification
   * Forces immediate save before navigation to prevent race conditions
   */
  const navigateToDetail = useCallback(async () => {
    console.log('[ProjectCard] Preparing to navigate for project:', project.id);
    
    // Force immediate save to ensure project is in localStorage
    if (onSave) {
      console.log('[ProjectCard] 🔄 Forcing immediate save before navigation...');
      await onSave();
      console.log('[ProjectCard] ✅ Save completed');
    }
    
    // Small delay to ensure localStorage write completes
    setTimeout(() => {
      // Verify project exists in localStorage
      const portfolioData = localStorage.getItem('portfolioData');
      if (portfolioData) {
        const parsed = JSON.parse(portfolioData);
        const projectExists = parsed.projects?.some((p: any) => p.id === project.id);
        
        if (projectExists) {
          console.log('[ProjectCard] ✅ Project verified in localStorage, navigating...');
          router.push(`/detail/project-editor/${project.id}?mode=${viewMode}`);
        } else {
          console.error('[ProjectCard] ❌ Project not found in localStorage after save!');
          console.log('[ProjectCard] Available projects:', parsed.projects?.map((p: any) => ({ id: p.id, title: p.title })));
          // Try navigation anyway - detail page has retry logic
          router.push(`/detail/project-editor/${project.id}?mode=${viewMode}`);
        }
      } else {
        console.error('[ProjectCard] ❌ No portfolioData in localStorage!');
        router.push(`/detail/project-editor/${project.id}?mode=${viewMode}`);
      }
    }, 200); // Increased to 200ms for safety
  }, [project.id, router, viewMode, onSave]);

  const handleUpdate = (field: keyof ProjectItem, value: any) => {
    onUpdate(project.id, { [field]: value });
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
      {/* Header with drag, edit, title, and actions */}
      <div className="flex items-center gap-2">
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
          className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex-shrink-0"
          title="Edit project"
        >
          <FileEdit className="w-4 h-4" />
        </button>
        
        <input
          value={project.title}
          onChange={(e) => handleUpdate('title', e.target.value)}
          placeholder="Project Title (e.g., E-Commerce Redesign)"
          className="flex-1 px-2 py-1.5 text-sm font-medium text-gray-900 border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500"
        />
        
        <button
          onClick={() => onDelete(project.id)}
          className="p-1 text-gray-500 hover:text-red-600 transition-colors flex-shrink-0"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
