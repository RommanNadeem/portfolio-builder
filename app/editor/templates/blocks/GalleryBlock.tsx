'use client';

import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { GalleryBlock as GalleryBlockType } from '../types';
import { GalleryPlaceholder } from './ImagePlaceholder';

interface GalleryBlockProps {
  block: GalleryBlockType;
  onChange: (block: GalleryBlockType) => void;
  mode: 'edit' | 'preview';
  deviceMode?: 'desktop' | 'mobile';
}

export function GalleryBlock({ block, onChange, mode, deviceMode }: GalleryBlockProps) {
  const { data } = block;
  const [currentIndex, setCurrentIndex] = useState(0);

  const addImage = () => {
    onChange({
      ...block,
      data: { ...data, images: [...data.images, { url: '', caption: '' }] },
    });
  };

  const updateImage = (index: number, field: 'url' | 'caption', value: string) => {
    const newImages = [...data.images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange({ ...block, data: { ...data, images: newImages } });
  };

  const removeImage = (index: number) => {
    if (data.images.length <= 1) return;
    const newImages = data.images.filter((_, i) => i !== index);
    onChange({ ...block, data: { ...data, images: newImages } });
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % data.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + data.images.length) % data.images.length);
  };

  if (mode === 'preview') {
    const layout = data.layout || 'grid';
    const validImages = data.images.filter(img => img.url);

    // Don't render empty blocks in preview mode
    if (validImages.length === 0) {
      return null;
    }

    const gridColsClass =
      deviceMode === 'mobile'
        ? 'grid-cols-2'
        : 'grid-cols-2 md:grid-cols-3';

    return (
      <div>
        {data.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{data.title}</h2>
        )}
        
        {layout === 'carousel' ? (
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <img 
                src={validImages[currentIndex].url} 
                alt={validImages[currentIndex].caption || ''} 
                className="w-full h-full object-cover"
              />
            </div>
            {validImages[currentIndex].caption && (
              <p className="text-center text-gray-600 mt-4">{validImages[currentIndex].caption}</p>
            )}
            
            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                <div className="flex justify-center gap-2 mt-4">
                  {validImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-blue-500 w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={`grid ${gridColsClass} gap-4`}>
            {validImages.map((image, index) => (
              <div key={index} className="group relative aspect-square">
                <img 
                  src={image.url} 
                  alt={image.caption || ''} 
                  className="w-full h-full object-cover rounded-lg"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-4">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Edit Mode - Notion-style document with exact typography spec
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

      {/* Layout Selector - minimal */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => onChange({ ...block, data: { ...data, layout: 'grid' } })}
          className={`px-2 py-1 text-[12px] font-medium rounded transition-all ${
            (data.layout || 'grid') === 'grid'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => onChange({ ...block, data: { ...data, layout: 'carousel' } })}
          className={`px-2 py-1 text-[12px] font-medium rounded transition-all ${
            data.layout === 'carousel'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Carousel
        </button>
      </div>

      {/* Gallery with Image Placeholders */}
      <div className="mt-6">
        <GalleryPlaceholder
          images={data.images}
          onAddImage={addImage}
          onRemoveImage={removeImage}
          onUpdateImage={(index, url) => updateImage(index, 'url', url)}
        />
      </div>
    </div>
  );
}

