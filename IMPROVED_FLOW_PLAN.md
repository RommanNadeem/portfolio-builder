# 🔧 Improved Template Save Flow

## Current Issues:

1. **template_type not persisting to database**
2. **Block content changes not saving**
3. **Data lost on page reload**

## Diagnosis Plan:

### Enable Full Debug Logging:
✅ `DEBUG_DATABASE = true` in `lib/database.ts`
✅ Enhanced logging in `useTemplateEditor`
✅ Enhanced logging in `usePortfolioData`

### Watch These Logs:

#### 1. When Selecting Template:
```
[useTemplateEditor] 🎨 Setting template type: startup-side-project
[useTemplateEditor] Initializing template: startup-side-project
[useTemplateEditor] Template initialized: {template: ..., blocksCreated: 6}
[useTemplateEditor] 💾 Saving document...
[EntityDocumentManager] 💾 Saving project to portfolio
[EntityDocumentManager] 📄 Document template_type: startup-side-project
[EntityDocumentManager] 💾 Saved to localStorage with template_type: startup-side-project
[EntityDocumentManager] 🔔 Portfolio update event dispatched
```

#### 2. In Editor Page (After Event):
```
[usePortfolioData] 🔔 Portfolio update event received: {entityType: 'project', ...}
[usePortfolioData] 📦 Updated project in localStorage: {
  template_type: 'startup-side-project',  // ← Should be here!
  blocks_count: 6                         // ← Should be here!
}
[usePortfolioData] 💾 Triggering database save after template update
[usePortfolioData] Current user ID: xxx-xxx-xxx  // ← Should NOT be null!
[Database Debug] Upserting 1 projects
[Database Debug] Projects data: [{
  template_type: 'startup-side-project',  // ← CRITICAL: Must be here!
  blocks: [...]                           // ← CRITICAL: Must be here!
}]
[Database Debug] Projects upsert result: { error: null }
[usePortfolioData] ✅ Database save completed
```

#### 3. When Editing Content:
```
[useTemplateEditor] 🔄 Updating blocks: {oldCount: 6, newCount: 6}
[useTemplateEditor] ⏰ Scheduling auto-save in 2500 ms
... (wait 2.5 seconds) ...
[useTemplateEditor] 💾 Auto-save triggered for blocks update
[EntityDocumentManager] 💾 Saving project to portfolio
[EntityDocumentManager] 📦 Document blocks: 6
[EntityDocumentManager] ✅ Synced entity data: {template_type: ..., blocks_count: 6}
[EntityDocumentManager] 🔔 Portfolio update event dispatched
[usePortfolioData] 🔔 Portfolio update event received
[usePortfolioData] 💾 Triggering database save
[Database Debug] Projects upsert result: { error: null }
```

## Expected vs Actual:

### Test Scenario:
1. Select template "Startup Side Project"
2. Edit subtitle to "An AI Emotional Companion"
3. Navigate back to editor
4. Reload page
5. Return to project editor

### Expected:
- ✅ Template selector skipped (has template_type)
- ✅ Subtitle shows "An AI Emotional Companion"
- ✅ All 6 blocks present
- ✅ All content preserved

### If Broken:
- ❌ Template selector shown again (template_type lost)
- ❌ Subtitle empty (blocks lost)
- ❌ Back to square one

## Potential Issues:

### Issue 1: currentUserId is null when event fires
**Symptom**: Log shows "No currentUserId, skipping database save!"
**Fix**: Add currentUserId to useEffect dependencies ✅ DONE

### Issue 2: savePortfolio doesn't actually save template_type/blocks
**Check**: Database logs should show template_type in upsert data
**Look for**: `[Database Debug] Projects data: [{ template_type: 'xxx' }]`

### Issue 3: Database columns don't exist
**Check**: Supabase table editor
**Columns needed**: `template_type TEXT`, `blocks JSONB`

### Issue 4: Timing issue - event fires before save completes
**Check**: Order of logs
**Should be**: Save complete → Event dispatch → Event received

## Next Step:

**Test in browser and check console for these specific logs:**

1. **After selecting template**, look for:
   - `[Database Debug] Projects data` - does it have `template_type`?
   - `[Database Debug] Projects upsert result` - any errors?

2. **After editing content**, look for:
   - `[useTemplateEditor] Auto-save triggered`
   - `[usePortfolioData] Triggering database save`
   - Does database save complete?

3. **After page reload**, look for:
   - What does database return?
   - Does `convertToLegacyFormat` preserve `template_type`?

## Quick Database Check:

Open Supabase dashboard → Table Editor → projects table → Check columns:
- ✅ `template_type` exists?
- ✅ `blocks` exists?
- ✅ Both are JSONB or TEXT?
- ✅ RLS allows SELECT?

