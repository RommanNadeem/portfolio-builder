# 🐛 Debug: Project Data Not Saving

## Problem
User reports: "data not saved for projects"

## Data Flow Check

### Expected Flow:
```
1. User edits project
   ↓
2. ProjectCard onChange → useSectionManager update()
   ↓
3. useSectionManager items state changes
   ↓
4. useSectionManager's useAutoSave detects change
   ↓
5. useAutoSave calls onSave callback (100ms delay)
   ↓
6. ProjectsSection onSave: onChange(prev => ({ ...prev, projects: legacy }))
   ↓
7. usePortfolioData updatePortfolio
   ↓
8. localStorage.setItem('portfolioData', ...)
   ↓
9. Editor page useAutoSave detects portfolio change
   ↓
10. savePortfolio → database.ts → Supabase
```

## Potential Issues:

### Issue 1: useSectionManager not calling onSave
**Check**: Does useSectionManager have useAutoSave integrated?
**File**: `app/editor/core/hooks/useSectionManager.ts`

### Issue 2: onChange not passed correctly
**Check**: Is onChange prop passed through wrapper?
**File**: `app/editor/sections/projects-v2/ProjectsSectionWrapper.tsx`
✅ Confirmed: Wrapper passes onChange correctly

### Issue 3: useAutoSave not triggering
**Check**: Is useAutoSave enabled and working?
**File**: `app/editor/core/hooks/useAutoSave.ts`
✅ Confirmed: useAutoSave has proper change detection

### Issue 4: Database save failing
**Check**: Is database.ts saveCompletePortfolio working?
**File**: `lib/database.ts`

## Console Logs to Check:

When editing a project, you should see:
```
1. [useSectionManager] ✅ Item added: xxx-xxx-xxx
2. [ProjectsSection] 💾 Synced to parent: 3
3. [usePortfolioData] ⚡ Instant localStorage update
4. [useAutoSave] 🔄 Data changed, scheduling save...
5. [useAutoSave] 💾 Saving changes to database...
6. [Database Debug] Projects upsert result
7. [Database Debug] ✅ Projects upserted successfully
```

## What to Test:

### Test 1: Is useSectionManager calling onSave?
```typescript
// In ProjectsSection.tsx, add more logging:
onSave: async (items) => {
  console.log('[ProjectsSection] 🔔 onSave called with:', items.length, 'projects');
  const legacy = items.map(convertToLegacy);
  console.log('[ProjectsSection] 📤 Calling onChange with:', legacy);
  onChange(prev => ({
    ...prev,
    projects: legacy,
  }));
  console.log('[ProjectsSection] ✅ onChange called');
},
```

### Test 2: Is onChange reaching usePortfolioData?
```typescript
// In usePortfolioData.ts updatePortfolio, add:
console.log('[usePortfolioData] 📥 updatePortfolio called');
console.log('[usePortfolioData] Projects before:', prev?.projects?.length);
console.log('[usePortfolioData] Projects after:', updated.projects?.length);
```

### Test 3: Is database save working?
```typescript
// Check browser console for:
// - "Projects upsert result"
// - Any error messages
// - Network tab for /api calls
```

## Quick Fix Checklist:

- [ ] Check if useSectionManager has useAutoSave
- [ ] Add debug logs to onSave callback
- [ ] Verify onChange is being called
- [ ] Check localStorage is updating
- [ ] Verify database save is called
- [ ] Check for errors in console
- [ ] Test with browser network tab open

## Next Steps:

1. Open browser console
2. Add a new project
3. Edit project title
4. Watch console logs
5. Check localStorage in DevTools
6. Check Network tab for API calls
7. Report which step fails

