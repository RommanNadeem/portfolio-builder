'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
  preview: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showNext?: boolean;
  showBack?: boolean;
}

export function OnboardingLayout({
  children,
  preview,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextLabel = 'Continue',
  nextDisabled = false,
  showNext = true,
  showBack = true,
}: OnboardingLayoutProps) {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Progress Bar */}
      <div className="border-b border-gray-100 px-8 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-medium text-gray-900">Portfolio Builder</h1>
            <span className="text-xs text-gray-400">
              {currentStep} / {totalSteps}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-0.5">
            <div
              className="bg-black h-0.5 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Split Panes */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor/Form */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-100">
          <div className="max-w-xl mx-auto px-8 py-16">
            {children}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-100 overflow-y-auto">
          <div className="min-h-full py-8 px-6">
            <div className="bg-white shadow-lg h-full rounded-3xl overflow-hidden">
              <div className="px-12 py-12">
                <div className="mb-6">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Preview
                  </span>
                </div>
                {preview}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 px-8 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {showNext && onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="px-6 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

