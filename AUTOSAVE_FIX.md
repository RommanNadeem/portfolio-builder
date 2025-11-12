# Auto-Save Fix - Prevent Saves During Navigation

## Problem
Auto-save was triggering during navigation to career/project detail pages, causing unnecessary database writes before the user made any changes.

## Root Cause
The `useTemplateEditor` hook's auto-save mechanism was activating too early:

1. **Early Activation**: The `isInitialLoad` flag was set to `false` immediately after the document loaded
2. **Post-Load Initialization**: Career/project editor pages do additional initialization after document load (analyzing blocks, setting up UI state)
3. **Unintended Triggers**: Any `updateBlocks()` calls during this initialization period would trigger auto-save

**Timeline:**
```
1. Document loads (0ms)
2. isInitialLoad = false (0ms) ← TOO EARLY!
3. Editor UI initializes (0-500ms)
4. Editor analyzes blocks (100-600ms)
5. User hasn't touched anything yet, but auto-save might trigger
```

## Solution

### 1. Grace Period for Initialization
Added a 1-second delay before enabling auto-save to allow editor pages to complete their initialization:

**File Modified:** `app/editor/templates/v3/hooks/useTemplateEditor.ts`

```typescript
// Before
finally {
  setLoading(false);
  isInitialLoad.current = false; // ← Immediate
}

// After
finally {
  setLoading(false);
  // Delay setting isInitialLoad to false to allow editor pages to initialize
  // This prevents auto-save from triggering during navigation/mounting
  setTimeout(() => {
    console.log('[useTemplateEditor] ✅ Initial load complete, auto-save enabled');
    isInitialLoad.current = false;
  }, 1000); // 1 second grace period for UI initialization
}
```

### 2. Optional Skip Auto-Save Parameter
Added an optional `skipAutoSave` parameter to `updateBlocks()` for cases where programmatic updates shouldn't trigger saves:

```typescript
// Updated signature
updateBlocks: (newBlocks: TemplateBlock[], skipAutoSave?: boolean) => void;

// Implementation with multiple safeguards
const updateBlocks = useCallback((newBlocks: TemplateBlock[], skipAutoSave = false) => {
  // ... update state ...
  
  // Trigger auto-save (with multiple safeguards)
  if (skipAutoSave) {
    console.log('[useTemplateEditor] ⏭️ Skipping save (explicitly disabled)');
  } else if (!autoSave) {
    console.log('[useTemplateEditor] ⚠️ Auto-save is disabled');
  } else if (isInitialLoad.current) {
    console.log('[useTemplateEditor] ⏭️ Skipping save (initial load)');
  } else {
    // Proceed with auto-save
  }
}, [document, autoSave, autoSaveDelay, save]);
```

### 3. Multiple Safeguards
Auto-save now has three layers of protection:

1. **`skipAutoSave` flag**: Explicit override for programmatic updates
2. **`isInitialLoad` check**: Prevents saves during initial page load
3. **`autoSave` setting**: Respects the hook configuration

### 4. Cleanup on Unmount
Existing cleanup prevents pending saves after navigation away:

```typescript
useEffect(() => {
  return () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };
}, []);
```

## When Auto-Save SHOULD Trigger

✅ **User edits block content** (after 1-second grace period)
✅ **User reorders blocks via drag-and-drop** (after 1-second grace period)  
✅ **User deletes a block** (after 1-second grace period)
✅ **User adds a new block** (after 1-second grace period)

## When Auto-Save Should NOT Trigger

❌ **During page navigation/mounting**
❌ **During initial block analysis** (first 1 second)
❌ **During template initialization** (handled separately with immediate save)
❌ **After component unmount** (timeout is cleared)

## Testing

### Test Case 1: Navigation Should Not Trigger Save
1. Open a career or project detail page with existing content
2. Wait for page to load completely
3. **Do not make any changes**
4. Watch the console logs

**Expected:**
```
[useTemplateEditor] Loading document: { entityId: "...", entityType: "career" }
[useTemplateEditor] ✅ Document loaded: { id: "...", blocks: 5 }
[CareerEditor V3] Analyzing existing blocks for content...
[CareerEditor V3] Block 0 (hero): { hasContent: true, ... }
[CareerEditor V3] Saved block IDs: [...]
[useTemplateEditor] ✅ Initial load complete, auto-save enabled
// NO auto-save triggered!
```

### Test Case 2: User Changes Should Trigger Save
1. Open a career or project detail page
2. Wait 1+ seconds for initialization to complete
3. Edit a block (e.g., add text to a bullets block)
4. Wait 2.5 seconds (auto-save delay)

**Expected:**
```
[useTemplateEditor] 🔄 Updating blocks: { oldCount: 5, newCount: 5, skipAutoSave: false }
[useTemplateEditor] ⏰ Scheduling auto-save in 2500 ms
// ... after 2.5 seconds ...
[useTemplateEditor] 💾 Auto-save triggered for blocks update
[useTemplateEditor] ✅ Saved successfully
```

### Test Case 3: Drag-and-Drop Should Trigger Save
1. Open a career or project detail page
2. Wait 1+ seconds for initialization
3. Drag and drop a block to reorder
4. Wait 2.5 seconds

**Expected:**
```
[useTemplateEditor] 🔄 Updating blocks: { oldCount: 5, newCount: 5, skipAutoSave: false }
[useTemplateEditor] ⏰ Scheduling auto-save in 2500 ms
// ... auto-save proceeds ...
```

## Configuration

The grace period can be adjusted if needed:

```typescript
// In useTemplateEditor.ts, line 95
setTimeout(() => {
  console.log('[useTemplateEditor] ✅ Initial load complete, auto-save enabled');
  isInitialLoad.current = false;
}, 1000); // ← Adjust this value if needed
```

**Recommendations:**
- **1000ms (1 second)**: Good balance for most use cases
- **500ms**: If pages load very quickly and you want faster auto-save
- **2000ms**: If pages have complex initialization or slow devices

## Impact

This fix ensures that:
- ✅ No unnecessary database writes during navigation
- ✅ Better performance (fewer saves)
- ✅ Cleaner console logs
- ✅ User changes are still automatically saved
- ✅ No data loss risk

## Related Files

- `app/editor/templates/v3/hooks/useTemplateEditor.ts` - Main auto-save logic
- `app/detail/career-editor/[id]/page.tsx` - Career editor page
- `app/detail/project-editor/[id]/page.tsx` - Project editor page
- `app/detail/components/TemplateEditorContent.tsx` - Block rendering and drag-and-drop


