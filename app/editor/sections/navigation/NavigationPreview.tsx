'use client';

interface NavigationPreviewProps {
  portfolioData: any;
  previewMode: 'desktop' | 'mobile';
}

const ALL_SECTIONS = [
  { id: 'overview', label: 'Overview', hasData: (data: any) => true }, // Always show
  { id: 'experience', label: 'Experience', hasData: (data: any) => (data.careerHighlights?.length || 0) > 0 },
  { id: 'projects', label: 'Projects', hasData: (data: any) => (data.projects?.length || 0) > 0 },
  { id: 'strengths', label: 'Strengths', hasData: (data: any) => (data.strengths?.length || 0) > 0 },
  { id: 'testimonials', label: 'Testimonials', hasData: (data: any) => (data.testimonials?.length || 0) > 0 },
];

export function NavigationPreview({ portfolioData, previewMode }: NavigationPreviewProps) {
  const isMobile = previewMode === 'mobile';

  // Filter sections that have data
  const visibleSections = ALL_SECTIONS.filter(section => section.hasData(portfolioData));

  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isMobile) {
    // Mobile: Horizontal scroll menu
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1 px-4 py-3 min-w-max">
            {visibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // Desktop: Full navigation bar
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {visibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button 
            onClick={() => handleScrollTo('overview')}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </nav>
  );
}

