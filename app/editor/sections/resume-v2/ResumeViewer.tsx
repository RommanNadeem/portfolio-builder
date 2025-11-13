/**
 * ResumeViewer Component
 * 
 * Modal overlay for viewing and downloading resume
 */

'use client';

import { X, Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
  fileName?: string;
}

export function ResumeViewer({ isOpen, onClose, resumeUrl, fileName }: ResumeViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = fileName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(resumeUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
            {fileName && (
              <span className="text-sm text-gray-500">({fileName})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg transition-colors"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Loading resume...</p>
              </div>
            </div>
          )}
          <iframe
            src={`${resumeUrl}#toolbar=0`}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title="Resume Preview"
          />
        </div>
      </div>
    </div>
  );
}

