'use client';

import { Check, Plus, Search, Clock, TrendingUp, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { TEMPLATE_CONFIGS } from './configs';
import { TemplateType } from './types';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType | null;
  onSelectTemplate: (templateType: TemplateType) => void;
}

const COLOR_STYLES: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
  gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', hoverBg: 'hover:bg-gray-100' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hoverBg: 'hover:bg-blue-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hoverBg: 'hover:bg-purple-100' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', hoverBg: 'hover:bg-pink-100' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hoverBg: 'hover:bg-green-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hoverBg: 'hover:bg-indigo-100' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', hoverBg: 'hover:bg-slate-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hoverBg: 'hover:bg-amber-100' },
};

const DIFFICULTY_COLORS = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-yellow-100 text-yellow-700',
  'Advanced': 'bg-red-100 text-red-700',
};

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'name'>('popular');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(TEMPLATE_CONFIGS.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = TEMPLATE_CONFIGS.filter(template => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort
    if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
          Choose Template
        </h2>
        <p className="text-xs text-gray-500">
          Select a template to get started or start from scratch
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates... (e.g., 'design case study')"
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="mb-4 flex items-center gap-2 text-xs">
        <span className="text-gray-600">Sort by:</span>
        <button
          onClick={() => setSortBy('popular')}
          className={`px-2 py-1 rounded ${sortBy === 'popular' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Popular
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setSortBy('name')}
          className={`px-2 py-1 rounded ${sortBy === 'name' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Name
        </button>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="mb-3 text-xs text-gray-600">
          Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
        </div>
      )}

      <div className="space-y-2">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm font-medium mb-1">No templates found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const colors = COLOR_STYLES[template.color] || COLOR_STYLES.gray;

            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${colors.bg} ${colors.border} ring-2 ring-offset-2 ring-${template.color}-500`
                    : `bg-white border-gray-200 ${colors.hoverBg} hover:-translate-y-0.5 hover:shadow-md`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{template.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`font-semibold text-sm ${isSelected ? colors.text : 'text-gray-900'}`}>
                        {template.name}
                      </h3>
                      {isSelected && (
                        <Check className={`w-4 h-4 ${colors.text}`} />
                      )}
                      {/* Difficulty Badge */}
                      {template.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[template.difficulty]}`}>
                          {template.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {template.description}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      {template.estimatedTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.estimatedTime}
                        </span>
                      )}
                      {template.usageCount && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {template.usageCount.toLocaleString()} uses
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {template.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sections Preview */}
                    {template.sections.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {template.sections.slice(0, 3).map((section) => (
                          <span
                            key={section.id}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isSelected ? colors.bg : 'bg-gray-100'
                            } ${colors.text}`}
                          >
                            {section.label}
                          </span>
                        ))}
                        {template.sections.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{template.sections.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2 font-medium">
            ✨ Template Selected!
          </p>
          <p className="text-xs text-blue-700">
            Your template sections will appear below. Fill in each section to build your project.
          </p>
        </div>
      )}
    </div>
  );
}

