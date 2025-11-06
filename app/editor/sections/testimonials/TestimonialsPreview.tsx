'use client';

import { MessageSquare, Linkedin } from 'lucide-react';
import { Testimonial } from './types';

interface TestimonialsPreviewProps {
  testimonials: Testimonial[];
  viewMode: 'edit' | 'preview';
  previewMode: 'desktop' | 'mobile';
}

export function TestimonialsPreview({ testimonials, viewMode, previewMode }: TestimonialsPreviewProps) {
  if (testimonials.length === 0 && viewMode === 'preview') {
    return null;
  }

  const isMobile = previewMode === 'mobile';

  return (
    <div id="testimonials" className={`w-full ${isMobile ? 'px-4 mb-6' : 'px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'}`}>
      {/* Section Header */}
      <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
        <div className={`rounded-lg bg-blue-100 flex items-center justify-center ${
          isMobile ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
        }`}>
          <MessageSquare className={isMobile ? 'w-3 h-3 text-blue-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-blue-600'} />
        </div>
        <h2 className={`font-bold text-gray-900 ${
          isMobile ? 'text-base' : 'text-2xl sm:text-3xl'
        }`}>Testimonials</h2>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length > 0 ? (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all ${
                isMobile ? 'p-4' : 'p-6'
              }`}
            >
              {/* Quote */}
              <div className={`mb-4 ${isMobile ? 'text-2xl' : 'text-3xl'} text-blue-600`}>"</div>
              
              {/* Testimonial Text */}
              <p className={`text-gray-700 mb-4 italic ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
                {testimonial.testimonial}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {testimonial.name}
                  </p>
                  {testimonial.title && (
                    <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {testimonial.title}
                    </p>
                  )}
                </div>
                {testimonial.linkedinUrl && (
                  <a
                    href={testimonial.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No testimonials yet. Add what others say about you!
        </div>
      )}
    </div>
  );
}

