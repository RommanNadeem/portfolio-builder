/**
 * ProjectsSection Component (V2 - Using Core Architecture)
 * 
 * Projects section built with the unified core architecture.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Plus, FileEdit, Briefcase } from 'lucide-react';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { ItemList } from '@/app/editor/core/components';
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
  
  // Convert legacy data to new format (memoized)
  const projects = useMemo(() => {
    const legacyProjects = data.projects || [];
    return legacyProjects.map((p: Project) => convertFromLegacy(p));
  }, [data.projects]);

  // Handle changes - update parent immediately
  const handleProjectsChange = useCallback((newProjects: ProjectItem[]) => {
    const legacy = newProjects.map(convertToLegacy);
    onChange(prev => ({
      ...prev,
      projects: legacy,
    }));
  }, [onChange]);

  // Use controlled hook
  const {
    items: currentProjects,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<ProjectItem>({
    items: projects,
    onChange: handleProjectsChange,
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
    const isMobile = previewMode === 'mobile';
    
    return (
      <div id="projects" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
        {/* Section Header */}
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className={`rounded-lg bg-purple-100 flex items-center justify-center ${
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          }`}>
            <Briefcase className={isMobile ? 'w-3.5 h-3.5 text-purple-600' : 'w-5 h-5 text-purple-600'} />
          </div>
          <h2 className={`font-bold text-gray-900 ${
            isMobile ? 'text-lg' : 'text-3xl'
          }`}>Projects</h2>
        </div>
        
        <div className={`grid gap-4 max-w-7xl mx-auto ${
          isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}>
          {currentProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative cursor-pointer"
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
                className={`absolute z-10 bg-white backdrop-blur-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all text-gray-700 hover:bg-purple-600 hover:text-white border border-gray-300 ${
                  isMobile ? 'top-2 right-2 p-1.5' : 'top-3 right-3 p-2'
                }`}
                title="Edit project"
              >
                <FileEdit className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              </button>
              
              {/* Thumbnail */}
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className={`w-full object-cover ${isMobile ? 'h-40' : 'h-48'}`}
                  onError={(e) => {
                    console.error('[ProjectsSection] 🖼️ Image load failed:', project.thumbnail);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('[ProjectsSection] 🖼️ Image loaded successfully:', project.thumbnail);
                  }}
                />
              ) : (
                <div className={`w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ${
                  isMobile ? 'h-40' : 'h-48'
                }`}>
                  <span className={isMobile ? 'text-4xl' : 'text-6xl'}>💼</span>
                </div>
              )}
              
              {/* Content */}
              <div className={isMobile ? 'p-4' : 'p-6'}>
                <h3 className={`font-semibold text-gray-900 ${
                  isMobile ? 'text-sm mb-2' : 'text-base mb-2'
                }`}>{project.title}</h3>
                <p className={`text-gray-600 line-clamp-2 ${
                  isMobile ? 'text-xs mb-3' : 'text-sm mb-4'
                }`}>{project.description}</p>
                
                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className={`flex flex-wrap ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`bg-blue-100 text-blue-700 rounded-full ${
                          isMobile ? 'px-2 py-0.5 text-xs' : 'px-2 py-1 text-xs'
                        }`}
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
      {/* Drag-and-drop list */}
      <ItemList
        items={currentProjects}
        onReorder={reorderByIndex}
        renderItem={(project, index) => (
          <ProjectCard
            project={project}
            index={index}
            totalCount={currentProjects.length}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={index > 0 ? () => reorder(project.id, 'up') : undefined}
            onMoveDown={index < currentProjects.length - 1 ? () => reorder(project.id, 'down') : undefined}
            viewMode={viewMode}
          />
        )}
      />
      
      {/* Add button */}
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </button>
    </div>
  );
}

