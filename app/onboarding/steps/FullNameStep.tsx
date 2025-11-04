'use client';

import { useState } from 'react';

interface FullNameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function FullNameStep({ value, onChange, onNext }: FullNameStepProps) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!value.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (value.trim().length < 2) {
      setError('Please enter a valid full name');
      return;
    }
    setError('');
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Let's get started
      </h2>
      <p className="text-gray-600 mb-8">
        What is your full name as you want it shown on your portfolio?
      </p>

      <div className="space-y-8">
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="John Doe"
            className={`w-full px-0 py-3 text-2xl text-gray-900 bg-transparent border-0 border-b-2 focus:outline-none focus:border-gray-900 transition-all placeholder:text-gray-300 ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleNext}
            className="flex-1 bg-gray-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

