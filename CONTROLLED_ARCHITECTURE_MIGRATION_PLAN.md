# Controlled Architecture Migration Plan

## Problem Analysis

### Current Architecture Issues
1. **Dual State Management**: Each section maintains internal state + parent state
2. **Race Conditions**: Auto-save delay causes sync conflicts
3. **Complex Sync Logic**: `initialData` changes trigger unwanted resets
4. **Deletion Bug**: Items reappear because internal state resets from `initialData`

### Root Cause
```
User deletes item → Internal state updates → Auto-save triggers (100ms later) 
→ Parent state updates → initialData changes → Internal state resets → Item reappears!
```

## Impact Analysis

### ✅ Safe to Migrate (No Dependencies)
- **SocialLinksSection** - Simple list, no detail editor
- **TestimonialsSection** - Simple list, no detail editor  
- **StrengthsSection** - Simple list, no detail editor
- **CompaniesSection** - Simple list, no detail editor

### ⚠️ Requires Careful Migration
- **ProjectsSection** - Has detail editor, but detail editor uses separate `useTemplateEditor` hook
- **CareerSection** - Has detail editor, but detail editor uses separate `useTemplateEditor` hook

### ✅ Detail Editors Are Independent
- **Project Detail Editor** (`/detail/project-editor/[id]`) - Uses `useTemplateEditor` + `EntityDocumentManager`
- **Career Detail Editor** (`/detail/career-editor/[id]`) - Uses `useTemplateEditor` + `EntityDocumentManager`
- **No dependency on `useSectionManager`** - Won't be affected by changes

## Migration Strategy

### Phase 1: Create Controlled Hook ✅
- [x] Created `useSectionManagerControlled.ts`
- Single source of truth (parent state)
- No internal state, no auto-save
- Immediate updates to parent

### Phase 2: Migrate Simple Sections (Safe)
1. **SocialLinksSection** (Test case)
   - Switch to controlled version
   - Remove auto-save
   - Test real-time sync
   - Verify deletion works

2. **TestimonialsSection**
3. **StrengthsSection**  
4. **CompaniesSection**

### Phase 3: Handle Projects & Career (Special Case)
These need auto-save for:
- Background persistence to localStorage
- Database sync without blocking UI

**Solution: Add auto-save at the PARENT level**
```typescript
// In editor/page.tsx
useAutoSave({
  data: portfolio,
  onSave: savePortfolio,
  delay: 2500, // Normal delay for DB sync
});
```

### Phase 4: Test Integration
- [ ] Test addition, deletion, updates, reordering
- [ ] Verify real-time sync between editor and preview
- [ ] Test detail editor → main page sync
- [ ] Test page refresh (data persistence)
- [ ] Test with multiple sections simultaneously

## Key Benefits

### 1. Real-Time Sync ⚡
```
User action → Parent state updates IMMEDIATELY → All views sync instantly
```

### 2. Single Source of Truth ✨
```
Parent Component (portfolio state)
    ↓ props
Editor View (controlled)
    ↓ props  
Preview View (controlled)
```

### 3. Simplified Data Flow 🎯
```
Before: User → Internal State → Auto-save → Parent → Re-sync → Conflict
After:  User → Parent State → Done ✅
```

### 4. No More Sync Issues 🐛
- No `initialData` sync conflicts
- No race conditions
- Deletions work immediately
- Updates propagate instantly

## Migration Checklist

### For Each Section:
- [ ] Import `useSectionManagerControlled`
- [ ] Add `useMemo` for data conversion
- [ ] Create `handleChange` callback
- [ ] Remove `autoSave` and `localStorageKey` props
- [ ] Update tests
- [ ] Verify preview sync

### Parent Level (editor/page.tsx):
- [ ] Keep existing `usePortfolioData` hook
- [ ] Keep existing `useAutoSave` for database persistence
- [ ] Monitor console for sync logs
- [ ] Test full flow end-to-end

## Rollback Plan

If issues arise:
1. Keep old `useSectionManager.ts` (rename to `useSectionManagerLegacy.ts`)
2. Each section can independently switch between versions
3. No breaking changes to data structure
4. Detail editors unaffected

## Testing Strategy

### Unit Tests
- Add/remove/update operations
- Reordering
- Validation

### Integration Tests  
- Editor ↔ Preview sync
- Detail editor ↔ Main page sync
- Page refresh persistence

### Manual Testing
1. Add social link → Verify appears in preview immediately
2. Delete social link → Verify disappears immediately  
3. Edit social link → Verify preview updates live
4. Reorder links → Verify preview reflects order
5. Refresh page → Verify data persists
6. Open detail editor → Edit project → Return → Verify sync

## Success Criteria

✅ Deletions work without items reappearing
✅ Real-time sync between all views
✅ No console errors
✅ Data persists across refreshes
✅ Detail editors still work correctly
✅ Auto-save to database still works

