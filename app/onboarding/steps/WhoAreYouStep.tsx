'use client';

import { useState } from 'react';

interface WhoAreYouStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function WhoAreYouStep({ value, onChange, onNext, onBack }: WhoAreYouStepProps) {
  const [error, setError] = useState('');

  const countSentences = (text: string): number => {
    if (!text.trim()) return 0;
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    return sentences ? sentences.length : 0;
  };

  const handleNext = () => {
    if (!value.trim()) {
      setError('Please write a profile description');
      return;
    }

    const sentenceCount = countSentences(value);
    if (sentenceCount < 2) {
      setError('Please write at least two sentences');
      return;
    }

    if (sentenceCount > 4) {
      setError('Please keep it to four sentences or less');
      return;
    }

    setError('');
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleNext();
    }
  };

  const sentenceCount = countSentences(value);

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Who are you?
      </h2>
      <p className="text-gray-600 mb-8">
        Write a short profile description about who you are. Two to four sentences.
      </p>

      <div className="space-y-6">
        <div>
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="I'm a passionate product designer with 5+ years of experience creating user-centered digital experiences. I specialize in mobile apps and SaaS platforms, focusing on accessibility and intuitive design. My approach combines research-driven insights with creative problem-solving. I believe great design should be both beautiful and functional."
            rows={6}
            className={`w-full px-4 py-3 text-lg text-gray-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400 ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
            autoFocus
          />
          <div className="flex items-center justify-between mt-2">
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Tell your story in 2-4 sentences
              </p>
            )}
            <p
              className={`text-sm font-medium ${
                sentenceCount >= 2 && sentenceCount <= 4
                  ? 'text-green-600'
                  : sentenceCount > 4
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {sentenceCount} {sentenceCount === 1 ? 'sentence' : 'sentences'}
            </p>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1">
            Cmd + Enter to continue
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleNext}
            className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            Complete Onboarding
          </button>
          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

