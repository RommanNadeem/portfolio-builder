'use client';

import { Eye, Link2 } from 'lucide-react';

interface NavigationEditorProps {
  isExpanded: boolean;
  data: any;
  onChange: (updater: (prev: any) => any) => void;
}

export function NavigationEditor({ isExpanded, data, onChange }: NavigationEditorProps) {
  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        Navigation bar at top
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs font-medium text-blue-900">
          ℹ️ The navigation bar appears at the top of your portfolio and links to different sections.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700">Navigation Items</label>
        <div className="space-y-1.5">
          {['Overview', 'Experience', 'Projects', 'Strengths', 'Testimonials'].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          These sections are automatically linked based on your content
        </p>
      </div>

      <div className="space-y-2 pt-3 border-t border-gray-200">
        <label className="block text-xs font-semibold text-gray-700">
          Get in Touch CTA
        </label>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">URL (optional)</label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={data?.navigation?.ctaUrl || ''}
                onChange={(e) => onChange((prev) => ({
                  ...prev,
                  navigation: {
                    ...prev.navigation,
                    ctaUrl: e.target.value
                  }
                }))}
                placeholder="https://calendly.com/your-link or mailto:your@email.com"
                className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add a custom link (e.g., Calendly, contact form, email). Leave empty to scroll to overview section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

