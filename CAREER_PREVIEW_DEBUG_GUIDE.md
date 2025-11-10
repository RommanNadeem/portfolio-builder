# Career Preview Debug Guide

## Issue
Career highlight data (achievements, description, etc.) is not appearing in the preview section.

## Debug Steps Added

### 1. **Console Logging**
Open your browser console and check for these logs:

#### When viewing the editor:
```javascript
[CareerSection] Rendering with: {
  renderMode: 'preview',
  viewMode: 'edit',
  highlightsCount: 2,
  rawDataCount: 2
}
```

#### When CareerPreview renders:
```javascript
[CareerPreview] Rendering with: {
  highlightsCount: 2,
  highlights: [
    {
      id: '...',
      organization: 'Google',
      role: 'Product Manager',
      description: '...',
      achievements: ['...', '...'],
      hasAchievements: true
    }
  ],
  viewMode: 'edit',
  previewMode: 'desktop'
}
```

#### When template saves:
```javascript
[Persistence] Synced achievements to career card: ['Achievement 1', 'Achievement 2']
```

#### When returning from template editor:
```javascript
[Editor Debug] ⚡ Reloading on window focus {
  projects: 5,
  careerHighlights: 2,
  careerWithAchievements: 2
}
```

---

## Common Issues & Fixes

### Issue 1: Empty achievements array

**Symptom:**
```javascript
[CareerPreview] highlights: [{ achievements: [], hasAchievements: false }]
```

**Cause:** Achievements not syncing from template back to card

**Fix:** ✅ Already fixed in `useTemplatePersistence.ts`
- Now syncs achievements from Responsibilities (bullets) section
- Also syncs from Key Achievements (feature_grid) section
- Logs: `[Persistence] Synced achievements to career card`

---

### Issue 2: Old data showing

**Symptom:** Changes in template editor don't appear in main editor preview

**Cause:** Browser cache or stale localStorage

**Fix:**
1. Open browser DevTools → Application → Local Storage
2. Check `portfolioData` key
3. Verify career highlight has updated `achievements` array
4. If not, clear localStorage and reload

---

### Issue 3: Data structure mismatch

**Symptom:**
```javascript
achievements: "string instead of array"
```

**Cause:** Legacy data format

**Fix:** ✅ Already handled in `usePortfolioData.ts`
```typescript
// Migrates string achievements to array
parsedData.careerHighlights = parsedData.careerHighlights.map((highlight) => {
  if (typeof highlight.achievements === 'string') {
    return { 
      ...highlight, 
      achievements: highlight.achievements.split('\n').filter(a => a.trim())
    };
  }
  return highlight;
});
```

---

### Issue 4: Preview section not rendering

**Symptom:** CareerPreview component returns null

**Possible causes:**
```typescript
// Check 1: Are there highlights?
if (highlights.length === 0 && viewMode === 'preview') {
  return null; // ← This returns nothing
}

// Check 2: Are highlights filtered correctly?
highlights.slice(0, 6).map(...) // Only shows first 6
```

**Fix:** Check console logs for `highlightsCount`

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  1. User adds career in main editor                         │
│     organization: 'Google'                                   │
│     role: 'PM'                                              │
│     achievements: ['Led redesign', 'Shipped features']      │
└─────────────────────────────────────────────────────────────┘
                          ↓ Saves to localStorage
┌─────────────────────────────────────────────────────────────┐
│  2. User clicks "Create Detailed Career Page"               │
│     → Navigates to /detail/career-editor/[id]              │
└─────────────────────────────────────────────────────────────┘
                          ↓ Loads from localStorage
┌─────────────────────────────────────────────────────────────┐
│  3. Career template initializes                              │
│     Hero: title = 'Google', subtitle = 'PM'                 │
│     Responsibilities: bullets = ['Led redesign', ...]       │
│     Key Achievements: items = [{title: 'Led redesign'}, ...]│
└─────────────────────────────────────────────────────────────┘
                          ↓ User edits
