# ⚠️ Database Migration Required

## Current Status

The featured achievements functionality is **partially working**:

✅ **Working Locally:**
- Add career highlights with achievements
- Mark achievements as featured (star icons)
- View featured achievements on cards
- All functionality works in the editor
- Data saved to localStorage

❌ **Database Save Error:**
- Supabase database doesn't have new columns yet
- You'll see error: "Failed to save your portfolio data. Please try again."
- Data will be lost if you clear browser or switch devices

## Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL

Copy and paste this SQL into the editor:

```sql
-- Add featured_achievements column
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS featured_achievements JSONB DEFAULT NULL;

-- Add achievements_order column
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS achievements_order JSONB DEFAULT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_career_highlights_featured 
ON career_highlights USING GIN (featured_achievements);
```

### Step 3: Execute

1. Click **Run** (or press Cmd+Enter on Mac, Ctrl+Enter on Windows)
2. Wait for "Success. No rows returned" message
3. Close the SQL editor

### Step 4: Verify

1. Refresh your portfolio builder app
2. Try adding a career highlight with achievements
3. Mark some as featured (star icons)
4. The save should now work without errors!

## What These Columns Do

- **featured_achievements**: Stores indices of up to 3 achievements to show on portfolio cards
  - Example: `[0, 2, 4]` means show the 1st, 3rd, and 5th achievements
  - Displayed prominently on your portfolio
  
- **achievements_order**: (Optional) Allows custom ordering of achievements
  - Not currently used, reserved for future drag-and-drop feature

## Temporary Workaround (If You Can't Run Migration Yet)

The app will continue working with localStorage only:
- All your edits are saved locally
- Featured achievements work in the editor
- You just can't sync across devices yet

**To preserve your data:**
1. Don't clear your browser cache
2. Don't use incognito/private mode
3. Stay on the same device
4. Run the migration as soon as possible

## After Migration

Once you run the migration:

✅ Data syncs to database automatically
✅ Works across all your devices  
✅ Featured achievements persist permanently  
✅ No more save errors  

## Rollback (If Needed)

If you need to undo the migration for any reason:

```sql
ALTER TABLE career_highlights DROP COLUMN IF EXISTS featured_achievements;
ALTER TABLE career_highlights DROP COLUMN IF EXISTS achievements_order;
DROP INDEX IF EXISTS idx_career_highlights_featured;
```

## Need Help?

**Check if migration ran successfully:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'career_highlights' 
AND column_name IN ('featured_achievements', 'achievements_order');
```

You should see 2 rows returned. If you see 0 rows, the migration hasn't run yet.

**Still seeing errors after migration?**

1. Hard refresh the app (Cmd+Shift+R / Ctrl+Shift+F5)
2. Clear browser cache
3. Try in incognito mode
4. Check browser console for specific error messages

## Technical Details

The migration is:
- **Safe**: Uses `ADD COLUMN IF NOT EXISTS` (won't fail if already exists)
- **Non-breaking**: Columns are nullable (won't affect existing data)
- **Backwards compatible**: Old code continues working
- **Instant**: Takes < 1 second to run
- **Reversible**: Can be rolled back if needed

---

**Priority:** 🔴 High (Required for full functionality)  
**Time Required:** ⏱️ 5 minutes  
**Difficulty:** 🟢 Easy (copy/paste SQL)  
**Risk:** 🟢 Low (safe, reversible)

