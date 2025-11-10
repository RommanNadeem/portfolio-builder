# Test with Exact Backend Data Format

## 🧪 Step-by-Step Testing Guide

### Step 1: Ensure Database Column Exists (CRITICAL!)

**Run in Supabase SQL Editor:**

```sql
-- Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'career_highlights' 
AND column_name = 'impacts';

-- If returns 0 rows, create it:
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL;

-- Verify it's there now:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'career_highlights' AND column_name = 'impacts';
```

✅ Must see: `impacts | jsonb`

---

### Step 2: Load Test Data (1 minute)

1. Open your app at `/editor`
2. Open Browser Console (F12)
3. Copy the entire contents of `TEST_BACKEND_DATA.js`
4. Paste into console
5. Press Enter
6. Page will reload automatically after 2 seconds

---

### Step 3: Watch Console Logs (30 seconds)

After page reloads, you should see these logs:

```
[Editor Debug] Starting to load portfolio data...
[Editor Debug] ⚡ Loaded from localStorage (instant)
[useAutoSave] 📌 Initial data loaded, not saving
```

Then after ~2 seconds (auto-save triggers):

```
[Database Debug] Career has impacts to save: {
  organization: "INTECH Process Automation",
  impactsKeys: ["business", "performance", "growth"],
  businessImpacts: 3,
  performanceImpacts: 1,
  fullImpacts: { business: [...], performance: [...], growth: [...] }
}

[Database Debug] Prepared career for upsert: {
  id: "...",
  organization: "INTECH Process Automation",
  hasImpacts: true,
  impactsValue: { business: [...], performance: [...], growth: [...] }
}
```

**If you DON'T see "Career has impacts to save":**
- Impacts were lost somewhere in the data flow
- Check: `console.log(JSON.parse(localStorage.getItem('portfolioData')).careerHighlights[0].impacts)`

---

### Step 4: Verify Database Save (1 minute)

**After seeing the save logs**, run in Supabase SQL Editor:

```sql
-- Check what was actually saved
SELECT 
  id,
  organization,
  role,
  impacts IS NOT NULL as has_impacts,
  jsonb_pretty(impacts) as impacts_formatted,
  jsonb_array_length(COALESCE(impacts->'business', '[]'::jsonb)) as business_count,
  jsonb_array_length(COALESCE(impacts->'performance', '[]'::jsonb)) as performance_count,
  jsonb_array_length(COALESCE(impacts->'growth', '[]'::jsonb)) as growth_count
FROM career_highlights
WHERE user_id = auth.uid()
AND organization = 'INTECH Process Automation'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Results:**
```
organization: INTECH Process Automation
has_impacts: true
business_count: 3
performance_count: 1
growth_count: 1
impacts_formatted: {
  "business": [
    {
      "value": "$3M",
      "metric": "Lead Value Generated",
      ...
    }
  ]
}
```

**If has_impacts is false or null:**
- Column exists but data didn't save
- Check console for errors during save
- Look for RLS policy errors

---

### Step 5: Test Career Detail Page (2 minutes)

1. Go to `/editor`
2. You should see "INTECH Process Automation" career card
3. Click "Create Detailed Career Page" button
4. Page should open with pre-populated sections

**Check Console for:**
```
[Career Template] Loaded career data: {
  id: "...",
  organization: "INTECH Process Automation",
  role: "Global Marketing Manager",
  responsibilities: 5,
  key_achievements: 7,
  impacts: "Present",
  impactCategories: ["business", "performance", "growth"],
  hasMultipleRoles: true,
  companyTenure: { firstStarted: "May 2017", ... }
}

[Career Template] ✅ Pre-filled hero block with metadata
[Career Template] ✅ Pre-filled context section with company metadata
[Career Template] Pre-filled responsibilities: 5
[Career Template] Pre-filled key achievements: 7
[Career Template] ✅ Pre-filled impacts: 5 metrics
```

**You should see 5 populated sections:**
1. ✅ **Overview** - "INTECH Process Automation", "Global Marketing Manager", timeline
2. ✅ **Context** - Shows other role: "Marketing & Business Development Manager"
3. ✅ **Responsibilities** - 5 bullet points
4. ✅ **Key Achievements** - 7 bullet points
5. ✅ **Impact & Results** - 5 metric cards ($3M, $0.98M, $4,500, 165%, 12%)

---

### Step 6: Test Preview Mode (30 seconds)

1. Click **"Preview"** button (top right)
2. All 5 sections should be visible
3. Metrics should show as cards with values
4. Should look professional and clean

---

## 🐛 Troubleshooting

### Problem: "Career has NO impacts" in console

**Cause:** Data lost between localStorage and save function

**Debug:**
```javascript
// Check localStorage right before save
const p = JSON.parse(localStorage.getItem('portfolioData'));
console.log('First career impacts:', p.careerHighlights[0].impacts);
```

Should show the impacts object, not undefined.

---

### Problem: Database shows `impacts: null`

**Cause 1:** Column doesn't exist
**Fix:** Run Step 1 SQL again

**Cause 2:** RLS policy blocking
**Fix:**
```sql
DROP POLICY IF EXISTS "Users can manage own career highlights" ON career_highlights;
CREATE POLICY "Users can manage own career highlights"
ON career_highlights FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**Cause 3:** Data is undefined in save function
**Fix:** Check console logs - should show "hasImpacts: true"

---

### Problem: Impact & Results section empty on detail page

**Check console for:**
```
[Career Template] Checking impacts... { hasImpacts: true/false }
```

**If false:** Impacts not in localStorage, reload test data  
**If true:** Check the conversion logs - should show metrics array

---

## 📋 Quick Checklist

Run through this checklist:

- [ ] Step 1: impacts column exists in database (SQL check passes)
- [ ] Step 2: Test data loaded (console shows "Test data saved")
- [ ] Step 3: Console shows "Career has impacts to save"
- [ ] Step 4: Database query shows `has_impacts: true` with data
- [ ] Step 5: Career detail page loads with 5 populated sections
- [ ] Step 6: Preview mode shows all sections
- [ ] Impact & Results section shows 5 metric cards
- [ ] No errors in console

## ✅ Expected Results

After all steps, you should have:

**In Database:**
```sql
impacts: {
  "business": [
    {"value": "$3M", "metric": "Lead Value Generated", ...},
    {"value": "$0.98M", "metric": "Revenue from Digital Marketing", ...},
    {"value": "$4,500", "metric": "Monthly SEO Value", ...}
  ],
  "performance": [
    {"value": "165%", "metric": "Revenue Increase", ...}
  ],
  "growth": [
    {"value": "12%", "metric": "Revenue Growth", ...}
  ]
}
```

**On Career Detail Page:**
- Hero shows: "INTECH Process Automation", "Global Marketing Manager"
- Context shows: "Multiple roles at INTECH..." with other role
- Responsibilities: 5 bullets
- Key Achievements: 7 bullets  
- Impact & Results: 5 metric cards (3 business + 1 performance + 1 growth)

---

**Run the test script now and tell me what you see in the console!** 🚀

