# Subtitle Not Saving - Debug Guide

## I've Added Comprehensive Logging

I've added detailed console logs throughout the entire subtitle save flow to help us identify exactly where the issue is.

## How to Test & Debug

### Step 1: Open Project Editor
1. Go to `/editor`
2. Click "Edit detailed page" on a project  
3. Make sure you have a template selected
4. Open browser console (F12 or Cmd+Option+I)

### Step 2: Test Subtitle Input
1. Click on the subtitle field (right below the title)
2. Type something, e.g., "My Project Subtitle"
3. Watch the console logs

### Expected Console Output (Full Flow):

```
[HeroBlock] Subtitle changed: M
[Project Editor] Block changed at index 0 : hero
[Project Editor] Hero block data: {title: "...", subtitle: "M", description: "..."}

[HeroBlock] Subtitle changed: My
[Project Editor] Block changed at index 0 : hero
[Project Editor] Hero block data: {title: "...", subtitle: "My", description: "..."}

[HeroBlock] Subtitle changed: My Project Subtitle
[Project Editor] Block changed at index 0 : hero
[Project Editor] Hero block data: {title: "...", subtitle: "My Project Subtitle", description: "..."}

[Template Editor] Blocks changed, scheduling save...

(after 500ms)

[Template Editor] Hero block in save: {title: "...", subtitle: "My Project Subtitle", description: "..."}
[Template Editor] Updated project description (from subtitle): My Project Subtitle
[Template Editor] Saving project: {id: "...", title: "...", hasBlocks: 6, hasTags: 0}
[Template Editor] ✅ Saved successfully
```

## Debugging Scenarios

### Scenario 1: No logs at all
**What it means**: Subtitle input field not connected

**Check**: 
- Is the subtitle field visible?
- Can you type in it?
- Is it in the hero section (first section)?

### Scenario 2: `[HeroBlock] Subtitle changed` but no `[Project Editor] Block changed`
**What it means**: onChange not reaching the editor

**Problem**: Connection between HeroBlock → TemplateRenderer → Project Editor broken

**Solution**: Check that onChange props are properly passed through

### Scenario 3: `[Project Editor] Block changed` but subtitle is empty/wrong
**What it means**: Block update isn't preserving subtitle

**Check console**: Look at the `Hero block data` log - does it show the correct subtitle?

### Scenario 4: Subtitle in logs but `[Template Editor] Blocks changed` never fires
**What it means**: Change detection isn't seeing the blocks change

**Possible cause**: Blocks state not actually updating

**Solution**: The blocks might not be changing reference - check if setBlocks is being called

### Scenario 5: Everything logs but subtitle doesn't persist after refresh
**What it means**: Subtitle is in the blocks but not being loaded back

**Check**:
1. Run in Supabase SQL:
```sql
SELECT 
  id,
  title,
  blocks->0->'data'->>'subtitle' as hero_subtitle,
  blocks->0->'data' as hero_data
FROM projects
WHERE user_id = auth.uid()
ORDER BY updated_at DESC
LIMIT 1;
```

2. Check if `hero_subtitle` column shows your subtitle
3. If it's there, the save is working but the load might be broken

### Scenario 6: `[Template Editor] Hero block in save` shows subtitle but `Updated project description` is empty
**What it means**: The conditional logic to extract subtitle isn't working

**Check**: Look at the console log - does it show:
```
Hero block in save: {title: "X", subtitle: "Y", description: "Z"}
Updated project description (from subtitle): Y
```

If description is empty/null, the conditional might be failing.

## Common Issues

### Issue 1: Subtitle in blocks but not in project.description
The subtitle is saved in two places:
1. In `blocks[0].data.subtitle` (the full block data)
2. In `project.description` (extracted for the project card)

If the subtitle is in blocks but not in project.description, you'll see it in the editor but not on the project card in `/editor`.

### Issue 2: Description vs Subtitle
The hero block has BOTH `subtitle` and `description` fields:
- `subtitle`: Short tagline under the title
- `description`: Longer explanation

When saving, we prefer `subtitle` over `description` for the project card:
```javascript
description: heroBlock.data.subtitle || heroBlock.data.description
```

### Issue 3: Empty String vs Null
If subtitle is `""` (empty string), the conditional might not save it:
```javascript
...(heroBlock.data.subtitle || heroBlock.data.description ? {
  description: heroBlock.data.subtitle || heroBlock.data.description,
} : {})
```

This checks for truthy values, so empty string won't trigger the save.

## What to Share

After testing, please share:

1. **Console logs** - Copy/paste everything that appears when you type subtitle
2. **Which scenario** matches what you see
3. **Database check** - Run the SQL query and share the result

This will help me identify exactly where in the flow the subtitle is being lost.

## Quick Verification

After typing a subtitle:

1. **Check localStorage**:
   ```javascript
   // Run in console
   const data = JSON.parse(localStorage.getItem('portfolioData'));
   const project = data.projects.find(p => p.id === 'YOUR_PROJECT_ID');
   console.log('Project description:', project.description);
   console.log('Hero subtitle:', project.blocks?.[0]?.data?.subtitle);
   ```

2. **Both should show your subtitle**

3. **If description is empty but subtitle is there**: The save logic isn't extracting it
4. **If both are empty**: The subtitle isn't being saved to blocks at all

## Files to Check

If we need to investigate further:
- `/app/editor/templates/blocks/HeroBlock.tsx` - Subtitle input
- `/app/detail/project-editor/[id]/page.tsx` - Block change handling & save logic
- `/app/editor/templates/TemplateRenderer.tsx` - onChange propagation

---

Let me know what you see in the console and we'll fix this! 🔍

