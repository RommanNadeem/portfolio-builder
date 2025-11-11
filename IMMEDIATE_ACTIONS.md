# 🚨 IMMEDIATE ACTIONS - Test Template Save Flow

## What I Just Fixed:

### 1. ✅ **Enabled Full Debug Logging**
- `DEBUG_DATABASE = true` in `database.ts`
- Every project save now shows `template_type` and `blocks_count`
- Every step of the flow is logged

### 2. ✅ **Fixed savePortfolio Ref Issue**
- Used ref pattern to avoid useEffect dependency issues
- savePortfolioRef.current always has latest function
- No more stale closures

### 3. ✅ **Enhanced Event Handler Logging**
- Shows if currentUserId is available
- Shows if savePortfolioRef is available
- Shows actual project data before database save
- Shows success/error from database save

---

## 🧪 DO THIS NOW:

### Test Flow:
1. **Open browser** with DevTools console
2. **Go to /editor** page
3. **Click edit** on "Humraaz" project
4. **Select template** "Startup Side Project"
5. **Watch console carefully**

### Critical Logs to Check:

#### ✅ GOOD - Template Saved:
```
[EntityDocumentManager] 💾 Saved to localStorage with template_type: startup-side-project
[EntityDocumentManager] 🔔 Portfolio update event dispatched
[usePortfolioData] 🔔 Portfolio update event received
[usePortfolioData] 📦 Updated project in localStorage: {
  template_type: 'startup-side-project',  ← MUST SEE THIS!
  blocks_count: 6                         ← MUST SEE THIS!
}
[usePortfolioData] 💾 Triggering database save
[usePortfolioData] Current user ID: xxx-xxx-xxx  ← MUST NOT BE NULL!
[Database Debug] 📦 Project 1: {
  template_type: 'startup-side-project',  ← MUST SEE THIS!
  blocks_count: 6,
  has_template_type: true,
  has_blocks: true
}
[Database Debug] Projects upsert result: {error: null}
[usePortfolioData] ✅ Database save completed
```

#### ❌ BAD - Something Wrong:
```
[usePortfolioData] ⚠️ No currentUserId or savePortfolio ref
  hasUserId: false  ← PROBLEM!
  hasSaveRef: false ← PROBLEM!
```

OR

```
[Database Debug] 📦 Project 1: {
  template_type: null,   ← PROBLEM!
  blocks_count: 0        ← PROBLEM!
}
```

---

## What Each Log Means:

### 🎨 Template Selection:
- `[useTemplateEditor] Setting template type` → User selected template
- `[EntityDocumentManager] Document template_type: xxx` → Template set in document
- `[EntityDocumentManager] Saved to localStorage` → Saved locally ✅

### 🔔 Event Dispatch & Handling:
- `[EntityDocumentManager] Portfolio update event dispatched` → Event sent
- `[usePortfolioData] Portfolio update event received` → Event caught
- `[usePortfolioData] Updated project in localStorage` → Data verified

### 💾 Database Save:
- `[usePortfolioData] Current user ID: xxx` → User authenticated
- `[Database Debug] Project 1: {template_type: xxx}` → Data being saved
- `[Database Debug] Projects upsert result: {error: null}` → Save succeeded
- `[usePortfolioData] Database save completed` → Confirmation

---

## 🐛 If It's Still Broken:

### Copy and send these console logs:

1. **After selecting template**, copy:
   - All `[EntityDocumentManager]` logs
   - All `[usePortfolioData]` logs
   - All `[Database Debug]` logs

2. **After page reload**, copy:
   - `[EntityDocumentManager] Found project: {...}`
   - Shows template_type value

3. **Supabase check**:
   - Go to Supabase Dashboard
   - Table Editor → projects
   - Screenshot of the project row
   - Show `template_type` and `blocks` columns

---

## 🎯 What to Report:

If template_type is still `null`:

### Report These Specific Values:
```
Step 1 - After template selection:
- EntityDocumentManager template_type: _______
- localStorage project template_type: _______
- Database Project 1 template_type: _______
- Database upsert error: _______

Step 2 - After page reload:
- EntityDocumentManager Found project template_type: _______
- Database returned template_type: _______

Step 3 - Supabase Table:
- projects.template_type value: _______
- projects.blocks value: _______
```

This will show exactly where the data is being lost!

---

## 🔧 Quick Fixes (If Needed):

### Fix 1: currentUserId is null
Wait for authentication to complete before testing

### Fix 2: savePortfolioRef is null
Refresh page and try again (ref should be set after mount)

### Fix 3: Database columns don't exist
Run migration:
```sql
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS template_type TEXT,
ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb;
```

### Fix 4: RLS policy blocks save
Check Supabase → Authentication → Policies
Ensure projects table allows INSERT/UPDATE for authenticated users

---

## ✅ Success Looks Like:

```
🎨 Select template
   ↓
💾 Save to localStorage (template_type: 'startup-side-project', blocks: 6)
   ↓
🔔 Dispatch event
   ↓
📡 Editor receives event
   ↓
💾 Save to database (template_type: 'startup-side-project', blocks: 6)
   ↓
✅ Database upsert: {error: null}
   ↓
🔄 Reload page
   ↓
📥 Fetch from database (has template_type and blocks)
   ↓
✅ Editor shows template (no selector!)
```

Test this and report what you see! 🚀

