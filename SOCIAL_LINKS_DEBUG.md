# 🐛 Social Links Debug Guide

## 🔍 Issue
Social links collected during onboarding should appear in the editor but they disappear on refresh.

## ✅ Data Flow

### **1. Onboarding Collects Links**
**File:** `app/onboarding-v2/start/page.tsx` (lines 146-150)

```typescript
const socialLinksWithUUIDs = (parsed.socialLinks || []).map((link: any) => ({
  ...link,
  id: link.id || crypto.randomUUID()  // Ensures UUID
}));
```

### **2. Onboarding Saves to Database**
**File:** `app/onboarding-v2/signup/page.tsx` (line 79)

```typescript
await saveCompletePortfolio(authData.user.id, portfolioData);
```

This saves:
- Profile data
- Career highlights
- Social links ✅
- Projects

### **3. Editor Loads from Database**
**File:** `app/editor/hooks/usePortfolioData.ts` (line 50)

```typescript
const { data: portfolioData } = await getCompletePortfolio(user.id);
```

### **4. Data Conversion**
**File:** `lib/database.ts` (lines 519-524)

```typescript
socialLinks: portfolioData.socialLinks.map(link => ({
  id: link.id,
  platform: link.platform,
  url: link.url,
  icon: link.icon
}))
```

## 🧪 **Debug Steps**

### **Step 1: Check What Onboarding Collected**
```javascript
// In browser console (on onboarding pages)
const draft = localStorage.getItem('onboarding_draft');
const parsed = JSON.parse(draft);
console.log('Onboarding links:', parsed.links);
console.log('Onboarding socialLinks:', parsed.socialLinks);
```

### **Step 2: Check What Was Saved to DB**
Open browser console on editor page, look for:
```
[Editor Debug] Raw portfolio data from Supabase: {...}
[Editor Debug] Social links from Supabase (raw): [...]
[Editor Debug] Social links after conversion: [...]
[Editor Debug] Social links count: X
```

### **Step 3: Check Supabase Directly**
1. Go to Supabase Dashboard
2. Table Editor → `social_links` table
3. Filter by your `user_id`
4. Check if records exist

## 🔧 **Possible Issues & Fixes**

### **Issue 1: Links Not Saved During Onboarding**
**Symptom:** Console shows `Social links count: 0`

**Fix:** Check `app/onboarding-v2/signup/page.tsx` line 79
Ensure `portfolioData` includes `socialLinks` before saving

### **Issue 2: Wrong Data Format**
**Symptom:** Links saved but not loaded

**Check:**
- Supabase table has: `id`, `user_id`, `platform`, `url`, `icon`
- Data has proper UUIDs for `id`

### **Issue 3: Conversion Error**
**Symptom:** Raw data has links but converted data doesn't

**Fix:** Check `lib/database.ts` `convertToLegacyFormat()` function

### **Issue 4: RLS Policy Blocks Read**
**Symptom:** Can save but can't read

**Fix:** Ensure Supabase RLS allows SELECT on `social_links` table

## 🎯 **Expected Console Output**

When editor loads with social links:
```
[Editor Debug] Raw portfolio data from Supabase: {
  profile: {...},
  socialLinks: [
    {id: "uuid-1", user_id: "user-id", platform: "LinkedIn", url: "...", icon: "linkedin"},
    {id: "uuid-2", user_id: "user-id", platform: "GitHub", url: "...", icon: "github"}
  ],
  ...
}
[Editor Debug] Social links from Supabase (raw): [{...}, {...}]
[Editor Debug] Social links after conversion: [{...}, {...}]
[Editor Debug] Social links count: 2
```

## 🚀 **Test Now**

1. Open browser DevTools → Console
2. Refresh the editor page
3. Look for the debug logs
4. Share what you see:
   - `Social links count: ?`
   - `Social links from Supabase (raw): ?`

This will tell us exactly where the data is getting lost!

---

**Enhanced logging is now active. Check the console to see what's happening with social links.** 🔍

