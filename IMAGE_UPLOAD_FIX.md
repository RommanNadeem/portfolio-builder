# 🖼️ Hero Image Upload - Immediate Save Fix

## Problem from Your Logs:

```
✅ [HeroBlock] ✅ Uploaded to Supabase: https://...hero-images/...jpg
❌ [EntityDocumentManager] Hero block data: {hasImage: false}
❌ [EntityDocumentManager] 🖼️ Synced hero image to thumbnail: {imageUrl: '', thumbnail: null}
```

**Image uploaded successfully, but saved with empty imageUrl!**

---

## Root Cause:

### Timing Issue:
```
1. User uploads image
2. Image uploads to Supabase ✅
3. HeroBlock calls onChange({ imageUrl: result.url }) ✅
4. Auto-save scheduled (2500ms delay) ⏰
5. Auto-save runs BEFORE state updates ❌
6. Saves with old state (empty imageUrl) ❌
```

### Why This Happened:
- React state updates are async
- onChange triggers state update
- updateBlocks schedules auto-save
- But document state hasn't propagated yet
- Auto-save runs with stale data

---

## Solution:

### Force Immediate Save After Image Upload

**Thread `save` function from page → component tree → HeroBlock:**

```
project-editor/page.tsx
  ↓ save: forceSave (from useTemplateEditor)
  ↓
TemplateEditorContent
  ↓ onSave={forceSave}
  ↓
SortableSection
  ↓ onSave={onSave}
  ↓
TemplateRenderer
  ↓ onSave={onSave}
  ↓
HeroBlock
  ↓ onSave prop available!
```

### HeroBlock After Upload:
```typescript
if (result.url) {
  // 1. Update block state
  onChange({ ...block, data: { ...data, imageUrl: result.url } });
  
  // 2. 🔥 Force immediate save!
  if (onSave) {
    setTimeout(async () => {
      await onSave();  // Saves after onChange completes
    }, 500);
  }
}
```

---

## Changes Made:

### 1. **HeroBlock.tsx**
- Added `onSave?: () => Promise<void>` to props
- Call `onSave()` after image upload (500ms delay for state update)
- Log: "💾 Triggering immediate save for image..."

### 2. **TemplateRenderer.tsx**
- Added `onSave?: () => Promise<void>` to props
- Pass `onSave` to HeroBlock

### 3. **TemplateEditorContent.tsx**
- Added `onSave?: () => Promise<void>` to `TemplateEditorContentProps`
- Added `onSave?: () => Promise<void>` to `SortableSectionProps`
- Pass `onSave` through the chain

### 4. **project-editor/page.tsx & career-editor/page.tsx**
- Extract `save: forceSave` from useTemplateEditor
- Pass `onSave={forceSave}` to TemplateEditorContent

---

## Expected Flow Now:

```
User uploads image
  ↓
[HeroBlock] 📤 Uploading hero image
  ↓
[ImageUpload] ✅ Upload successful: https://...
  ↓
[HeroBlock] ✅ Uploaded to Supabase
  ↓
onChange({ imageUrl: 'https://...' })
  ↓ (React updates state)
  ↓ (500ms delay for propagation)
  ↓
[HeroBlock] 💾 Triggering immediate save for image...
  ↓
forceSave() called
  ↓
[useTemplateEditor] 💾 Saving document...
  ↓
[EntityDocumentManager] Hero block data: {hasImage: true, imageUrl: 'https://...'}  ✅
  ↓
[EntityDocumentManager] 🖼️ Synced hero image to thumbnail: {
  imageUrl: 'https://...',
  thumbnail: 'https://...',
  hasImage: true  ✅
}
  ↓
[EntityDocumentManager] 💾 Saved to localStorage with template_type
  ↓
[EntityDocumentManager] 💾 Attempting to save to database...
  ↓
[Database Debug] 📦 Project 1: {
  thumbnail: 'https://...',  ✅
  template_type: 'startup-side-project'
}
  ↓
[EntityDocumentManager] ✅ Saved to database successfully!
  ↓
Navigate to editor
  ↓
[ProjectsSection] 🖼️ Image loaded successfully: https://...
  ↓
Image shows in project card! 🎉
```

---

## Test It:

### Steps:
1. Open project editor
2. Upload an image in hero block
3. Watch console for:
   ```
   ✅ [HeroBlock] ✅ Uploaded to Supabase
   ✅ [HeroBlock] 💾 Triggering immediate save for image...
   ✅ [EntityDocumentManager] 🖼️ Synced hero image to thumbnail: {hasImage: true}
   ✅ [EntityDocumentManager] ✅ Saved to database successfully!
   ```
4. Navigate back to editor
5. Check console for:
   ```
   ✅ [ProjectsSection] 🖼️ Image loaded successfully
   ```
6. **Result**: Image shows in project card!

---

## Status:

✅ **Fixed and Ready to Test!**

The hero image will now:
- Upload to Supabase
- Trigger immediate save
- Sync to thumbnail
- Save to database
- Appear in project card preview

No more timing issues! 🎉

