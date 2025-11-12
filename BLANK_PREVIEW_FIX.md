# Blank Preview Fix - Career/Project Pages

## Problem
When opening a career or project page from the editor and clicking preview, the preview was sometimes blank even though the page had content.

## Root Cause
The career and project editor pages had their own simplified `hasBlockContent()` function that didn't properly detect content for all block types. This caused the following issues:

1. **Incomplete Block Type Support**: The local function only did basic type checking (string, array, object) but didn't understand the specific data structure of each block type (bullets, metrics, gallery, etc.)

2. **Incorrect Content Detection**: For example:
   - **Bullets block**: Has `data.bullets` array, not just `data`
   - **Metrics block**: Has `data.metrics` array with objects
   - **Gallery block**: Has `data.images` array
   - The simplified function couldn't detect content in these structures properly

3. **Preview Filtering**: In preview mode, blocks without detected content are hidden (see `TemplateEditorContent.tsx` lines 54-56). If content wasn't detected correctly, ALL blocks would be hidden, resulting in a blank preview.

## Solution

### 1. Use Proper Content Detection Function
Replaced the simplified local `hasBlockContent()` function with the comprehensive one from `shared-utils.ts` that properly checks all block types:

**Files Modified:**
- `app/detail/career-editor/[id]/page.tsx`
- `app/detail/project-editor/[id]/page.tsx`

**Change:**
```typescript
// Before: Local simplified version
function hasBlockContent(block: TemplateBlock): boolean {
  // ... basic checks that didn't understand block structures
}

// After: Import proper version
import { hasBlockContent } from '@/app/editor/templates/shared-utils';
```

### 2. Improved Content Detection Function
Enhanced the shared `hasBlockContent()` function to be more explicit and reliable:

**File Modified:** `app/editor/templates/shared-utils.ts`

**Improvements:**
```typescript
// Now explicitly returns boolean for all block types
if (block.type === 'richtext') return !!(block.data?.body?.trim());
if (block.type === 'bullets') return !!(block.data?.bullets?.some((b: string) => b.trim()));
if (block.type === 'metrics') return !!(block.data?.metrics?.some((m: any) => m.value?.trim()));
if (block.type === 'gallery') return !!(block.data?.images?.length > 0);
// ... etc for all block types
```

### 3. Added Diagnostic Logging
Added detailed console logging to help debug future issues:

```typescript
console.log('[CareerEditor V3] Analyzing existing blocks for content...');
blocks.forEach((block, idx) => {
  const hasContent = hasBlockContent(block);
  console.log(`[CareerEditor V3] Block ${idx} (${block.type}):`, {
    id: block.id,
    type: block.type,
    hasContent,
    data: block.data,
  });
});
console.log('[CareerEditor V3] Saved block IDs:', Array.from(saved));
```

## How Content Detection Works Now

The `hasBlockContent()` function properly checks each block type:

1. **Hero Block**: Always has content (contains primary metadata)
2. **Rich Text**: Checks if `data.body` has text
3. **Callout**: Checks if `data.body` has text
4. **Bullets**: Checks if `data.bullets` array has non-empty strings
5. **Steps**: Checks if `data.steps` array has items with titles
6. **Feature Grid**: Checks if `data.items` array has items with titles
7. **Gallery**: Checks if `data.images` array has items
8. **Metrics**: Checks if `data.metrics` array has items with values
9. **Embed**: Checks if `data.url` exists

## Testing

To verify the fix:

1. **Create a career highlight** with various sections (bullets, metrics, etc.)
2. **Add content** to the sections in the career editor
3. **Save** the changes
4. **Navigate back** to the main editor
5. **Click on the career card** to open the detail page in preview mode
6. **Verify** that all sections with content are visible

**Check Console Logs:**
Open browser DevTools console and look for:
```
[CareerEditor V3] Analyzing existing blocks for content...
[CareerEditor V3] Block 0 (hero): { hasContent: true, ... }
[CareerEditor V3] Block 1 (bullets): { hasContent: true, ... }
[CareerEditor V3] Block 2 (metrics): { hasContent: true, ... }
[CareerEditor V3] Saved block IDs: ['block-1', 'block-2', ...]
```

If a block shows `hasContent: false` but you know it has content, that indicates the content detection needs further refinement for that specific block type.

## Impact

This fix ensures that:
- ✅ Preview mode correctly displays all blocks with content
- ✅ Empty blocks are still hidden in preview (as intended)
- ✅ The same logic is used across both career and project editors
- ✅ Better diagnostics for future debugging

## Related Files

- `app/detail/career-editor/[id]/page.tsx` - Career editor
- `app/detail/project-editor/[id]/page.tsx` - Project editor  
- `app/editor/templates/shared-utils.ts` - Shared utilities with proper content detection
- `app/detail/components/TemplateEditorContent.tsx` - Preview rendering logic


