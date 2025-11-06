'use client';

import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onSave: (croppedImage: string) => void;
  onCancel: () => void;
}

export function ImageCropper({ imageUrl, onSave, onCancel }: ImageCropperProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      // Center image initially
      if (containerRef.current) {
        const containerSize = 192; // 48 * 4 (w-48)
        const scale = Math.max(containerSize / img.width, containerSize / img.height);
        setScale(scale * 1.2); // Slightly larger for better initial view
      }
    };
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleSave = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400; // High quality output
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Calculate image position and size
    const containerSize = 192;
    const scaleFactor = size / containerSize;
    const imgWidth = imageRef.current.width * scale * scaleFactor;
    const imgHeight = imageRef.current.height * scale * scaleFactor;
    const imgX = (size / 2) - (imgWidth / 2) + (position.x * scaleFactor);
    const imgY = (size / 2) - (imgHeight / 2) + (position.y * scaleFactor);

    // Draw image
    ctx.drawImage(imageRef.current, imgX, imgY, imgWidth, imgHeight);

    // Convert to base64
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    onSave(croppedImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-black mb-4">Adjust Your Photo</h3>
        
        {/* Cropper Area */}
        <div 
          ref={containerRef}
          className="relative w-48 h-48 mx-auto mb-6 bg-gray-100 rounded-full overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {imageRef.current && (
            <img
              src={imageUrl}
              alt="Crop preview"
              className="absolute pointer-events-none"
              style={{
                width: `${imageRef.current.width * scale}px`,
                height: `${imageRef.current.height * scale}px`,
                left: `50%`,
                top: `50%`,
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              }}
            />
          )}
          
          {/* Circular border overlay */}
          <div className="absolute inset-0 border-4 border-white rounded-full pointer-events-none" />
        </div>

        <p className="text-xs text-gray-500 text-center mb-4">
          Drag to reposition • Use buttons to zoom
        </p>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={handleZoomOut}
            className="p-2 border border-gray-200 rounded hover:border-black transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 border border-gray-200 rounded hover:border-black transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 hover:border-black transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>

        {/* Hidden canvas for generating cropped image */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

