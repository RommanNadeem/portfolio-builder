/**
 * ResumeSection Component
 * 
 * Section for viewing and downloading resume
 */

'use client';

import { useState, useRef } from 'react';
import { FileText, Download, Eye, Upload, Loader2, Trash2 } from 'lucide-react';
import { ResumeViewer } from './ResumeViewer';
import { uploadFile } from '@/lib/storage';

interface ResumeSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
}

export function ResumeSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
}: ResumeSectionProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Resume can be in either location for backward compatibility
  const resumeUrl = data.resume || data.profile?.resume_url;
  const resumeFileName = data.resumeFileName || 'resume.pdf';
  const hasResume = resumeUrl && resumeUrl.trim().length > 0;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload resume to storage
      const result = await uploadFile({
        userId,
        file,
        type: 'resume',
        isPublic: true,
      });

      if (result.error || !result.publicUrl) {
        setUploadError(result.error || 'Upload failed');
        setIsUploading(false);
        return;
      }

      // Update portfolio with resume URL and filename (flat structure)
      onChange(prev => ({
        ...prev,
        resume: result.publicUrl,
        resumeFileName: file.name, // Store original filename
      }));

      setIsUploading(false);
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
      setIsUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveResume = () => {
    if (!confirm('Are you sure you want to remove your resume?')) return;
    
    // Update portfolio with null resume (flat structure)
    onChange(prev => ({
      ...prev,
      resume: null,
    }));
  };

  // In preview renderMode, render the preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    const isMobile = previewMode === 'mobile';
    
    // Show empty state only in Edit mode (right preview), hide in Preview mode
    if (!hasResume) {
      // Hide in Preview mode or published site
      if (viewMode === 'preview') {
        return null;
      }
      
      // Show helpful empty state in Edit mode (right side)
      return (
        <div id="resume" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
          {/* Section Header */}
          <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`}>
              <FileText className={isMobile ? 'w-3.5 h-3.5 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
            </div>
            <h2 className={`font-bold text-gray-900 ${
              isMobile ? 'text-lg' : 'text-3xl'
            }`}>Resume</h2>
          </div>
          
          {/* Empty State */}
          <div className={`bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl flex flex-col items-center justify-center ${
            isMobile ? 'p-6' : 'p-8'
          }`}>
            <FileText className={`text-emerald-600 ${isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'}`} />
            <p className={`text-gray-600 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
              No resume uploaded yet
            </p>
            <p className={`text-gray-500 text-center mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Upload in settings to display here
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <>
        <div id="resume" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
          {/* Section Header */}
          <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`}>
              <FileText className={isMobile ? 'w-3.5 h-3.5 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
            </div>
            <h2 className={`font-bold text-gray-900 ${
              isMobile ? 'text-lg' : 'text-3xl'
            }`}>Resume</h2>
          </div>
          
          {/* Resume Card */}
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
            isMobile ? 'p-4' : 'p-6'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
                  isMobile ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <FileText className={isMobile ? 'w-5 h-5 text-emerald-600' : 'w-6 h-6 text-emerald-600'} />
                </div>
                <div>
                  <h3 className={`font-semibold text-gray-900 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>View My Resume</h3>
                  <p className={`text-gray-600 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>Download or view in browser</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsViewerOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
                >
                  <Eye className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                  <span>View</span>
                </button>
                <a
                  href={resumeUrl}
                  download={resumeFileName}
                  className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
                  title={`Download ${resumeFileName}`}
                >
                  <Download className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Viewer Modal */}
        <ResumeViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          resumeUrl={resumeUrl}
          fileName={resumeFileName}
        />
      </>
    );
  }

  // Editor mode
  return (
    <div className="space-y-3">
      {hasResume ? (
        <>
          {/* Resume Display with Embedded Preview */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-lg border-2 border-emerald-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-emerald-200 bg-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 flex items-center justify-center w-10 h-10">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Resume Uploaded</h3>
                    <p className="text-gray-600 text-xs">Available for visitors to view</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsViewerOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <a
                    href={resumeUrl}
                    download={resumeFileName}
                    className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                    title={`Download ${resumeFileName}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                    disabled={isUploading}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                  <button
                    onClick={handleRemoveResume}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Embedded PDF Preview */}
            <div className="relative bg-white" style={{ height: '400px' }}>
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-0"
                title="Resume Preview"
              />
              {/* Overlay hint */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-transparent p-4 text-center">
                <p className="text-white text-xs font-medium">
                  ✓ Your resume is live and ready to be viewed by visitors
                </p>
              </div>
            </div>
          </div>

          {/* Resume Viewer Modal */}
          <ResumeViewer
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            resumeUrl={resumeUrl}
            fileName={resumeFileName}
          />
        </>
      ) : (
        /* No Resume State - Upload Interface */
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-16 h-16 text-gray-300" />
              <div>
                <p className="font-medium text-gray-900 mb-1">No Resume Yet</p>
                <p className="text-sm text-gray-600">
                  Upload your resume (PDF, DOC, DOCX) - Max 10MB
                </p>
              </div>
              
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Resume</span>
                  </>
                )}
              </button>
              
              {/* Upload Error */}
              {uploadError && (
                <p className="text-red-600 text-xs mt-2">
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

