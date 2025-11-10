'use client';

import { X } from 'lucide-react';
import { BLOCK_TYPE_OPTIONS } from './shared-utils';

interface BlockSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (blockType: string) => void;
  title?: string;
  description?: string;
}

export function BlockSelector({ 
  isOpen, 
  onClose, 
  onSelectBlock,
  title = 'Add a Section',
  description = 'Choose a block type to add:'
}: BlockSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          {BLOCK_TYPE_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => onSelectBlock(option.type)}
              className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-1">{option.label}</h4>
              <p className="text-xs text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

