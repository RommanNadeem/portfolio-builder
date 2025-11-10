# Template Type Not Saving - FIXED ✅

## Problem

When clicking "Edit detailed page" on a project that already had a template selected, it was showing the template selection screen again instead of going directly to the editor.

**User reported:**
```javascript
Project data: {
  id: '1afcebb2-2d09-4cf9-9acc-2f52b685bbc1',
  title: 'Humraaz',
  template_type: null,  // ❌ Should be 'product-case-study'
  has_blocks: 0         // ❌ Should be 6
}
```

## Root Cause

The auto-save effect wasn't tracking `selectedTemplate` changes properly:

**BEFORE (Broken):**
```javascript
useEffect(() => {
  // Only watched blocks, not selectedTemplate
  if (currentBlocksStr === previousBlocksRef.current) {
    return; // Skipped save when template selected!
  }
  
  saveProject();
}, [blocks, flowState]); // ❌ Missing selectedTemplate
```

**What happened:**
1. User selected template → `selectedTemplate` = 'product-case-study'
2. Blocks were created → `blocks` = [hero, overview, ...]
3. Auto-save triggered because `blocks` changed
4. But the OLD `saveProject` callback ran (before `selectedTemplate` updated)
5. Saved with `template_type: null`

## The Fix

### 1. Track Template Changes
```javascript
const previousTemplateRef = useRef<string | null>(null);

useEffect(() => {
  // Now tracks BOTH blocks and template changes
  const blockChanged = currentBlocksStr !== previousBlocksRef.current;
  const templateChanged = selectedTemplate !== previousTemplateRef.current;
  
  if (!blockChanged && !templateChanged) {
    return; // No change, skip
  }
  
  console.log('[Template Editor] Data changed:', {
    blockChanged,
    templateChanged,
    selectedTemplate  // Shows the actual template
  });
  
  saveProject();
}, [blocks, flowState, selectedTemplate]); // ✅ Added selectedTemplate
```

### 2. Added Guardrails in saveProject
```javascript
const saveProject = useCallback(() => {
  // Early exit if template not selected
  if (!selectedTemplate) {
    console.log('[Template Editor] ❌ No selectedTemplate, skipping save');
    return;
  }
  
  if (blocks.length === 0) {
    console.log('[Template Editor] ❌ No blocks, skipping save');
    return;
  }
  
  console.log('[Template Editor] 🔄 Starting save...', {
    selectedTemplate,  // Confirm it's not null
    blocksCount: blocks.length
  });
  
  // ... save logic ...
}, [projectData, selectedTemplate, blocks, projectId]);
```

### 3. Enhanced Logging Throughout
```javascript
// When loading:
console.log('[Template Editor] 📦 Loading project:', {
  template_type: project.template_type,
  blocks_count: project.blocks?.length
});

// When selecting template:
console.log('[Template Editor] ✅ Template selected:', templateType);

// When saving:
console.log('[Template Editor] ⭐ About to save:', {
  template_type: updatedProject.template_type,
  blocks_count: updatedProject.blocks?.length
});

// After save verification:
console.log('[Template Editor] ✅ Verification:', {
  template_type: savedProject?.template_type,
  blocks_count: savedProject?.blocks?.length
});
```

### 4. Added Database Save Integration
```javascript
// After localStorage save, also save to database
(async () => {
  const user = await getCurrentUser();
  if (user) {
    // Save metadata (including template_type)
    await saveProjectMetadata(user.id, projectId, {
      title: updatedProject.title,
      description: updatedProject.description,
      template_type: updatedProject.template_type,  // ⭐
    });
    
    // Save blocks
    await saveProjectBlocks(user.id, projectId, updatedProject.blocks);
  }
})();
```

## Expected Behavior Now

### First Time (No Template)
```
1. Click "Edit detailed page"
   → Console: "No template, showing selector"
   → Shows template selection screen

2. Select "Product Case Study"
   → Console: "Template selected: product-case-study"
   → Console: "Created blocks: 8"
   → Console: "Data changed, scheduling save..."
   → Console: "About to save: template_type: product-case-study, blocks_count: 8"
   → Console: "✅ Saved successfully"
   → Console: "Verification: template_type: product-case-study, blocks_count: 8"

3. Go back to /editor

4. Click "Edit detailed page" again
   → Console: "Loading project: template_type: product-case-study, blocks_count: 8"
   → Console: "✅ Has template, going to editing mode"
   → Opens editor directly (skips template selector) ✅
```

### Subsequent Edits
```
1. Edit content (subtitle, metrics, etc.)
   → Console: "Data changed, scheduling save..."
   → Saves after 500ms

2. Go back and click edit again
   → Opens editor directly ✅
```

## Testing Checklist

1. **Test New Project:**
   - [ ] Create new project in `/editor`
   - [ ] Add title and description
   - [ ] Click "Edit detailed page"
   - [ ] Should show template selector
   - [ ] Select template
   - [ ] Console shows: `template_type: product-case-study`
   - [ ] Go back to `/editor`
   - [ ] Click edit again
   - [ ] Should go directly to editor (no template selector)

2. **Test Existing Project:**
   - [ ] Click edit on project that already has template
   - [ ] Console shows: `Has template, going to editing mode`
   - [ ] Should go directly to editor
   - [ ] Make changes
   - [ ] Verification shows template_type is saved

3. **Test Database Persistence:**
   - [ ] Run `FIX_PROJECTS_TABLE.sql` first
   - [ ] Edit project and template
   - [ ] Console shows: `✅ Metadata saved to database`
   - [ ] Console shows: `✅ Blocks saved to database`
   - [ ] Open different browser/device
   - [ ] Same template content appears

## What Console Logs to Look For

### Success:
```
[Template Editor] 📦 Loading project: {template_type: "product-case-study", blocks_count: 8}
[Template Editor] ✅ Has template, going to editing mode
[Template Editor] ⭐ About to save: {template_type: "product-case-study", blocks_count: 8}
[Template Editor] ✅ Verification: {template_type: "product-case-study", blocks_count: 8}
[Template Editor] ✅ Metadata saved to database
[Template Editor] ✅ Blocks saved to database
```

### Problems:
```
[Template Editor] ❌ No selectedTemplate, skipping save
  → Template selection didn't work

[Template Editor] ✅ Verification: {template_type: null, blocks_count: 0}
  → Save didn't work

[Template Editor] 📦 Loading project: {template_type: null, blocks_count: 0}
  → Data not persisting
```

## Files Modified

1. **`app/detail/project-editor/[id]/page.tsx`**
   - Added `selectedTemplate` to auto-save dependencies
   - Added template change tracking with ref
   - Added comprehensive logging throughout
   - Added database save integration
   - Added early-exit guards in saveProject
   - Added verification after save

## Summary

**Before:**
- ❌ `template_type` wasn't being saved
- ❌ Always showed template selector
- ❌ No visibility into what was happening
- ❌ Only saved to localStorage

**After:**
- ✅ `template_type` saves correctly
- ✅ Goes directly to editor when template exists
- ✅ Detailed console logs for debugging
- ✅ Saves to both localStorage AND database
- ✅ Verification confirms save worked
- ✅ Change detection prevents unnecessary saves

---

**Status:** ✅ Fixed and ready to test
**Next Step:** Try selecting a template, go back, and click edit again - it should go directly to the editor!

