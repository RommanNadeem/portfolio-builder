'use client';

import { useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useSection } from '../../hooks/useSection';
import { ProjectsEditor } from './ProjectsEditor';
import { ProjectsPreview } from './ProjectsPreview';
import { Project } from './types';

interface ProjectsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  renderMode: 'editor' | 'preview';
}

export function ProjectsSection({ data, onChange, viewMode, previewMode, renderMode }: ProjectsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (updatedProjects: Project[]) => {
    onChange(prev => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const { items: projects, addItem, updateItem, deleteItem, moveItem } = useSection<Project>(
    data.projects || [],
    handleUpdate
  );

  const handleAdd = () => {
    addItem({
      title: '',
      description: '',
      thumbnail: null,
      tags: [], // Ensure tags is always an empty array
      pageContent: '',
      link: '',
      sections: [],
      blocks: [] // Initialize blocks for detail page
    });
  };

  if (renderMode === 'editor') {
    return (
      <div className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Projects</h3>
              <p className="text-xs text-gray-500">Showcase your work</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Content */}
        <div className="px-4 pb-4">
          <ProjectsEditor
            projects={projects}
            onAdd={handleAdd}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onMove={moveItem}
            isExpanded={isExpanded}
            viewMode={viewMode}
          />
        </div>
      </div>
    );
  }

  return (
    <ProjectsPreview
      projects={projects}
      viewMode={viewMode}
      previewMode={previewMode}
      onUpdate={viewMode === 'edit' ? updateItem : undefined}
    />
  );
}

