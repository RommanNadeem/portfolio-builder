# View Mode Persistence Across Pages ✅

## Feature Overview

When you switch to **Preview mode** in the main editor, all navigation to detail pages (projects, career highlights) now **preserves the preview mode**. The pages stay in preview mode until you explicitly switch back to edit mode.

## How It Works

### 1. Main Editor (`/editor`)

**View Mode Toggle:**
- Edit mode: Shows editing controls
- Preview mode: Shows how portfolio will look to viewers

**State:**
```javascript
const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
```

**URL Param Support:**
- `/editor` → Defaults to edit mode
- `/editor?mode=edit` → Opens in edit mode
- `/editor?mode=preview` → Opens in preview mode

### 2. Navigation to Detail Pages

**All navigation links now pass the current mode:**

```javascript
// From Projects Section
router.push(`/detail/project-editor/${projectId}?mode=${viewMode}`);

// From Career Section
router.push(`/detail/career-editor/${highlightId}?mode=${viewMode}`);

// From Detail Pages back to Editor
router.push(`/editor?mode=${viewMode}`);
```

### 3. Detail Pages Read Mode from URL

**Both detail editors check URL params on load:**

```javascript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
  if (mode === 'preview' || mode === 'edit') {
    setViewMode(mode);
    console.log('[Project Editor] View mode from URL:', mode);
  }
}, []);
```

## Complete User Flow

### Scenario 1: Edit Mode Navigation
```
1. In /editor → Edit mode (default)
2. Click "Edit detailed page" on project
   → /detail/project-editor/123?mode=edit
   → Opens in edit mode ✅

3. Edit template content
4. Click back arrow
   → /editor?mode=edit
   → Returns to edit mode ✅
```

### Scenario 2: Preview Mode Navigation
```
1. In /editor → Switch to Preview mode
2. Click on project card
   → /detail/project-editor/123?mode=preview
   → Opens in preview mode ✅

3. View template in preview
4. Click back arrow
   → /editor?mode=preview
   → Returns to preview mode ✅
```

### Scenario 3: Switching Modes in Detail Page
```
1. Open project in preview mode
2. Switch to Edit mode (toggle at top)
3. Click back arrow
   → /editor?mode=edit
   → Main editor now in edit mode ✅
```

### Scenario 4: Multiple Page Navigation
```
1. In /editor → Preview mode
2. Open Project A
   → Preview mode ✅
3. Go back
   → Preview mode ✅
4. Open Career highlight
   → Preview mode ✅
5. Go back
   → Preview mode ✅

All pages remember preview mode!
```

## Updated Components

### Projects Section
**Files Modified:**
- `app/editor/sections/projects/ProjectsEditor.tsx`
- `app/editor/sections/projects/ProjectsPreview.tsx`
- `app/editor/sections/projects/index.tsx`

**Changes:**
- Added `viewMode` prop
- All navigation links include `?mode=${viewMode}`
- Passes mode to detail pages

### Career Section
**Files Modified:**
- `app/editor/sections/career/CareerEditor.tsx`
- `app/editor/sections/career/CareerPreview.tsx`
- `app/editor/sections/career/index.tsx`

**Changes:**
- Added `viewMode` prop
- All navigation links include `?mode=${viewMode}`
- Passes mode to detail pages

### Detail Pages
**Files Modified:**
- `app/detail/project-editor/[id]/page.tsx`
- `app/detail/[type]/[id]/page.tsx`

**Changes:**
- Read `mode` from URL params on load
- Back buttons include `?mode=${viewMode}`
- Breadcrumbs include `?mode=${viewMode}`
- Publish redirect includes `?mode=${viewMode}`

## Benefits

### ✅ Consistent Experience
- Preview mode stays in preview across all pages
- Edit mode stays in edit across all pages
- No unexpected mode switches

### ✅ Better UX for Preview
- Users can navigate entire portfolio in preview mode
- See exactly how visitors will see it
- No editing controls visible
- Clean, polished view

### ✅ Intuitive Behavior
- Mode persists as expected
- Explicit toggle to switch modes
- Clear visual feedback

### ✅ Flexible Workflow
- Can switch modes at any time
- Mode change propagates on next navigation
- Both modes fully functional

## Console Logs

**When navigating with mode:**
```
[Project Editor] View mode from URL: preview
```

**When navigating back:**
```
// URL changes to /editor?mode=preview
// Main editor updates viewMode state
```

## Edge Cases Handled

### ✅ Direct URL Access
- `/detail/project-editor/123` → Defaults to edit mode
- `/detail/project-editor/123?mode=preview` → Opens in preview
- `/editor` → Defaults to edit mode
- `/editor?mode=preview` → Opens in preview

### ✅ Invalid Mode Param
- `?mode=invalid` → Ignored, uses default (edit)
- No mode param → Uses default (edit)

### ✅ Browser Back/Forward
- Mode preserved in URL
- Browser history includes mode
- Back/forward buttons work correctly

### ✅ Page Refresh
- URL params preserved
- Mode maintained after refresh
- No data loss

## Testing Checklist

### Test 1: Preview Mode Persistence
- [ ] Switch to Preview mode in `/editor`
- [ ] Click on a project card
- [ ] Detail page opens in preview mode
- [ ] Click back arrow
- [ ] Main editor still in preview mode
- [ ] Click on career highlight
- [ ] Opens in preview mode

### Test 2: Edit Mode Persistence  
- [ ] Stay in Edit mode in `/editor`
- [ ] Click "Edit detailed page"
- [ ] Detail page opens in edit mode
- [ ] Make changes
- [ ] Go back
- [ ] Still in edit mode

### Test 3: Mode Switching
- [ ] Open detail page in preview
- [ ] Switch to edit mode
- [ ] Click back
- [ ] Main editor now in edit mode
- [ ] Subsequent navigation uses edit mode

### Test 4: Direct URL
- [ ] Open `/editor?mode=preview` directly
- [ ] Should be in preview mode
- [ ] Navigate to detail pages
- [ ] Should stay in preview mode

## Summary

| Navigation | Before | After |
|------------|--------|-------|
| Editor → Detail | Always edit | Preserves mode ✅ |
| Detail → Editor | Always edit | Preserves mode ✅ |
| Project card click | Always edit | Preserves mode ✅ |
| Career card click | Always edit | Preserves mode ✅ |
| Back button | Loses mode | Preserves mode ✅ |
| URL params | Not used | Fully supported ✅ |

---

**Status:** ✅ Complete
**Result:** View mode now persists across all pages in the portfolio builder!

**Try it:**
1. Switch to Preview mode in `/editor`
2. Click on any project or career card
3. Page opens in preview mode
4. Navigate back
5. Still in preview mode!

