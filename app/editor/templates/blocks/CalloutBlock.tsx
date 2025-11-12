'use client';

import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { CalloutBlock as CalloutBlockType } from '../types';

interface CalloutBlockProps {
  block: CalloutBlockType;
  onChange: (block: CalloutBlockType) => void;
  mode: 'edit' | 'preview';
}

export function CalloutBlock({ block, onChange, mode }: CalloutBlockProps) {
  const { data } = block;

  const variantStyles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: Info, iconColor: 'text-blue-500' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: CheckCircle, iconColor: 'text-green-500' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', icon: AlertTriangle, iconColor: 'text-yellow-500' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: XCircle, iconColor: 'text-red-500' },
  };

  const variant = data.variant || 'info';
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  if (mode === 'preview') {
    // Don't render empty callouts in preview mode
    const hasContent = (data.title && data.title.trim()) || 
                      (data.body && data.body.trim()) || 
                      (data.quote && data.quote.trim());
    
    if (!hasContent) {
      return null;
    }

    return (
      <div className={`p-6 rounded-lg border-2 ${styles.bg} ${styles.border}`}>
        <div className="flex gap-4">
          <Icon className={`w-6 h-6 flex-shrink-0 ${styles.iconColor}`} />
          <div className="flex-1">
            {data.title && (
              <h3 className={`text-lg font-semibold ${styles.text} mb-2`}>{data.title}</h3>
            )}
            <p className={`${styles.text} whitespace-pre-wrap`}>{data.body}</p>
            
            {data.quote && (
              <blockquote className={`mt-4 pl-4 border-l-4 ${styles.border} italic`}>
                <p className={styles.text}>"{data.quote}"</p>
                {data.author && (
                  <cite className={`block mt-2 text-sm ${styles.text} not-italic`}>
                    — {data.author}
                  </cite>
                )}
              </blockquote>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode - Notion-style with light background (keeps callout visual)
  return (
    <div className={`p-6 rounded-md border-l-2 ${styles.bg} ${styles.border}`}>
      <div className="flex gap-3">
        <Icon className={`w-4 h-4 flex-shrink-0 ${styles.iconColor} mt-1`} />
        <div className="flex-1 space-y-3">
          {/* Style selector - minimal with ability to unselect */}
          <div className="flex gap-1 mb-2">
            {(['info', 'success', 'warning', 'error'] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  // Allow unselecting: clicking the same variant cycles back to 'info'
                  if (variant === v) {
                    // If clicking the current variant, cycle to next or default to 'info'
                    const variants = ['info', 'success', 'warning', 'error'] as const;
                    const currentIndex = variants.indexOf(v);
                    const nextVariant = variants[(currentIndex + 1) % variants.length];
                    onChange({ ...block, data: { ...data, variant: nextVariant } });
                  } else {
                    onChange({ ...block, data: { ...data, variant: v } });
                  }
                }}
                className={`w-5 h-5 rounded text-[10px] font-medium transition-all ${
                  variant === v
                    ? 'bg-gray-900 text-white'
                    : 'bg-white/50 text-gray-600 hover:bg-white'
                }`}
                title={variant === v ? `Click to cycle to next style` : v}
              >
                {v[0].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Title - Optional */}
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onChange({ ...block, data: { ...data, title: e.target.value } })}
            placeholder="Callout title (optional)"
            className={`w-full text-[15px] leading-7 font-medium ${styles.text} border-0 bg-transparent focus:outline-none placeholder-italic px-0 py-0 focus:ring-0`}
          />
          
          {/* Body */}
          <textarea
            value={data.body}
            onChange={(e) => onChange({ ...block, data: { ...data, body: e.target.value } })}
            placeholder="Type something…"
            rows={3}
            className={`w-full text-[15px] leading-7 ${styles.text} border-0 bg-transparent focus:outline-none placeholder-italic resize-none px-0 py-0 focus:ring-0`}
          />
        </div>
      </div>
    </div>
  );
}

