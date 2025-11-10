# Block Save Debugging - Complete Guide

## What I Fixed

Added comprehensive logging to track when **any** block is updated and saved on the project detail editor page.

## How Data Saves for Different Blocks

### Hero Block (Index 0)
**Fields**: title, subtitle, description, imageUrl, role, link, tags, timeline, year, team, client

**Save Flow**:
```
User edits field
  ↓
updateHeroField(field, value) 
  ↓
Updates heroBlock.data[field]
  ↓
Logs: [Detail Page] 📝 Updating hero field: {field} = {value}
  ↓
Logs: [Detail Page] ✏️ Hero block updated with {field} : {value}
  ↓
Logs: [Detail Page] 💾 Saving blocks with updated hero data...
  ↓
saveBlocks(updatedBlocks)
  ↓
After 500ms → saves to database
```

### All Other Blocks (richtext, callout, bullets, steps, metrics, gallery, embed, feature_grid)
**Save Flow**:
```
User edits content in TemplateRenderer
  ↓
TemplateRenderer calls onChange(newBlocks)
  ↓
Logs: [Detail Page] 📝 Block updated: {type} at index {index}
  ↓
Logs: [Detail Page] 🔍 New block data: {...}
  ↓
Logs: [Detail Page] 💾 Saving all blocks...
  ↓
saveBlocks(updatedBlocks)
  ↓
After 500ms → saves to database
```

## Testing Each Block Type

### 1. Hero Block (Already Tested - Subtitle Issue)
**Fields to test**:
- ✅ Title
- ✅ **Subtitle** ← This was the reported issue
- ✅ Description
- ✅ Image URL
- ✅ Role
- ✅ Link
- ✅ Tags
- ✅ Timeline
- ✅ Year
- ✅ Team
- ✅ Client

**Console logs to watch for**:
```
[Detail Page] 📝 Updating hero field: subtitle = My Subtitle
[Detail Page] ✏️ Hero block updated with subtitle : My Subtitle
[Detail Page] 💾 Saving blocks with updated hero data...
[Detail Page] 💾 Saving blocks to database. Count: X
[Detail DB] ✅ Blocks saved successfully to database
```

### 2. Rich Text Block
**What to test**: Long-form text content

**Steps**:
1. Add a Rich Text section
2. Type or paste content
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: richtext at index 1
[Detail Page] 🔍 New block data: {type: "richtext", data: {body: "..."}}
[Detail Page] 💾 Saving all blocks...
```

### 3. Callout Block
**What to test**: Highlighted information box

**Steps**:
1. Add a Callout section
2. Edit the callout text
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: callout at index X
[Detail Page] 🔍 New block data: {type: "callout", data: {body: "...", color: "..."}}
[Detail Page] 💾 Saving all blocks...
```

### 4. Bullets Block
**What to test**: Bullet point list

**Steps**:
1. Add a Bullets section
2. Add/edit bullet points
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: bullets at index X
[Detail Page] 🔍 New block data: {type: "bullets", data: {bullets: ["...", "..."]}}
[Detail Page] 💾 Saving all blocks...
```

### 5. Steps Block
**What to test**: Sequential steps/process

**Steps**:
1. Add a Steps section
2. Add/edit steps with titles and descriptions
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: steps at index X
[Detail Page] 🔍 New block data: {type: "steps", data: {steps: [{title: "...", description: "..."}]}}
[Detail Page] 💾 Saving all blocks...
```

### 6. Metrics Block
**What to test**: Key numbers and statistics

**Steps**:
1. Add a Metrics section
2. Add/edit metrics with values and labels
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: metrics at index X
[Detail Page] 🔍 New block data: {type: "metrics", data: {metrics: [{value: "45%", metric: "...", description: "..."}]}}
[Detail Page] 💾 Saving all blocks...
```

### 7. Gallery Block
**What to test**: Image grid/carousel

**Steps**:
1. Add a Gallery section
2. Add image URLs
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: gallery at index X
[Detail Page] 🔍 New block data: {type: "gallery", data: {images: ["url1", "url2"], layout: "..."}}
[Detail Page] 💾 Saving all blocks...
```

### 8. Feature Grid Block
**What to test**: Grid of features/highlights