┌─────────────────────────────────────────────────────────────┐
│  4. Template auto-saves (every 2.5s)                        │
│     useTemplatePersistence syncs:                           │
│       - hero.title → organization                           │
│       - hero.subtitle → role                                │
│       - bullets OR items → achievements array               │
└─────────────────────────────────────────────────────────────┘
                          ↓ Saves to localStorage
┌─────────────────────────────────────────────────────────────┐
│  5. User returns to main editor                             │
│     window.focus triggers reload from localStorage          │
│     CareerSection receives updated data                     │
└─────────────────────────────────────────────────────────────┘
                          ↓ Passes to preview
┌─────────────────────────────────────────────────────────────┐
│  6. CareerPreview renders                                   │
│     Shows: organization, role, description, achievements    │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Checklist

**Step 1: Add Career in Main Editor**
- [ ] Add new career highlight
- [ ] Fill in: organization, role, description
- [ ] Add 2-3 achievements
- [ ] Check browser console for data

**Step 2: Open Template Editor**
- [ ] Click "Create Detailed Career Page"
- [ ] Verify Hero section shows: organization, role, description
- [ ] Verify Responsibilities section shows achievements
- [ ] Check console: `[Career Template] Pre-filled achievements into Responsibilities section`

**Step 3: Edit in Template**
- [ ] Edit achievements in Responsibilities or Key Achievements section
- [ ] Wait 3 seconds for auto-save
- [ ] Check console: `[Persistence] Synced achievements to career card: [...]`

**Step 4: Return to Main Editor**
- [ ] Click "Back to Editor" 
- [ ] Check console: `[Editor Debug] ⚡ Reloading on window focus`
- [ ] Check: `careerWithAchievements: 1` (or number of careers with achievements)

**Step 5: Toggle to Preview**
- [ ] Click "Preview" button in main editor
- [ ] Check console: `[CareerPreview] Rendering with: { highlightsCount: ..., highlights: [...] }`
- [ ] Verify achievements array has data
- [ ] Verify achievements render on screen

---

## Quick Fixes

### If achievements still don't show:

**Option 1: Check localStorage**
```javascript
// In browser console:
const data = JSON.parse(localStorage.getItem('portfolioData'));
console.log(data.careerHighlights[0].achievements);
// Should show: ['Achievement 1', 'Achievement 2']
```

**Option 2: Force reload**
```javascript
// In browser console:
localStorage.removeItem('portfolioData');
window.location.reload();
// Then re-add your career data
```

**Option 3: Check data structure**
```javascript
// In browser console:
const data = JSON.parse(localStorage.getItem('portfolioData'));
data.careerHighlights.forEach(c => {
  console.log({
    org: c.organization,
    role: c.role,
    desc: c.description,
    achievements: c.achievements,
    type: typeof c.achievements,
    isArray: Array.isArray(c.achievements)
  });
});
```

---

## Expected Console Output

### Successful flow:
```
[CareerSection] Rendering with: { renderMode: 'preview', highlightsCount: 2 }
[CareerPreview] Rendering with: {
  highlightsCount: 2,
  highlights: [
    {
      organization: 'Google',
      achievements: ['Led redesign', 'Shipped features'],
      hasAchievements: true
    }
  ]
}
```

### If data is missing:
```
[CareerPreview] Rendering with: {
  highlightsCount: 2,
  highlights: [
    {
      organization: 'Google',
      achievements: [],  // ← PROBLEM: Empty!
      hasAchievements: false
    }
  ]
}
```

Then check:
1. Did template editor save? Look for `[Persistence] Synced achievements`
2. Did main editor reload? Look for `[Editor Debug] ⚡ Reloading on window focus`
3. Is localStorage correct? Check DevTools → Application

---

## Next Steps

1. **Open the app** in browser (http://localhost:3001)
2. **Open DevTools** Console (F12 or Cmd+Option+J)
3. **Add a career** with achievements
4. **Open template editor**, edit, wait for save
5. **Return to main editor** and check console logs
6. **Report findings** - share the console logs

The debug logs will show exactly where the data is getting lost! 🔍

