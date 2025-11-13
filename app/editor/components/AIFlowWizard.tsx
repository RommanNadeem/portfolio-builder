'use client';

/**
 * AI Flow Wizard
 * 
 * Multi-step wizard for AI case study generation
 * Steps: Category → Upload → Details → Configure → Generate
 */

import { useState, useCallback, useRef } from 'react';
import { X, Upload, FileText, FileSpreadsheet, File, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { TONE_OPTIONS, LENGTH_OPTIONS } from '../templates/block-catalog';

interface AIFlowWizardProps {
  isOpen: boolean;
  projectTitle?: string;
  onClose: () => void;
  onGenerate: (data: AIGenerationData) => Promise<void>;
}

export interface AIGenerationData {
  category: string;
  files: File[];
  user_notes: string;
  tone: string;
  target_length: string;
  auto_extract_metrics: boolean;
  include_technical_details: boolean;
}

const CATEGORY_OPTIONS = [
  'Product Launch',
  'Product Design',
  'Engineering/Technical',
  'Marketing Campaign',
  'User Research',
  'Creative/Branding',
  'Startup/Business',
  'Other',
];

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
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function AIFlowWizard({ isOpen, projectTitle, onClose, onGenerate }: AIFlowWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [tone, setTone] = useState('professional');
  const [targetLength, setTargetLength] = useState('standard');
  const [autoExtractMetrics, setAutoExtractMetrics] = useState(true);
  const [includeTechnicalDetails, setIncludeTechnicalDetails] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError(null);
    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach(file => {
      if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 10MB)`);
        return;
      }

      newFiles.push(file);
    });

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

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleNext = () => {
    if (step === 1 && !category) {
      setError('Please select a category');
      return;
    }
    if (step === 1 && category === 'Other' && !customCategory.trim()) {
      setError('Please describe your project type');
      return;
    }
    setError(null);
    setStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
  };

  const handleGenerate = async () => {
    if (files.length === 0 && !userNotes.trim()) {
      setError('Please upload files or add details');
      return;
    }

    const finalCategory = category === 'Other' ? `Custom: ${customCategory}` : category;

    await onGenerate({
      category: finalCategory,
      files,
      user_notes: userNotes,
      tone,
      target_length: targetLength,
      auto_extract_metrics: autoExtractMetrics,
      include_technical_details: includeTechnicalDetails,
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />;
    if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <FileSpreadsheet className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

  const selectedLength = LENGTH_OPTIONS.find(l => l.value === targetLength);
  const selectedTone = TONE_OPTIONS.find(t => t.value === tone);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Case Study Generator</h2>
              <p className="text-sm text-gray-500">Step {step} of 4</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What type of project is this?</h3>
                <p className="text-sm text-gray-600 mb-4">This helps AI create the best structure for your case study</p>
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="">Select a category...</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {category === 'Other' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your project type
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g., Educational Platform, Nonprofit Campaign..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: File Upload */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Project Files</h3>
                <p className="text-sm text-gray-600 mb-4">Add any documents that describe your project</p>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
                `}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
                <p className="text-base font-medium text-gray-700 mb-1">Drag & drop files or click to browse</p>
                <p className="text-sm text-gray-500 mb-3">Max 10MB per file</p>
                <div className="text-xs text-gray-400">
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

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Uploaded Files ({files.length})</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-gray-600">{getFileIcon(file.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="p-1 hover:bg-gray-200 rounded">
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Any additional detail to share with AI?
                </h3>
                <p className="text-sm text-gray-600 mb-4">Optional - but more context creates better results</p>
              </div>

              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Share anything that would help AI create a better case study:&#10;&#10;• Key metrics and achievements&#10;• Timeline and milestones&#10;• Team composition&#10;• Technologies used&#10;• Challenges overcome&#10;• Impact and results&#10;• Anything else relevant..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm font-mono"
              />
              <p className="text-xs text-gray-500">The more detail you provide, the better the AI-generated case study will be</p>
            </div>
          )}

          {/* Step 4: Configure */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Your Case Study</h3>
                <p className="text-sm text-gray-600 mb-4">Configure tone and length</p>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Writing Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {TONE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${tone === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                    >
                      <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
                {selectedTone && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {selectedTone.characteristics}
                  </p>
                )}
              </div>

              {/* Length Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Case Study Length</label>
                <div className="grid grid-cols-3 gap-3">
                  {LENGTH_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTargetLength(option.value)}
                      className={`
                        p-4 rounded-lg border-2 text-center transition-all
                        ${targetLength === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                    >
                      <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.subtitle}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {option.details.block_count_range.min}-{option.details.block_count_range.max} blocks
                      </div>
                    </button>
                  ))}
                </div>
                {selectedLength && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {selectedLength.details.best_for}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoExtractMetrics}
                    onChange={(e) => setAutoExtractMetrics(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Auto-extract metrics and numbers from files</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTechnicalDetails}
                    onChange={(e) => setIncludeTechnicalDetails(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Include technical implementation details</span>
                </label>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Ready to generate:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Category: {category === 'Other' ? customCategory : category}</li>
                  <li>• Files: {files.length} uploaded</li>
                  <li>• Tone: {selectedTone?.label}</li>
                  <li>• Length: {selectedLength?.label} ({selectedLength?.subtitle})</li>
                </ul>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={files.length === 0 && !userNotes.trim()}
              className="px-6 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
              style={{ background: (files.length === 0 && !userNotes.trim()) ? '' : '#5BC64A', border: (files.length === 0 && !userNotes.trim()) ? '' : '2px solid #111111', color: (files.length === 0 && !userNotes.trim()) ? '' : '#111111' }}
            >
              <Sparkles className="w-4 h-4" />
              Generate Case Study
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