**Steps**:
1. Add a Feature Grid section
2. Add/edit feature items
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: feature_grid at index X
[Detail Page] 🔍 New block data: {type: "feature_grid", data: {items: [{title: "...", description: "..."}]}}
[Detail Page] 💾 Saving all blocks...
```

### 9. Embed Block
**What to test**: External content (Figma, videos, PDFs)

**Steps**:
1. Add an Embed section
2. Add an embed URL
3. Watch console logs

**Expected logs**:
```
[Detail Page] 📝 Block updated: embed at index X
[Detail Page] 🔍 New block data: {type: "embed", data: {url: "...", embedType: "..."}}
[Detail Page] 💾 Saving all blocks...
```

## Complete Test Procedure

### Step 1: Start Fresh
1. Go to `/editor`
2. Click "Edit detailed page" on a project
3. Choose a template
4. Open browser console (F12)

### Step 2: Test Each Block
For **every block type** in your template:

1. **Edit the content**
2. **Wait 1 second** (for save to trigger)
3. **Check console** for:
   - `📝 Block updated` or `📝 Updating hero field`
   - `💾 Saving blocks...`
   - `✅ Blocks saved successfully`
4. **Refresh the page**
5. **Verify content persists**

### Step 3: Verify in Database
Run in Supabase SQL Editor:
```sql
SELECT 
  id,
  title,
  template_type,
  jsonb_array_length(blocks) as block_count,
  blocks->0->'data'->>'subtitle' as hero_subtitle,
  blocks->1->'type' as second_block_type,
  blocks->1->'data' as second_block_data,
  blocks
FROM projects
WHERE user_id = auth.uid()
ORDER BY updated_at DESC
LIMIT 1;
```

This shows:
- How many blocks you have
- The subtitle from hero block
- The type and data of the second block
- Full blocks JSON

## Troubleshooting

### Block Updates But Doesn't Save
**Symptom**: See "Block updated" log but no "Saving blocks" log

**Cause**: TemplateRenderer onChange not firing

**Fix**: Check TemplateRenderer component

### Saves to LocalStorage But Not Database
**Symptom**: Shows in app until refresh, then disappears

**Console shows**:
```
[Detail Page] 💾 Saving blocks to database. Count: X
[Detail DB] ❌ Error saving blocks: column "blocks" does not exist
```

**Fix**: Run `FIX_PROJECTS_TABLE.sql`

### Some Blocks Save, Others Don't
**Symptom**: Hero saves but other blocks don't (or vice versa)

**Debug**:
1. Check which block types trigger logs
2. Compare working vs non-working blocks
3. Look for errors in TemplateRenderer

### Save Status Stuck on "Saving..."
**Symptom**: Never shows "Saved"

**Cause**: Database save failing without error handling

**Check**: Look for database errors in console

## What Logs Mean

| Log Message | Meaning |
|------------|---------|
| `📝 Updating hero field` | Hero field changed |
| `📝 Block updated` | Non-hero block changed |
| `🔍 New block data` | Shows what data is being saved |
| `💾 Saving blocks` | About to save to localStorage & database |
| `💾 Saving blocks to database` | Database save started |
| `✅ Blocks saved successfully` | Database save completed |
| `❌ Error saving blocks` | Database save failed |

## Common Issues Fixed

### Issue 1: Subtitle Not Saving (✅ Fixed)
- Added logging to `updateHeroField`
- Confirmed subtitle goes through correct save flow
- Same fix applies to all hero fields

### Issue 2: No Visibility Into Block Saves
- Added logging to TemplateRenderer onChange
- Can now see when any block type updates
- Shows exactly what data is being saved

### Issue 3: Async Save Timing
- Fixed setTimeout not awaiting database save
- Save status now accurate
- "Saved" only shows after database confirms

## Summary

**Before**: No way to tell if blocks were saving or which blocks had issues

**After**: Comprehensive logging for:
- ✅ Every hero field update (subtitle, timeline, team, etc.)
- ✅ Every block type update (richtext, callout, bullets, etc.)
- ✅ What data is being saved
- ✅ When database save completes
- ✅ Any errors that occur

Now you can test each block type and see exactly what's happening in the console!

