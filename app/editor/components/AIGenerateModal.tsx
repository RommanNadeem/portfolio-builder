'use client';

/**
 * AI Generate Modal
 * 
 * Modal for AI-powered case study generation
 * Allows users to upload files and add notes for AI processing
 */

import { useState, useCallback, useRef } from 'react';
import { X, Upload, FileText, FileSpreadsheet, File, Link as LinkIcon, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { TemplateType } from '../templates/types';

interface AIGenerateModalProps {
  isOpen: boolean;
  templateType: TemplateType;
  templateName: string;
  projectData?: {
    title?: string;
    description?: string;
    tags?: string[];
  };
  onClose: () => void;
  onGenerate: (files: File[], userNotes: string, options: GenerationOptions) => Promise<void>;
}

export interface GenerationOptions {
  tone: 'professional' | 'casual' | 'technical';
  auto_extract_metrics: boolean;
  include_technical_details: boolean;
  use_custom_structure: boolean; // NEW: Let AI design structure
  target_length: 'brief' | 'standard' | 'comprehensive';
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-excel': '.xls',
  'text/csv': '.csv',
  'text/plain': '.txt',
  'text/markdown': '.md',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.ms-powerpoint': '.ppt',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

export function AIGenerateModal({
  isOpen,
  templateType,
  templateName,
  projectData,
  onClose,
  onGenerate,
}: AIGenerateModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<GenerationOptions>({
    tone: 'professional',
    auto_extract_metrics: true,
    include_technical_details: false,
    use_custom_structure: true, // Default to AI-designed structure
    target_length: 'comprehensive',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError(null);
    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach(file => {
      // Check file type
      if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 10MB)`);
        return;
      }

      newFiles.push(file);
    });

    // Check total size
    const totalSize = [...files, ...newFiles].reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      setError('Total file size exceeds 50MB limit');
      return;
    }

    if (errors.length > 0) {
      setError(errors.join('; '));
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (files.length === 0 && !userNotes.trim()) {
      setError('Please upload files or add notes to generate content');
      return;
    }

    try {
      await onGenerate(files, userNotes, options);
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />;
    if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <FileSpreadsheet className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Case Study Generator
              </h2>
              <p className="text-sm text-gray-500">
                {templateName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📁 Upload Your Project Files
            </label>
            
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all
                ${isDragging 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                }
              `}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
              <p className="text-base font-medium text-gray-700 mb-1">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Maximum file size: 10MB per file, 50MB total
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Accepted formats:</p>
                <p>📄 PDF, Word • 📊 Excel, CSV • 📝 Text, Markdown • 📽️ PowerPoint</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={Object.values(ACCEPTED_FILE_TYPES).join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Files ({files.length})
              </p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-gray-600">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💡 Additional Context (Optional)
            </label>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Add any additional notes about your project: key metrics, achievements, timeline, challenges, or anything else that would help create a better case study..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports markdown formatting
            </p>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ⚙️ Generation Options
            </label>
            <div className="space-y-3">
              {/* NEW: Custom Structure Toggle */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.use_custom_structure}
                    onChange={(e) => setOptions(prev => ({ ...prev, use_custom_structure: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      ✨ Let AI design the structure
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      AI analyzes your content and creates a custom case study structure (recommended)
                    </p>
                  </div>
                </label>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.auto_extract_metrics}
                  onChange={(e) => setOptions(prev => ({ ...prev, auto_extract_metrics: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Auto-extract metrics and numbers</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.include_technical_details}
                  onChange={(e) => setOptions(prev => ({ ...prev, include_technical_details: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Include technical details (for engineering projects)</span>
              </label>

              <div>
                <label className="block text-xs text-gray-600 mb-2">Tone:</label>
                <div className="flex gap-2">
                  {(['professional', 'casual', 'technical'] as const).map(tone => (
                    <button
                      key={tone}
                      onClick={() => setOptions(prev => ({ ...prev, tone }))}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${options.tone === tone
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                        }
                      `}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Target */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Case Study Length:</label>
                <div className="flex gap-2">
                  {(['brief', 'standard', 'comprehensive'] as const).map(length => (
                    <button
                      key={length}
                      onClick={() => setOptions(prev => ({ ...prev, target_length: length }))}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${options.target_length === length
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                        }
                      `}
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {options.target_length === 'brief' && '3-5 min read (5-7 blocks)'}
                  {options.target_length === 'standard' && '5-7 min read (7-10 blocks)'}
                  {options.target_length === 'comprehensive' && '7-10 min read (10-15 blocks)'}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Info Banner */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="space-y-1 text-xs">
                <li>• AI analyzes your files and notes</li>
                <li>• Generates content matching the {templateName} structure</li>
                <li>• You'll preview and can edit before accepting</li>
                <li>• Usually takes 20-40 seconds</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={files.length === 0 && !userNotes.trim()}
            className="px-6 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
            style={{ background: (files.length === 0 && !userNotes.trim()) ? '' : '#5BC64A', border: (files.length === 0 && !userNotes.trim()) ? '' : '2px solid #111111', color: (files.length === 0 && !userNotes.trim()) ? '' : '#111111' }}
          >
            <Sparkles className="w-4 h-4" />
            Generate Case Study
          </button>
        </div>
      </div>
    </div>
  );
}

