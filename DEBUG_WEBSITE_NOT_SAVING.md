# Debug: Website Not Saving - Diagnostic Guide 🔍

## Problem Report

The company website entered in the career template hero section is being lost and not saved.

## Comprehensive Logging Added

I've added detailed logging throughout the save pipeline to help track exactly where the website data is being lost.

## How to Debug

### Step 1: Open Career Detail Page

1. Open a career highlight detail page
2. Open browser console (F12)
3. Clear the console

### Step 2: Enter Website

1. In the hero section, find "Company Website" field
2. Enter a test URL: `https://google.com`
3. Wait 2-3 seconds for the input to register

### Step 3: Check Console Logs

Watch for these log messages in order:

#### A. Hero Block Update (Immediate)
```
[HeroBlock] Company Website field changed: https://google.com
```

If you DON'T see this:
- ❌ The input field onChange is not triggering
- **Fix:** Check that the input field in HeroBlock has proper onChange handler

#### B. Block Change Detection (Immediate)
```
[Career Template] Block changed at index 0
Hero block meta: { Website: "https://google.com", ... }
```

If you DON'T see this:
- ❌ handleBlockChange is not being called
- **Fix:** Verify onChange prop is passed to HeroBlock

#### C. Auto-Save Scheduled (After 2.5 seconds)
```
[Career Template] 🔄 Blocks changed, scheduling save... {
  blocksCount: 5,
  blockOrder: [...],
  heroWebsite: "https://google.com",  ← Should show website
  careerDataLink: undefined or old value
}
```

If heroWebsite is undefined:
- ❌ Website is not in blocks[0].data.meta.Website
- **Fix:** Check HeroBlock onChange is updating the correct path

#### D. Persistence Hook - Hero Block Check
```
[Persistence] Hero block found: {
  hasHero: true,
  heroType: "hero",
  metaFields: ["Timeline", "role", "Website"],
  website: "https://google.com"  ← Should show website
}
```

If website is undefined:
- ❌ Hero block doesn't have meta.Website
- **Fix:** Blocks data is not structured correctly

#### E. Persistence Hook - Career Sync
```
[Persistence] Syncing career hero data: {
  title: "Google",
  subtitle: "Senior Product Designer",
  metaWebsite: "https://google.com",  ← Should show website
  currentLink: "..." or null
}
```

If metaWebsite is undefined:
- ❌ Hero block meta is missing Website field
- **Check:** Verify data structure in previous log

#### F. Persistence Hook - Website Sync
```
[Persistence] ✅ Synced company website to career card: https://google.com
```

OR

```
[Persistence] ⚠️ No website in hero meta to sync
```

If you see the warning:
- ❌ heroBlock.data.meta.Website is empty
- **Fix:** Data is being lost between steps B and E

#### G. Save Complete
```
[career Template] ✅ Saved successfully
```

### Step 4: Verify Save

1. Go back to main editor
2. Look at the career card
3. Should see website icon (🔗) next to organization name
4. Click icon - should open the website

### Step 5: Verify Database

1. Refresh the page
2. Open the same career detail page
3. Check console for:
```
[Career Template] 📌 Pre-filling company website: https://google.com
```

4. The "Company Website" field should be filled with the URL

## Common Issues and Fixes

### Issue 1: Website Not in Blocks

**Symptoms:**
- Log shows: `heroWebsite: undefined`
- Website disappears immediately after typing

**Cause:**
- HeroBlock onChange not updating meta correctly

**Fix:**
Check that HeroBlock input has:
```javascript
<input
  type="url"
  value={data.meta?.Website || ''}
  onChange={(e) => onChange({ 
    ...block, 
    data: { 
      ...data, 
      meta: { ...data.meta, Website: e.target.value } 
    } 
  })}
/>
```

### Issue 2: Website Lost During Save

**Symptoms:**
- Log shows website in heroWebsite
- But `⚠️ No website in hero meta to sync`

**Cause:**
- Blocks structure changed between schedule and save
- Race condition

**Fix:**
- Ensure debounced save uses latest blocks
- Check dependencies in useEffect

### Issue 3: Website Not Loading on Refresh

**Symptoms:**
- Website saves during session
- Disappears after page refresh

**Cause:**
- Saved to localStorage but not database
- OR pre-fill not reading from career.link

