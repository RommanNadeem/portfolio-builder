'use client';

/**
 * Template Selector - Square Grid with AI First
 * 
 * Modern square grid layout with Lucide icons
 * AI-Designed as first option
 */

import { Sparkles, Rocket, Palette, Code, Lightbulb, TrendingUp, Microscope, Zap, FileText } from 'lucide-react';
import { TEMPLATE_CONFIGS } from './configs';
import { TemplateType } from './types';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType | null;
  onSelectTemplate: (templateType: TemplateType | 'ai') => void;
}

// Icon mapping for templates
const TEMPLATE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'product-case-study': Rocket,
  'product-design-case-study': Palette,
  'engineering-technical': Code,
  'creative-branding': Zap,
  'digital-marketing': TrendingUp,
  'user-research': Microscope,
  'startup-side-project': Lightbulb,
  'blank': FileText,
};

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Case Study Template
        </h2>
        <p className="text-gray-600">
          Select a template or let AI design the perfect structure
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* AI-Designed Card (First Position - Special) */}
        <button
          onClick={() => onSelectTemplate('ai')}
          className="group relative aspect-square rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-6 flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl hover:scale-105"
        >
          <div className="absolute top-3 right-3">
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
              Recommended
            </span>
          </div>
          
          <Sparkles className="w-16 h-16 text-white mb-4" />
          
          <h3 className="text-white font-semibold text-lg mb-2">
            AI-Designed
          </h3>
          
          <p className="text-white/90 text-sm">
            Let AI create the perfect structure
          </p>
        </button>

        {/* Regular Template Cards */}
        {TEMPLATE_CONFIGS.filter(t => t.id !== 'blank').map((template) => {
          const Icon = TEMPLATE_ICONS[template.id] || FileText;
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`
                group relative aspect-square rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all
                ${isSelected
                  ? 'bg-purple-50 border-2 border-purple-500 shadow-lg'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-102'
                }
              `}
            >
              <Icon className={`w-16 h-16 mb-4 ${
                isSelected ? 'text-purple-600' : 'text-gray-600 group-hover:text-gray-900'
              }`} />
              
              <h3 className={`font-semibold text-base mb-2 ${
                isSelected ? 'text-purple-900' : 'text-gray-900'
              }`}>
                {template.name.replace(' Case Study', '').replace(' Project', '')}
              </h3>
              
              {/* Show description on hover */}
              <div className="absolute inset-0 bg-gray-900/95 rounded-2xl p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}

        {/* Blank Template (Last Position) */}
        {(() => {
          const blankTemplate = TEMPLATE_CONFIGS.find(t => t.id === 'blank');
          if (!blankTemplate) return null;

          const isSelected = selectedTemplate === 'blank';

          return (
            <button
              key="blank"
              onClick={() => onSelectTemplate('blank')}
              className={`
                group relative aspect-square rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all
                ${isSelected
                  ? 'bg-purple-50 border-2 border-purple-500 shadow-lg'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-102'
                }
              `}
            >
              <FileText className={`w-16 h-16 mb-4 ${
                isSelected ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              
              <h3 className={`font-semibold text-base mb-2 ${
                isSelected ? 'text-purple-900' : 'text-gray-900'
              }`}>
                Blank Canvas
              </h3>

              <div className="absolute inset-0 bg-gray-900/95 rounded-2xl p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">
                  {blankTemplate.description}
                </p>
              </div>
            </button>
          );
        })()}
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Try <span className="font-medium text-purple-600">AI-Designed</span> for best results - it adapts to your content
        </p>
      </div>
    </div>
  );
}
