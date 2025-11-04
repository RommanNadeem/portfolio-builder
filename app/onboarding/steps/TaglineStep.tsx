'use client';

import { useState } from 'react';

interface TaglineStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TaglineStep({ value, onChange, onNext, onBack }: TaglineStepProps) {
  const [error, setError] = useState('');
  const maxLength = 100;

  const handleNext = () => {
    if (!value.trim()) {
      setError('Please enter a tagline');
      return;
    }
    if (value.length > maxLength) {
      setError(`Tagline must be ${maxLength} characters or less`);
      return;
    }
    setError('');
    onNext();
  };

  const handleChange = (newValue: string) => {
    if (newValue.length <= maxLength) {
      onChange(newValue);
      setError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  const remainingChars = maxLength - value.length;

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Your tagline
      </h2>
      <p className="text-gray-600 mb-8">
        Share a short tagline that captures your role and focus. Keep it under 100 characters.
      </p>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Building products that solve real problems"
            className={`w-full px-4 py-3 text-lg text-gray-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
            autoFocus
          />
          <div className="flex items-center justify-between mt-2">
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <p className="text-sm text-gray-500">
                A concise statement about what you do
              </p>
            )}
            <p
              className={`text-sm font-medium ${
                remainingChars < 20
                  ? 'text-orange-600'
                  : remainingChars < 10
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {remainingChars} left
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleNext}
            className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            Continue
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

