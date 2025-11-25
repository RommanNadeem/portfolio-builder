/**
 * FAQsSection Component (Controlled Version)
 * 
 * Fully controlled component with no internal state.
 * Real-time sync between editor and preview.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Plus, HelpCircle, ChevronDown } from 'lucide-react';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { ItemList } from '@/app/editor/core/components';
import { FAQItem, convertFromLegacy, convertToLegacy, FAQ } from './types';
import { FAQCard } from './FAQCard';

interface FAQsSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function FAQsSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
  onScrollToSection,
}: FAQsSectionProps) {
  
  // Convert legacy data to new format (memoized)
  const faqs = useMemo(() => {
    const legacyFAQs = data.faqs || [];
    return legacyFAQs.map((f: FAQ) => convertFromLegacy(f));
  }, [data.faqs]);

  // Handle changes - update parent immediately
  const handleFAQsChange = useCallback((newFAQs: FAQItem[]) => {
    const legacy = newFAQs.map(convertToLegacy);
    onChange(prev => ({
      ...prev,
      faqs: legacy,
    }));
  }, [onChange]);

  // Use controlled hook
  const {
    items: currentFAQs,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<FAQItem>({
    items: faqs,
    onChange: handleFAQsChange,
  });

  const handleAdd = () => {
    // Check if there's already an empty FAQ
    const hasEmptyFAQ = currentFAQs.some(f => 
      f.question.trim().length === 0 || f.answer.trim().length === 0
    );
    
    if (hasEmptyFAQ) {
      console.log('[FAQsSection] Empty FAQ already exists, not adding new one');
      return; // Don't add new one, user should fill existing
    }
    
    add({
      question: '',
      answer: '',
      category: '',
    });
  };

  // In preview renderMode, render the preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    // Filter out empty FAQs (question and answer required)
    const validFAQs = currentFAQs.filter(f => 
      f.question.trim().length > 0 && f.answer.trim().length > 0
    );
    
    const isMobile = previewMode === 'mobile';
    
    // Show empty state only in Edit mode (right preview), hide in Preview mode
    if (validFAQs.length === 0) {
      // Hide in Preview mode or published site
      if (viewMode === 'preview') {
        return null;
      }
      
      // Show helpful empty state in Edit mode (right side)
      return (
        <div id="faqs" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
          {/* Section Header */}
          <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`}>
              <HelpCircle className={isMobile ? 'w-3.5 h-3.5 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
            </div>
            <h2 className={`font-bold text-gray-900 ${
              isMobile ? 'text-lg' : 'text-3xl'
            }`}>FAQs</h2>
          </div>
          
          {/* Empty State – consistent with Projects section */}
          <div className={`bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl flex flex-col items-center justify-center ${
            isMobile ? 'p-6' : 'p-8'
          }`}>
            <HelpCircle className={`text-emerald-600 ${isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'}`} />
            <p className={`text-gray-600 mb-3 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
              No FAQs added yet
            </p>
            <button
              onClick={() => {
                handleAdd();
                onScrollToSection?.('faqs');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              <Plus className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>Add Your First FAQ</span>
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div id="faqs" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
        {/* Section Header */}
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className={`rounded-lg bg-emerald-100 flex items-center justify-center ${
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          }`}>
            <HelpCircle className={isMobile ? 'w-3.5 h-3.5 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
          </div>
          <h2 className={`font-bold text-gray-900 ${
            isMobile ? 'text-lg' : 'text-3xl'
          }`}>FAQs</h2>
        </div>
        
        <div className="space-y-3">
          {validFAQs.map((faq) => (
            <details
              key={faq.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group ${
                isMobile ? 'p-4' : 'p-6'
              }`}
            >
              <summary className={`cursor-pointer list-none flex items-center justify-between ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                <span className="font-semibold text-gray-900 flex-1 pr-4">
                  {faq.question}
                </span>
                <ChevronDown className={`text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ${
                  isMobile ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </summary>
              <div className={`text-gray-600 leading-relaxed ${
                isMobile ? 'text-xs mt-3' : 'text-sm mt-4 pt-4 border-t border-gray-100'
              }`}>
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-3">
      <ItemList
        items={currentFAQs}
        onReorder={reorderByIndex}
        renderItem={(faq, index) => (
          <FAQCard
            faq={faq}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={() => reorder(faq.id, 'up')}
            onMoveDown={() => reorder(faq.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < currentFAQs.length - 1}
          />
        )}
      />
      
      {/* Add button - Always visible */}
      {currentFAQs.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <HelpCircle className="w-12 h-12 text-emerald-700 mb-1" />
          <div className="text-center">
            <p className="font-semibold text-gray-900">No FAQs yet</p>
            <p className="text-sm text-gray-500">Click to add your first FAQ</p>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      )}
    </div>
  );
}

