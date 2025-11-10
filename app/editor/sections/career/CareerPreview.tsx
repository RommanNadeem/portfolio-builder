'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, ExternalLink, Calendar, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { CareerHighlight } from './types';

interface CareerPreviewProps {
  highlights: CareerHighlight[];
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  onUpdate?: (id: string, updates: Partial<CareerHighlight>) => void;
}

export function CareerPreview({ highlights, viewMode, previewMode, onUpdate }: CareerPreviewProps) {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  // Debug logging
  console.log('[CareerPreview] Rendering with:', {
    highlightsCount: highlights.length,
    highlights: highlights.map(h => ({
      id: h.id,
      organization: h.organization,
      role: h.role,
      description: h.description,
      achievements: h.achievements,
      hasAchievements: h.achievements?.length > 0,
    })),
    viewMode,
    previewMode,
  });

  if (highlights.length === 0) {
    if (viewMode === 'preview') {
      return null;
    }
    console.log('[CareerPreview] ⚠️ No highlights to display');
  }

  const isMobile = previewMode === 'mobile';
  const isEditable = viewMode === 'edit' && onUpdate;

  return (
    <div id="experience" className={`w-full ${isMobile ? 'px-4 mb-6' : 'px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'}`}>
      {/* Section Header */}
      <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
        <div className={`rounded-lg bg-blue-100 flex items-center justify-center ${
          isMobile ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
        }`}>
          <Award className={isMobile ? 'w-3 h-3 text-blue-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-blue-600'} />
        </div>
        <h2 className={`font-bold text-gray-900 ${
          isMobile ? 'text-base' : 'text-2xl sm:text-3xl'
        }`}>Career Highlights</h2>
      </div>

      {/* Highlights */}
      {highlights.length > 0 ? (
        <div className="space-y-4">
          <div className={isMobile ? 'space-y-3' : 'space-y-4 sm:space-y-6'}>
          {(showAll ? highlights : highlights.slice(0, 4)).map((highlight) => {
            console.log('[CareerPreview] Rendering highlight:', {
              id: highlight.id,
              org: highlight.organization,
              role: highlight.role,
              link: highlight.link || '(no link)',
              hasLink: !!highlight.link,
              desc: highlight.description?.substring(0, 50),
              achievements: highlight.achievements,
              achievementsCount: highlight.achievements?.length || 0,
            });
            return (
            <div
              key={highlight.id}
              className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all ${
                isMobile ? 'p-3' : 'p-6 sm:p-8'
              } ${!isEditable ? 'cursor-pointer hover:border-blue-300' : ''}`}
              onClick={() => {
                if (!isEditable) {
                  router.push(`/detail/career-editor/${highlight.id}?mode=${viewMode}`);
                }
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isEditable ? (
                      <input
                        type="text"
                        value={highlight.organization}
                        onChange={(e) => onUpdate!(highlight.id, { organization: e.target.value })}
                        className={`font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none transition-colors flex-1 ${isMobile ? 'text-sm' : 'text-lg sm:text-xl'} placeholder:text-gray-400`}
                        placeholder="Click to edit company name"
                      />
                    ) : (
                      <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-lg sm:text-xl'}`}>
                        {highlight.organization}
                      </h3>
                    )}
                    {/* Show website link in both edit and preview modes */}
                    {highlight.link && (
                      <a
                        href={highlight.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                        title={`Visit ${highlight.organization} website`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  {isEditable ? (
                    <input
                      type="text"
                      value={highlight.role}
                      onChange={(e) => onUpdate!(highlight.id, { role: e.target.value })}
                      className={`text-gray-600 font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none transition-colors w-full ${isMobile ? 'text-xs mt-0.5' : 'text-sm sm:text-base mt-1'} placeholder:text-gray-400`}
                      placeholder="Click to edit role"
                    />
                  ) : (
                    <p className={`text-gray-600 font-medium ${isMobile ? 'text-xs mt-0.5' : 'text-sm sm:text-base mt-1'}`}>
                      {highlight.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              {(highlight.startDate || highlight.endDate) && (
                <div className={`flex items-center gap-1.5 text-gray-500 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  <Calendar className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                  <span>
                    {highlight.startDate} - {highlight.current || highlight.endDate === 'Present' ? 'Present' : highlight.endDate}
                  </span>
                </div>
              )}

              {/* Description */}
              {highlight.description && (
                <p className={`text-gray-600 mb-3 ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
                  {highlight.description}
                </p>
              )}

              {/* Achievements - Show top 3 featured key achievements */}
              {(() => {
                // Use key_achievements if available, otherwise fall back to achievements
                const achievements = highlight.key_achievements || highlight.achievements || [];
                
                if (achievements.length === 0) {
                  return (
                    <p className="text-xs text-gray-400 italic">
                      No achievements yet - add them in the editor or create a detailed career page
                    </p>
                  );
                }
                
                // Get featured achievements (max 3)
                let featuredIndices = highlight.featured_achievements || [];
                
                // If no featured set, use first 3
                if (featuredIndices.length === 0) {
                  featuredIndices = Array.from({ length: Math.min(3, achievements.length) }, (_, i) => i);
                }
                
                // Get featured achievements
                const featuredAchievements = featuredIndices
                  .filter(idx => idx < achievements.length && achievements[idx])
                  .map(idx => achievements[idx]);
                
                return (
                  <div>
                    <ul className={`space-y-1.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {featuredAchievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span className="flex-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* View More Link - Single textual link at bottom */}
              <div className={`mt-4 pt-4 border-t border-gray-100`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/detail/career-editor/${highlight.id}?mode=${viewMode}`);
                  }}
                  className={`text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 transition-colors ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
                >
                  View More →
                </button>
              </div>
            </div>
            );
          })}
          </div>

          {/* View All / Show Less Button */}
          {highlights.length > 4 && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}
              >
                {showAll ? (
                  <>
                    <ChevronUp className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                    View All {highlights.length} Career Highlights
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No career highlights yet. Add your first experience!
        </div>
      )}
    </div>
  );
}

