'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Check, RotateCcw, Type, Highlighter, Link2, Link2Off, X } from 'lucide-react';
import { TextStyle } from './types';

interface RichTextToolbarProps {
  position: { top: number; left: number };
  currentStyle: TextStyle;
  hasSelection: boolean;
  onStyleChange: (style: TextStyle) => void;
  onInlineFormat: (command: string, value?: string) => void;
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

export function RichTextToolbar({ 
  position, 
  currentStyle, 
  hasSelection,
  onStyleChange, 
  onInlineFormat,
  onClose 
}: RichTextToolbarProps) {
  const [style, setStyle] = useState<TextStyle>(currentStyle);
  const [mounted, setMounted] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffff00');
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [linkInfo, setLinkInfo] = useState<{ url: string; element: HTMLAnchorElement } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStyle(currentStyle);
  }, [currentStyle]);

  // Save selection continuously while hasSelection is true
  useEffect(() => {
    if (!hasSelection) {
      setLinkInfo(null);
      return;
    }
    
    const saveCurrentSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        // Clone the range properly
        const clonedRange = range.cloneRange();
        setSavedSelection(clonedRange);
        
        // Check if selection contains a link
        const container = range.commonAncestorContainer;
        let linkElement: HTMLAnchorElement | null = null;
        
        // Check if container itself is a link
        if (container.nodeType === Node.ELEMENT_NODE && (container as Element).tagName === 'A') {
          linkElement = container as HTMLAnchorElement;
        } else {
          // Check parent elements for a link
          let parent = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
          while (parent) {
            if (parent.tagName === 'A') {
              linkElement = parent as HTMLAnchorElement;
              break;
            }
            parent = parent.parentElement;
          }
        }
        
        if (linkElement) {
          setLinkInfo({
            url: linkElement.href,
            element: linkElement
          });
        } else {
          setLinkInfo(null);
        }
      }
    };
    
    // Save immediately
    saveCurrentSelection();
    
    // Save on selection change
    document.addEventListener('selectionchange', saveCurrentSelection);
    
    return () => {
      document.removeEventListener('selectionchange', saveCurrentSelection);
    };
  }, [hasSelection]);

  // Helper to restore selection
  const restoreSelection = () => {
    if (savedSelection) {
      try {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          // Clone again to avoid mutation
          selection.addRange(savedSelection.cloneRange());
        }
        return true;
      } catch (e) {
        console.error('Failed to restore selection:', e);
        return false;
      }
    }
    return false;
  };

  const updateStyle = (updates: Partial<TextStyle>) => {
    const newStyle = { ...style, ...updates };
    setStyle(newStyle);
    onStyleChange(newStyle);
  };

  const handleReset = () => {
    const resetStyle: TextStyle = {};
    setStyle(resetStyle);
    onStyleChange(resetStyle);
  };

  // Inline formatting functions
  const toggleBold = () => {
    if (hasSelection && savedSelection) {
      // Restore selection first
      if (restoreSelection()) {
        // Apply bold formatting
        document.execCommand('bold', false);
        
        // Focus back to the editable element
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const element = container.nodeType === Node.ELEMENT_NODE 
            ? container as HTMLElement 
            : container.parentElement;
          element?.focus();
        }
      }
    } else {
      updateStyle({ fontWeight: style.fontWeight === 700 ? 400 : 700 });
    }
  };

  const toggleItalic = () => {
    if (hasSelection && savedSelection) {
      // Restore selection first
      if (restoreSelection()) {
        // Apply italic formatting
        document.execCommand('italic', false);
        
        // Focus back to the editable element
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const element = container.nodeType === Node.ELEMENT_NODE 
            ? container as HTMLElement 
            : container.parentElement;
          element?.focus();
        }
      }
    } else {
      updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' });
    }
  };

  const toggleUnderline = () => {
    if (hasSelection && savedSelection) {
      // Restore selection first
      if (restoreSelection()) {
        // Apply underline formatting
        document.execCommand('underline', false);
        
        // Focus back to the editable element
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const element = container.nodeType === Node.ELEMENT_NODE 
            ? container as HTMLElement 
            : container.parentElement;
          element?.focus();
        }
      }
    } else {
      updateStyle({ textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' });
    }
  };

  const applyTextColor = (color: string) => {
    if (hasSelection && savedSelection) {
      // Restore selection first
      restoreSelection();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.color = color;
        
        try {
          range.surroundContents(span);
        } catch (e) {
          // If surroundContents fails, use a different approach
          const fragment = range.extractContents();
          span.appendChild(fragment);
          range.insertNode(span);
        }
        
        // Save the new selection
        setSavedSelection(selection.getRangeAt(0).cloneRange());
      }
    } else {
      updateStyle({ color });
    }
  };

  const applyBackgroundColor = (color: string) => {
    if (hasSelection && savedSelection) {
      // Restore selection first
      restoreSelection();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        
        try {
          range.surroundContents(span);
        } catch (e) {
          // If surroundContents fails, use a different approach
          const fragment = range.extractContents();
          span.appendChild(fragment);
          range.insertNode(span);
        }
        
        // Save the new selection
        setSavedSelection(selection.getRangeAt(0).cloneRange());
      }
    } else {
      updateStyle({ backgroundColor: color });
    }
  };

  const addHyperlink = () => {
    if (!savedSelection) {
      alert('Please select some text first');
      return;
    }

    // Restore selection
    restoreSelection();
    
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      alert('Please select some text first');
      return;
    }

    const url = prompt('Enter URL:', 'https://');
    if (url && url.trim()) {
      const range = selection.getRangeAt(0);
      const link = document.createElement('a');
      link.href = url.trim();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'text-blue-600 underline hover:text-blue-800 transition-colors';
      link.style.textDecoration = 'underline';
      
      try {
        range.surroundContents(link);
      } catch (e) {
        // If surroundContents fails, use insertNode
        const fragment = range.extractContents();
        link.appendChild(fragment);
        range.insertNode(link);
      }
      
      // Clear selection
      selection.removeAllRanges();
    }
  };

  const removeHyperlink = () => {
    if (linkInfo) {
      // Use the saved link element
      const anchor = linkInfo.element;
      const text = document.createTextNode(anchor.textContent || '');
      anchor.parentNode?.replaceChild(text, anchor);
      setLinkInfo(null);
      return;
    }
    
    // Fallback: try to find link from selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    
    // Find parent anchor element
    let anchor = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
    while (anchor && anchor.tagName !== 'A') {
      anchor = anchor.parentElement;
    }

    if (anchor && anchor.tagName === 'A') {
      // Replace link with its text content
      const text = document.createTextNode(anchor.textContent || '');
      anchor.parentNode?.replaceChild(text, anchor);
    }
  };

  if (!mounted) return null;

  // If there's a link, show link tooltip instead of main toolbar
  if (linkInfo) {
    return createPortal(
      <div
        className="fixed z-[9999] bg-gray-900 text-white rounded-lg shadow-2xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: Math.max(10, position.top),
          left: Math.max(10, Math.min(position.left, window.innerWidth - 400)),
          maxWidth: '400px',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Link Icon */}
        <Link2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
        
        {/* URL Display */}
        <a
          href={linkInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          {linkInfo.url}
        </a>
        
        {/* Remove Link Button */}
        <button
          onClick={() => {
            removeHyperlink();
            onClose();
          }}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 flex-shrink-0"
          title="Remove Link"
        >
          <Link2Off className="w-3 h-3" />
          Unlink
        </button>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>,
      document.body
    );
  }

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
      {hasSelection && (
        <div className="text-xs text-blue-600 font-semibold mr-2 px-2 py-1 bg-blue-50 rounded">
          ✨ Selection Mode
        </div>
      )}

      {/* Font Family - Block level only */}
      {!hasSelection && (
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
      )}

      {/* Font Size - Block level only */}
      {!hasSelection && (
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
      )}

      {!hasSelection && <div className="w-px h-6 bg-gray-300" />}

      {/* Bold */}
      <button
        onClick={toggleBold}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.fontWeight === 700 ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title={hasSelection ? "Bold Selection (Cmd+B)" : "Bold Text (Cmd+B)"}
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        onClick={toggleItalic}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title={hasSelection ? "Italic Selection (Cmd+I)" : "Italic Text (Cmd+I)"}
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        onClick={toggleUnderline}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          style.textDecoration === 'underline' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'text-gray-700'
        }`}
        title={hasSelection ? "Underline Selection (Cmd+U)" : "Underline Text (Cmd+U)"}
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300" />

      {/* Text Alignment - Block level only */}
      {!hasSelection && (
        <>
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
        </>
      )}

      {/* Text Color */}
      <div className="flex items-center gap-1">
        <input
          type="color"
          value={textColor}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          onChange={(e) => {
            const newColor = e.target.value;
            setTextColor(newColor);
            applyTextColor(newColor);
          }}
          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 hover:border-gray-400"
          title={hasSelection ? "Color Selection" : "Text Color"}
        />
      </div>

      {/* Background/Highlight Color */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <input
            type="color"
            value={bgColor}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            onChange={(e) => {
              const newColor = e.target.value;
              setBgColor(newColor);
              applyBackgroundColor(newColor);
            }}
            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 hover:border-gray-400"
            title={hasSelection ? "Highlight Selection" : "Background Color"}
          />
          <Highlighter className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500 pointer-events-none" />
        </div>
      </div>

      {/* Hyperlink buttons - only when text is selected */}
      {hasSelection && (
        <>
          <div className="w-px h-6 bg-gray-300" />
          
          <button
            onClick={addHyperlink}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            title="Add Link"
          >
            <Link2 className="w-4 h-4" />
          </button>

          <button
            onClick={removeHyperlink}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            title="Remove Link"
          >
            <Link2Off className="w-4 h-4" />
          </button>
        </>
      )}

      <div className="flex-1" />

      {/* Reset */}
      {!hasSelection && (
        <button
          onClick={handleReset}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          title="Reset Styles"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}

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

