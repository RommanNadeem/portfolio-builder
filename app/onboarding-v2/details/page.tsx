'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2 } from 'lucide-react';
import { track } from '@/lib/telemetry';

export default function OnboardingDetailsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [projectUrl, setProjectUrl] = useState('');
  const [addingProject, setAddingProject] = useState(false);

  useEffect(() => {
    // Load draft data
    const draft = localStorage.getItem('onboarding_draft');
    if (!draft) {
      router.push('/onboarding-v2/start');
      return;
    }
    setData(JSON.parse(draft));
  }, [router]);

  const handleAddProject = () => {
    if (!projectUrl.trim()) return;

    setAddingProject(true);
    
    // Mock project parsing (in production, fetch and parse the URL)
    setTimeout(() => {
      const newProject = {
        id: `proj-${Date.now()}`,
        name: 'Project Name',
        summary: 'Brief description of the project',
        role: 'Your role',
        year: new Date().getFullYear().toString(),
        tags: [],
        links: [{ label: 'View Project', url: projectUrl }],
        coverUrl: ''
      };

      const updated = {
        ...data,
        projects: [...(data.projects || []), newProject]
      };

      setData(updated);
      localStorage.setItem('onboarding_draft', JSON.stringify(updated));
      setProjectUrl('');
      setAddingProject(false);
    }, 1000);
  };

  const handleRemoveProject = (id: string) => {
    const updated = {
      ...data,
      projects: data.projects.filter((p: any) => p.id !== id)
    };
    setData(updated);
    localStorage.setItem('onboarding_draft', JSON.stringify(updated));
  };

  const handleContinue = () => {
    // Save final data
    localStorage.setItem('portfolioData', JSON.stringify(data));
    router.push('/onboarding-v2/publish');
  };

  const handleSkip = () => {
    localStorage.setItem('portfolioData', JSON.stringify(data));
    router.push('/onboarding-v2/publish');
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Add projects (optional)
          </h1>
          <p className="text-gray-600">
            Showcase your best work by adding project links
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* Add Project Form */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Project URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                placeholder="GitHub, Dribbble, Behance, YouTube, etc."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                disabled={addingProject}
              />
              <button
                onClick={handleAddProject}
                disabled={!projectUrl.trim() || addingProject}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {addingProject ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We'll try to extract project details automatically
            </p>
          </div>

          {/* Projects List */}
          {data.projects && data.projects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Your Projects ({data.projects.length})
              </h3>
              {data.projects.map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{project.summary}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">{project.role}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{project.year}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveProject(project.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(!data.projects || data.projects.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No projects added yet</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Skip this step
          </button>
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue to Publish
          </button>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-semibold text-gray-900 mb-1">Design Work</h4>
            <p className="text-xs text-gray-600">
              Dribbble, Behance, Figma files
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl mb-2">💻</div>
            <h4 className="font-semibold text-gray-900 mb-1">Code Projects</h4>
            <p className="text-xs text-gray-600">
              GitHub repos, live demos
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl mb-2">📹</div>
            <h4 className="font-semibold text-gray-900 mb-1">Videos</h4>
            <p className="text-xs text-gray-600">
              YouTube demos, case studies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

