'use client';

import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizablePanesProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  defaultLeftWidth?: number; // percentage
  minLeftWidth?: number; // pixels
  maxLeftWidth?: number; // pixels
}

export function ResizablePanes({
  leftPane,
  rightPane,
  defaultLeftWidth = 25, // 25% default
  minLeftWidth = 280,
  maxLeftWidth = 600,
}: ResizablePanesProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved width from localStorage
    const saved = localStorage.getItem('editorLeftPaneWidth');
    if (saved) {
      setLeftWidth(parseFloat(saved));
    }
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidthPx = e.clientX - containerRect.left;
      
      // Convert to percentage but respect min/max in pixels
      const containerWidth = containerRect.width;
      const clampedWidthPx = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidthPx));
      const newWidthPercent = (clampedWidthPx / containerWidth) * 100;

      setLeftWidth(newWidthPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Save to localStorage
      localStorage.setItem('editorLeftPaneWidth', leftWidth.toString());
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, leftWidth, minLeftWidth, maxLeftWidth]);

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
      {/* Left Pane */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="bg-white border-r border-gray-200 overflow-y-auto transition-all"
      >
        {leftPane}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className={`w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize flex items-center justify-center group relative ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        style={{ cursor: 'col-resize' }}
      >
        {/* Visible drag indicator */}
        <div className={`absolute inset-y-0 left-0 w-1 ${isDragging ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-500'} transition-colors`} />
        
        {/* Grip icon (shows on hover) */}
        <div className={`absolute top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded p-1 shadow-sm opacity-0 group-hover:opacity-100 ${
          isDragging ? 'opacity-100' : ''
        } transition-opacity`}>
          <GripVertical className="w-3 h-3 text-gray-600" />
        </div>
      </div>

      {/* Right Pane */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="overflow-y-auto bg-gray-100 transition-all"
      >
        {rightPane}
      </div>

      {/* Overlay during drag to prevent iframe issues */}
      {isDragging && (
        <div className="absolute inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}

