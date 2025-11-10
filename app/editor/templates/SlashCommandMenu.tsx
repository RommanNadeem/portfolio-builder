'use client';

import { useState, useEffect, useRef } from 'react';
import { Command } from 'lucide-react';
import { BlockType } from './types';

interface BlockOption {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
  keywords: string[];
}

const BLOCK_OPTIONS: BlockOption[] = [
  { 
    type: 'hero', 
    label: 'Hero', 
    icon: '🎯', 
    description: 'Main project title and introduction',
    keywords: ['hero', 'title', 'header', 'intro']
  },
  { 
    type: 'richtext', 
    label: 'Rich Text', 
    icon: '📝', 
    description: 'Long-form content and paragraphs',
    keywords: ['text', 'paragraph', 'content', 'rich', 'write']
  },
  { 
    type: 'callout', 
    label: 'Callout', 
    icon: '💡', 
    description: 'Highlighted information box',
    keywords: ['callout', 'highlight', 'note', 'info', 'important']
  },
  { 
    type: 'bullets', 
    label: 'Bullet List', 
    icon: '📋', 
    description: 'Key points and takeaways',
    keywords: ['bullets', 'list', 'points', 'items']
  },
  { 
    type: 'steps', 
    label: 'Steps', 
    icon: '🔢', 
    description: 'Sequential process or methodology',
    keywords: ['steps', 'process', 'numbered', 'sequence', 'workflow']
  },
  { 
    type: 'feature_grid', 
    label: 'Feature Grid', 
    icon: '⚡', 
    description: 'Grid of features or highlights',
    keywords: ['grid', 'features', 'highlights', 'icons']
  },
  { 
    type: 'gallery', 
    label: 'Gallery', 
    icon: '🖼️', 
    description: 'Image grid or carousel',
    keywords: ['gallery', 'images', 'photos', 'carousel', 'pictures']
  },
  { 
    type: 'metrics', 
    label: 'Metrics', 
    icon: '📊', 
    description: 'Key numbers and statistics',
    keywords: ['metrics', 'stats', 'numbers', 'data', 'results']
  },
  { 
    type: 'embed', 
    label: 'Embed', 
    icon: '🎬', 
    description: 'Videos, Figma, or PDFs',
    keywords: ['embed', 'video', 'figma', 'pdf', 'iframe']
  },
];

interface SlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (blockType: BlockType) => void;
  position?: { top: number; left: number };
  searchQuery?: string;
}

export function SlashCommandMenu({ 
  isOpen, 
  onClose, 
  onSelect, 
  position,
  searchQuery = ''
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState(searchQuery);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter blocks based on query
  const filteredBlocks = BLOCK_OPTIONS.filter(block => {
    const search = query.toLowerCase();
    return (
      block.label.toLowerCase().includes(search) ||
      block.description.toLowerCase().includes(search) ||
      block.keywords.some(keyword => keyword.includes(search))
    );
  });

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredBlocks.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredBlocks.length) % filteredBlocks.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredBlocks[selectedIndex]) {
          onSelect(filteredBlocks[selectedIndex].type);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredBlocks, selectedIndex, onSelect, onClose]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      style={{
        top: position?.top ?? '50%',
        left: position?.left ?? '50%',
        transform: position ? undefined : 'translate(-50%, -50%)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Command className="w-3 h-3" />
          <span className="font-medium">Insert Block</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3 py-2 border-b border-gray-200">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blocks..."
          className="w-full px-2 py-1.5 text-sm border-0 bg-transparent focus:outline-none placeholder:text-gray-400"
          autoFocus
        />
      </div>

      {/* Block List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredBlocks.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No blocks found
          </div>
        ) : (
          filteredBlocks.map((block, index) => (
            <button
              key={block.type}
              onClick={() => {
                onSelect(block.type);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                selectedIndex === index
                  ? 'bg-purple-50 border-l-2 border-purple-600'
                  : 'hover:bg-gray-50 border-l-2 border-transparent'
              }`}
            >
              <span className="text-xl flex-shrink-0">{block.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-0.5">
                  {block.label}
                </div>
                <div className="text-xs text-gray-600 line-clamp-1">
                  {block.description}
                </div>
              </div>
              {selectedIndex === index && (
                <div className="text-xs text-gray-400 flex-shrink-0">
                  ↵
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}

