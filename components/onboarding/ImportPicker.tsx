'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, XCircle } from 'lucide-react';

interface ImportPickerProps {
  onResumeUpload: (file: File) => void;
  onSkip: () => void;
  isProcessing: boolean;
}

export default function ImportPicker({
  onResumeUpload,
  onSkip,
  isProcessing
}: ImportPickerProps) {
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('That file type is not supported. Upload PDF or DOCX');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10 MB');
      return;
    }

    setError('');
    onResumeUpload(file);
  };

  if (isProcessing) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-6 h-6 text-emerald-600 mx-auto mb-4 animate-spin" />
        <p className="text-base text-gray-900 font-semibold">
          Parsing your career profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drag and Drop / Click to Upload Area */}
      <label
        className="block cursor-pointer"
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className={`
          onboarding-upload-area ${dragActive ? 'active' : ''}
        `}>
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-emerald-600' : 'text-gray-400'}`} />
          <p className="text-lg font-bold text-gray-900 mb-2">
            Upload Your Work History
          </p>
          <p className="text-sm text-gray-800 mb-1 font-medium">
            Click to browse or drag and drop
          </p>
          <p className="text-sm text-gray-800">
            PDF, DOC, DOCX • Max 10 MB
          </p>
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {error && (
        <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
          <XCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

