'use client';

import { useState, useRef, useEffect } from 'react';
import { RichTextToolbar } from './RichTextToolbar';
import { TextStyle } from './types';

interface RichEditableTextProps {
  children: React.ReactNode;
  initialHtml?: string;
  initialText?: string;
  initialStyle?: TextStyle;
  onContentChange?: (html: string, text: string) => void;
  onStyleChange?: (style: TextStyle) => void;
  enabled?: boolean;
  fieldId: string;
  placeholder?: string;
}

export function RichEditableText({ 
  children, 
  initialHtml = '',
  initialText = '',
  initialStyle = {}, 
  onContentChange,
  onStyleChange,
  enabled = true,
  fieldId,
  placeholder = 'Click to edit...'
}: RichEditableTextProps) {
  const [isActive, setIsActive] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<TextStyle>(initialStyle);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editableRef = useRef<HTMLDivElement>(null);
  const prevInitialStyleRef = useRef<string>(JSON.stringify(initialStyle));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editableRef.current && !editableRef.current.contains(e.target as Node)) {
        setIsActive(false);
        setHasSelection(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsActive(false);
        setHasSelection(false);
        window.getSelection()?.removeAllRanges();
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
    const initialStyleString = JSON.stringify(initialStyle);
    if (prevInitialStyleRef.current !== initialStyleString) {
      prevInitialStyleRef.current = initialStyleString;
      setCurrentStyle(initialStyle);
    }
  }, [initialStyle]);

  // Handle text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!isActive || !enabled) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setHasSelection(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      // Check if selection is within our editable element
      if (editableRef.current?.contains(range.commonAncestorContainer)) {
        if (selectedText.length > 0) {
          setHasSelection(true);
          
          // Position toolbar near selection
          const rect = range.getBoundingClientRect();
          setToolbarPosition({
            top: rect.top - 60,
            left: rect.left + (rect.width / 2) - 275,
          });
        } else {
          setHasSelection(false);
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [isActive, enabled]);

  const handleClick = (e: React.MouseEvent) => {
    if (!enabled) return;
    e.stopPropagation();
    
    // Don't interfere if already active and user is clicking to position cursor
    if (isActive) {
      return;
    }
    
    setIsActive(true);
    
    // Make element editable and focus, but don't move cursor
    if (editableRef.current) {
      // Wait a tick for React to update, then set cursor at click position
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus();
          
          // Try to set cursor position at click location
          const selection = window.getSelection();
          if (selection && document.caretRangeFromPoint) {
            const range = document.caretRangeFromPoint(e.clientX, e.clientY);
            if (range) {
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      }, 0);
    }

    // Position toolbar at click location
    const rect = editableRef.current?.getBoundingClientRect();
    if (rect) {
      setToolbarPosition({
        top: rect.top - 60,
        left: rect.left + (rect.width / 2) - 275,
      });
    }
  };

  const handleInput = () => {
    if (!editableRef.current) return;
    const html = editableRef.current.innerHTML;
    const text = editableRef.current.innerText;
    onContentChange?.(html, text);
  };

  const handleStyleUpdate = (newStyle: TextStyle) => {
    setCurrentStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  // Apply formatting to selected text
  const applyInlineFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editableRef.current?.focus();
  };

  const divProps = {
    ref: editableRef,
    contentEditable: enabled,
    suppressContentEditableWarning: true,
    onClick: handleClick,
    onInput: handleInput,
    onFocus: () => setIsActive(true),
    className: `
      ${enabled ? 'cursor-text transition-all' : ''}
      ${isActive ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg outline-none p-2 -m-2' : ''}
      ${enabled && !isActive ? 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 hover:bg-blue-50/30 rounded-lg p-2 -m-2' : ''}
    `,
    style: currentStyle,
  };

  return (
    <>
      {initialHtml ? (
        <div
          {...divProps}
          dangerouslySetInnerHTML={{ __html: initialHtml }}
        />
      ) : (
        <div {...divProps}>
          {children}
        </div>
      )}

      {(isActive || hasSelection) && enabled && (
        <RichTextToolbar
          position={toolbarPosition}
          currentStyle={currentStyle}
          hasSelection={hasSelection}
          onStyleChange={handleStyleUpdate}
          onInlineFormat={applyInlineFormat}
          onClose={() => {
            setIsActive(false);
            setHasSelection(false);
          }}
        />
      )}
    </>
  );
}

