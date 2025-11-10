# ✅ Found It! Project Data Save Analysis

## Current Architecture:

```
useSectionManager
  ├── items state (project list)
  ├── useAutoSave hook
  │   ├── watches items for changes
  │   ├── delay: 100ms (autoSaveDelay)
  │   └── calls onSave callback
  └── onSave → ProjectsSection onChange
                └── usePortfolioData updatePortfolio
                    └── localStorage + database
```

## Key Finding:

**useSectionManager DOES have useAutoSave!** ✅

```typescript
// In useSectionManager.ts line 36:
const { saveStatus, lastSaved, save: manualSave } = useAutoSave({
  data: items,
  onSave: async (data) => {
    if (onSave) {
      await onSave(data);
    }
  },
  delay: autoSaveDelay,  // 100ms for projects
  enabled: autoSave && !!onSave,
  localStorageKey,
});
```

## So the Flow IS Correct:

1. User edits project ✅
2. ProjectCard calls update() ✅  
3. useSectionManager items changes ✅
4. useAutoSave detects change (after 100ms) ✅
5. useAutoSave calls onSave(items) ✅
6. ProjectsSection onSave: onChange(prev => ({ ...prev, projects: legacy })) ✅
7. usePortfolioData updatePortfolio ✅
8. localStorage updated ✅
9. Editor useAutoSave triggered ✅
10. Database save ✅

## Possible Issues:

### Issue 1: autoSave or onSave is false/undefined
**Check**:
```typescript
// In ProjectsSection.tsx:
useSectionManager<ProjectItem>({
  initialData,
  onSave: async (items) => { ... },  // ← Is this defined?
  autoSave: true,                      // ← Is this true?
  autoSaveDelay: 100,
  localStorageKey: `projects-${userId}`,  // ← Is userId defined?
});
```

### Issue 2: userId is undefined
If `userId` is undefined, localStorage key becomes `projects-undefined`, and `onSave` enabled check fails!

```typescript
enabled: autoSave && !!onSave,  // ← This returns false if onSave is falsy
```

### Issue 3: onChange from parent not working
Check if `onChange` prop from editor page is correctly wired.

### Issue 4: Template changes not syncing back
Template editor saves separately - need the event system we just added!

## Debug Steps:

### 1. Check userId
```typescript
// In ProjectsSection:
console.log('[ProjectsSection] userId:', userId);
console.log('[ProjectsSection] onSave defined:', !!onSave);
console.log('[ProjectsSection] autoSave:', autoSave);
```

### 2. Check if onSave is being called
```typescript
// In ProjectsSection onSave:
onSave: async (items) => {
  console.log('[ProjectsSection] 🔔 onSave CALLED!', items.length);
  const legacy = items.map(convertToLegacy);
  onChange(prev => ({
    ...prev,
    projects: legacy,
  }));
},
```

### 3. Check useAutoSave in useSectionManager
```typescript
// Add logging to useSectionManager:
const { saveStatus, lastSaved, save: manualSave } = useAutoSave({
  data: items,
  onSave: async (data) => {
    console.log('[useSectionManager] 🔔 useAutoSave calling onSave');
    if (onSave) {
      await onSave(data);
    } else {
      console.log('[useSectionManager] ⚠️  onSave is undefined!');
    }
  },
  delay: autoSaveDelay,
  enabled: autoSave && !!onSave,
});

console.log('[useSectionManager] useAutoSave enabled:', autoSave && !!onSave);
```

## Most Likely Issue:

**userId is undefined or onSave is not being passed correctly!**

Let me check where userId comes from in the editor page...

