import { supabase } from './supabase';
import { FileAttachment } from './types';

// ============================================
// FILE UPLOAD UTILITIES
// ============================================

export type FileUploadType = 
  | 'profile_image' 
  | 'resume' 
  | 'thumbnail' 
  | 'document' 
  | 'video' 
  | 'image'
  | 'attachment';

export interface UploadOptions {
  userId: string;
  file: File;
  type: FileUploadType;
  entityType?: string;      // 'project', 'career_highlight', etc.
  entityId?: string;
  isPublic?: boolean;
  displayName?: string;
  description?: string;
}

export interface UploadResult {
  data: FileAttachment | null;
  publicUrl?: string;
  error: string | null;
}

// Map upload type to bucket
function getBucketForType(type: FileUploadType): string {
  const bucketMap: Record<FileUploadType, string> = {
    profile_image: 'profile-pictures',
    resume: 'resumes',
    thumbnail: 'project-files',
    document: 'documents',
    video: 'media',
    image: 'media',
    attachment: 'documents'
  };
  return bucketMap[type];
}

// Validate file type and size
function validateFile(file: File, type: FileUploadType): { valid: boolean; error?: string } {
  const validations: Record<FileUploadType, { types: string[]; maxSize: number }> = {
    profile_image: {
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      maxSize: 5 * 1024 * 1024 // 5MB
    },
    resume: {
      types: [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'
      ],
      maxSize: 10 * 1024 * 1024 // 10MB
    },
    thumbnail: {
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024 // 5MB
    },
    document: {
      types: [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      maxSize: 20 * 1024 * 1024 // 20MB
    },
    video: {
      types: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
      maxSize: 100 * 1024 * 1024 // 100MB
    },
    image: {
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      maxSize: 10 * 1024 * 1024 // 10MB
    },
    attachment: {
      types: [], // Any type
      maxSize: 50 * 1024 * 1024 // 50MB
    }
  };

  const validation = validations[type];
  
  if (validation.types.length > 0 && !validation.types.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed: ${validation.types.join(', ')}` 
    };
  }
  
  if (file.size > validation.maxSize) {
    const maxSizeMB = (validation.maxSize / (1024 * 1024)).toFixed(0);
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true };
}

// Generate unique filename
function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = originalName.split('.').pop();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${timestamp}-${random}.${extension}`;
}

// Helper: Get image dimensions
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    
    img.src = url;
  });
}

// ============================================
// MAIN UPLOAD FUNCTION
// ============================================
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { userId, file, type, entityType, entityId, isPublic = true, displayName, description } = options;
  
  // Validate file
  const validation = validateFile(file, type);
  if (!validation.valid) {
    return { data: null, error: validation.error || 'Invalid file' };
  }
  
  // Get bucket and generate path
  const bucket = getBucketForType(type);
  const filePath = generateFileName(userId, file.name);
  
  try {
    // Upload to Supabase Storage
    // Use upsert for resumes to handle retry scenarios
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: type === 'resume' // Allow resume re-uploads on retry
      });
    
    if (uploadError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Upload error:', uploadError.message);
      }
      return { data: null, error: uploadError.message };
    }
    
    // Get public URL if applicable
    let publicUrl: string | undefined;
    if (isPublic) {
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      publicUrl = urlData.publicUrl;
    }
    
    // Extract metadata
    const metadata: any = {
      originalName: file.name,
      uploadedAt: new Date().toISOString()
    };
    
    // Add image dimensions if it's an image
    if (file.type.startsWith('image/')) {
      try {
        const dimensions = await getImageDimensions(file);
        metadata.width = dimensions.width;
        metadata.height = dimensions.height;
      } catch (e) {
        // Ignore dimension extraction errors
      }
    }
    
    // Save to file_attachments table
    const { data: fileRecord, error: dbError } = await supabase
      .from('file_attachments')
      .insert({
        user_id: userId,
        bucket_name: bucket,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        entity_type: entityType,
        entity_id: entityId,
        attachment_type: type,
        display_name: displayName || file.name,
        description: description,
        is_public: isPublic,
        metadata: metadata
      })
      .select()
      .single();
    
    if (dbError) {
      // Check if it's a duplicate error (409 conflict on unique constraint)
      if (dbError.code === '23505') {
        // Duplicate file - try to find existing record
        const { data: existing } = await supabase
          .from('file_attachments')
          .select('*')
          .eq('user_id', userId)
          .eq('file_path', filePath)
          .maybeSingle();
        
        if (existing) {
          // Return existing record instead of error
          return {
            data: existing as FileAttachment,
            publicUrl,
            error: null
          };
        }
      }
      
      // Rollback: delete uploaded file
      await supabase.storage.from(bucket).remove([filePath]);
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Database insert error:', dbError.message);
      }
      
      return { data: null, error: dbError.message };
    }
    
    return { 
      data: fileRecord as FileAttachment,
      publicUrl,
      error: null 
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Upload failed' };
  }
}

