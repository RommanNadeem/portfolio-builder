/**
 * PublishOverlay - Popover-style overlay for publishing
 * 
 * Appears right below the publish button without blocking the UI.
 * Shows slug creation first, then publishing status.
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

interface PublishOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorElement?: HTMLElement | null; // Element to position relative to
}

export function PublishOverlay({ isOpen, onClose, children, anchorElement }: PublishOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Trigger animation after mount
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Add delay to prevent immediate close
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Transparent backdrop - invisible but catches clicks */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Popover Panel - positioned below publish button */}
      <div className="fixed top-16 right-6 z-50">
        <div
          ref={overlayRef}
          className={`bg-white rounded-lg shadow-2xl border border-gray-200 w-[480px] max-h-[calc(100vh-80px)] flex flex-col transition-all duration-200 ease-out ${
            isAnimating 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2'
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

/**
 * Overlay Header - Reusable header component
 */
interface OverlayHeaderProps {
  title: string;
  onClose: () => void;
  badge?: React.ReactNode;
}

export function OverlayHeader({ title, onClose, badge }: OverlayHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {badge}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
        title="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Overlay Body - Scrollable content area
 */
export function OverlayBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      {children}
    </div>
  );
}

/**
 * Overlay Footer - Sticky footer with actions
 */
export function OverlayFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-200 px-5 py-4 flex-shrink-0 bg-gray-50">
      {children}
    </div>
  );
}

