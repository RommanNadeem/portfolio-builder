'use client';

import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import MonthYearPicker from '@/app/editor/components/MonthYearPicker';
import { HeroBlock as HeroBlockType } from '../types';
import { SmartSuggestions } from './BlockSuggestions';
import { ImagePlaceholder, LogoPlaceholder } from './ImagePlaceholder';

interface HeroBlockProps {
  block: HeroBlockType;
  onChange: (block: HeroBlockType) => void;
  mode: 'edit' | 'preview';
  deviceMode?: 'desktop' | 'mobile';
  entityType?: 'project' | 'career'; // Optional entity type for context
  onSave?: () => Promise<void>; // Force immediate save (for image uploads)
  onTitleChange?: (newTitle: string) => void; // For real-time navigation bar update
}

export function HeroBlock({ block, onChange, mode, entityType, onSave, onTitleChange }: HeroBlockProps) {
  const { data } = block;
  const isEmpty = !data.title || data.title.trim().length === 0;
  const [uploadingImage, setUploadingImage] = useState(false);
  const isCareerTemplate = entityType === 'career';
  
  // For career templates, display role from meta in preview
  const displaySubtitle = isCareerTemplate ? (data.meta?.role || data.subtitle) : data.subtitle;

  const handleApplySuggestion = (field: string, value: string) => {
    if (field === 'role') {
      onChange({ ...block, data: { ...data, meta: { ...data.meta, role: value } } });
    } else {
      onChange({ ...block, data: { ...data, [field]: value } });
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    
    try {
      console.log('[HeroBlock] 📤 Uploading hero image');
      
      // Import upload utilities (same as thumbnail upload)
      const { uploadProjectImage, imageToDataUrl } = await import('@/lib/image-upload');
      const { getCurrentUser } = await import('@/lib/supabase');
      
      // Get current user
      const user = await getCurrentUser();
      
      if (user) {
        // Upload to Supabase Storage (same bucket as thumbnails)
        const result = await uploadProjectImage({
          file,
          userId: user.id,
          projectId: block.id,
          folder: 'hero-images'  // Store in hero-images subfolder
        });
        
        if (result.url) {
          console.log('[HeroBlock] ✅ Uploaded to Supabase:', result.url);
          
          const updatedBlock = { ...block, data: { ...data, imageUrl: result.url } };
          console.log('[HeroBlock] 🔄 Setting imageUrl in block:', {
            blockId: block.id,
            oldImageUrl: data.imageUrl,
            newImageUrl: result.url,
          });
          
          onChange(updatedBlock);
          
          // 🔥 Force immediate save to persist image URL
          if (onSave) {
            console.log('[HeroBlock] 💾 Triggering immediate save for image in 1 second...');
            setTimeout(async () => {
              console.log('[HeroBlock] 💾 Calling onSave now...');
              await onSave();
              console.log('[HeroBlock] ✅ Image save completed');
            }, 1000); // Increased delay to ensure state propagates
          } else {
            console.warn('[HeroBlock] ⚠️ No onSave function provided, relying on auto-save');
          }
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } else {
        // Fallback to data URL if not logged in
        console.log('[HeroBlock] ⚠️ No user, using data URL fallback');
        const dataUrl = await imageToDataUrl(file);
        onChange({ ...block, data: { ...data, imageUrl: dataUrl } });
      }
      
      setUploadingImage(false);
      
    } catch (error) {
      console.error('[HeroBlock] ❌ Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setUploadingImage(false);
    }
  };

  if (mode === 'preview') {
    return (
      <div className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-20 px-8">
        {data.imageUrl && (
          <div className="absolute inset-0 opacity-10">
            <img src={data.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="relative max-w-4xl mx-auto text-center">
          {data.logoUrl && (
            <img src={data.logoUrl} alt="Logo" className="h-16 mx-auto mb-6" />
          )}
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {data.title || (isCareerTemplate ? 'Company Name' : 'Untitled Project')}
          </h1>
          
          {displaySubtitle && (
            <p className="text-2xl text-gray-600 mb-6">{displaySubtitle}</p>
          )}
          
          {data.description && (
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">{data.description}</p>
          )}
          
          {/* Meta Information */}
          {data.meta && Object.keys(data.meta).length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              {/* Career Template: Show timeline and website */}
              {isCareerTemplate && (data.meta as any).startDate && (
                <span>📅 {(data.meta as any).startDate} - {(data.meta as any).currentlyWorking ? 'Present' : ((data.meta as any).endDate || 'Present')}</span>
              )}
              {isCareerTemplate && (data.meta as any).Website && (
                <a
                  href={(data.meta as any).Website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <span>🌐</span>
                  <span className="font-medium">Visit Website</span>
                </a>
              )}
              
              {/* Project Template fields */}
              {!isCareerTemplate && data.meta.projectYear && <span>📅 {data.meta.projectYear}</span>}
              {!isCareerTemplate && data.meta.year && <span>📅 {data.meta.year}</span>}
              {!isCareerTemplate && data.meta.team && <span>👥 {data.meta.team}</span>}
              {!isCareerTemplate && data.meta.timeline && <span>⏱️ {data.meta.timeline}</span>}
              {!isCareerTemplate && data.meta.role && <span>🎯 {data.meta.role}</span>}
              {!isCareerTemplate && data.meta.channels && data.meta.channels.length > 0 && (
                <div className="flex gap-2">
                  {data.meta.channels.map((channel, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {channel}
                    </span>
                  ))}
                </div>
              )}
              {!isCareerTemplate && data.meta.stackTags && data.meta.stackTags.length > 0 && (
                <div className="flex gap-2">
                  {data.meta.stackTags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit Mode - Notion-style document with exact typography spec
  return (
    <div className="space-y-6">
      {/* Title - h1 per spec: text-[40px] leading-tight font-semibold tracking-[0.2px] */}
      <input
        type="text"
        value={data.title}
        onChange={(e) => {
          const newTitle = e.target.value;
          onChange({ ...block, data: { ...data, title: newTitle } });
          // Update navigation bar in real-time for projects only
          if (!isCareerTemplate && onTitleChange) {
            onTitleChange(newTitle);
          }
        }}
        placeholder={isCareerTemplate ? "Company Name" : "Untitled"}
        className="w-full text-[40px] leading-tight font-semibold tracking-[0.2px] text-gray-900 border-0 bg-transparent focus:outline-none placeholder-italic px-0 py-0 focus:ring-0"
      />

      {/* Subtitle - Only for Project Templates */}
      {!isCareerTemplate && (
        <input
          type="text"
          value={data.subtitle || ''}
          onChange={(e) => {
            const newValue = e.target.value;
            console.log('[HeroBlock] Subtitle changed:', newValue);
            onChange({ ...block, data: { ...data, subtitle: newValue } });
          }}
          placeholder="Add a subtitle…"
          className="w-full text-[15px] leading-7 text-gray-800 focus-underline bg-transparent focus:outline-none placeholder-italic px-0 py-2 focus:ring-0"
        />
      )}

      {/* Description */}
      <textarea
        value={data.description || ''}
        onChange={(e) => onChange({ ...block, data: { ...data, description: e.target.value } })}
        placeholder="Add a description…"
        rows={2}
        className="w-full text-[15px] leading-7 text-gray-800 focus-underline bg-transparent focus:outline-none placeholder-italic resize-none px-0 py-2 focus:ring-0"
      />

      {/* Company Website - Only for Career Templates */}
      {isCareerTemplate && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Website
          </label>
          <input
            type="url"
            value={(data.meta as any)?.Website || ''}
            onChange={(e) => {
              const newWebsite = e.target.value;
              console.log('[HeroBlock] Website field changed:', {
                oldValue: (data.meta as any)?.Website,
                newValue: newWebsite,
                fullMeta: { ...data.meta, Website: newWebsite }
              });
              onChange({ 
                ...block, 
                data: { 
                  ...data, 
                  meta: { ...data.meta, Website: newWebsite } as any
                } 
              });
            }}
            placeholder="https://company.com"
            className="w-full text-[15px] leading-7 text-gray-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Hero Image - Only for Project Templates */}
      {!isCareerTemplate && (
        <div className="mt-8">
        {uploadingImage ? (
          <div className="w-full h-80 rounded-lg border-2 border-purple-300 bg-purple-50 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-purple-600 font-medium">Uploading image...</span>
          </div>
        ) : data.imageUrl ? (
          <div className="relative group">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img 
                src={data.imageUrl} 
                alt="Hero image" 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onChange({ ...block, data: { ...data, imageUrl: '' } })}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="w-full h-80 rounded-lg border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center gap-3 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer group">
            <Upload className="w-10 h-10 text-gray-400 group-hover:text-purple-600 transition-colors" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP up to 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              className="hidden"
            />
          </label>
        )}
        </div>
      )}

      {/* Meta Information - meta/labels per spec */}
      {isCareerTemplate ? (
        // Career Template: Timeline with Month/Year Pickers
        <div className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role / Position
            </label>
            <input
              type="text"
              value={data.meta?.role || ''}
              onChange={(e) => onChange({ ...block, data: { ...data, meta: { ...data.meta, role: e.target.value } } })}
              placeholder="e.g., Senior Product Manager"
              className="w-full text-[15px] leading-7 text-gray-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <MonthYearPicker
                  value={(data.meta as any)?.startDate || ''}
                  onChange={(value) => onChange({ ...block, data: { ...data, meta: { ...data.meta, startDate: value } as any } })}
                  placeholder="Start date"
                />
              </div>
              <span className="text-gray-400">—</span>
              <div className="flex-1">
                <MonthYearPicker
                  value={(data.meta as any)?.endDate || ''}
                  onChange={(value) => onChange({ ...block, data: { ...data, meta: { ...data.meta, endDate: value, currentlyWorking: false } as any } })}
                  placeholder="End date or Present"
                  disabled={(data.meta as any)?.currentlyWorking}
                />
              </div>
            </div>
            
            {/* Currently Working Here Checkbox */}
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(data.meta as any)?.currentlyWorking || false}
                  onChange={(e) => {
                    const isCurrentlyWorking = e.target.checked;
                    onChange({ 
                      ...block, 
                      data: { 
                        ...data, 
                        meta: { 
                          ...data.meta, 
                          currentlyWorking: isCurrentlyWorking,
                          endDate: isCurrentlyWorking ? 'Present' : (data.meta as any)?.endDate || ''
                        } as any
                      } 
                    });
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Currently working here</span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        // Project Template: Original inline metadata fields
        <div className="flex flex-wrap gap-3 text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px] pt-6">
          <input
            type="text"
            value={data.meta?.role || ''}
            onChange={(e) => onChange({ ...block, data: { ...data, meta: { ...data.meta, role: e.target.value } } })}
            placeholder="YOUR ROLE"
            className="border-0 border-b border-transparent hover:border-gray-200 focus:border-gray-900 bg-transparent focus:outline-none px-0 py-1 text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px] placeholder:text-gray-400 placeholder:not-italic transition-[border-color] duration-150 focus:ring-0"
          />
          <span className="text-gray-300">•</span>
          <input
            type="text"
            value={data.meta?.timeline || ''}
            onChange={(e) => onChange({ ...block, data: { ...data, meta: { ...data.meta, timeline: e.target.value } } })}
            placeholder="TIMELINE"
            className="border-0 border-b border-transparent hover:border-gray-200 focus:border-gray-900 bg-transparent focus:outline-none px-0 py-1 text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px] placeholder:text-gray-400 placeholder:not-italic transition-[border-color] duration-150 focus:ring-0"
          />
          <span className="text-gray-300">•</span>
          <input
            type="text"
            value={data.meta?.year || ''}
            onChange={(e) => onChange({ ...block, data: { ...data, meta: { ...data.meta, year: e.target.value } } })}
            placeholder="YEAR"
            className="border-0 border-b border-transparent hover:border-gray-200 focus:border-gray-900 bg-transparent focus:outline-none px-0 py-1 text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px] placeholder:text-gray-400 placeholder:not-italic transition-[border-color] duration-150 focus:ring-0"
          />
        </div>
      )}
    </div>
  );
}