**Fix 1 - Check LocalStorage:**
```javascript
// In console:
const data = JSON.parse(localStorage.getItem('portfolioData'));
const career = data.careerHighlights.find(c => c.id === 'CAREER_ID');
console.log('Career link:', career.link);
console.log('Career blocks:', career.blocks[0].data.meta.Website);
```

**Fix 2 - Check Pre-fill:**
The initialization should include:
```javascript
if (careerData.link) {
  metaFields.Website = careerData.link;
}
```

### Issue 4: Website Shows But Doesn't Save to DB

**Symptoms:**
- Website works in current session
- Lost when logging in from different device

**Cause:**
- Saved to localStorage only
- Database sync not happening

**Fix:**
Check that `saveCompletePortfolio` includes website in career object when syncing to Supabase.

## Testing Checklist

Run through these tests and check the results:

### ✅ Test 1: Enter Website
- [ ] Open career detail page
- [ ] Enter website in hero section
- [ ] See logs A, B, C with correct website
- [ ] Wait 2.5 seconds
- [ ] See logs D, E, F, G
- [ ] Website syncs successfully

### ✅ Test 2: View in Card
- [ ] Go back to main editor
- [ ] Find the career card
- [ ] See 🔗 icon next to organization name
- [ ] Click icon
- [ ] Website opens in new tab

### ✅ Test 3: Refresh Persistence
- [ ] Refresh the page
- [ ] Open career detail page
- [ ] "Company Website" field is filled
- [ ] Go to main editor
- [ ] Icon still shows on card

### ✅ Test 4: Database Persistence
- [ ] Enter website
- [ ] Wait for save
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Find portfolioData key
- [ ] Search for career
- [ ] Verify career.link has website
- [ ] Verify career.blocks[0].data.meta.Website has website

## Expected Data Structure

### In Blocks (Template)
```json
{
  "type": "hero",
  "id": "hero-123",
  "sectionLabel": "Overview",
  "data": {
    "title": "Google",
    "subtitle": "Senior Product Designer",
    "description": "...",
    "meta": {
      "Timeline": "2020 - 2023",
      "role": "Senior Product Designer",
      "Website": "https://google.com"  ← HERE
    }
  }
}
```

### In Career Object (Card)
```json
{
  "id": "career-456",
  "organization": "Google",
  "role": "Senior Product Designer",
  "link": "https://google.com",  ← SYNCED HERE
  "blocks": [/* ... */]
}
```

### In Database
```sql
SELECT 
  id, 
  organization, 
  role, 
  link,  -- Should have website
  blocks::jsonb -> 0 -> 'data' -> 'meta' -> 'Website'  -- Also has website
FROM career_highlights
WHERE user_id = auth.uid()
LIMIT 1;
```

## Next Steps

1. **Run the tests above**
2. **Copy all console logs** into a file
3. **Identify which log is missing** or shows wrong data
4. **That's where the problem is**

### If All Logs Look Correct But Still Not Working

Check:
1. Are you testing with the correct career?
2. Is the career ID consistent?
3. Is there a caching issue?
4. Try clearing localStorage and starting fresh

### If Logs Show Website But Card Doesn't

Check:
1. Is the career card using `highlight.link` for the icon?
2. Is the link field being filtered/removed somewhere?
3. Try logging in CareerPreview component

## Manual Test Script

Run this in the console to manually verify the save:

```javascript
// Get current portfolio data
const data = JSON.parse(localStorage.getItem('portfolioData'));

// Find your career (replace with actual ID)
const careerId = 'YOUR_CAREER_ID';
const career = data.careerHighlights.find(c => c.id === careerId);

// Check both locations
console.log('Career link field:', career.link);
console.log('Hero meta website:', career.blocks?.[0]?.data?.meta?.Website);

// They should match
if (career.link === career.blocks?.[0]?.data?.meta?.Website) {
  console.log('✅ Website is synced correctly!');
} else {
  console.log('❌ Website sync mismatch!');
  console.log('  - Card shows:', career.link);
  console.log('  - Template has:', career.blocks?.[0]?.data?.meta?.Website);
}
```

---

**With these logs, we can pinpoint exactly where the website is being lost!**

Run through the debug steps and share the console output - that will tell us exactly what's happening.

