'use client';

import { useState, useEffect } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
  resumeFileName?: string;
}

export function ResumeModal({ isOpen, onClose, resumeUrl, resumeFileName = 'resume.pdf' }: ResumeModalProps) {
  const [isPDF, setIsPDF] = useState(true);

  useEffect(() => {
    // Check if the resume is a PDF
    const isPdfFile = resumeUrl.toLowerCase().endsWith('.pdf') || resumeUrl.includes('pdf');
    setIsPDF(isPdfFile);
  }, [resumeUrl]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 sm:m-8 bg-white rounded-lg sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Resume</h2>
          <div className="flex items-center gap-2">
            {/* Download Button */}
            <a
              href={resumeUrl}
              download={resumeFileName}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              title={`Download ${resumeFileName}`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Open in New Tab Button */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Open</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isPDF ? (
            <iframe
              src={resumeUrl}
              className="w-full h-full border-0"
              title="Resume PDF Viewer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <p className="text-gray-600 mb-4">
                  This resume format cannot be previewed in the browser.
                </p>
                <a
                  href={resumeUrl}
                  download={resumeFileName}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

