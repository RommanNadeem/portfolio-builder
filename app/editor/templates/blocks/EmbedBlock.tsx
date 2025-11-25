'use client';

import { FileText, Film, Link as LinkIcon, Upload, File, Video } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { EmbedBlock as EmbedBlockType } from '../types';

interface EmbedBlockProps {
  block: EmbedBlockType;
  onChange: (block: EmbedBlockType) => void;
  mode: 'edit' | 'preview';
  deviceMode?: 'desktop' | 'mobile';
}

// Auto-detect embed type from URL
function detectEmbedType(url: string): EmbedBlockType['data']['embedType'] {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('figma.com')) return 'figma';
  if (lowerUrl.includes('loom.com')) return 'loom';
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.includes('vimeo.com')) return 'vimeo';
  if (lowerUrl.endsWith('.pdf')) return 'pdf';
  if (lowerUrl.includes('drive.google.com')) return 'document';
  
  return 'other';
}

export function EmbedBlock({ block, onChange, mode }: EmbedBlockProps) {
  const { data } = block;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close fullscreen on ESC key
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle document upload
  const handleFileUpload = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF, Word, or PowerPoint files');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size should be less than 10MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (reader.result) {
        onChange({
          ...block,
          data: {
            ...data,
            url: reader.result as string,
            embedType: file.type === 'application/pdf' ? 'pdf' : 'document',
            fileName: file.name,
          },
        });
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  // Handle URL change with auto-detection
  const handleUrlChange = (url: string) => {
    const detectedType = detectEmbedType(url);
    onChange({
      ...block,
      data: {
        ...data,
        url,
        embedType: detectedType,
      },
    });
  };

  const getEmbedPreview = () => {
    if (!data.url) return null;

    // Figma embed
    if (data.embedType === 'figma' || data.url.includes('figma.com')) {
      return (
        <iframe
          src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(data.url)}`}
          className="w-full h-[600px] rounded-md border border-gray-200"
          allowFullScreen
        />
      );
    }

    // Loom embed
    if (data.embedType === 'loom' || data.url.includes('loom.com')) {
      // Extract Loom video ID
      const loomMatch = data.url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
      const embedUrl = loomMatch 
        ? `https://www.loom.com/embed/${loomMatch[1]}`
        : data.url;
      
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-md border border-gray-200"
          allowFullScreen
        />
      );
    }

    // YouTube embed
    if (data.embedType === 'youtube' || data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
      let videoId = '';
      
      if (data.url.includes('youtube.com/watch')) {
        videoId = new URL(data.url).searchParams.get('v') || '';
      } else if (data.url.includes('youtu.be/')) {
        videoId = data.url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-md border border-gray-200"
          allowFullScreen
        />
      );
    }

    // Vimeo embed
    if (data.embedType === 'vimeo' || data.url.includes('vimeo.com')) {
      const videoId = data.url.split('/').pop()?.split('?')[0];
      const embedUrl = `https://player.vimeo.com/video/${videoId}`;
      
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-md border border-gray-200"
          allowFullScreen
        />
      );
    }

    // PDF - Clean viewer without sidebar
    if (data.embedType === 'pdf' || data.url.endsWith('.pdf')) {
      // Add URL parameters to hide sidebar and toolbar
      const pdfUrl = data.url.includes('#') 
        ? data.url 
        : `${data.url}#toolbar=0&navpanes=0&view=FitH`;
      
      return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-[600px] bg-white"
          />
        </div>
      );
    }

    // Document viewer - Clean embedded view
    if (data.embedType === 'document' || data.url.includes('drive.google.com') || data.url.includes('dropbox.com')) {
      // For Google Drive, use viewer mode
      let viewerUrl = data.url;
      if (data.url.includes('drive.google.com')) {
        viewerUrl = data.url.replace('/view', '/preview');
      }
      
      return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <iframe
            src={viewerUrl}
            className="w-full h-[600px] bg-white"
          />
        </div>
      );
    }

    // Other/Generic embed - Try iframe, fallback to link
    return (
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <iframe
          src={data.url}
          className="w-full h-[600px] bg-white"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    );
  };

  if (mode === 'preview') {
    // Don't render empty blocks in preview mode
    if (!data.url || !data.url.trim()) {
      return null;
    }

    const isPDF = data.embedType === 'pdf' || data.url.endsWith('.pdf');
    const isDocument = data.embedType === 'document' || data.url.includes('drive.google.com');
    const isClickableDocument = isPDF || isDocument;

    return (
      <>
        <div>
          {data.title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{data.title}</h2>
          )}
          
          <div 
            className={isClickableDocument ? 'cursor-pointer group relative' : ''}
            onClick={(e) => {
              if (isClickableDocument) {
                e.stopPropagation();
                setIsFullscreen(true);
              }
            }}
          >
            {getEmbedPreview()}
            {isClickableDocument && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-150 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg pointer-events-none">
                  <p className="text-[12px] font-medium text-gray-900">Click to enlarge</p>
                </div>
              </div>
            )}
          </div>
          {data.caption && (
            <p className="text-center text-gray-600 mt-4">{data.caption}</p>
          )}
        </div>

        {/* Fullscreen Lightbox Modal */}
        {isFullscreen && isClickableDocument && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setIsFullscreen(false)}
          >
            <div 
              className="w-full max-w-6xl h-full bg-white rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <p className="text-[15px] font-medium text-gray-900">
                  {data.fileName || data.title || 'Document'}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="w-3 h-3" />
                    Open in new tab
                  </a>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="px-3 py-1.5 text-[12px] text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Close ✕
                  </button>
                </div>
              </div>

              {/* Full Document Viewer */}
              <iframe
                src={isPDF 
                  ? (data.url.includes('#') ? data.url : `${data.url}#toolbar=0&navpanes=0&view=FitH`)
                  : (data.url.includes('drive.google.com') ? data.url.replace('/view', '/preview') : data.url)
                }
                className="w-full h-[calc(100%-60px)] bg-white"
              />
            </div>

            {/* Click outside hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-[12px]">
              Click outside to close
            </div>
          </div>
        )}
      </>
    );
  }

  // Edit Mode - Notion-style with document upload and URL embed
  return (
    <div className="space-y-3">
      {/* Title - Optional */}
      <input
        type="text"
        value={data.title || ''}
        onChange={(e) => onChange({ ...block, data: { ...data, title: e.target.value } })}
        placeholder="Heading (optional)"
        className="w-full text-[18px] font-medium tracking-[0.2px] text-gray-900 focus-underline bg-transparent focus:outline-none placeholder-italic px-0 py-2 focus:ring-0"
      />

      {/* Embed Type Indicator */}
      {data.url && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]">
            {data.embedType === 'loom' ? 'Loom Video' :
             data.embedType === 'youtube' ? 'YouTube Video' :
             data.embedType === 'vimeo' ? 'Vimeo Video' :
             data.embedType === 'figma' ? 'Figma Design' :
             data.embedType === 'pdf' ? 'PDF Document' :
             data.embedType === 'document' ? 'Document' :
             'Embed'}
          </span>
          <button
            onClick={() => onChange({ ...block, data: { ...data, url: '', fileName: '' } })}
            className="text-[12px] text-red-500 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Embed Preview or Input */}
      {data.url ? (
        <div className="space-y-3">
          {getEmbedPreview()}
          <input
            type="text"
            value={data.caption || ''}
            onChange={(e) => onChange({ ...block, data: { ...data, caption: e.target.value } })}
            placeholder="Add caption…"
            className="w-full text-[12px] text-gray-500 text-center border-0 bg-transparent focus:outline-none placeholder-italic px-0 py-1 focus:ring-0"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px] mb-2">
              Embed URL
            </label>
            <input
              type="url"
              value={data.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste Loom, YouTube, Figma, or other URL…"
              className="w-full text-[15px] leading-7 text-gray-800 focus-underline bg-transparent focus:outline-none placeholder-italic px-0 py-2 focus:ring-0"
            />
            <p className="text-[12px] text-gray-500 mt-2">
              Supports: Loom, YouTube, Vimeo, Figma, PDF links
            </p>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[12px] text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Document Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full rounded-md px-4 py-6 text-center border border-dashed border-transparent hover:border-[rgba(0,0,0,0.12)] hover:bg-black/[0.03] transition-all duration-150"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-[12px] text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-[15px] text-gray-400 italic">Upload document</span>
                </div>
                <p className="text-[12px] text-gray-500 mt-1">
                  PDF, Word, PowerPoint up to 10MB
                </p>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

