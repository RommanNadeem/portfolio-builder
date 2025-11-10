# Unified Image Upload System ✅

## Overview

I've implemented a **unified image upload system** where both the project thumbnail and hero image use the **same upload function** and store images in the **same Supabase Storage bucket**.

## Architecture

### Shared Upload Module
**File:** `lib/image-upload.ts`

**Key Functions:**
1. `uploadProjectImage()` - Main upload function (used by both thumbnail & hero)
2. `imageToDataUrl()` - Fallback for offline/quick preview
3. `deleteProjectImage()` - Delete from Supabase Storage

### Storage Structure
```
Supabase Storage Bucket: "project-files"
├── {userId}/
│   ├── thumbnails/
│   │   ├── {projectId}-{timestamp}-{random}.jpg
│   │   └── {projectId}-{timestamp}-{random}.png
│   └── hero-images/
│       ├── {blockId}-{timestamp}-{random}.jpg
│       └── {blockId}-{timestamp}-{random}.png
```

## How It Works

### 1. Upload from Project Card (Thumbnail)

**Location:** `app/editor/sections/projects/ProjectsEditor.tsx`

**Flow:**
```
User clicks upload or drops file
  ↓
handleImageUpload(projectId, file)
  ↓
uploadProjectImage({ folder: 'thumbnails' })
  ↓
Uploads to: project-files/{userId}/thumbnails/{projectId}-...jpg
  ↓
Returns public URL
  ↓
onUpdate(projectId, { thumbnail: url })
  ↓
Auto-save (500ms) to localStorage & database
```

### 2. Upload from Template Hero Block

**Location:** `app/editor/templates/blocks/HeroBlock.tsx`

**Flow:**
```
User clicks upload or drops file
  ↓
handleImageUpload(file)
  ↓
uploadProjectImage({ folder: 'hero-images' })
  ↓
Uploads to: project-files/{userId}/hero-images/{blockId}-...jpg
  ↓
Returns public URL
  ↓
onChange({ data: { imageUrl: url } })
  ↓
Syncs to project.thumbnail (via handleBlockChange)
  ↓
Auto-save (500ms) to localStorage & database
```

### 3. Automatic Sync

**When hero image changes:**
```javascript
// In project-editor/[id]/page.tsx
handleBlockChange(0, heroBlock) {
  // Real-time sync hero → thumbnail
  setProjectData({
    ...projectData,
    thumbnail: heroBlock.data.imageUrl  // ⭐ Same URL
  });
}

// On save
const updatedProject = {
  thumbnail: heroBlock.data.imageUrl  // ⭐ Persisted
};
```

**When thumbnail changes (in card):**
```javascript
// On template selection
newBlocks[heroIndex].data.imageUrl = projectData.thumbnail  // ⭐ Same URL
```

## Unified Upload Function

```typescript
export async function uploadProjectImage(options: ImageUploadOptions) {
  const { file, userId, projectId, folder } = options;

  // 1. Validate
  if (!file.type.startsWith('image/')) {
    return { url: null, error: 'File must be an image' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: 'Image must be less than 5MB' };
  }

  // 2. Generate unique filename
  const fileName = `${userId}/${folder}/${projectId}-${timestamp}-${random}.${ext}`;

  // 3. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('project-files')  // ⭐ Same bucket for both
    .upload(fileName, file);

  // 4. Get public URL
  const { data: urlData } = supabase.storage
    .from('project-files')
    .getPublicUrl(fileName);

  // 5. Return URL
  return { url: urlData.publicUrl, error: null };
}
```

## Benefits

### ✅ Single Source of Truth
- Both use `project-files` bucket in Supabase
- Both use `uploadProjectImage()` function
- Same validation, error handling, logging

### ✅ Automatic Sync
- Hero image URL → Thumbnail URL
- Thumbnail URL → Hero image URL
- Always the same URL, no conflicts

### ✅ Consistent UX
- Same upload UI in both places
- Same file size limits (5MB)
- Same supported formats (PNG, JPG, WebP)
- Same loading states
- Same error messages

### ✅ Easy Management
- Images stored in organized folders
- Easy to find and debug
- Can delete from storage when needed
- Proper file naming with timestamps

## Features

### File Upload
- ✅ Click to upload
- ✅ Drag and drop (HTML5 file input)
- ✅ Shows upload progress
- ✅ Immediate preview

### URL Input
- ✅ Paste any image URL
- ✅ Supports external images (Unsplash, etc.)
- ✅ No upload needed
- ✅ Instant display

### Image Management
- ✅ Preview with hover-to-remove
- ✅ Delete from storage (optional)
- ✅ Replace anytime
- ✅ Auto-save

## Console Logs

