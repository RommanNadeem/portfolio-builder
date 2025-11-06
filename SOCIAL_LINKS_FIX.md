# 🔧 Social Links Persistence Fix

## 🐛 Issue
Social links disappear on page refresh

## ✅ Solutions Implemented

### **1. Enhanced Logging**

Added detailed console logs to track social links through the entire save pipeline:

```
[usePortfolioData] Social links count: X
[usePortfolioData] Social links data: [...]
[Database Debug] Inserting X social links
[Database Debug] Social links data: [...]
[Database Debug] Social links insert result: {...}
```

### **2. Save Indicator in Left Pane**

Added real-time save status indicator above sections list:

- 🔵 **Blue pulsing dot** → "Saving" (during save)
- 🟠 **Orange dot** → "Unsaved" (has changes)
- 🟢 **Green dot** → "Saved" (all saved)

### **3. Verification Steps**

To confirm social links are being saved:

#### **Step 1: Check Console on Save**
1. Open DevTools (F12) → Console
2. Add a social link (e.g., LinkedIn)
3. Wait 2 seconds
4. Look for:
   ```
   [usePortfolioData] Social links count: 1
   [usePortfolioData] Social links data: [{...}]
   [Database Debug] Inserting 1 social links
   [Database Debug] Social links insert result: {data: null, error: null}
   ```

#### **Step 2: Check Supabase Dashboard**
1. Go to Supabase project
2. Navigate to Table Editor
3. Open `social_links` table
4. Filter by your `user_id`
5. Confirm records exist

#### **Step 3: Check localStorage**
```javascript
// In browser console
const data = JSON.parse(localStorage.getItem('portfolioData'));
console.log('Social links:', data.socialLinks);
```

#### **Step 4: Refresh Test**
1. Add social links
2. Wait for green "Saved" indicator
3. Refresh page
4. Social links should reappear

## 🔍 **Possible Causes & Fixes**

### **Cause 1: Data Not Being Passed**
**Check:** Is `socialLinks` in the portfolio state?

**Fix:**
```typescript
// In usePortfolioData, verify initialization:
if (!parsedData.socialLinks) parsedData.socialLinks = [];
```
✅ Already implemented (line 62)

### **Cause 2: Database Insert Failing**
**Check:** Console shows insert errors?

**Fix:** Now has detailed error logging
```typescript
if (socialLinksInsert.error) {
  console.error('Social links insert error:', socialLinksInsert.error);
}
```
✅ Now implemented

### **Cause 3: Data Not Loading on Refresh**
**Check:** `getCompletePortfolio()` returns socialLinks?

**Verify:**
```typescript
// lib/database.ts line 85
socialLinks: (socialLinksRes.data || []) as SocialLink[]
```
✅ Already correct

### **Cause 4: Conversion Issue**
**Check:** `convertToLegacyFormat()` properly maps socialLinks?

**Verify:**
```typescript
// lib/database.ts line 519-524
socialLinks: portfolioData.socialLinks.map(link => ({
  id: link.id,
  platform: link.platform,
  url: link.url,
  icon: link.icon
}))
```
✅ Already correct

## 🧪 **Testing Checklist**

Run through this checklist:

- [ ] Add a social link (e.g., LinkedIn)
- [ ] See "Unsaved" indicator (orange)
- [ ] Wait 2 seconds
- [ ] See "Saving" indicator (blue, pulsing)
- [ ] See "Saved" indicator (green)
- [ ] Check console for success logs
- [ ] Refresh page
- [ ] Social link still appears ✅

## 📊 **Expected Console Output**

When adding LinkedIn link:
```
[useAutoSave] ⏰ Auto-save triggered after 2000ms
[usePortfolioData] 💾 Saving portfolio to database for user: abc-123...
[usePortfolioData] Social links count: 1
[usePortfolioData] Social links data: [{id: "...", platform: "LinkedIn", url: "...", icon: "linkedin"}]
[usePortfolioData] ✅ Saved to localStorage
[Database Debug] saveCompletePortfolio called for user: abc-123...
[Database Debug] Profile saved
[Database Debug] Existing data cleared
[Database Debug] Inserting 1 social links
[Database Debug] Social links data: [{...}]
[Database Debug] Social links insert result: {data: null, error: null}
[Database Debug] All data saved successfully
[usePortfolioData] ✅ Successfully saved to Supabase database
[useAutoSave] ✅ Auto-save successful
```

## 🎯 **Next Steps**

1. **Test now** - Add a social link and check console
2. **Share console output** - If still not working, share the logs
3. **Check Supabase** - Verify data in database
4. **Check RLS policies** - Ensure user can INSERT to social_links table

---

**The save indicator is now visible in the left pane, and social links have enhanced logging for debugging.** 🔍

