'use client';

import { useState } from 'react';

interface EmailStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EmailStep({ value, onChange, onNext, onBack }: EmailStepProps) {
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return false;
    }
    if (!email.includes('@')) {
      setError('Email must contain "@"');
      return false;
    }
    const parts = email.split('@');
    if (parts.length !== 2 || !parts[1].includes('.')) {
      setError('Email must contain a valid domain');
      return false;
    }
    if (parts[0].length === 0 || parts[1].length < 3) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateEmail(value)) {
      setError('');
      onNext();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Contact email
      </h2>
      <p className="text-gray-600 mb-8">
        What email should be shown for contact?
      </p>

      <div className="space-y-6">
        <div>
          <input
            type="email"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="john.doe@example.com"
            className={`w-full px-4 py-3 text-lg text-gray-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
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

