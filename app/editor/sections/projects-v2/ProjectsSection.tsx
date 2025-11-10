/**
 * ProjectsSection Component (V2 - Using Core Architecture)
 * 
 * Projects section built with the unified core architecture.
 */

'use client';

import { Plus, FileEdit } from 'lucide-react';
import { useSectionManager } from '@/app/editor/core/hooks';
import { ProjectItem, convertFromLegacy, convertToLegacy, Project } from './types';
import { ProjectCard } from './ProjectCard';

interface ProjectsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
}

export function ProjectsSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
}: ProjectsSectionProps) {
  
  // Convert legacy data to new format
  const legacyProjects = data.projects || [];
  const initialData: ProjectItem[] = legacyProjects.map((p: Project) => 
    convertFromLegacy(p)
  );

  // Use shared hook for state management (both editor and preview)
  const {
    items: projects,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    saveStatus,
    itemCount,
    save: forceSave,
  } = useSectionManager<ProjectItem>({
    initialData,
    onSave: async (items) => {
      // Convert back to legacy format for compatibility
      const legacy = items.map(convertToLegacy);
      
      // Update parent state IMMEDIATELY (not debounced)
      onChange(prev => ({
        ...prev,
        projects: legacy,
      }));
      
      console.log('[ProjectsSection] 💾 Synced to parent:', items.length);
    },
    autoSave: true,
    autoSaveDelay: 100, // ← Very short delay for instant sync
    localStorageKey: `projects-${userId}`,
  });

  const handleAdd = () => {
    add({
      title: 'New Project',
      description: '',
      thumbnail: null,
      tags: [],
      link: undefined,
      has_detail_page: true,
      template_type: 'blank',
      blocks: [],
      published: false,
      published_at: null,
    });
  };

  // In preview renderMode, render the projects grid
  if (renderMode === 'preview' || viewMode === 'preview') {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative cursor-pointer"
              onClick={() => {
                // Navigate to detail page in same mode (preview)
                if (typeof window !== 'undefined') {
                  window.location.href = `/detail/project-editor/${project.id}?mode=preview`;
                }
              }}
            >
              {/* Quick Edit Icon - Appears on Hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Don't trigger card click
                  if (typeof window !== 'undefined') {
                    window.location.href = `/detail/project-editor/${project.id}?mode=edit`;
                  }
                }}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-600 hover:text-white border border-gray-200"
                title="Edit project"
              >
                <FileEdit className="w-4 h-4" />
              </button>
              
              {/* Thumbnail */}
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">💼</span>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                
                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          totalCount={projects.length}
          onUpdate={update}
          onDelete={remove}
          onMoveUp={index > 0 ? () => reorder(project.id, 'up') : undefined}
          onMoveDown={index < projects.length - 1 ? () => reorder(project.id, 'down') : undefined}
          onSave={forceSave}
          viewMode={viewMode}
        />
      ))}
      
      {/* Add button */}
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </button>
    </div>
  );
}

