'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, Award, Edit, Eye, ArrowRight, CheckCircle2, 
  TrendingUp, Sparkles, FileEdit
} from 'lucide-react';

export default function SimpleDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ projects: 0, publishedProjects: 0, careers: 0, publishedCareers: 0 });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadData = () => {
      try {
        const data = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        const projects = data.projects || [];
        const careers = data.careerHighlights || [];
        
        setStats({
          projects: projects.length,
          publishedProjects: projects.filter((p: any) => p.published).length,
          careers: careers.length,
          publishedCareers: careers.filter((c: any) => c.published).length,
        });
        
        setUserName(data.fullName || 'there');
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const completionScore = Math.min(100, 
    (stats.projects * 30) + 
    (stats.publishedProjects * 20) + 
    (stats.careers * 15) + 
    (stats.publishedCareers * 10)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-lg text-gray-600">Let's build something amazing today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.projects}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
            <div className="text-xs text-green-600 mt-1">{stats.publishedProjects} published</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.careers}</div>
            <div className="text-sm text-gray-600">Career Highlights</div>
            <div className="text-xs text-green-600 mt-1">{stats.publishedCareers} published</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-1">{completionScore}%</div>
            <div className="text-sm text-gray-600">Portfolio Complete</div>
            <div className="text-xs text-gray-500 mt-1">
              {completionScore >= 70 ? 'Looking great!' : 'Keep going!'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="text-3xl font-bold mb-1">{stats.publishedProjects + stats.publishedCareers}</div>
            <div className="text-sm text-purple-100">Published Items</div>
            <div className="text-xs text-purple-200 mt-1">Live on your portfolio</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Edit Portfolio */}
          <button
            onClick={() => router.push('/editor')}
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-10 text-white shadow-xl hover:shadow-2xl transition-all group text-left"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Edit className="w-8 h-8" />
              </div>
              <Sparkles className="w-6 h-6 opacity-70" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Edit Portfolio</h2>
            <p className="text-purple-100 text-lg mb-6">
              Update your projects, career highlights, and profile
            </p>
            <div className="flex items-center gap-2 text-purple-100 group-hover:gap-3 transition-all">
              <span className="font-semibold">Get started</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>

          {/* Preview Portfolio */}
          <button
            onClick={() => router.push('/editor?mode=preview')}
            className="bg-white rounded-2xl p-10 border-2 border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all group text-left"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Preview</h2>
            <p className="text-gray-600 text-lg mb-6">
              See how your portfolio looks to visitors
            </p>
            <div className="flex items-center gap-2 text-purple-600 group-hover:gap-3 transition-all">
              <span className="font-semibold">View now</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Quick Add Section - Only show if no projects */}
        {stats.projects === 0 && (
          <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Let's get started!</h3>
                <p className="text-gray-700 mb-4">
                  Add your first project or career highlight to start building your portfolio
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/editor')}
                    className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all"
                  >
                    Add Project
                  </button>
                  <button
                    onClick={() => router.push('/editor')}
                    className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg border border-purple-200 hover:bg-purple-50 transition-all"
                  >
                    Add Career Highlight
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Overview - Only show if has items */}
        {(stats.projects > 0 || stats.careers > 0) && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Projects */}
              {stats.projects > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Projects</h3>
                      <p className="text-sm text-gray-500">{stats.projects} total</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Published</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">{stats.publishedProjects}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <FileEdit className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">Drafts</span>
                      </div>
                      <span className="text-sm font-bold text-orange-600">{stats.projects - stats.publishedProjects}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Career Highlights */}
              {stats.careers > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Career Highlights</h3>
                      <p className="text-sm text-gray-500">{stats.careers} total</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Published</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">{stats.publishedCareers}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <FileEdit className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">Drafts</span>
                      </div>
                      <span className="text-sm font-bold text-orange-600">{stats.careers - stats.publishedCareers}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
