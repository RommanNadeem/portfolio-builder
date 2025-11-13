'use client';

import '@/app/onboarding-v2/onboarding.css';
import { useState, useEffect, useMemo } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useAutoSave } from './hooks/useAutoSave';
import { usePublishStatus } from './hooks/usePublishStatus';
import { useSectionScroll } from './hooks/useSectionScroll';
import { EditorLayout } from './components/EditorLayout';
import { SortableSections } from './components/SortableSections';
import { DraggableSection } from './components/DraggableSection';
import { SectionOrderBanner } from './components/SectionOrderBanner';
import { PublishOverlayController } from './components/PublishOverlayController';
import { NavigationSection } from './sections/navigation';
import { PersonalSection } from './sections/personal';
import { CompaniesSection } from './sections/companies-v2';
import { SocialLinksSection } from './sections/social-links-v2';
import { ProjectsSection } from './sections/projects-v2';
import { CareerSection } from './sections/career-v2';
import { StrengthsSection } from './sections/strengths-v2';
import { TestimonialsSection } from './sections/testimonials-v2';
import { FAQsSection } from './sections/faqs-v2';
import { ServicesSection } from './sections/services-v2';
import { ResumeSection } from './sections/resume-v2';
import { FooterSection } from './sections/footer';

// Default section order
const DEFAULT_SECTION_ORDER = ['career', 'projects', 'strengths', 'services', 'testimonials', 'faqs', 'resume'];

export default function EditorPage() {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const { registerSection, scrollToSection } = useSectionScroll();

  // Check URL params for view mode (from detail page navigation)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode === 'preview' || mode === 'edit') {
      setViewMode(mode);
    }
  }, []);
  
  const { portfolio, updatePortfolio, savePortfolio, loading, error, currentUserId } = usePortfolioData();
  const { isDirty, isSaving, lastSaved } = useAutoSave(portfolio, savePortfolio, 500);
  const { status: publishStatus, loading: publishLoading } = usePublishStatus(currentUserId);

  // Get section order from portfolio data or use default
  const sectionOrder = portfolio?.sectionOrder || DEFAULT_SECTION_ORDER;

  // Handle section reordering
  const handleSectionReorder = (newOrder: string[]) => {
    updatePortfolio((prev) => ({
      ...prev,
      sectionOrder: newOrder,
    }));
  };

  // Section component map
  const getSectionComponent = (sectionId: string, renderMode: 'editor' | 'preview') => {
    const commonProps = {
      data: portfolio,
      onChange: updatePortfolio,
      viewMode,
      previewMode,
      renderMode,
      userId: currentUserId,
      onScrollToSection: renderMode === 'preview' ? scrollToSection : undefined,
    };

    switch (sectionId) {
      case 'career':
        return <CareerSection key={sectionId} {...commonProps} />;
      case 'projects':
        return <ProjectsSection key={sectionId} {...commonProps} />;
      case 'strengths':
        return <StrengthsSection key={sectionId} {...commonProps} />;
      case 'services':
        return <ServicesSection key={sectionId} {...commonProps} />;
      case 'testimonials':
        return <TestimonialsSection key={sectionId} {...commonProps} />;
      case 'faqs':
        return <FAQsSection key={sectionId} {...commonProps} />;
      case 'resume':
        return <ResumeSection key={sectionId} {...commonProps} />;
      default:
        return null;
    }
  };

  // Render sortable sections for editor
  const renderSortableSections = () => {
    const sections = sectionOrder.map((sectionId) => ({
      id: sectionId,
      component: (
        <DraggableSection key={sectionId} id={sectionId}>
          <div ref={(el) => registerSection(sectionId, el)}>
            {getSectionComponent(sectionId, 'editor')}
          </div>
        </DraggableSection>
      ),
    }));

    return <SortableSections sections={sections} onReorder={handleSectionReorder} />;
  };

  // Render sections for preview (in order, no drag and drop)
  const renderPreviewSections = () => {
    return sectionOrder.map((sectionId) => (
      <div key={sectionId}>{getSectionComponent(sectionId, 'preview')}</div>
    ));
  };

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
      {/* Fixed sections at top */}
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
        userId={currentUserId}
      />

      {/* Banner to inform users about drag and drop */}
      <SectionOrderBanner />

      {/* Sortable sections */}
      {renderSortableSections()}
      
      {/* Fixed section at bottom */}
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
      {/* Navigation - Full Width */}
      <NavigationSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      {/* Companies Slider - Full Width */}
      <CompaniesSection
        data={portfolio}
        onChange={updatePortfolio}
        viewMode={viewMode}
        previewMode={previewMode}
        renderMode="preview"
      />
      
      {/* Content sections with padding */}
      <div className={previewMode === 'mobile' ? 'px-6' : 'px-16'}>
        <PersonalSection
          data={portfolio}
          onChange={updatePortfolio}
          viewMode={viewMode}
          previewMode={previewMode}
          renderMode="preview"
        />

        {/* Sections in custom order */}
        {renderPreviewSections()}
      </div>
      
      {/* Footer - Full Width */}
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
    <>
      <EditorLayout
        viewMode={viewMode}
        previewMode={previewMode}
        onViewModeChange={setViewMode}
        onPreviewModeChange={setPreviewMode}
        isDirty={isDirty}
        isSaving={isSaving}
        lastSaved={lastSaved}
        editorPanel={editorPanel}
        previewPanel={previewPanel}
        userId={currentUserId}
        onPublishClick={() => setShowPublishModal(true)}
        publishStatus={publishStatus}
      />

      {/* Publish Overlay */}
      {currentUserId && portfolio && (
        <PublishOverlayController
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          userId={currentUserId}
          portfolioData={portfolio}
        />
      )}
    </>
  );
}
