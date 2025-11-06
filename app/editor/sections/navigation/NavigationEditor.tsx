'use client';

import { Eye } from 'lucide-react';

interface NavigationEditorProps {
  isExpanded: boolean;
}

export function NavigationEditor({ isExpanded }: NavigationEditorProps) {
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
    </div>
  );
}

