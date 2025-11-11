# 🧪 Testing Guide: Template Save Flow

## Overview
This guide helps you test and debug the template save flow to ensure `template_type` and `blocks` persist correctly.

---

## 🔍 What to Check

### Setup:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Enable "Preserve log" (checkbox at top)

---

## Test Sequence

### Step 1: Select Template

**Action**: Click a project → Select "Startup Side Project" template

**Expected Console Logs**:
```
[useTemplateEditor] 🎨 Setting template type: startup-side-project
[useTemplateEditor] Initializing template: startup-side-project
[ProjectInitializer] Created 6 base blocks
[useTemplateEditor] Template initialized: {template: 'startup-side-project', blocksCreated: 6}
[EntityDocumentManager] 💾 Saving project to portfolio: xxx
[EntityDocumentManager] 📄 Document template_type: startup-side-project  ← MUST BE HERE
[EntityDocumentManager] 📦 Document blocks: 6                            ← MUST BE HERE
[EntityDocumentManager] ✅ Synced entity data: {
  template_type: 'startup-side-project',  ← CRITICAL!
  blocks_count: 6                          ← CRITICAL!
}
[EntityDocumentManager] 💾 Saved to localStorage with template_type: startup-side-project
[EntityDocumentManager] 🔔 Portfolio update event dispatched
```

**Then in Editor Page**:
```
[usePortfolioData] 🔔 Portfolio update event received: {entityType: 'project', entityId: 'xxx'}
[usePortfolioData] 📦 Updated project in localStorage: {
  template_type: 'startup-side-project',  ← MUST BE HERE
  blocks_count: 6                          ← MUST BE HERE
}
[usePortfolioData] 💾 Triggering database save after template update
[usePortfolioData] Current user ID: xxx-xxx-xxx  ← MUST NOT BE NULL
[Database Debug] Upserting 1 projects
[Database Debug] 📦 Project 1: {
  template_type: 'startup-side-project',  ← CRITICAL: Must appear here!
  blocks_count: 6,                        ← CRITICAL: Must appear here!
  has_template_type: true,
  has_blocks: true
}
[Database Debug] Projects upsert result: { error: null }  ← No error
[usePortfolioData] ✅ Database save completed after template update
```

### ❌ If You See:
```
[usePortfolioData] ⚠️ No currentUserId or savePortfolio ref
```
→ **PROBLEM**: Event handler can't access save function

```
[Database Debug] 📦 Project 1: {
  template_type: null,  ← BAD!
  blocks_count: 0       ← BAD!
}
```
→ **PROBLEM**: Data not in localStorage or not being read correctly

---

### Step 2: Edit Content

**Action**: Change subtitle to "Test Subtitle"

**Expected Logs**:
```
[HeroBlock] Subtitle changed: Test Subtitle
[useTemplateEditor] 🔄 Updating blocks: {oldCount: 6, newCount: 6, template_type: 'startup-side-project'}
[useTemplateEditor] ⏰ Scheduling auto-save in 2500 ms
... (wait 2.5 seconds) ...
[useTemplateEditor] 💾 Auto-save triggered for blocks update
[useTemplateEditor] 💾 Saving document...
[useTemplateEditor] 📊 Document state: {
  template_type: 'startup-side-project',  ← Still there!
  blocks_count: 6
}
[EntityDocumentManager] 💾 Saving project to portfolio
[EntityDocumentManager] Hero block data: {
  title: 'Humraaz',
  subtitle: 'Test Subtitle',  ← New content!
}
[EntityDocumentManager] 💾 Saved to localStorage with template_type: startup-side-project
[EntityDocumentManager] 🔔 Portfolio update event dispatched
[usePortfolioData] 🔔 Portfolio update event received
[usePortfolioData] 💾 Triggering database save
[Database Debug] 📦 Project 1: {
  template_type: 'startup-side-project',
  blocks_count: 6
}
[usePortfolioData] ✅ Database save completed
```

---

### Step 3: Navigate Back to Editor

**Action**: Click "Back to Editor"

**Expected**:
- No errors in console
- Preview shows updated content

---

### Step 4: Reload Page

**Action**: Press F5 or Cmd+R

**Expected Logs**:
```
[Editor Debug] Starting to load portfolio data...
[Editor Debug] ⚡ Loaded from localStorage (instant)
[Editor Debug] User found: xxx
[Editor Debug] Raw portfolio data from Supabase: {...}
[Database Debug] convertToLegacyFormat input: {...}
```

**Check**: Do projects in database response have `template_type` and `blocks`?

---

### Step 5: Return to Project Editor

**Action**: Click Edit icon on the project

**Expected Logs**:
```
[useTemplateEditor] Loading document: {entityId: 'xxx', entityType: 'project'}
[EntityDocumentManager] Found project: {
  template_type: 'startup-side-project',  ← MUST BE HERE!
  blocks_count: 6                         ← MUST BE HERE!
}
[useTemplateEditor] ✅ Document loaded: {id: 'xxx', blocks: 6}
[ProjectEditor V3] 🔍 Determining flow state: {
  templateType: 'startup-side-project',   ← MUST BE HERE!
  blocksLength: 6,                        ← MUST BE HERE!
  entityTemplateType: 'startup-side-project'  ← MUST BE HERE!
}
[ProjectEditor V3] ✅ Has blocks, showing editor  ← Should go directly to editor!
```

**❌ If You See**:
```
[EntityDocumentManager] Found project: {
  template_type: null,  ← PROBLEM!
  blocks_count: 0       ← PROBLEM!
}
[ProjectEditor V3] 🆕 No blocks or template, showing selector  ← WRONG!
```
→ **Database didn't save or retrieve correctly**

---

## 🔍 Diagnostic Checklist

### If template_type is null after reload:

- [ ] Check: Is currentUserId available when event fires?
  - Look for: `[usePortfolioData] Current user ID: xxx`
  - If null: Event handler runs before user auth completes

- [ ] Check: Is savePortfolioRef.current available?
  - Look for: `{hasUserId: true, hasSaveRef: true}`
  - If false: Ref not set properly

- [ ] Check: Does database save actually run?
  - Look for: `[Database Debug] 📦 Project 1`
  - Should show template_type and blocks_count

- [ ] Check: Does database save succeed?
  - Look for: `[Database Debug] Projects upsert result: {error: null}`
  - If error: Check the error message

- [ ] Check: Does database FETCH return the data?
  - Look for: `[Editor Debug] Raw portfolio data from Supabase`
  - Expand in console and check projects array
  - Each project should have `template_type` and `blocks` fields

- [ ] Check Supabase directly:
  - Go to Supabase Dashboard
  - Table Editor → projects
  - Find your project row
  - Verify `template_type` column has value
  - Verify `blocks` column has array

---

## 🎯 Success Criteria

### Template Persistence:
✅ Select template → See selector disappear  
✅ Edit content → See subtitle change  
✅ Navigate away → Content persists  
✅ Reload page → Data still there  
✅ Return to editor → Goes directly to editor (no selector)  
✅ All content preserved → Subtitle, blocks, everything intact

### Console Confirmation:
✅ `[Database Debug] template_type: 'startup-side-project'` in save  
✅ `[Database Debug] blocks_count: 6` in save  
✅ `[EntityDocumentManager] Found project: {template_type: '...', blocks_count: 6}` on load  
✅ `[usePortfolioData] ✅ Database save completed` after template edit

---

## 📝 Report Issues

If any step fails, report:
1. **Which step failed** (1-5)
2. **Console logs** at that step
3. **What you expected vs what happened**
4. **Screenshot of Supabase table** (projects row)

This will help pinpoint the exact failure point!

