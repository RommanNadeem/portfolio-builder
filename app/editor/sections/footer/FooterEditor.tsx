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
        <p className="mt-1 text-xs text-gray-500">
          Headline for footer CTA. Button uses navigation CTA URL or your email by default.
        </p>
      </div>

      {/* Footer Signature - Hardcoded */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Footer Signature
          <span className="ml-2 text-xs font-normal text-gray-500">(Powered by BuildSpace)</span>
        </label>
        <div className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
          Join thousands building their story on <span className="text-gray-700 font-medium">BuildSpace</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          This attribution helps us grow and keep BuildSpace free for everyone 🚀
        </p>
      </div>
    </div>
  );
}

