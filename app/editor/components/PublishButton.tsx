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
          className: 'bg-green-600 hover:bg-green-700 text-white',
          disabled: disabled,
        };
      
      case 'loading':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Publishing...',
          className: 'bg-blue-600 text-white cursor-wait',
          disabled: true,
        };
      
      case 'published':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Published',
          className: 'bg-green-600 text-white',
          disabled: true,
        };
      
      case 'update':
        return {
          icon: <RefreshCw className="w-4 h-4" />,
          text: hasUnpublishedChanges ? 'Publish Changes' : 'Republish',
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
          disabled: disabled,
        };
      
      case 'error':
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Retry Publishing',
          className: 'bg-red-600 hover:bg-red-700 text-white',
          disabled: disabled,
        };
      
      default:
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Publish',
          className: 'bg-gray-600 hover:bg-gray-700 text-white',
          disabled: disabled,
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={onClick}
      disabled={config.disabled}
      className={`w-full px-6 py-3 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2 ${
        config.className
      } ${config.disabled ? 'opacity-60 cursor-not-allowed' : 'shadow-sm hover:shadow-md'}`}
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
          className: 'bg-green-600 hover:bg-green-700 text-white',
        };
      
      case 'loading':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Publishing...',
          className: 'bg-blue-600 text-white cursor-wait',
        };
      
      case 'published':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Published',
          className: 'bg-green-600 text-white',
        };
      
      case 'update':
        return {
          icon: <RefreshCw className="w-4 h-4" />,
          text: 'Update',
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      
      default:
        return {
          icon: <Upload className="w-4 h-4" />,
          text: 'Publish',
          className: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={onClick}
      disabled={disabled || state === 'loading' || state === 'published'}
      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
        config.className
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {config.icon}
      <span className="hidden sm:inline">{config.text}</span>
    </button>
  );
}


