# Debug: Impacts Not Saving to Database

## Quick Diagnosis (Run These in Order)

### 1. Check if Column Exists in Database

**Run in Supabase SQL Editor:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'career_highlights' 
AND column_name = 'impacts';
```

**Expected:** 1 row showing `impacts | jsonb`  
**If 0 rows:** Column doesn't exist! Run the migration below.

---

### 2. Create Column if Missing

**Run in Supabase SQL Editor:**

```sql
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL;

-- Verify
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'career_highlights' AND column_name = 'impacts';
```

---

### 3. Check localStorage for Impacts Data

**Run in Browser Console (F12):**

```javascript
const portfolio = JSON.parse(localStorage.getItem('portfolioData'));
console.log('Full portfolio:', portfolio);
console.log('Career highlights count:', portfolio.careerHighlights?.length);

portfolio.careerHighlights?.forEach((career, idx) => {
  console.log(`Career ${idx}:`, {
    organization: career.organization,
    role: career.role,
    hasImpacts: !!career.impacts,
    impacts: career.impacts,
    hasResponsibilities: !!career.responsibilities,
    hasKeyAchievements: !!career.key_achievements
  });
});
```

**If impacts is undefined:** The data never made it to localStorage  
**If impacts is present:** Continue to next step

---

### 4. Manually Add Test Impacts to localStorage

**Run in Browser Console:**

```javascript
const portfolio = JSON.parse(localStorage.getItem('portfolioData'));

// Add impacts to first career
if (portfolio.careerHighlights && portfolio.careerHighlights[0]) {
  portfolio.careerHighlights[0].impacts = {
    business: [
      {
        value: "$2M",
        metric: "Revenue Generated",
        description: "Launched premium tier generating $2M ARR",
        category: "business"
      }
    ],
    performance: [
      {
        value: "60%",
        metric: "Latency Reduction",
        description: "Reduced API response from 2s to 800ms",
        category: "performance"
      }
    ],
    growth: [
      {
        value: "45%",
        metric: "User Engagement",
        description: "Increased daily active users by 45%",
        category: "growth"
      }
    ]
  };
  
  localStorage.setItem('portfolioData', JSON.stringify(portfolio));
  console.log('✅ Test impacts added!');
  console.log('Impacts:', portfolio.careerHighlights[0].impacts);
}
```

---

### 5. Trigger a Save

**Option A: Edit something in the editor**
1. Go to `/editor`
2. Edit a career highlight (change description)
3. Wait 2 seconds
4. Check console for save logs

**Option B: Force save via console**

```javascript
// Force a save
const event = new CustomEvent('save');
window.dispatchEvent(event);

// Or just edit and wait 2 seconds
```

---

### 6. Check Console Logs During Save

**You should see these logs:**

```
[Database Debug] Career has impacts to save: {
  organization: "Google",
  impactsKeys: ["business", "performance", "growth"],
  businessImpacts: 1,
  performanceImpacts: 1,
  fullImpacts: { business: [...], performance: [...], ... }
}

[Database Debug] Prepared career for upsert: {
  id: "...",
  organization: "Google",
  hasImpacts: true,
  impactsValue: { business: [...], ... }
}

[Database Debug] Career highlights upsert result: { ... }
```

**If you see "Career has NO impacts":** Data not in localStorage  
**If you see "Career has impacts to save":** Good! Continue to step 7

---

### 7. Verify in Database

**Run in Supabase SQL Editor:**

```sql
-- Check if impacts were saved
SELECT 
  id,
  organization,
  role,
  impacts IS NOT NULL as has_impacts_column,
  impacts,
  jsonb_pretty(impacts) as impacts_formatted
FROM career_highlights
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 3;
```

**Expected:** `has_impacts_column` should be `true` and `impacts` should show data

---

## Common Issues & Solutions

### Issue 1: Column Doesn't Exist

**Symptom:** Query #1 returns 0 rows

**Fix:**
```sql
ALTER TABLE career_highlights ADD COLUMN IF NOT EXISTS impacts JSONB;
```

### Issue 2: RLS Policy Blocking Save

**Symptom:** Save fails with "violates row-level security"

**Fix:**
```sql
DROP POLICY IF EXISTS "Users can manage own career highlights" ON career_highlights;
CREATE POLICY "Users can manage own career highlights"
ON career_highlights FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Issue 3: Data Not in localStorage

**Symptom:** localStorage check shows `impacts: undefined`

**Root Cause:** Backend didn't send impacts, or onboarding didn't preserve them

**Fix:** Add test data manually (see Step 4 above), or check backend response

### Issue 4: Save Function Not Called

**Symptom:** No console logs showing save attempt

**Fix:** Edit something in the editor to trigger auto-save

### Issue 5: Null Being Saved Instead of Data

**Symptom:** Database shows `impacts: null` instead of the object

**Check:**
```javascript
// In console during save, check what's being sent
const portfolio = JSON.parse(localStorage.getItem('portfolioData'));
console.log('What will be saved:', {
  impacts: portfolio.careerHighlights[0].impacts,
  type: typeof portfolio.careerHighlights[0].impacts
});
```

Should show `type: "object"`, not `"undefined"` or `"null"`

---

## Complete Test Script

**Run this entire script in Browser Console:**

```javascript
console.log('=== IMPACTS DEBUG SCRIPT ===');

// 1. Check localStorage
const portfolio = JSON.parse(localStorage.getItem('portfolioData'));
console.log('1. Portfolio exists:', !!portfolio);
console.log('   Career highlights:', portfolio.careerHighlights?.length);

// 2. Check first career
const firstCareer = portfolio.careerHighlights?.[0];
if (firstCareer) {
  console.log('2. First career:', firstCareer.organization);
  console.log('   Has impacts:', !!firstCareer.impacts);
  console.log('   Impacts value:', firstCareer.impacts);
  
  // 3. Add test impacts if missing
  if (!firstCareer.impacts) {
    console.log('3. Adding test impacts...');
    firstCareer.impacts = {
      business: [{
        value: "$2M",
        metric: "Revenue",
        description: "Test impact",
        category: "business"
      }]
    };
    localStorage.setItem('portfolioData', JSON.stringify(portfolio));
    console.log('   ✅ Impacts added to localStorage');
  }
  
  // 4. Verify impacts are there
  const updated = JSON.parse(localStorage.getItem('portfolioData'));
  console.log('4. Verified impacts in localStorage:', !!updated.careerHighlights[0].impacts);
  
  // 5. Trigger save by making a small change
  updated.careerHighlights[0].description = updated.careerHighlights[0].description + ' ';
  localStorage.setItem('portfolioData', JSON.stringify(updated));
  
  console.log('5. ✅ Made a change to trigger auto-save');
  console.log('   Wait 2 seconds and check console for save logs...');
} else {
  console.log('❌ No career highlights found!');
}
```

---

## Expected Flow

1. ✅ Column exists in database
2. ✅ Impacts data in localStorage
3. ✅ Save triggered (console logs show)
4. ✅ Database receives impacts data
5. ✅ Query shows impacts saved

## If Still Not Working

**Check this in console after making an edit:**

```javascript
// Right before save happens
window.addEventListener('beforeunload', () => {
  const portfolio = JSON.parse(localStorage.getItem('portfolioData'));
  console.log('FINAL CHECK - Impacts:', portfolio.careerHighlights[0]?.impacts);
});
```

**Then tell me:**
1. What does the console show for impacts?
2. Do you see the "Database Debug" logs?
3. What does the Supabase query return?

I'll help debug further based on what you find!

