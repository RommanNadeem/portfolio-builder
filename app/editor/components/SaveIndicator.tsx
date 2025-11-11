'use client';

import { Check, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
  isDirty: boolean;
  isSaving: boolean;
}

export function SaveIndicator({ isDirty, isSaving }: SaveIndicatorProps) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (isDirty) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700">
        <div className="w-2 h-2 rounded-full bg-orange-500" />
        <span>Unsaved</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
      <Check className="w-3 h-3" />
      <span>Saved</span>
    </div>
  );
}

