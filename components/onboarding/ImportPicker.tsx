'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

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
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    onResumeUpload(file);
  };

  if (isProcessing) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 text-black mx-auto mb-4 animate-spin" />
        <p className="text-sm text-gray-500">
          Parsing resume...
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
          border-2 border-dashed p-16 text-center transition-colors
          ${dragActive 
            ? 'border-black bg-gray-50' 
            : 'border-gray-200 hover:border-black'
          }
        `}>
          <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-base text-black mb-2 font-medium">
            Upload Resume
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-gray-400">
            PDF, DOC, DOCX up to 10MB
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
        <div className="p-4 border border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600">{error}</p>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onSkip}
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Start from scratch
        </button>
      </div>
    </div>
  );
}

