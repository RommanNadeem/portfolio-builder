import { supabase } from './supabase';

export interface ImageUploadOptions {
  file: File;
  userId: string;
  projectId?: string;
  folder?: 'thumbnails' | 'hero-images' | 'gallery';
}

export interface ImageUploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Unified image upload for project thumbnails and hero images
 * Stores in Supabase Storage and returns public URL
 */
export async function uploadProjectImage(options: ImageUploadOptions): Promise<ImageUploadResult> {
  const { file, userId, projectId, folder = 'thumbnails' } = options;

  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'File must be an image' };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { url: null, error: 'Image must be less than 5MB' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${userId}/${folder}/${projectId || 'temp'}-${timestamp}-${random}.${fileExt}`;

    console.log('[ImageUpload] 📤 Uploading to Supabase Storage:', fileName);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('[ImageUpload] ❌ Upload failed:', uploadError);
      return { url: null, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('project-files')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log('[ImageUpload] ✅ Upload successful:', publicUrl);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error('[ImageUpload] ❌ Exception:', error);
    return { url: null, error: error.message || 'Upload failed' };
  }
}

/**
 * Fallback: Convert image to base64 data URL (client-side only)
 * Use when Supabase Storage is not available or for quick preview
 */
export function imageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteProjectImage(imageUrl: string): Promise<{ error: string | null }> {
  try {
    // Extract file path from public URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/project-files/{path}
    const urlParts = imageUrl.split('/project-files/');
    if (urlParts.length < 2) {
      // Not a Supabase Storage URL, nothing to delete
      return { error: null };
    }

    const filePath = urlParts[1];
    console.log('[ImageUpload] 🗑️ Deleting from storage:', filePath);

    const { error } = await supabase.storage
      .from('project-files')
      .remove([filePath]);

    if (error) {
      console.error('[ImageUpload] ❌ Delete failed:', error);
      return { error: error.message };
    }

    console.log('[ImageUpload] ✅ Deleted successfully');
    return { error: null };
  } catch (error: any) {
    console.error('[ImageUpload] ❌ Delete exception:', error);
    return { error: error.message || 'Delete failed' };
  }
}

