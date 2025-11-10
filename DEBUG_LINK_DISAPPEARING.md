# Debug: Link Disappearing After Refresh 🔍

## Problem

The website link appears initially but disappears after:
- A short while (possibly after auto-save)
- After page refresh

## Comprehensive Logging Added

I've added detailed logging at every step to track where the link is being lost.

## Debugging Steps

### Step 1: Enter Website and Watch Initial Save

1. Open career detail page
2. Clear console (Cmd+K)
3. Enter website: `www.aurahealth.io`
4. Wait 2.5 seconds for auto-save

**Expected Console Output:**

```javascript
// 1. Input change
[HeroBlock] Website field changed: {
  oldValue: undefined,
  newValue: "www.aurahealth.io",
  fullMeta: { Website: "www.aurahealth.io" }
}

// 2. Career data update
[Career Template] Updated careerData with hero changes: {
  organization: "AuraHealth",
  role: "Product Manager",
  link: "www.aurahealth.io"  ← CHECK THIS
}

// 3. Auto-save trigger
[Career Template] 🔄 Blocks changed, scheduling save... {
  heroWebsite: "www.aurahealth.io",  ← CHECK THIS
  careerDataLink: "www.aurahealth.io"  ← CHECK THIS (should match)
}

// 4. Persistence sync
[Persistence] Hero block found: {
  website: "www.aurahealth.io"  ← CHECK THIS
}

[Persistence] Syncing career hero data: {
  metaWebsite: "www.aurahealth.io",  ← CHECK THIS
  currentLink: "..." or ""
}

[Persistence] ✅ Synced company website to career card: www.aurahealth.io

// 5. Final save check
[Persistence] Final career data being saved to localStorage: {
  organization: "AuraHealth",
  role: "Product Manager",
  link: "www.aurahealth.io",  ← CRITICAL: Check this value
  hasBlocks: true,
  blocksCount: 8,
  heroWebsite: "www.aurahealth.io"  ← Should match link
}

[career Template] ✅ Saved successfully
```

**What to Check:**
- ✅ All the `link` and `website` fields should have `www.aurahealth.io`
- ❌ If any show `(empty)` or `undefined`, that's where it's lost

### Step 2: Refresh and Check Load

1. After save completes, **refresh the page** (Cmd+R)
2. Watch console during load

**Expected Console Output:**

```javascript
// 1. Load from localStorage
[Career Template] Loaded career data: {
  organization: "AuraHealth",
  role: "Product Manager",
  link: "www.aurahealth.io",  ← CRITICAL: Should still be here
  ...
}

// 2. Link status check
[Career Template] Link field status: {
  rawCareerLink: "www.aurahealth.io",  ← From localStorage
  normalizedLink: "www.aurahealth.io",  ← After normalization
  hasLink: true  ← Should be true
}

// 3. Blocks load
[Career Template] Loading existing blocks: {
  blockCount: 8,
  heroWebsite: "www.aurahealth.io"  ← Should still be in blocks
}
```

**What to Check:**
- ✅ `rawCareerLink` should have the website
- ✅ `normalizedLink` should match `rawCareerLink`
- ✅ `heroWebsite` in blocks should match
- ❌ If any are `(empty)` or `(none)`, data was lost during save

### Step 3: Check localStorage Directly

**Run this in browser console:**

```javascript
// Get portfolio data from localStorage
const data = JSON.parse(localStorage.getItem('portfolioData'));

// Find your career (replace with actual ID or search by name)
const career = data.careerHighlights.find(c => c.organization === 'AuraHealth');

console.log('=== CAREER DATA IN LOCALSTORAGE ===');
console.log('Career link field:', career.link);
console.log('Hero website in blocks:', career.blocks?.[0]?.data?.meta?.Website);

// Check if they match
if (career.link === career.blocks?.[0]?.data?.meta?.Website) {
  console.log('✅ Link and hero website MATCH');
} else {
  console.log('❌ MISMATCH FOUND!');
  console.log('  - career.link:', career.link || '(empty)');
  console.log('  - blocks website:', career.blocks?.[0]?.data?.meta?.Website || '(empty)');
}
```

## Common Issues and Fixes

### Issue 1: Link Empty After Refresh

**Symptoms:**
```
[Career Template] Link field status: {
  rawCareerLink: "",  ← Empty!
  normalizedLink: "",
  hasLink: false
}
```

