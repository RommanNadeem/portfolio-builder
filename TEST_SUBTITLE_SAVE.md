# Testing Subtitle Save Issue

## The Problem
User added a subtitle to a project and it wasn't saved.

## How Subtitle Should Work

The subtitle is stored in the **hero block** of the template blocks (not in the main project metadata).

### Data Flow:
```
User types subtitle
  ↓
updateHeroField('subtitle', value)
  ↓
Updates heroBlock.data.subtitle
  ↓
saveBlocks(updatedBlocks)
  ↓
Saves to localStorage immediately
  ↓
After 500ms → saves to database (projects.blocks column)
```

## Testing Steps

### 1. Check Database Has blocks Column
Run this SQL in Supabase:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'blocks';
```

Expected: Should see `blocks | jsonb`

If missing, run: `FIX_PROJECTS_TABLE.sql`

### 2. Test Subtitle Save

1. Go to `/editor`
2. Click "Edit detailed page" on a project
3. Choose a template (e.g., Product Case Study)
4. Open browser console (F12)
5. Type a subtitle in the subtitle field
6. Watch console logs:

**Expected console output:**
```
[Detail Page] 📝 Updating hero field: subtitle = Your subtitle here
[Detail Page] ✏️ Hero block updated with subtitle : Your subtitle here
[Detail Page] 💾 Saving blocks with updated hero data...
[Detail Page] 💾 Saving blocks to database. Count: X
[Detail DB] 💾 Saving blocks directly to Supabase...
[Detail DB] Blocks count: X
[Detail DB] Sample blocks data: [{type: "hero", data: {subtitle: "Your subtitle here", ...}}]
[Detail DB] ✅ Blocks saved successfully to database
[Detail Page] ✅ Blocks saved to database
```

### 3. Verify in Database

Run in Supabase SQL Editor:
```sql
SELECT 
  id,
  title,
  blocks->0->'data'->>'subtitle' as hero_subtitle,
  blocks
FROM projects
WHERE user_id = auth.uid()
ORDER BY updated_at DESC
LIMIT 5;
```

Expected: Should see your subtitle in the `hero_subtitle` column

### 4. Verify After Refresh

1. Refresh the detail page
2. Subtitle should still be there
3. Check console for load logs:
```
[Detail Page] 📦 Loaded project with blocks
```

## Common Issues

### Issue 1: blocks Column Missing
**Error**: `column "blocks" does not exist`

**Solution**: Run `FIX_PROJECTS_TABLE.sql` migration

### Issue 2: Blocks Not Saving
**Symptom**: Console shows save but data not in database

**Check**:
1. Look for error messages in console
2. Run verification SQL to see if blocks are empty
3. Check RLS policies allow writes

### Issue 3: Subtitle Not in Blocks
**Symptom**: Blocks saved but subtitle is null/missing

**Debug**:
Check console log for:
```
[Detail DB] Sample blocks data: [...]
```

Look at the hero block structure - subtitle should be there.

### Issue 4: LocalStorage vs Database Mismatch
**Symptom**: Subtitle shows until page refresh, then disappears

**Diagnosis**: Saves to localStorage but not database

**Fix**: Check for database save errors in console

## What I Fixed

Added detailed console logging to `updateHeroField`:
- Logs when subtitle is changed
- Logs when blocks are being saved
- Helps track the entire save flow

Now you can see exactly when subtitle updates and if it's being saved.

## Next Steps

1. Try adding a subtitle again
2. Watch the browser console
3. Share the console output if it's not saving
4. I can debug further based on the logs

