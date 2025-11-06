'use client';

import { useState, useEffect } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useAutoSave } from './hooks/useAutoSave';
import { EditorLayout } from './components/EditorLayout';
import { NavigationSection } from './sections/navigation';
import { PersonalSection } from './sections/personal';
import { CompaniesSection } from './sections/companies';
import { SocialLinksSection } from './sections/social-links';
import { ProjectsSection } from './sections/projects';
import { CareerSection } from './sections/career';
import { StrengthsSection } from './sections/strengths';
import { TestimonialsSection } from './sections/testimonials';
import { FooterSection } from './sections/footer';

export default function EditorPage() {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Check URL params for view mode (from detail page navigation)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode === 'preview' || mode === 'edit') {
      setViewMode(mode);
    }
  }, []);
  
  const { portfolio, updatePortfolio, savePortfolio, loading, error } = usePortfolioData();
  const { isDirty, isSaving, lastSaved, forceSave } = useAutoSave(portfolio, savePortfolio);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-500 mb-2">Loading your portfolio...</div>
          <div className="text-xs text-gray-400">This may take a moment</div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-2 font-semibold">Failed to load portfolio</div>
          <div className="text-sm text-gray-600 mb-4">{error || 'Unknown error'}</div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.href = '/onboarding-v2/start'}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  const editorPanel = (
    <>
      <NavigationSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <CompaniesSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <PersonalSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <SocialLinksSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <CareerSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <ProjectsSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <StrengthsSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <TestimonialsSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
      
      <FooterSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="editor"
      />
    </>
  );

  const previewPanel = (
    <>
      <NavigationSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <CompaniesSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <PersonalSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <SocialLinksSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <CareerSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <ProjectsSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <StrengthsSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <TestimonialsSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      <FooterSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
    </>
  );

  return (
    <EditorLayout
      viewMode={viewMode}
      previewMode={previewMode}
      onViewModeChange={setViewMode}
      onPreviewModeChange={setPreviewMode}
      isDirty={isDirty}
      isSaving={isSaving}
      lastSaved={lastSaved}
      onForceSave={forceSave}
      editorPanel={editorPanel}
      previewPanel={previewPanel}
    />
  );
}
