'use client';

import { useState, useEffect } from 'react';

interface CompaniesStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CompaniesStep({ value, onChange, onNext, onBack }: CompaniesStepProps) {
  const [error, setError] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [companies, setCompanies] = useState<string[]>([]);

  // Initialize companies from value
  useEffect(() => {
    if (value) {
      const companiesList = value.split(',').map(c => c.trim()).filter(c => c);
      setCompanies(companiesList);
    }
  }, []);

  // Update parent value when companies change
  useEffect(() => {
    onChange(companies.join(', '));
  }, [companies]);

  const handleAddCompany = () => {
    const trimmed = currentCompany.trim();
    if (!trimmed) {
      setError('Please enter a company name');
      return;
    }
    
    if (companies.includes(trimmed)) {
      setError('This company is already in the list');
      return;
    }

    setCompanies([...companies, trimmed]);
    setCurrentCompany('');
    setError('');
  };

  const handleRemoveCompany = (index: number) => {
    setCompanies(companies.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCompany();
    }
  };

  const handleNext = () => {
    if (companies.length === 0) {
      setError('Please add at least one company');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Companies you've worked with
      </h2>
      <p className="text-gray-600 mb-8">
        List the companies or clients you have worked with.
      </p>

      <div className="space-y-6">
        {/* Companies List */}
        {companies.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {companies.length} {companies.length === 1 ? 'company' : 'companies'} added
            </p>
            <div className="space-y-2">
              {companies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg group hover:bg-gray-100 transition-all"
                >
                  <span className="text-gray-900">{company}</span>
                  <button
                    onClick={() => handleRemoveCompany(index)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Remove company"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentCompany}
              onChange={(e) => {
                setCurrentCompany(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter company name"
              className={`flex-1 px-4 py-3 text-lg text-gray-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400 ${
                error ? 'border-red-500' : 'border-gray-200'
              }`}
              autoFocus
            />
            <button
              onClick={handleAddCompany}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              Add
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Press Enter or click Add to add a company
          </p>
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
