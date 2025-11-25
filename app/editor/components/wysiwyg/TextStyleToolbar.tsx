'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, X, Check, RotateCcw, Type } from 'lucide-react';
import { TextStyle } from './types';

interface TextStyleToolbarProps {
  position: { top: number; left: number };
  currentStyle: TextStyle;
  onStyleChange: (style: TextStyle) => void;
  onClose: () => void;
}

const FONT_FAMILIES = [
  'Inter',
  'Poppins',
  'Roboto',
  'Playfair Display',
  'Montserrat',
  'Open Sans',
  'Lato',
  'Raleway',
];

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px', '56px', '64px'];

const TEXT_COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', // Blacks/Grays
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', // Colors
  '#FFFFFF', '#F3F4F6', '#E5E7EB', // Whites/Light grays
];

export function TextStyleToolbar({ position, currentStyle, onStyleChange, onClose }: TextStyleToolbarProps) {
  const [style, setStyle] = useState<TextStyle>(currentStyle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStyle(currentStyle);
  }, [currentStyle]);

  const updateStyle = (updates: Partial<TextStyle>) => {
    const newStyle = { ...style, ...updates };
    setStyle(newStyle);
    // Auto-apply changes immediately
    onStyleChange(newStyle);
  };

  const handleReset = () => {
    const resetStyle: TextStyle = {};
    setStyle(resetStyle);
    onStyleChange(resetStyle);
  };

  const toggleBold = () => {
    updateStyle({ fontWeight: style.fontWeight === 700 ? 400 : 700 });
  };

  const toggleItalic = () => {
    updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' });
  };

  const toggleUnderline = () => {
    updateStyle({ textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' });
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed z-[9999] bg-white rounded-xl shadow-2xl border-2 border-gray-300 p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: Math.max(10, position.top),
        left: Math.max(10, Math.min(position.left, window.innerWidth - 570)),
        width: '550px',
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      {/* Font Family */}
      <div className="flex items-center gap-1">
        <Type className="w-3 h-3 text-gray-400" />
        <select
          value={style.fontFamily || 'Inter'}
          onChange={(e) => updateStyle({ fontFamily: e.target.value })}
          className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          style={{ minWidth: '110px' }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <select
        value={style.fontSize || '16px'}
        onChange={(e) => updateStyle({ fontSize: e.target.value })}
        className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        style={{ width: '70px' }}
      >
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <div className="w-px h-6 bg-gray-300" />

      {/* Bold */}
      <button
        onClick={toggleBold}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.fontWeight === 700 ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title="Bold (Cmd+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        onClick={toggleItalic}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title="Italic (Cmd+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        onClick={toggleUnderline}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.textDecoration === 'underline' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title="Underline (Cmd+U)"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300" />

      {/* Text Alignment */}
      <button
        onClick={() => updateStyle({ textAlign: 'left' })}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.textAlign === 'left' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => updateStyle({ textAlign: 'center' })}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.textAlign === 'center' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        onClick={() => updateStyle({ textAlign: 'right' })}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.textAlign === 'right' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300" />

      {/* Text Color */}
      <div className="flex items-center gap-1">
        <input
          type="color"
          value={style.color || '#000000'}
          onChange={(e) => updateStyle({ color: e.target.value })}
          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 hover:border-gray-400"
          title="Text Color"
        />
      </div>

      {/* Background Color */}
      <div className="flex items-center gap-1">
        <input
          type="color"
          value={style.backgroundColor || '#ffffff'}
          onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 hover:border-gray-400"
          title="Background Color"
        />
      </div>

      <div className="flex-1" />

      {/* Reset */}
      <button
        onClick={handleReset}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
        title="Reset Styles"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
        title="Done"
      >
        <Check className="w-4 h-4" />
      </button>
    </div>,
    document.body
  );
}

