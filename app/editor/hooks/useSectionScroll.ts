/**
 * useSectionScroll Hook
 * 
 * Provides scroll-to-section and highlight functionality
 */

import { useRef, useCallback, useEffect } from 'react';

export function useSectionScroll() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const highlightTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Register a section ref
  const registerSection = useCallback((sectionId: string, element: HTMLDivElement | null) => {
    sectionRefs.current[sectionId] = element;
  }, []);

  // Scroll to section and highlight it
  const scrollToSection = useCallback((sectionId: string) => {
    console.log(`[SectionScroll] scrollToSection called for ${sectionId}`);
    
    // Wait for DOM to update (section to expand) before scrolling
    setTimeout(() => {
      const element = sectionRefs.current[sectionId];
      if (!element) {
        console.warn(`[SectionScroll] Section ${sectionId} not found in refs`);
        console.log('[SectionScroll] Available refs:', Object.keys(sectionRefs.current));
        return;
      }

      console.log(`[SectionScroll] Found element, scrolling to ${sectionId}`);

      // Scroll to section
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Add highlight class
      element.classList.add('section-highlight');
      console.log(`[SectionScroll] Highlight added to ${sectionId}`);

      // Clear any existing timeout for this section
      if (highlightTimeouts.current[sectionId]) {
        clearTimeout(highlightTimeouts.current[sectionId]);
      }

      // Remove highlight after animation
      highlightTimeouts.current[sectionId] = setTimeout(() => {
        element.classList.remove('section-highlight');
        delete highlightTimeouts.current[sectionId];
        console.log(`[SectionScroll] Highlight removed from ${sectionId}`);
      }, 2000); // 2 second highlight
    }, 100); // 100ms delay for DOM update
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(highlightTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  return {
    registerSection,
    scrollToSection,
  };
}