// ============================================
// DELETE FILE
// ============================================
export async function deleteFile(fileId: string): Promise<{ error: string | null }> {
  try {
    // Get file record
    const { data: fileRecord, error: fetchError } = await supabase
      .from('file_attachments')
      .select('bucket_name, file_path')
      .eq('id', fileId)
      .single();
    
    if (fetchError) {
      return { error: fetchError.message };
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(fileRecord.bucket_name)
      .remove([fileRecord.file_path]);
    
    if (storageError) {
      // Continue anyway - delete from DB even if storage delete fails
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('file_attachments')
      .delete()
      .eq('id', fileId);
    
    if (dbError) {
      return { error: dbError.message };
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Delete failed' };
  }
}

// ============================================
// GET SIGNED URL (for private files)
// ============================================
export async function getSignedUrl(
  fileId: string, 
  expiresIn: number = 3600
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data: fileRecord, error: fetchError } = await supabase
      .from('file_attachments')
      .select('bucket_name, file_path, is_public')
      .eq('id', fileId)
      .single();
    
    if (fetchError) {
      return { url: null, error: fetchError.message };
    }
    
    // If public, return public URL
    if (fileRecord.is_public) {
      const { data } = supabase.storage
        .from(fileRecord.bucket_name)
        .getPublicUrl(fileRecord.file_path);
      return { url: data.publicUrl, error: null };
    }
    
    // Generate signed URL for private files
    const { data, error } = await supabase.storage
      .from(fileRecord.bucket_name)
      .createSignedUrl(fileRecord.file_path, expiresIn);
    
    if (error) {
      return { url: null, error: error.message };
    }
    
    return { url: data.signedUrl, error: null };
  } catch (error: any) {
    return { url: null, error: error.message || 'Failed to get URL' };
  }
}

// ============================================
// GET USER FILES
// ============================================
export async function getUserFiles(
  userId: string, 
  type?: FileUploadType
): Promise<{ data: FileAttachment[]; error: string | null }> {
  try {
    let query = supabase
      .from('file_attachments')
      .select('*')
      .eq('user_id', userId);
    
    if (type) {
      query = query.eq('attachment_type', type);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return { data: [], error: error.message };
    }
    
    return { data: (data || []) as FileAttachment[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message || 'Failed to fetch files' };
  }
}

// ============================================
// GET FILES FOR ENTITY (e.g., all files for a project)
// ============================================
export async function getEntityFiles(
  entityType: string,
  entityId: string
): Promise<{ data: FileAttachment[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('file_attachments')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('display_order', { ascending: true });
    
    if (error) {
      return { data: [], error: error.message };
    }
    
    return { data: (data || []) as FileAttachment[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message || 'Failed to fetch entity files' };
  }
}

// ============================================
// CONVERT FILE TO BASE64 (for displaying images)
// ============================================
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

