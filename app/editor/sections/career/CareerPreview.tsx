'use client';

import { Award, ExternalLink, Calendar } from 'lucide-react';
import { CareerHighlight } from './types';

interface CareerPreviewProps {
  highlights: CareerHighlight[];
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
  onUpdate?: (id: string, updates: Partial<CareerHighlight>) => void;
}

export function CareerPreview({ highlights, viewMode, previewMode, onUpdate }: CareerPreviewProps) {
  if (highlights.length === 0 && viewMode === 'preview') {
    return null;
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
        <div className={isMobile ? 'space-y-3' : 'space-y-4 sm:space-y-6'}>
          {highlights.slice(0, 6).map((highlight) => (
            <div
              key={highlight.id}
              className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                isMobile ? 'p-3' : 'p-6 sm:p-8'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={highlight.organization}
                      onChange={(e) => onUpdate!(highlight.id, { organization: e.target.value })}
                      className={`font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none transition-colors w-full ${isMobile ? 'text-sm' : 'text-lg sm:text-xl'} placeholder:text-gray-400`}
                      placeholder="Click to edit company name"
                    />
                  ) : (
                    <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-lg sm:text-xl'}`}>
                      {highlight.organization}
                      {highlight.link && (
                        <a
                          href={highlight.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex ml-2 text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </h3>
                  )}
                  
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

              {/* Achievements */}
              {highlight.achievements && highlight.achievements.length > 0 && (
                <ul className={`space-y-1.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {highlight.achievements.filter(a => a).map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span className="flex-1">{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No career highlights yet. Add your first experience!
        </div>
      )}
    </div>
  );
}

