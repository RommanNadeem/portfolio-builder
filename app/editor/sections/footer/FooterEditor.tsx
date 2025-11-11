'use client';

import { FooterData } from './types';

interface FooterEditorProps {
  data: FooterData;
  fullName: string;
  onChange: (updates: Partial<FooterData>) => void;
  isExpanded: boolean;
}

export function FooterEditor({ data, fullName, onChange, isExpanded }: FooterEditorProps) {
  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {data.footerText || 'Default footer'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Footer Call-to-Action */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Call-to-Action Text</label>
        <input
          type="text"
          value={data.footerText || "Let's build something meaningful."}
          onChange={(e) => onChange({ footerText: e.target.value })}
          placeholder="Let's build something amazing together."
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-600"
        />
        <p className="mt-1 text-xs text-gray-500">Main CTA text in footer</p>
      </div>

      {/* Footer Signature */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Footer Signature</label>
        <input
          type="text"
          value={data.footerSignature || `Built with 🤍 by ${fullName || 'You'}`}
          onChange={(e) => onChange({ footerSignature: e.target.value })}
          placeholder={`Built with 🤍 by ${fullName}`}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-600"
        />
        <p className="mt-1 text-xs text-gray-500">Small text shown at bottom</p>
      </div>
    </div>
  );
}

