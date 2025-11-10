# Template System - Database Setup

## Database Changes Required

The template system requires adding new columns to the `projects` table. Run the SQL migration file to add these columns.

### Migration File

**File**: `ADD_TEMPLATE_COLUMNS.sql`

```sql
-- Add role column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS role TEXT;

-- Add template_type column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS template_type TEXT;

-- Add published status columns
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(user_id, published);
CREATE INDEX IF NOT EXISTS idx_projects_template_type ON projects(user_id, template_type);
```

### How to Run Migration

**Option 1: Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `ADD_TEMPLATE_COLUMNS.sql`
4. Click "Run"

**Option 2: Command Line (if you have direct access)**
```bash
psql -h your-host -U postgres -d your-database -f ADD_TEMPLATE_COLUMNS.sql
```

**Option 3: Railway/Supabase CLI**
```bash
supabase db push
```

## New Columns Added

### `role` (TEXT)
- **Purpose**: Stores the user's role in the project
- **Example**: "Lead Designer", "Full-stack Developer", "Product Manager"
- **Nullable**: Yes (optional field)

### `template_type` (TEXT)
- **Purpose**: Identifies which template the project uses
- **Example**: "product-case-study", "product-design-case-study", "blank"
- **Nullable**: Yes (null for legacy non-template projects)

### `published` (BOOLEAN)
- **Purpose**: Indicates if project is published and visible
- **Default**: `false`
- **Nullable**: No

### `published_at` (TIMESTAMPTZ)
- **Purpose**: Records when the project was published
- **Example**: "2024-11-07T10:30:00Z"
- **Nullable**: Yes

## Data Flow

### When User Edits Project:

1. **Local Changes** → Immediate localStorage update
2. **Debounced Save** → After 500ms of no activity:
   - Metadata changes → `saveProjectMetadata()`
   - Block changes → `saveProjectBlocks()`
3. **Database Update** → Supabase `projects` table

### What Gets Saved:

**Metadata (via `saveProjectMetadata`):**
- `title` - Project title
- `description` - Project description
- `tags` - Array of tags
- `link` - Project URL
- `role` - User's role ✨ NEW
- `template_type` - Template ID ✨ NEW
- `published` - Published status ✨ NEW
- `published_at` - Publish timestamp ✨ NEW

**Blocks (via `saveProjectBlocks`):**
- `blocks` - JSONB array of template blocks or legacy blocks

### Auto-Save from Editor:

When user edits in the main editor (not detail page):
- Uses `saveCompletePortfolio()` function
- Upserts entire portfolio including all projects
- Now includes `role`, `template_type`, `published`, `published_at`

## Verification

### Check if Data is Saving:

1. **Console Logs**: Open browser console and look for:
   ```
   [Detail Page] 💾 Saving metadata to database: {...}
   [Detail Page] ✅ Metadata saved to database
   
   [Detail Page] 💾 Saving blocks to database. Count: 8
   [Detail Page] ✅ Blocks saved to database
   
   [Database Debug] ✅ Projects upserted with template data
   ```

2. **Supabase Dashboard**:
   - Go to Table Editor → `projects`
   - Find your project by ID
   - Check columns: `role`, `template_type`, `blocks`, `published`

3. **Network Tab**:
   - Filter for "projects" requests
   - Check PATCH/POST requests to Supabase
   - Verify payload includes new fields

### Common Issues:

**Issue**: Columns don't exist
- **Solution**: Run the migration SQL file

**Issue**: Data not saving
- **Console**: Check for database errors in console
- **Auth**: Ensure user is authenticated
- **Permissions**: Check Supabase RLS policies

**Issue**: Template type not persisting
- **Check**: localStorage has `template_type` field
- **Check**: Database column exists
- **Check**: Console shows successful save

## Testing Checklist

- [ ] Run `ADD_TEMPLATE_COLUMNS.sql` migration
- [ ] Create new project with template
- [ ] Fill in role field
- [ ] Add template content
- [ ] Check console for save confirmations
- [ ] Verify in Supabase dashboard
- [ ] Refresh page - data should persist
- [ ] Publish project - check `published` field updates
- [ ] Check `published_at` timestamp is set

## Rollback (If Needed)

```sql
ALTER TABLE projects DROP COLUMN IF EXISTS role;
ALTER TABLE projects DROP COLUMN IF EXISTS template_type;
ALTER TABLE projects DROP COLUMN IF EXISTS published;
ALTER TABLE projects DROP COLUMN IF EXISTS published_at;
DROP INDEX IF EXISTS idx_projects_published;
DROP INDEX IF EXISTS idx_projects_template_type;
```

## Summary

✅ **Database functions updated** to save all new fields
✅ **Migration file created** for database schema
✅ **Logging added** for debugging
✅ **Auto-save working** for templates
✅ **LocalStorage + Database** dual persistence
✅ **Backward compatible** with existing projects

