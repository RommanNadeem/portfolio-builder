'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthYearPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function MonthYearPicker({ value, onChange, placeholder = 'Select date', disabled = false }: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update position when opening or scrolling
  const updatePosition = useCallback(() => {
    if (pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen, updatePosition]);

  const handleMonthSelect = (monthIndex: number) => {
    const formattedDate = `${months[monthIndex]} ${selectedYear}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };

  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 5; i >= currentYear - 50; i--) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="relative" ref={pickerRef}>
      <input
        type="text"
        value={value}
        onClick={() => {
          if (!disabled) {
            updatePosition();
            setIsOpen(!isOpen);
          }
        }}
        readOnly
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400 ${
          disabled 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-gray-100'
        }`}
      />

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-[9999] p-3 w-[280px]" 
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
          }}
        >
          {showYearPicker ? (
            <>
              {/* Year Picker */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowYearPicker(false)}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  ← Back
                </button>
                <span className="font-semibold text-gray-900 text-sm">Select Year</span>
                <div className="w-12"></div>
              </div>
              <div className="max-h-64 overflow-y-auto grid grid-cols-3 gap-2">
                {generateYearRange().map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      year === selectedYear
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Year Selector */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setSelectedYear(selectedYear - 1)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowYearPicker(true)}
                  className="font-semibold text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {selectedYear}
                </button>
                <button
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      value === `${month} ${selectedYear}`
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

