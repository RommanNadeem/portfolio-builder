'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, ExternalLink, FileEdit, Image as ImageIcon, X, Upload } from 'lucide-react';
import { Project } from './types';

interface ProjectsEditorProps {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isExpanded: boolean;
  viewMode?: 'edit' | 'preview';
}

export function ProjectsEditor({ 
  projects, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onMove,
  isExpanded,
  viewMode = 'edit'
}: ProjectsEditorProps) {
  const router = useRouter();
  // Track input values for each project's tags
  const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({});
  // Track uploading state for each project
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});
  // Track thumbnail URL inputs (for debouncing)
  const [thumbnailInputs, setThumbnailInputs] = useState<{ [key: string]: string }>({});

  const handleImageUpload = async (projectId: string, file: File) => {
    setUploadingImages(prev => ({ ...prev, [projectId]: true }));
    
    try {
      console.log('[ProjectsEditor] 📤 Uploading thumbnail for project:', projectId);
      
      // Import upload utilities
      const { uploadProjectImage, imageToDataUrl } = await import('@/lib/image-upload');
      const { getCurrentUser } = await import('@/lib/supabase');
      
      // Get current user
      const user = await getCurrentUser();
      
      if (user) {
        // Upload to Supabase Storage
        const result = await uploadProjectImage({
          file,
          userId: user.id,
          projectId,
          folder: 'thumbnails'
        });
        
        if (result.url) {
          console.log('[ProjectsEditor] ✅ Uploaded to Supabase:', result.url);
          onUpdate(projectId, { thumbnail: result.url });
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } else {
        // Fallback to data URL if not logged in
        console.log('[ProjectsEditor] ⚠️ No user, using data URL fallback');
        const dataUrl = await imageToDataUrl(file);
        onUpdate(projectId, { thumbnail: dataUrl });
      }
      
      setUploadingImages(prev => ({ ...prev, [projectId]: false }));
      
    } catch (error) {
      console.error('[ProjectsEditor] ❌ Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setUploadingImages(prev => ({ ...prev, [projectId]: false }));
    }
  };

  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {projects.length} {projects.length === 1 ? 'project' : 'projects'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project, index) => {
        // Get current input value or generate from tags
        const currentInput = tagInputs[project.id] ?? (Array.isArray(project.tags) ? project.tags.join(', ') : '');
        // Check if project is new (only has title, no other content)
        const isNewProject = !project.description && (!project.tags || project.tags.length === 0) && !project.link;
        
        return (
          <div key={project.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          {/* Header with drag, edit detail page, and delete */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => onMove(project.id, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Move up"
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <input
                value={project.title}
                onChange={(e) => onUpdate(project.id, { title: e.target.value })}
                placeholder="E-Commerce Platform Redesign"
                className="w-full px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500"
              />
            </div>
            <button
              onClick={() => router.push(`/detail/project-editor/${project.id}?mode=${viewMode}`)}
              className="p-1 text-purple-600 hover:text-purple-700"
              title="Edit detailed page"
            >
              <FileEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-1 text-red-500 hover:text-red-700"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Image */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Thumbnail Image
            </label>
            
            {project.thumbnail ? (
              <div className="relative group">
                <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title || 'Project thumbnail'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onUpdate(project.id, { thumbnail: null })}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : uploadingImages[project.id] ? (
              <div className="w-full h-32 rounded-lg border-2 border-purple-300 bg-purple-50 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-purple-600 font-medium">Uploading...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {/* File Upload */}
                <label className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer group">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <span className="text-xs text-gray-500 group-hover:text-purple-600 font-medium transition-colors">
                    Click to upload or drag image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(project.id, file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                
                {/* URL Input Alternative */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-gray-50 px-2 text-gray-500">or paste URL</span>
                  </div>
                </div>
                
                <input
                  type="url"
                  value={thumbnailInputs[project.id] ?? (project.thumbnail || '')}
                  onChange={(e) => {
                    // Update local input state immediately for smooth typing
                    setThumbnailInputs(prev => ({ ...prev, [project.id]: e.target.value }));
                  }}
                  onBlur={(e) => {
                    // Only update project when user finishes typing (on blur)
                    const url = e.target.value.trim();
                    if (url !== project.thumbnail) {
                      onUpdate(project.id, { thumbnail: url || null });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Also update on Enter key
                    if (e.key === 'Enter') {
                      const url = (e.target as HTMLInputElement).value.trim();
                      if (url !== project.thumbnail) {
                        onUpdate(project.id, { thumbnail: url || null });
                      }
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-gray-400"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload an image or paste a URL. Syncs with template hero image.
            </p>
          </div>

          {/* Description */}
          <textarea
            value={project.description}
            onChange={(e) => onUpdate(project.id, { description: e.target.value })}
            placeholder="A complete redesign that increased conversions by 45% and improved user satisfaction scores."
            rows={2}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none placeholder:text-gray-500"
          />

          {/* Link */}
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="url"
              value={project.link || ''}
              onChange={(e) => onUpdate(project.id, { link: e.target.value })}
              placeholder="https://myproject.com or https://github.com/user/repo"
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-gray-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => {
                const value = e.target.value;
                // Update local state for natural typing
                setTagInputs(prev => ({ ...prev, [project.id]: value }));
                
                // Parse tags in real-time for chip display
                const tagArray = value
                  .split(',')
                  .map(t => t.trim())
                  .filter(t => t.length > 0);
                onUpdate(project.id, { tags: tagArray });
              }}
              placeholder="React, TypeScript, Figma, Mobile-First"
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-gray-500"
            />
            
            {/* Tag Preview Chips - Real-time */}
            {Array.isArray(project.tags) && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const newTags = project.tags.filter((_, i) => i !== idx);
                        onUpdate(project.id, { tags: newTags });
                        setTagInputs(prev => ({ ...prev, [project.id]: newTags.join(', ') }));
                      }}
                      className="hover:text-purple-900 ml-0.5"
                      title="Remove tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Tags appear instantly as you type. Separate with commas.
            </p>
          </div>

          {/* Add/Edit Button */}
          {isNewProject ? (
            <button
              onClick={() => router.push(`/detail/project-editor/${project.id}?mode=${viewMode}`)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Choose Template & Start Editing
            </button>
          ) : (
            <button
              onClick={() => router.push(`/detail/project-editor/${project.id}?mode=${viewMode}`)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-100 transition-all"
            >
              <FileEdit className="w-4 h-4" />
              {(project as any).template_type ? 'Continue Editing' : 'Choose Template'}
            </button>
          )}
          </div>
        );
      })}

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </button>
    </div>
  );
}

