'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const emojiCategories = {
  'Work & Skills': ['💼', '💪', '🎯', '🚀', '⚡', '🔥', '✨', '💡', '🧠', '🎨', '⚙️', '🔧'],
  'Achievement': ['🏆', '🥇', '⭐', '🌟', '💫', '🎖️', '👑', '🏅', '📊', '📈', '💯', '✅'],
  'Communication': ['💬', '📢', '🗣️', '📱', '📧', '📞', '✉️', '🔔', '📣', '💭', '🗨️', '📨'],
  'Growth & Learning': ['📚', '🎓', '📖', '✏️', '📝', '🔍', '🔬', '🧪', '🎯', '📐', '📏', '🧮'],
  'Creative': ['🎨', '🖌️', '✏️', '🖍️', '🎭', '🎬', '📷', '🎪', '🎨', '🖼️', '🎹', '🎸'],
  'Technology': ['💻', '⌨️', '🖥️', '📱', '⚙️', '🔧', '🛠️', '🔌', '💾', '🖱️', '🔑', '🔐'],
  'People & Team': ['👥', '🤝', '👫', '👬', '👭', '🫱', '🫲', '👏', '🙌', '💪', '🤜', '🤛'],
  'Innovation': ['💡', '🔮', '🧩', '🎲', '🎪', '🌈', '🔆', '✨', '💫', '⚡', '🌟', '💥'],
};

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Work & Skills');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-gray-50 border-2 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-900 ${
          value ? 'border-gray-200 text-4xl' : 'border-dashed border-gray-300 text-gray-400'
        }`}
      >
        {value ? value : <Plus className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 w-80">
          {/* Category Tabs */}
          <div className="border-b border-gray-200 p-2 overflow-x-auto">
            <div className="flex gap-1">
              {Object.keys(emojiCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Grid */}
          <div className="p-4">
            {/* Reset to default option at top */}
            {value && value !== '⭐' && (
              <div className="mb-3 pb-3 border-b border-gray-200">
                <button
                  onClick={() => {
                    onChange('⭐');
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-lg">⭐</span>
                  Reset to Default
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-6 gap-2">
              {emojiCategories[activeCategory as keyof typeof emojiCategories].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-10 h-10 text-2xl hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

