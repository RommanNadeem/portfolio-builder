'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { TextStyleToolbar } from './TextStyleToolbar';
import { TextStyle } from './types';

interface EditableTextProps {
  children: React.ReactNode;
  initialStyle?: TextStyle;
  onStyleChange?: (style: TextStyle) => void;
  enabled?: boolean;
  fieldId: string;
}

export function EditableText({ 
  children, 
  initialStyle = {}, 
  onStyleChange,
  enabled = true,
  fieldId 
}: EditableTextProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<TextStyle>(initialStyle);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const prevInitialStyleRef = useRef<string>(JSON.stringify(initialStyle));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isActive]);

  useEffect(() => {
    // Only update if the style values actually changed (deep comparison via JSON)
    const initialStyleString = JSON.stringify(initialStyle);
    if (prevInitialStyleRef.current !== initialStyleString) {
      prevInitialStyleRef.current = initialStyleString;
      setCurrentStyle(initialStyle);
    }
  }, [initialStyle]);

  const handleClick = (e: React.MouseEvent) => {
    if (!enabled) return;
    
    e.stopPropagation();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      // Position toolbar above the element
      const toolbarHeight = 60;
      const spaceAbove = rect.top;
      const shouldPositionBelow = spaceAbove < toolbarHeight + 20;
      
      setToolbarPosition({
        top: shouldPositionBelow ? rect.bottom + 10 : rect.top - toolbarHeight - 10,
        left: rect.left + (rect.width / 2) - 275, // Center it (550px toolbar width / 2)
      });
    }
    
    setIsActive(true);
  };

  const handleStyleUpdate = (newStyle: TextStyle) => {
    setCurrentStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  return (
    <>
      <div
        ref={elementRef}
        onClick={handleClick}
        className={`
          ${enabled ? 'cursor-pointer transition-all' : ''}
          ${isActive ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''}
          ${enabled && !isActive ? 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 rounded-lg' : ''}
        `}
        style={currentStyle}
      >
        {children}
      </div>

      {isActive && enabled && (
        <TextStyleToolbar
          position={toolbarPosition}
          currentStyle={currentStyle}
          onStyleChange={handleStyleUpdate}
          onClose={() => setIsActive(false)}
        />
      )}
    </>
  );
}

