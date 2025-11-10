/**
 * ProjectCard Component (V2 - Simplified)
 * 
 * Progressive disclosure: Start with just title, add details in template editor.
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FileEdit, GripVertical, Trash2 } from 'lucide-react';
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

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow group">
      {/* Header with drag, title, and actions */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-move"
          title="Reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1 flex items-center gap-2">
          <input
            value={project.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="Project Title (e.g., E-Commerce Redesign)"
            className="flex-1 px-2 py-1.5 text-sm font-medium border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-400"
          />
          
          {/* Quick Edit Icon */}
          <button
            onClick={navigateToDetail}
            className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            title={project.template_type ? 'Continue editing' : 'Start editing'}
          >
            <FileEdit className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={() => onDelete(project.id)}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Start Editing Button */}
      <button
        onClick={navigateToDetail}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
      >
        <FileEdit className="w-4 h-4" />
        {project.template_type ? 'Continue Editing' : 'Start Editing'}
      </button>
      
      {/* Helper text */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Add description, images, and content in the editor
      </p>
    </div>
  );
}