**Cause:**
- Link not saved to localStorage
- Saved but with empty string

**Fix:**
Check the save logs - find this line:
```
[Persistence] Final career data being saved to localStorage: {
  link: "...",  ← What does this show?
}
```

If it shows `(empty)`, the sync from heroBlock to career.link failed.

### Issue 2: Link in Blocks But Not in career.link

**Symptoms:**
```
[Persistence] Final career data being saved: {
  link: "(empty)",  ← Empty
  heroWebsite: "www.aurahealth.io"  ← Has value
}
```

**Cause:**
- Sync from blocks to career.link is not working
- `careerData.link` not updated in real-time

**Already Fixed:**
We added real-time sync in `handleBlockChange`:
```javascript
link: updatedBlock.data.meta?.Website || careerData.link
```

**Verify:**
Check for this log after typing:
```
[Career Template] Updated careerData with hero changes: {
  link: "www.aurahealth.io"  ← Should appear
}
```

If missing, the fix didn't apply - check `handleBlockChange`.

### Issue 3: Link Saved But Overwritten

**Symptoms:**
- Link saves successfully
- Appears briefly
- Then disappears after a few seconds

**Cause:**
- Another save operation overwrites with old data
- Race condition

**Check:**
Look for **multiple** save operations in quick succession:
```
[career Template] ✅ Saved successfully
// ... a few seconds later
[career Template] ✅ Saved successfully  ← Second save?
```

If you see multiple saves, check what data the second save has:
```
[Persistence] Final career data being saved: {
  link: "(empty)"  ← Second save has no link!
}
```

**Potential Fix:**
The `careerData` state might be stale. Check dependencies in useEffect.

### Issue 4: Link Not Propagating to Card

**Symptoms:**
- Link exists in localStorage
- But card doesn't show icon

**Check:**
```javascript
// In console:
const data = JSON.parse(localStorage.getItem('portfolioData'));
const career = data.careerHighlights.find(c => c.organization === 'AuraHealth');
console.log('Career link:', career.link);
```

If link exists but icon doesn't show:
- React not re-rendering
- Conditional render issue

**Verify render:**
In CareerPreview.tsx, add temporary log:
```javascript
console.log('Rendering career card:', {
  organization: highlight.organization,
  hasLink: !!highlight.link,
  linkValue: highlight.link
});
```

## Manual Recovery Test

If link keeps disappearing, try this manual test:

```javascript
// 1. Get portfolio data
const data = JSON.parse(localStorage.getItem('portfolioData'));

// 2. Find your career
const career = data.careerHighlights.find(c => c.organization === 'AuraHealth');

// 3. Manually set link
career.link = 'www.aurahealth.io';

// 4. Also set in blocks
if (career.blocks && career.blocks[0]) {
  if (!career.blocks[0].data.meta) career.blocks[0].data.meta = {};
  career.blocks[0].data.meta.Website = 'www.aurahealth.io';
}

// 5. Save back to localStorage
localStorage.setItem('portfolioData', JSON.stringify(data));

// 6. Refresh page
location.reload();
```

After refresh:
- If link persists: Save logic is fine, issue is during editing
- If link disappears: Something overwrites localStorage

## What to Report

If link still disappears, provide:

1. **Complete console log** from entering website to refresh
2. **localStorage dump:**
   ```javascript
   const data = JSON.parse(localStorage.getItem('portfolioData'));
   const career = data.careerHighlights.find(c => c.organization === 'AuraHealth');
   console.log(JSON.stringify({
     link: career.link,
     heroWebsite: career.blocks?.[0]?.data?.meta?.Website,
     blocksCount: career.blocks?.length
   }, null, 2));
   ```
3. **Timing:** When does it disappear?
   - Immediately after typing?
   - After 2.5 seconds (auto-save)?
   - After refresh?
   - After going back to editor?

## Next Steps

Based on the logs:

**If link is in final save log but not after refresh:**
→ Database sync might be overwriting localStorage

**If link never reaches final save log:**
→ Sync from heroBlock to career.link is broken

**If link in localStorage but not in card:**
→ React component not reading data correctly

**If multiple saves with different data:**
→ State synchronization issue

---

**Run the debugging steps and share the console output - we'll pinpoint exactly where it's lost!** 🔍

