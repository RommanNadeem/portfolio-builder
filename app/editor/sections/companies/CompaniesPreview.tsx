'use client';

import { useEffect, useRef } from 'react';

interface CompaniesPreviewProps {
  companies: string[];
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
}

export function CompaniesPreview({ companies, viewMode, previewMode }: CompaniesPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scroll = () => {
      scrollPosition += 0.5; // Adjust speed here
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, [companies]);

  if (companies.length === 0 && viewMode === 'preview') {
    return null;
  }

  const isMobile = previewMode === 'mobile';

  if (companies.length === 0) {
    return (
      <div className={`w-full ${isMobile ? 'px-4 py-4' : 'px-4 sm:px-6 lg:px-8 py-6'}`}>
        <div className="text-center py-8 text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-lg">
          Add companies to display above
        </div>
      </div>
    );
  }

  // Duplicate companies for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className={`w-full bg-white ${isMobile ? 'px-4 py-6' : 'px-4 sm:px-6 lg:px-8 py-8 sm:py-12'}`}>
      {/* Section Header - Uppercase, centered */}
      <h2 className={`text-center font-semibold tracking-wider text-gray-600 uppercase ${
        isMobile ? 'text-xs mb-5' : 'text-xs sm:text-sm mb-6 sm:mb-8'
      }`}>
        Companies and Teams I Have Worked With
      </h2>

      {/* Scrolling Company Slider */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden scrollbar-hide"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          {duplicatedCompanies.map((company, index) => (
            <div
              key={index}
              className={`flex-shrink-0 flex items-center justify-center ${
                isMobile ? 'text-sm px-6' : 'text-base sm:text-lg lg:text-xl px-8'
              } font-semibold text-gray-400 opacity-60 hover:opacity-100 hover:text-gray-600 transition-all duration-200`}
            >
              {company}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

