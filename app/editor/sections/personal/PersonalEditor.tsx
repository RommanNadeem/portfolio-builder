'use client';

import { User, Upload, X } from 'lucide-react';
import { PersonalData } from './types';

interface PersonalEditorProps {
  data: PersonalData;
  onChange: (updates: Partial<PersonalData>) => void;
  isExpanded: boolean;
}

export function PersonalEditor({ data, onChange, isExpanded }: PersonalEditorProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ profileImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange({ profileImage: null });
  };

  if (!isExpanded) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
            {data.profileImage ? (
              <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{data.heading || 'No heading set'}</p>
            {data.profileImage && <p className="text-xs text-gray-500">Photo uploaded</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Image */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Profile Image</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
            {data.profileImage ? (
              <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            {data.profileImage ? (
              <button
                onClick={handleRemoveImage}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Main Heading (Replaces Full Name) */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Main Heading</label>
        <input
          type="text"
          value={data.heading || ''}
          onChange={(e) => onChange({ heading: e.target.value })}
          placeholder="Hi, I'm Sarah — Product Designer crafting delightful experiences"
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500">This will be your main headline with gradient effect</p>
      </div>

      {/* Tagline (Callout) */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Tagline / Value Proposition</label>
        <textarea
          value={data.tagline || ''}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="I help startups turn 0 → 1 ideas into products that users love, combining design thinking with technical execution."
          rows={2}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none placeholder:text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500">Your value proposition — appears with purple-blue gradient line</p>
      </div>

      {/* About / Who Are You */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">About You (Optional)</label>
        <textarea
          value={data.whoAreYou || ''}
          onChange={(e) => onChange({ whoAreYou: e.target.value })}
          placeholder="Share more about your background, what drives you, or what makes you unique. This appears below your tagline as additional context."
          rows={3}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}

