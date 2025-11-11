# 🐛 template_type Issue - Root Cause Found!

## Problem:
`template_type` and `blocks` are **saved** to localStorage but **lost** on page reload.

## Debug Output Analysis:

### ✅ Save Works:
```
[EntityDocumentManager] 💾 Saved to localStorage with template_type: startup-side-project
[useTemplateEditor] 📦 Updated entity: {
  template_type: 'startup-side-project',
  has_blocks: true,
  blocks_count: 6
}
```

### ❌ Load Fails:
```
// After page reload:
[EntityDocumentManager] Found project: {
  title: 'Humraaz ',
  has_blocks: true,
  blocks_count: 0,      // ← MISSING!
  template_type: null   // ← MISSING!
}
```

## Root Cause:

### The Flow:
1. **Template Editor** saves to localStorage ✅
2. User navigates to editor page
3. **usePortfolioData** loads from localStorage (has data) ✅
4. **usePortfolioData** fetches from database
5. **Database response** doesn't include `template_type`/`blocks` ❌
6. **Database data overwrites localStorage** ❌

### Why This Happens:

```typescript
// database.ts saves correctly:
blocks: p.blocks || [],
template_type: p.template_type,

// BUT... the SELECT query might not be fetching these fields!
// OR... the database columns don't have the data
```

## Possible Issues:

### Issue 1: SELECT Query Missing Fields
The `getCompletePortfolio` might not be selecting `template_type` and `blocks`:

```typescript
// WRONG:
.select('id, title, description, thumbnail_url')

// RIGHT:
.select('id, title, description, thumbnail_url, template_type, blocks')
```

### Issue 2: Database Columns Don't Exist
The `projects` table might not have `template_type` and `blocks` columns.

Check with:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects';
```

### Issue 3: RLS Policy Blocks Read
Row-Level Security might allow INSERT/UPDATE but not SELECT for these columns.

### Issue 4: Data Not Being Saved to Database
The `saveCompletePortfolio` is called, but maybe it's failing silently.

## Next Steps:

### 1. Check SELECT Query
Find where `getCompletePortfolio` fetches projects and verify it includes:
- `template_type`
- `blocks`

### 2. Add Database Fetch Logging
```typescript
const { data: projects } = await supabase
  .from('projects')
  .select('*')  // Get ALL fields
  .eq('user_id', userId);

console.log('[Database] Fetched project:', projects[0]);
console.log('[Database] template_type:', projects[0]?.template_type);
console.log('[Database] blocks:', projects[0]?.blocks);
```

### 3. Verify Database Save
Check console for:
```
[Database Debug] Projects data: [{
  ...
  template_type: 'startup-side-project',  // ← Should be here
  blocks: [...]  // ← Should be here
}]

[Database Debug] Projects upsert result: { error: null }  // ← No error?
```

### 4. Check Database Table
In Supabase dashboard:
1. Go to Table Editor
2. Open `projects` table
3. Find the project row
4. Check if `template_type` and `blocks` columns have data

## Expected Fix:

Likely need to add `template_type` and `blocks` to the SELECT query in `getCompletePortfolio`:

```typescript
const { data: projects } = await supabase
  .from('projects')
  .select(`
    id,
    title,
    description,
    thumbnail_url,
    tags,
    link,
    role,
    page_content,
    sections,
    template_type,    // ← ADD THIS
    blocks,           // ← ADD THIS
    published,
    published_at,
    display_order
  `)
  .eq('user_id', userId)
  .order('display_order', { ascending: true });
```

Then in conversion:
```typescript
projects: projectsData.map((p: any) => ({
  id: p.id,
  title: p.title,
  // ...
  template_type: p.template_type,  // ← ADD THIS
  blocks: p.blocks || [],          // ← ADD THIS
  // ...
}))
```

This ensures the data roundtrips correctly:
```
localStorage → Database → localStorage (with all fields intact)
```

