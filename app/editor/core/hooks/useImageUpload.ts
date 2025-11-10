/**
 * useImageUpload Hook
 * 
 * Unified image upload handling with Supabase Storage and fallbacks
 */

import { useState, useCallback } from 'react';

interface UploadOptions {
  file: File;
  folder: 'thumbnails' | 'hero-images' | 'avatars' | 'gallery' | 'blocks';
  entityType?: 'project' | 'career' | 'profile';
  entityId?: string;
}

interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Convert file to data URL (fallback when not logged in)
 */
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload to Supabase Storage
 */
async function uploadToSupabase(
  file: File,
  userId: string,
  folder: string,
  entityType?: string,
  entityId?: string
): Promise<UploadResult> {
  try {
    // Dynamic import to avoid issues if supabase not configured
    const { supabase } = await import('@/lib/supabase');
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    
    let filePath: string;
    if (entityType && entityId) {
      filePath = `${userId}/${folder}/${entityType}/${entityId}/${timestamp}-${randomStr}.${fileExt}`;
    } else {
      filePath = `${userId}/${folder}/${timestamp}-${randomStr}.${fileExt}`;
    }
    
    console.log(`[useImageUpload] 📤 Uploading to: ${filePath}`);
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('[useImageUpload] ❌ Upload error:', error);
      return { url: null, error: error.message };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);
    
    console.log('[useImageUpload] ✅ Upload successful:', publicUrl);
    
    return { url: publicUrl, error: null };
    
  } catch (error) {
    console.error('[useImageUpload] ❌ Upload failed:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (options: UploadOptions): Promise<UploadResult> => {
    const { file, folder, entityType, entityId } = options;
    
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      setProgress(20);
      
      // Try to get current user
      let userId: string | null = null;
      try {
        const { getCurrentUser } = await import('@/lib/supabase');
        const user = await getCurrentUser();
        userId = user?.id || null;
      } catch (err) {
        console.warn('[useImageUpload] Could not get user, using fallback');
      }
      
      setProgress(40);
      
      let result: UploadResult;
      
      if (userId) {
        // User is logged in - upload to Supabase
        console.log('[useImageUpload] 📤 Uploading to Supabase Storage');
        result = await uploadToSupabase(file, userId, folder, entityType, entityId);
        
        // If Supabase upload failed, fallback to data URL
        if (result.error) {
          console.warn('[useImageUpload] ⚠️ Supabase upload failed, using data URL fallback');
          const dataUrl = await fileToDataUrl(file);
          result = { url: dataUrl, error: null };
        }
      } else {
        // Not logged in - use data URL
        console.log('[useImageUpload] ⚠️ No user, using data URL fallback');
        const dataUrl = await fileToDataUrl(file);
        result = { url: dataUrl, error: null };
      }
      
      setProgress(100);
      setUploading(false);
      
      if (result.error) {
        setError(result.error);
      }
      
      return result;
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      console.error('[useImageUpload] ❌ Error:', errorMsg);
      setError(errorMsg);
      setUploading(false);
      setProgress(0);
      return { url: null, error: errorMsg };
    }
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    upload,
    uploading,
    progress,
    error,
    reset,
  };
}

