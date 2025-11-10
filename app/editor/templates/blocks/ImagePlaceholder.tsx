'use client';

import { Upload, Image as ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImagePlaceholderProps {
  onImageUrlChange?: (url: string) => void;
  imageUrl?: string;
  height?: string;
  label?: string;
}

export function ImagePlaceholder({ 
  onImageUrlChange, 
  imageUrl, 
  height = 'h-64',
  label = 'Add image'
}: ImagePlaceholderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Convert file to base64
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (onImageUrlChange && reader.result) {
        onImageUrlChange(reader.result as string);
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (imageUrl) {
    return (
      <div className="relative group">
        <img 
          src={imageUrl} 
          alt={label} 
          className={`w-full ${height} object-cover rounded-lg`}
        />
        {onImageUrlChange && (
          <button
            onClick={() => onImageUrlChange('')}
            className="absolute top-2 right-2 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`w-full rounded-md px-4 py-6 text-center cursor-pointer transition-all duration-150 ${
        isDragging 
          ? 'border border-dashed border-[rgba(0,0,0,0.12)] bg-black/[0.03]' 
          : 'border border-dashed border-transparent hover:border-[rgba(0,0,0,0.12)] hover:bg-black/[0.03]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {isUploading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[12px] text-gray-500">Uploading...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-2 pointer-events-none">
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="text-[15px] text-gray-400 italic">
              {isDragging ? 'Drop image here' : label}
            </span>
          </div>
          <p className="text-[12px] text-gray-500 mt-1 pointer-events-none">
            PNG, JPG up to 5MB
          </p>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

// Gallery placeholder for multiple images
interface GalleryPlaceholderProps {
  images: { url: string; caption?: string }[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onUpdateImage: (index: number, url: string) => void;
}

export function GalleryPlaceholder({ 
  images, 
  onAddImage, 
  onRemoveImage,
  onUpdateImage 
}: GalleryPlaceholderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (index: number, file: File) => {
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
      if (reader.result) {
        onUpdateImage(index, reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddFromComputer = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onAddImage(); // Create new empty slot
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            // Update the last image (newly added)
            onUpdateImage(images.length, reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              {image.url ? (
                <>
                  <img 
                    src={image.url} 
                    alt={`Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div 
                  className="w-full h-48 rounded-md border border-dashed border-transparent hover:border-[rgba(0,0,0,0.12)] hover:bg-black/[0.03] flex items-center justify-center cursor-pointer transition-all duration-150"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(index, file);
                    };
                    input.click();
                  }}
                >
                  <div className="text-center">
                    <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-[15px] text-gray-400 italic">Click to upload</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Image Button - Minimal text-only */}
      <button
        onClick={handleAddFromComputer}
        className="w-full rounded-md px-4 py-6 text-center border border-dashed border-transparent hover:border-[rgba(0,0,0,0.12)] hover:bg-black/[0.03] transition-all duration-150"
      >
        <div className="flex items-center justify-center gap-2">
          <Upload className="w-4 h-4 text-gray-400" />
          <span className="text-[15px] text-gray-400 italic">Add image</span>
        </div>
        <p className="text-[12px] text-gray-500 mt-1">Click or drag & drop</p>
      </button>
    </div>
  );
}

// Logo placeholder (smaller, square)
export function LogoPlaceholder({ 
  onLogoUrlChange, 
  logoUrl 
}: { 
  onLogoUrlChange: (url: string) => void;
  logoUrl?: string;
}) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for logos
      alert('Logo size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        onLogoUrlChange(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  if (logoUrl) {
    return (
      <div className="relative group inline-block">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="h-16 w-auto rounded-lg"
        />
        <button
          onClick={() => onLogoUrlChange('')}
          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <button 
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 border border-dashed border-transparent hover:border-[rgba(0,0,0,0.12)] hover:bg-black/[0.03] transition-all duration-150"
      onClick={() => logoInputRef.current?.click()}
    >
      <ImageIcon className="w-4 h-4 text-gray-400" />
      <span className="text-[15px] text-gray-400 italic">Add logo</span>
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleLogoUpload(file);
        }}
        className="hidden"
      />
    </button>
  );
}

