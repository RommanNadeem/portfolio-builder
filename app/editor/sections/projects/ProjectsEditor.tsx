'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, ExternalLink, FileEdit } from 'lucide-react';
import { Project } from './types';

interface ProjectsEditorProps {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isExpanded: boolean;
}

export function ProjectsEditor({ 
  projects, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onMove,
  isExpanded 
}: ProjectsEditorProps) {
  const router = useRouter();
  // Track input values for each project's tags
  const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({});

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
              onClick={() => router.push(`/detail/project/${project.id}?mode=edit`)}
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

          {/* Detail Page Button */}
          <button
            onClick={() => router.push(`/detail/project/${project.id}?mode=edit`)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-100 transition-all"
          >
            <FileEdit className="w-4 h-4" />
            Add Detailed Content & Sections
          </button>
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

