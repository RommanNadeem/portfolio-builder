'use client';

import { useState, useRef, useEffect } from 'react';

interface PhoneStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  format: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', format: '(###) ###-####', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', format: '#### ### ####', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', format: '(###) ###-####', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', format: '#### ### ###', flag: '🇦🇺' },
  { code: 'IN', name: 'India', dialCode: '+91', format: '##### #####', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', format: '### #######', flag: '🇵🇰' },
  { code: 'DE', name: 'Germany', dialCode: '+49', format: '### ########', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', format: '# ## ## ## ##', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', dialCode: '+34', format: '### ## ## ##', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dialCode: '+39', format: '### ### ####', flag: '🇮🇹' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', format: '(##) #####-####', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', format: '### ### ####', flag: '🇲🇽' },
  { code: 'JP', name: 'Japan', dialCode: '+81', format: '###-####-####', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', format: '### #### ####', flag: '🇨🇳' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', format: '###-####-####', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', format: '#### ####', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', dialCode: '+971', format: '## ### ####', flag: '🇦🇪' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', format: '## ########', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', format: '###-### ## ##', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', format: '### ## ###', flag: '🇳🇴' },
  { code: 'PL', name: 'Poland', dialCode: '+48', format: '### ### ###', flag: '🇵🇱' },
];

export default function PhoneStep({ value, onChange, onNext, onBack }: PhoneStepProps) {
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPhoneNumber = (number: string, format: string): string => {
    const digits = number.replace(/\D/g, '');
    let formatted = '';
    let digitIndex = 0;

    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === '#') {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
      }
    }

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = input.replace(/\D/g, '');
    
    const formatted = formatPhoneNumber(digits, selectedCountry.format);
    setPhoneNumber(formatted);
    
    const fullNumber = `${selectedCountry.dialCode} ${formatted}`;
    onChange(fullNumber);
    setError('');
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
    setSearchQuery('');
    
    if (phoneNumber) {
      const digits = phoneNumber.replace(/\D/g, '');
      const formatted = formatPhoneNumber(digits, country.format);
      setPhoneNumber(formatted);
      const fullNumber = `${country.dialCode} ${formatted}`;
      onChange(fullNumber);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  const handleNext = () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    const digitCount = phoneNumber.replace(/\D/g, '').length;
    if (digitCount < 7) {
      setError('Please enter a valid phone number');
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
        Phone number
      </h2>
      <p className="text-gray-600 mb-8">
        Enter your phone number.
      </p>

      <div className="space-y-6">
        <div>
          <div className="flex relative">
            {/* Country Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`h-full px-3 flex items-center gap-2 bg-white border-2 rounded-l-lg hover:bg-gray-50 transition-all focus:outline-none ${
                  isFocused 
                    ? 'border-gray-900 ring-2 ring-gray-900' 
                    : error 
                    ? 'border-red-500' 
                    : 'border-gray-200'
                }`}
                style={{ borderRight: 'none' }}
              >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-gray-700 font-medium text-sm">{selectedCountry.dialCode}</span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search country..."
                      className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                            selectedCountry.code === country.code ? 'bg-gray-100' : ''
                          }`}
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span className="flex-1 text-gray-900">{country.name}</span>
                          <span className="text-gray-500 font-medium text-sm">{country.dialCode}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No countries found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Input */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={selectedCountry.format.replace(/#/g, '0')}
              className={`flex-1 px-4 py-3 text-lg text-gray-900 bg-white border-2 rounded-r-lg focus:outline-none transition-all placeholder:text-gray-400 ${
                isFocused
                  ? 'border-gray-900 ring-2 ring-gray-900'
                  : error
                  ? 'border-red-500'
                  : 'border-gray-200'
              }`}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Format: {selectedCountry.format}
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
