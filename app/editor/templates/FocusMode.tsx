'use client';

import { Eye, EyeOff } from 'lucide-react';
import { ReactNode } from 'react';

interface FocusModeProps {
  enabled: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function FocusMode({ enabled, onToggle, children }: FocusModeProps) {
  return (
    <div className="relative">
      {/* Focus Mode Toggle */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Focus Mode</span>
            <span className="text-xs text-gray-500">
              {enabled ? 'Clean preview while editing' : 'Show all controls'}
            </span>
          </div>
          <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              enabled
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {enabled ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Focus On</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Focus Off</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content with conditional styling */}
      <div className={`transition-all duration-300 ${
        enabled
          ? 'focus-mode-enabled'
          : ''
      }`}>
        {children}
      </div>

      {/* Focus Mode Styles */}
      <style jsx global>{`
        .focus-mode-enabled {
          /* Hide UI chrome when in focus mode */
        }
        
        .focus-mode-enabled input::placeholder,
        .focus-mode-enabled textarea::placeholder {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .focus-mode-enabled input:focus::placeholder,
        .focus-mode-enabled textarea:focus::placeholder {
          opacity: 0.5;
        }

        .focus-mode-enabled button[title]:not(.focus-mode-keep),
        .focus-mode-enabled .focus-mode-hide {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }

        .focus-mode-enabled:hover button[title]:not(.focus-mode-keep),
        .focus-mode-enabled:hover .focus-mode-hide {
          opacity: 0.3;
        }

        .focus-mode-enabled button[title]:hover,
        .focus-mode-enabled .focus-mode-hide:hover {
          opacity: 1 !important;
        }

        /* Make borders more subtle */
        .focus-mode-enabled input,
        .focus-mode-enabled textarea {
          border-color: transparent !important;
        }

        .focus-mode-enabled input:focus,
        .focus-mode-enabled textarea:focus {
          border-color: rgba(147, 51, 234, 0.3) !important;
        }

        /* Hide section numbers and decorations */
        .focus-mode-enabled .section-number {
          opacity: 0.2;
        }

        .focus-mode-enabled:hover .section-number {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}

// Alternative: Inline Focus Mode Component
interface InlineFocusWrapperProps {
  focusMode: boolean;
  children: ReactNode;
  className?: string;
}

export function InlineFocusWrapper({ focusMode, children, className = '' }: InlineFocusWrapperProps) {
  return (
    <div className={`${focusMode ? 'focus-mode-content' : ''} ${className}`}>
      {children}
      
      <style jsx>{`
        .focus-mode-content {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .focus-mode-content:focus-within {
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
        }
      `}</style>
    </div>
  );
}

// Hook for focus mode state
export function useFocusMode(initialState = false) {
  const [focusMode, setFocusMode] = React.useState(initialState);

  const toggleFocusMode = () => setFocusMode(prev => !prev);

  React.useEffect(() => {
    // Add keyboard shortcut (Cmd/Ctrl + Shift + F)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { focusMode, toggleFocusMode, setFocusMode };
}

// Make sure to import React for the hook
import React from 'react';

