'use client';

import { ArrowLeft, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';
import '../onboarding.css';

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
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Panel - Editor/Form */}
      <div className="w-1/2 border-r border-gray-100 flex flex-col">
        {/* Top Progress Bar - Only on Left Side */}
        <div className="border-b border-gray-100 px-8 py-6 flex-shrink-0 bg-white">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-sm font-bold text-gray-900">Portfolio Builder</h1>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            {/* Progress Bar - Using design system */}
            <div className="onboarding-progress">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`onboarding-progress-step ${idx < currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-xl mx-auto px-8 py-16 animate-fadeIn">
            {children}
          </div>
        </div>

        {/* Bottom Navigation - Only on Left Side */}
        <div className="border-t border-gray-100 px-8 py-6 flex-shrink-0 bg-white">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            {showBack && onBack ? (
              <button
                onClick={onBack}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
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
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
              >
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
        <div className="min-h-full py-8 px-6">
          <div className="bg-white shadow-xl h-full rounded-3xl overflow-hidden border-2 border-gray-200">
            <div className="px-12 py-12">
              <div className="mb-6">
                <span className="onboarding-badge onboarding-badge-blue">
                  Live Preview
                </span>
              </div>
              {preview}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

