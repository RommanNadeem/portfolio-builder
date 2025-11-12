'use client';

/**
 * AI Preview Modal
 * 
 * Preview generated content before accepting
 */

import { X, CheckCircle2, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import type { TemplateBlock } from '../templates/types';
import { TemplateRenderer } from '../templates/TemplateRenderer';

interface AIPreviewModalProps {
  isOpen: boolean;
  blocks: TemplateBlock[];
  confidence: number;
  suggestions?: string[];
  missingData?: string[];
  onAccept: () => void;
  onRegenerate: () => void;
  onClose: () => void;
}

export function AIPreviewModal({
  isOpen,
  blocks,
  confidence,
  suggestions = [],
  missingData = [],
  onAccept,
  onRegenerate,
  onClose,
}: AIPreviewModalProps) {
  if (!isOpen) return null;

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Medium Confidence';
    return 'Low Confidence - Review Recommended';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Case Study Generated!
              </h2>
              <p className="text-sm text-gray-500">
                Review the content before applying
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

        {/* Confidence & Info */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-3">
          {/* Confidence Score */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getConfidenceColor(confidence)}`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              {getConfidenceLabel(confidence)} ({confidence}%)
            </span>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-2">💡 AI Suggestions:</p>
              <ul className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Data */}
          {missingData.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">Missing Information:</p>
                  <ul className="space-y-1">
                    {missingData.map((item, index) => (
                      <li key={index} className="text-sm text-yellow-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-yellow-600 mt-2">
                    You can fill these sections manually after accepting
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="max-w-3xl mx-auto">
              <TemplateRenderer 
                blocks={blocks} 
                onChange={() => {}} 
                mode="preview" 
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onRegenerate}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Use This Case Study
          </button>
        </div>
      </div>
    </div>
  );
}

