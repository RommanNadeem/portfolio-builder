# Preview and Auto-Save Fixes - Complete Summary

## Overview
Fixed two related issues with the career/project editor pages:
1. **Blank Preview Bug**: Preview mode showing blank content when blocks had data
2. **Auto-Save During Navigation**: Unnecessary saves triggering on page load

---

## Issue #1: Blank Preview Bug

### Problem
When opening a career or project page and clicking preview, the preview was sometimes blank even though the page had content.

### Root Cause
The career and project editor pages had their own simplified `hasBlockContent()` function that couldn't properly detect content in specific block types:

- **Bullets blocks**: Has `data.bullets` array (not detected)
- **Metrics blocks**: Has `data.metrics` array (not detected)  
- **Gallery blocks**: Has `data.images` array (not detected)

Since preview mode hides blocks without detected content, ALL blocks would be hidden → blank preview.

### Solution
Replaced the local simplified function with the comprehensive `hasBlockContent()` from `shared-utils.ts`:

**Files Modified:**
- `app/detail/career-editor/[id]/page.tsx`
- `app/detail/project-editor/[id]/page.tsx`
- `app/editor/templates/shared-utils.ts` (improved)

**Changes:**
```typescript
// Before: Local simplified version
function hasBlockContent(block: TemplateBlock): boolean {
  // ... basic checks
}

// After: Import proper version
import { hasBlockContent } from '@/app/editor/templates/shared-utils';
```

**Improved Detection Logic:**
```typescript
export function hasBlockContent(block: any): boolean {
  if (block.type === 'hero') return true;
  if (block.type === 'richtext') return !!(block.data?.body?.trim());
  if (block.type === 'bullets') return !!(block.data?.bullets?.some((b: string) => b.trim()));
  if (block.type === 'metrics') return !!(block.data?.metrics?.some((m: any) => m.value?.trim()));
  if (block.type === 'gallery') return !!(block.data?.images?.length > 0);
  // ... etc for all block types
  return false;
}
```

### Diagnostic Logging Added
```typescript
console.log('[CareerEditor V3] Analyzing existing blocks for content...');
blocks.forEach((block, idx) => {
  const hasContent = hasBlockContent(block);
  console.log(`Block ${idx} (${block.type}):`, {
    id: block.id,
    type: block.type,
    hasContent,
    data: block.data,
  });
});
```

---

## Issue #2: Auto-Save During Navigation

### Problem
Auto-save was triggering during navigation before any user changes were made, causing unnecessary database writes.

### Root Cause
The `isInitialLoad` flag was set to `false` immediately after document load, but editor pages do additional initialization (analyzing blocks, setting up UI) that would trigger `updateBlocks()` and auto-save.

**Timeline of the Problem:**
```
0ms:   Document loads
0ms:   isInitialLoad = false ← TOO EARLY!
0-500ms: Editor UI initializes
100-600ms: Editor analyzes blocks
Result: Auto-save might trigger before user interaction
```

### Solution

#### 1. Grace Period (1 second)
Added delay before enabling auto-save:

```typescript
// In useTemplateEditor.ts
finally {
  setLoading(false);
  setTimeout(() => {
    console.log('[useTemplateEditor] ✅ Initial load complete, auto-save enabled');
    isInitialLoad.current = false;
  }, 1000); // 1 second grace period
}
```

#### 2. Optional Skip Parameter
Added `skipAutoSave` parameter to `updateBlocks()`:

```typescript
// New signature
updateBlocks: (newBlocks: TemplateBlock[], skipAutoSave?: boolean) => void;

// Multiple safeguards
if (skipAutoSave) {
  // Skip
} else if (!autoSave) {
  // Skip
} else if (isInitialLoad.current) {
  // Skip
} else {
  // Proceed with auto-save
}
```

#### 3. Cleanup on Unmount
Existing cleanup prevents pending saves after navigation:

```typescript
useEffect(() => {
  return () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };
}, []);
```

---

## Testing Both Fixes

### Test 1: Preview Shows Content
1. Create a career highlight with multiple section types
2. Add content to bullets, metrics, and other blocks
3. Save and return to editor
4. Click on career card to open detail page in preview mode
5. **✓ All sections with content should be visible**

**Check Console:**
```
[CareerEditor V3] Analyzing existing blocks for content...
[CareerEditor V3] Block 0 (hero): { hasContent: true }
[CareerEditor V3] Block 2 (bullets): { hasContent: true }
[CareerEditor V3] Block 4 (metrics): { hasContent: true }
```

### Test 2: No Auto-Save During Navigation
1. Open an existing career/project page
2. **Do not make any changes**
3. Watch console logs

**Expected - No auto-save:**
```
[useTemplateEditor] Loading document...
[useTemplateEditor] ✅ Document loaded
[CareerEditor V3] Analyzing existing blocks...
[useTemplateEditor] ✅ Initial load complete, auto-save enabled
// NO auto-save triggered!
```

### Test 3: Auto-Save on User Changes
1. Open a page and wait 1+ seconds
2. Edit a block (add/change text)
3. Wait 2.5 seconds

