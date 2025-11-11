/**
 * CareerPreview Component (V2)
 * 
 * Preview component for career highlights matching old UI exactly
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, ExternalLink, Calendar, ChevronDown, ChevronUp, FileEdit } from 'lucide-react';
import { CareerItem } from './types';

interface CareerPreviewProps {
  highlights: CareerItem[];
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  onUpdate?: (id: string, updates: Partial<CareerItem>) => void;
}

export function CareerPreview({ highlights, viewMode, previewMode, onUpdate }: CareerPreviewProps) {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  
  if (highlights.length === 0) {
    if (viewMode === 'preview') {
      return null;
    }
  }

  const isMobile = previewMode === 'mobile';
  const isEditable = viewMode === 'edit' && onUpdate;

  return (
    <div id="experience" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
      {/* Section Header */}
      <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
        <div className={`rounded-lg bg-blue-100 flex items-center justify-center ${
          isMobile ? 'w-6 h-6' : 'w-8 h-8'
        }`}>
          <Award className={isMobile ? 'w-3.5 h-3.5 text-blue-600' : 'w-5 h-5 text-blue-600'} />
        </div>
        <h2 className={`font-bold text-gray-900 ${
          isMobile ? 'text-lg' : 'text-3xl'
        }`}>Career Highlights</h2>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="space-y-4">
          <div className={isMobile ? 'space-y-3' : 'space-y-4 sm:space-y-6'}>
            {(showAll ? highlights : highlights.slice(0, 4)).map((highlight) => {
              const achievements = highlight.key_achievements || highlight.achievements || [];
              const featuredIndices = highlight.featured_achievements || [];
              const featuredAchievements = featuredIndices.length > 0
                ? featuredIndices.filter(idx => idx < achievements.length).map(idx => achievements[idx]).slice(0, 3)
                : achievements.slice(0, 3);

              return (
                <div
                  key={highlight.id}
                  className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative cursor-pointer hover:border-blue-300 ${
                    isMobile ? 'p-3' : 'p-6 sm:p-8'
                  }`}
                  onClick={() => {
                    // Navigate to detail page in preview mode
                    router.push(`/detail/career-editor/${highlight.id}?mode=preview`);
                  }}
                >
                  {/* Quick Edit Icon - Appears on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof window !== 'undefined') {
                        window.location.href = `/detail/career-editor/${highlight.id}?mode=edit`;
                      }
                    }}
                    className="absolute top-3 right-3 z-10 p-2 bg-white backdrop-blur-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-300"
                    title="Edit career highlight"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                  
                  {/* Header with organization and role */}
                  <div className={`flex items-start justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                          {highlight.organization}
                        </h3>
                        {highlight.link && (
                          <a
                            href={highlight.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex text-blue-600 hover:text-blue-700 transition-colors"
                            title={`Visit ${highlight.organization} website`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className={`text-blue-600 font-medium ${isMobile ? 'text-xs mt-0.5' : 'text-sm mt-1'}`}>
                        {highlight.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-gray-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {highlight.start_date} - {highlight.current ? 'Present' : highlight.end_date}
                      </div>
                      {highlight.current && (
                        <span className={`inline-block bg-green-100 text-green-700 rounded-full font-medium ${
                          isMobile ? 'text-xs px-2 py-0.5 mt-1' : 'text-xs px-2.5 py-1 mt-1'
                        }`}>
                          Current Role
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {highlight.description && (
                    <p className={`text-gray-600 ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
                      {highlight.description}
                    </p>
                  )}

                  {/* Featured Achievements */}
                  {featuredAchievements.length > 0 && (
                    <ul className={`space-y-1.5 ${isMobile ? 'mt-2' : 'mt-3'}`}>
                      {featuredAchievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className={`flex items-start gap-2 text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}
                        >
                          <span className={`flex-shrink-0 ${isMobile ? 'text-xs mt-0.5' : 'text-base mt-0.5'} text-blue-500`}>
                            ✓
                          </span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Show More button */}
          {highlights.length > 4 && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors ${
                  isMobile ? 'text-xs' : 'text-sm font-medium'
                }`}
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    See All {highlights.length} Experiences
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

