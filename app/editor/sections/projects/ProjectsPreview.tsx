'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, ExternalLink, FileEdit, ArrowRight } from 'lucide-react';
import { Project } from './types';

interface ProjectsPreviewProps {
  projects: Project[];
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  onUpdate?: (id: string, updates: Partial<Project>) => void;
}

export function ProjectsPreview({ projects, viewMode, previewMode, onUpdate }: ProjectsPreviewProps) {
  const router = useRouter();
  
  // Debug: Log projects data to see if thumbnails are present
  console.log('[ProjectsPreview] Rendering projects:', projects.map(p => ({
    id: p.id,
    title: p.title,
    thumbnail: p.thumbnail,
    hasThumbnail: !!p.thumbnail
  })));
  
  if (projects.length === 0 && viewMode === 'preview') {
    return null;
  }

  const isMobile = previewMode === 'mobile';
  const isEditable = viewMode === 'edit' && onUpdate;

  const handleCardClick = (projectId: string, e: React.MouseEvent) => {
    // Navigate to the new project editor (pass current viewMode)
    if (!(e.target as HTMLElement).closest('a')) {
      router.push(`/detail/project-editor/${projectId}?mode=${viewMode}`);
    }
  };

  return (
    <div id="projects" className={`w-full ${isMobile ? 'px-4 mb-6' : 'px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'}`}>
      {/* Section Header */}
      <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
        <div className={`rounded-lg bg-purple-100 flex items-center justify-center ${
          isMobile ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
        }`}>
          <Briefcase className={isMobile ? 'w-3 h-3 text-purple-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-purple-600'} />
        </div>
        <h2 className={`font-bold text-gray-900 ${
          isMobile ? 'text-base' : 'text-2xl sm:text-3xl'
        }`}>Projects</h2>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={(e) => handleCardClick(project.id, e)}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer"
            >
              {/* Thumbnail */}
              {project.thumbnail ? (
                <div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('[ProjectsPreview] Image failed to load:', project.thumbnail);
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-purple-50 to-blue-50 border-b border-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No thumbnail</span>
                </div>
              )}

              {/* Content */}
              <div className={isMobile ? 'p-3' : 'p-4 sm:p-5'}>
                {/* Title and Actions */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  {isEditable ? (
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => onUpdate!(project.id, { title: e.target.value })}
                      className={`flex-1 font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-purple-600 focus:outline-none transition-colors ${isMobile ? 'text-sm' : 'text-base sm:text-lg'} placeholder:text-gray-400`}
                      placeholder="Click to edit title"
                    />
                  ) : (
                    <h3 className={`flex-1 font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>
                      {project.title}
                    </h3>
                  )}
                  
                  {/* Action Icons - Only in Edit mode */}
                  {viewMode === 'edit' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/detail/project-editor/${project.id}?mode=${viewMode}`);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        Edit Details
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                {(project.description || isEditable) && (
                  isEditable ? (
                    <textarea
                      value={project.description}
                      onChange={(e) => onUpdate!(project.id, { description: e.target.value })}
                      className={`text-gray-600 mb-3 bg-transparent border border-transparent hover:border-gray-300 focus:border-purple-600 focus:outline-none transition-colors w-full rounded resize-none ${isMobile ? 'text-xs' : 'text-sm'} placeholder:text-gray-400`}
                      placeholder="Click to edit description"
                      rows={2}
                    />
                  ) : (
                    <p className={`text-gray-600 mb-3 ${isMobile ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'}`}>
                      {project.description}
                    </p>
                  )
                )}

                {/* Tags */}
                {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium ${
                          isMobile ? 'text-[10px]' : 'text-xs'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Project Link - Visible text */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{project.link}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No projects yet. Add your first project!
        </div>
      )}
    </div>
  );
}

