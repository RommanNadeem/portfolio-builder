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
  onScrollToSection?: (sectionId: string) => void;
}

export function ProjectsSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
  onScrollToSection,
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
    // Check if there's already an empty project
    const hasEmptyProject = currentProjects.some(p => 
      p.title.trim().length === 0 || p.title === 'New Project'
    );
    
    if (hasEmptyProject) {
      console.log('[ProjectsSection] Empty project already exists, not adding new one');
      return; // Don't add new one, user should fill existing
    }
    
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
    // Filter out empty projects (title required)
    const validProjects = currentProjects.filter(p => 
      p.title.trim().length > 0
    );
    
    const isMobile = previewMode === 'mobile';
    
    // Show empty state only in Edit mode (right preview), hide in Preview mode
    if (validProjects.length === 0) {
      // Hide in Preview mode or published site
      if (viewMode === 'preview') {
        return null;
      }
      
      // Show helpful empty state in Edit mode (right side)
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
          
          {/* Empty State */}
          <div className={`bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl flex flex-col items-center justify-center ${
            isMobile ? 'p-6' : 'p-8'
          }`}>
            <Briefcase className={`text-purple-300 ${isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'}`} />
            <p className={`text-gray-600 mb-3 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
              No projects added yet
            </p>
            <button
              onClick={() => {
                handleAdd();
                onScrollToSection?.('projects');
              }}
              className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
            >
              <Plus className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>Add Your First Project</span>
            </button>
          </div>
        </div>
      );
    }
    
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
          {validProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative cursor-pointer"
              onClick={() => {
                // Navigate to detail page
                // If no blocks, go to edit mode so user can add content
                // If has blocks, go to preview mode to view
                const hasBlocks = project.blocks && project.blocks.length > 0;
                const mode = hasBlocks ? 'preview' : 'edit';
                if (typeof window !== 'undefined') {
                  window.location.href = `/detail/project-editor/${project.id}?mode=${mode}`;
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
      
      {/* Add button - Always visible */}
      {currentProjects.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <Briefcase className="w-12 h-12 text-purple-300 mb-1" />
          <div className="text-center">
            <p className="font-medium">No projects yet</p>
            <p className="text-sm text-gray-500">Click to add your first project</p>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      )}
    </div>
  );
}