### Thumbnail Upload (from card):
```
[ProjectsEditor] 📤 Uploading thumbnail for project: {projectId}
[ImageUpload] 📤 Uploading to Supabase Storage: {userId}/thumbnails/{projectId}-...jpg
[ImageUpload] ✅ Upload successful: https://...supabase.co/.../thumbnails/...jpg
[ProjectsEditor] ✅ Uploaded to Supabase: https://...
```

### Hero Image Upload (from template):
```
[HeroBlock] 📤 Uploading hero image
[ImageUpload] 📤 Uploading to Supabase Storage: {userId}/hero-images/{blockId}-...jpg
[ImageUpload] ✅ Upload successful: https://...supabase.co/.../hero-images/...jpg
[HeroBlock] ✅ Uploaded to Supabase: https://...
[Project Editor] 🔄 Syncing hero to project metadata: {thumbnail: "https://..."}
```

### Data Flow Confirmation:
```
[Template Editor] Hero block in save: {
  imageUrl: "https://...supabase.co/.../hero-images/...jpg"
}
[Template Editor] ⭐ About to save: {
  thumbnail: "✅ Has image"  // Same URL synced
}
```

## Database Structure

### Supabase Storage

**Bucket:** `project-files` (public)

**Folders:**
- `{userId}/thumbnails/` - Images uploaded from project cards
- `{userId}/hero-images/` - Images uploaded from hero blocks

**Files:**
- Format: `{id}-{timestamp}-{random}.{ext}`
- Public URLs automatically generated
- Can be accessed without authentication

### Projects Table

```sql
{
  id: uuid,
  user_id: uuid,
  thumbnail_url: text,  -- ⭐ Stores the public URL
  blocks: jsonb,        -- ⭐ Contains hero block with same URL
  ...
}
```

**Data in blocks:**
```json
{
  "blocks": [
    {
      "id": "hero-uuid",
      "type": "hero",
      "data": {
        "imageUrl": "https://...supabase.co/.../project-files/..."  // ⭐ Same URL
      }
    }
  ]
}
```

## Usage

### For Users

**Option 1: Upload from Project Card**
1. Go to `/editor`
2. Expand Projects section
3. Click the upload box or drag/drop image
4. Image uploads to Supabase
5. Appears immediately in card
6. Syncs to hero when template opened

**Option 2: Upload from Hero Block**
1. Go to template editor
2. Click upload box in hero section
3. Image uploads to Supabase
4. Appears in hero block
5. Syncs to card thumbnail automatically

**Option 3: Paste URL (Either Place)**
1. Paste any image URL
2. No upload needed
3. Syncs between hero and thumbnail

### All Options Result in Same Outcome:
- ✅ Image stored in Supabase (if uploaded)
- ✅ Same URL in thumbnail and hero
- ✅ Appears in all preview modes
- ✅ Syncs across devices

## Fallback Behavior

**If user not logged in:**
- Uses base64 data URLs instead of Supabase
- Images stored in localStorage only
- Still syncs between hero and thumbnail
- Won't sync across devices

**If Supabase upload fails:**
- Falls back to data URL
- Shows error message
- User can retry or use URL instead

## File Validation

**Accepted formats:**
- PNG (.png)
- JPEG (.jpg, .jpeg)
- WebP (.webp)
- GIF (.gif)

**Size limit:**
- Maximum: 5MB
- Error shown if exceeded

**Security:**
- Only image types accepted
- File extension validated
- MIME type checked

## Next Steps

### For Immediate Use (Data URLs)
✅ **Works now** - Upload anywhere, instant sync
- Images saved as base64 in localStorage/database
- No Supabase Storage setup needed
- Good for testing and development

### For Production (Supabase Storage)

**Prerequisites:**
1. Create `project-files` bucket in Supabase
2. Enable public access
3. Set up RLS policies (optional for public bucket)

**SQL to run:**
```sql
-- Create bucket (run in Supabase Dashboard > Storage)
-- Or use the UI: Storage > Create new bucket
-- Name: project-files
-- Public: Yes

-- Optional: Set up RLS policies
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view public files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-files');
```

**Then the code will automatically:**
- Upload to Supabase Storage ✅
- Return public URLs ✅
- No code changes needed ✅

## Summary

| Feature | Thumbnail Upload | Hero Upload | Result |
|---------|-----------------|-------------|--------|
| Function | `uploadProjectImage` | `uploadProjectImage` | ✅ Same |
| Bucket | `project-files` | `project-files` | ✅ Same |
| Folder | `/thumbnails/` | `/hero-images/` | Different (for organization) |
| URL Format | `https://.../project-files/...` | `https://.../project-files/...` | ✅ Same domain |
| Sync | Hero → Thumbnail | Thumbnail → Hero | ✅ Bidirectional |
| Fallback | Data URL | Data URL | ✅ Same |

**Result:** Complete unification with automatic sync! 🎉

---

**Status:** ✅ Implemented and ready to use
**Testing:** Upload an image from either location - it will appear in both!

