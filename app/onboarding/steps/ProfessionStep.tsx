'use client';

import { useState } from 'react';

interface ProfessionStepProps {
  value: 'Product Manager' | 'Product Designer' | 'Software Engineer' | '';
  onChange: (value: 'Product Manager' | 'Product Designer' | 'Software Engineer') => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ProfessionStep({ value, onChange, onNext, onBack }: ProfessionStepProps) {
  const [error, setError] = useState('');

  const professions: Array<'Product Manager' | 'Product Designer' | 'Software Engineer'> = [
    'Product Manager',
    'Product Designer',
    'Software Engineer',
  ];

  const handleNext = () => {
    if (!value) {
      setError('Please select a profession');
      return;
    }
    setError('');
    onNext();
  };

  const handleSelect = (profession: 'Product Manager' | 'Product Designer' | 'Software Engineer') => {
    onChange(profession);
    setError('');
    // Automatically move to next step after selection
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Choose your profession
      </h2>
      <p className="text-gray-600 mb-8">
        Select one.
      </p>

      <div className="space-y-6">
        <div className="space-y-3">
          {professions.map((profession) => (
            <button
              key={profession}
              onClick={() => handleSelect(profession)}
              className={`w-full p-4 text-left rounded-lg border-2 font-medium transition-all duration-200 ${
                value === profession
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{profession}</span>
                {value === profession && (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

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
  );
}

