/**
 * PublishButton - Evolving button with state transitions
 * 
 * States: ready → loading → published → update
 */

'use client';

import { Upload, Loader2, CheckCircle, RefreshCw } from 'lucide-react';

export type PublishButtonState = 'ready' | 'loading' | 'published' | 'update' | 'error';

interface PublishButtonProps {
  state: PublishButtonState;
  onClick: () => void;
  disabled?: boolean;
  hasUnpublishedChanges?: boolean;
}

export function PublishButton({ 
  state, 
  onClick, 
  disabled = false,
  hasUnpublishedChanges = false 
}: PublishButtonProps) {
  const getButtonConfig = () => {
    switch (state) {
      case 'ready':
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Publish Portfolio',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
          disabled: disabled,
        };
      
      case 'loading':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Publishing...',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
          disabled: true,
        };
      
      case 'published':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Published',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
          disabled: true,
        };
      
      case 'update':
        return {
          icon: <RefreshCw className="w-4 h-4" />,
          text: hasUnpublishedChanges ? 'Publish Changes' : 'Republish',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
          disabled: disabled,
        };
      
      case 'error':
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Retry Publishing',
          style: { background: '#ef4444', border: '2px solid #111111', color: '#ffffff' },
          disabled: disabled,
        };
      
      default:
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Publish',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
          disabled: disabled,
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={onClick}
      disabled={config.disabled}
      className={`w-full px-6 py-3 rounded-full transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2 ${
        config.disabled ? 'opacity-60 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
      }`}
      style={config.style}
    >
      {config.icon}
      {config.text}
    </button>
  );
}

/**
 * Compact version for toolbar/header
 */
interface CompactPublishButtonProps {
  state: PublishButtonState;
  onClick: () => void;
  disabled?: boolean;
}

export function CompactPublishButton({ state, onClick, disabled = false }: CompactPublishButtonProps) {
  const getButtonConfig = () => {
    switch (state) {
      case 'ready':
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Publish',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
        };
      
      case 'loading':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Publishing...',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
        };
      
      case 'published':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Published',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
        };
      
      case 'update':
        return {
          icon: <RefreshCw className="w-4 h-4" />,
          text: 'Update',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
        };
      
      default:
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Publish',
          style: { background: '#5BC64A', border: '2px solid #111111', color: '#111111' },
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={onClick}
      disabled={disabled || state === 'loading' || state === 'published'}
      className={`px-4 py-2 rounded-full transition-all text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      style={config.style}
    >
      {config.icon}
      <span className="hidden sm:inline">{config.text}</span>
    </button>
  );
}


