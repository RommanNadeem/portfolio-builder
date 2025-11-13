'use client';

import { useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import { ResumeModal } from './ResumeModal';

interface ResumeSectionClientProps {
  resumeUrl: string;
  resumeFileName?: string;
}

export function ResumeSectionClient({ resumeUrl, resumeFileName = 'resume.pdf' }: ResumeSectionClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="resume" className="w-full">
        {/* Section Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="rounded-lg bg-green-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <h2 className="font-bold text-gray-900 text-2xl sm:text-3xl">Resume</h2>
        </div>
        
        {/* Resume Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-lg bg-green-100 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">View My Resume</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Click to preview or download</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>View Resume</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeUrl={resumeUrl}
        resumeFileName={resumeFileName}
      />
    </>
  );
}

