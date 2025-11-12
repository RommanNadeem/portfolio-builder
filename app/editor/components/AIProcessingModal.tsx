'use client';

/**
 * AI Processing Modal
 * 
 * Shows progress while AI generates case study
 */

import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface AIProcessingModalProps {
  isOpen: boolean;
  progress: number; // 0-100
  currentStep: string;
  steps?: string[];
}

export function AIProcessingModal({
  isOpen,
  progress,
  currentStep,
  steps = [
    'Processing uploaded files...',
    'Extracting content and data...',
    'Analyzing project context...',
    'Generating case study sections...',
    'Formatting and validating...',
  ],
}: AIProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
          AI is crafting your case study
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          This usually takes 20-40 seconds
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            {progress}% complete
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = progress > (index / steps.length) * 100;
            const isCurrent = step === currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 text-sm transition-opacity ${
                  isCompleted || isCurrent ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-purple-500 flex-shrink-0 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className={isCurrent ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fun fact */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center italic">
            💡 Tip: The AI is analyzing your content to create personalized, high-quality sections
          </p>
        </div>
      </div>
    </div>
  );
}

