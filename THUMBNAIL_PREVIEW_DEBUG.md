# Thumbnail Not Showing in Preview - Debug Guide

## Current Status

I've added debugging to track thumbnail data flow. Here's how to diagnose the issue:

## Step 1: Check Console Logs

Open browser console (F12) and look for:

```
[ProjectsPreview] Rendering projects: [
  {
    id: "1afcebb2-2d09-4cf9-9acc-2f52b685bbc1",
    title: "Humraaz",
    thumbnail: "https://...",  // ⭐ Check this value
    hasThumbnail: true         // ⭐ Should be true
  }
]
```

## Diagnosis Scenarios

### Scenario 1: `thumbnail: null` or `thumbnail: undefined`
**Problem**: Thumbnail not saved or not loaded

**Check:**
```javascript
// Run in console
const data = JSON.parse(localStorage.getItem('portfolioData'));
const project = data.projects.find(p => p.title === 'Humraaz');
console.log('Project thumbnail:', project.thumbnail);
console.log('Hero imageUrl:', project.blocks?.[0]?.data?.imageUrl);
```

**If both are null**: 
- Hero image wasn't added
- Or wasn't saved from template editor

**If hero imageUrl exists but thumbnail is null**:
- Sync from hero to thumbnail isn't working
- Check the save logs in template editor

### Scenario 2: `thumbnail: "https://..."` but image doesn't show
**Problem**: Image URL is there but not rendering

**Check console for image load error:**
```
[ProjectsPreview] Image failed to load: https://...
```

**Possible causes:**
- Invalid URL
- Image doesn't exist at that URL
- CORS issue
- Network error

**Fix**: Try a different image URL (e.g., from Unsplash)

### Scenario 3: `hasThumbnail: false` but you added one
**Problem**: Data structure mismatch

**Check:**
```javascript
// Field name might be wrong
const project = data.projects.find(p => p.title === 'Humraaz');
console.log('All project fields:', Object.keys(project));
console.log('Thumbnail field:', project.thumbnail);
console.log('Thumbnail_url field:', project.thumbnail_url);
```

**If it's `thumbnail_url` instead of `thumbnail`**:
- Database conversion issue
- Need to fix `convertToLegacyFormat` in `lib/database.ts`

### Scenario 4: Works in editor but not in preview
**Problem**: Different data being passed

**Check:**
- Are you in the same view mode?
- Is the data refreshing properly?

## Complete Test Flow

### Test 1: Add Thumbnail in Card
1. Go to `/editor`
2. Expand Projects section
3. Paste image URL in thumbnail field
4. See thumbnail preview in editor card ✅
5. Switch to Preview mode (top right)
6. Check console: `[ProjectsPreview] Rendering projects`
7. Should show `hasThumbnail: true`
8. Should see thumbnail image on card

### Test 2: Add Image in Template
1. Go to template editor
2. Add image to hero block
3. Save (wait 1 second)
4. Console should show: `thumbnail: "✅ Has image"`
5. Go back to `/editor`
6. Should see thumbnail in editor view
7. Switch to preview mode
8. Should see thumbnail in preview

### Test 3: Database Sync
1. Add thumbnail (either way)
2. Console should show: `✅ Metadata saved to database`
3. Refresh page (Cmd+R)
4. Thumbnail should still be there
5. If not, check database save errors

## What to Share

If thumbnail still not showing, share:

1. **Console output:**
```
[ProjectsPreview] Rendering projects: [...]
```

2. **localStorage check:**
```javascript
const data = JSON.parse(localStorage.getItem('portfolioData'));
const project = data.projects.find(p => p.title === 'Humraaz');
console.log({
  thumbnail: project.thumbnail,
  heroImage: project.blocks?.[0]?.data?.imageUrl,
  template_type: project.template_type
});
```

3. **Any error messages** in console

## Common Issues & Fixes

### Issue 1: Thumbnail is `thumbnail_url` not `thumbnail`
**Fix**: The conversion function handles this
```javascript
thumbnail: p.thumbnail_url  // Converts from database field
```

### Issue 2: Preview mode uses different data
**Check**: Both editor and preview use same `projects` array
```javascript
<ProjectsPreview
  projects={projects}  // Same data
  viewMode={viewMode}
  previewMode={previewMode}
/>
```

### Issue 3: Image placeholder shown but no actual image
**Symptom**: You see the gray box but no image inside

**Check**: Look at the actual `<img>` tag in browser dev tools
- Is `src` attribute set?
- Is it a valid URL?
- Check network tab for failed image request

### Issue 4: Only shows in edit mode, not preview
**Check the condition:**
```javascript
{project.thumbnail ? (
  <img src={project.thumbnail} />  // Shows if thumbnail exists
) : (
  <div>No thumbnail</div>  // Fallback
)}
```

This should work in both edit and preview modes.

## Next Steps

1. **Check console logs** when in preview mode
2. **Share the console output** if issue persists
3. **Try a test image** like:
   ```
   https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800
   ```

---

The code is correct - the issue is likely:
- Thumbnail not saved (check template editor logs)
- Wrong field name (check console logs)
- Invalid image URL (check network tab)

Let me know what the console shows!