**Expected - Auto-save triggers:**
```
[useTemplateEditor] 🔄 Updating blocks
[useTemplateEditor] ⏰ Scheduling auto-save in 2500 ms
// ... after 2.5 seconds ...
[useTemplateEditor] 💾 Auto-save triggered for blocks update
[useTemplateEditor] ✅ Saved successfully
```

### Test 4: Drag-and-Drop Triggers Save
1. Open a page and wait 1+ seconds
2. Drag a block to reorder
3. Wait 2.5 seconds

**Expected - Auto-save triggers:**
```
[useTemplateEditor] 🔄 Updating blocks
[useTemplateEditor] ⏰ Scheduling auto-save in 2500 ms
[useTemplateEditor] 💾 Auto-save triggered
[useTemplateEditor] ✅ Saved successfully
```

---

## When Auto-Save Should Trigger

✅ User edits block content (after 1-second grace period)
✅ User reorders blocks via drag-and-drop (after grace period)
✅ User deletes a block (after grace period)
✅ User adds a new block (after grace period)

## When Auto-Save Should NOT Trigger

❌ During page navigation/mounting
❌ During initial block analysis (first 1 second)
❌ During template initialization (handled separately)
❌ After component unmount

---

## Files Modified

### Preview Fix
- `app/detail/career-editor/[id]/page.tsx`
- `app/detail/project-editor/[id]/page.tsx`
- `app/editor/templates/shared-utils.ts`

### Auto-Save Fix
- `app/editor/templates/v3/hooks/useTemplateEditor.ts`

---

## Impact Summary

### Before
- ❌ Preview sometimes showed blank even with content
- ❌ Auto-save triggered on navigation
- ❌ Unnecessary database writes
- ❌ Poor user experience

### After
- ✅ Preview correctly shows all blocks with content
- ✅ Auto-save only triggers for user changes
- ✅ Better performance (fewer saves)
- ✅ Cleaner console logs for debugging
- ✅ No data loss risk
- ✅ Improved user experience

---

## Configuration

### Adjust Grace Period
If needed, change the auto-save grace period:

```typescript
// In useTemplateEditor.ts
setTimeout(() => {
  isInitialLoad.current = false;
}, 1000); // ← Adjust this value
```

**Recommendations:**
- **1000ms**: Good balance (default)
- **500ms**: For fast devices/simple pages
- **2000ms**: For slow devices/complex pages

### Adjust Auto-Save Delay
The auto-save delay after changes:

```typescript
// In career/project editor page
useTemplateEditor({
  entityId: id,
  entityType: 'career',
  autoSave: true,
  autoSaveDelay: 2500, // ← Adjust this value
});
```

---

## Debug Console Logs

### Successful Preview Load
```
[useTemplateEditor] Loading document: { entityId: "xyz", entityType: "career" }
[useTemplateEditor] ✅ Document loaded: { blocks: 5 }
[CareerEditor V3] Initializing UI state: { blocksCount: 5 }
[CareerEditor V3] Analyzing existing blocks for content...
[CareerEditor V3] Block 0 (hero): { hasContent: true }
[CareerEditor V3] Block 1 (richtext): { hasContent: true }
[CareerEditor V3] Block 2 (bullets): { hasContent: true }
[CareerEditor V3] Block 3 (metrics): { hasContent: true }
[CareerEditor V3] Saved block IDs: ['block-0', 'block-1', 'block-2', 'block-3']
[useTemplateEditor] ✅ Initial load complete, auto-save enabled
```

### User Edit Triggers Auto-Save
```
[useTemplateEditor] 🔄 Updating blocks: { oldCount: 5, newCount: 5, skipAutoSave: false }
[useTemplateEditor] ⏰ Scheduling auto-save in 2500 ms
[useTemplateEditor] 💾 Auto-save triggered for blocks update
[EntityDocumentManager] 💾 Saving career to portfolio: xyz
[EntityDocumentManager] ✅ Synced entity data
[EntityDocumentManager] 💾 Saved to localStorage
[EntityDocumentManager] ✅ Saved to database successfully!
[useTemplateEditor] ✅ Saved successfully
```

---

## Troubleshooting

### Preview Still Blank?
Check console for block content detection:
```javascript
// Should see hasContent: true for blocks with data
[CareerEditor V3] Block 2 (bullets): { hasContent: true, data: { bullets: [...] } }
```

If `hasContent: false` but you know there's content, the detection logic for that block type may need adjustment.

### Auto-Save Triggering Too Early?
1. Check if `isInitialLoad.current` is still true
2. Increase grace period from 1000ms to 2000ms
3. Check console for "⏭️ Skipping save (initial load)" messages

### Auto-Save Not Triggering at All?
1. Verify `autoSave: true` in hook options
2. Check if 1-second grace period has passed
3. Look for "⏰ Scheduling auto-save" in console
4. Verify block content actually changed

---

## Related Documentation

- `BLANK_PREVIEW_FIX.md` - Detailed preview fix explanation
- `AUTOSAVE_FIX.md` - Detailed auto-save fix explanation
- `V3_TEMPLATE_SYSTEM_COMPLETE.md` - Template system overview
- `TESTING_GUIDE_TEMPLATE_SAVE.md` - Testing guidelines


