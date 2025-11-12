# Resume Save Debugging Guide

## Steps to Verify Resume is Saving

### 1. Upload Resume
1. Go to `/editor`
2. Expand "Resume" section
3. Click "Upload Resume"
4. Select a PDF file

### 2. Check Console Logs

You should see these logs in order:

```
[usePortfolioData] ⚡ Instant localStorage update: {...}
[useAutoSave] 🔄 Data changed, saving...
[useAutoSave] 💾 Saving changes to database...
[usePortfolioData] 💾 Saving portfolio to database for user: xxx
[Database Debug] saveCompletePortfolio called for user: xxx
[Database Debug] Full portfolio data: {resume: "https://...", ...}  ← Check this!
[Database Debug] Attempting to save profile: {...}
[Database Debug] Resume URL being saved: https://...  ← Should show URL!
[Database Debug] Profile saved successfully
[useAutoSave] ✅ Saved successfully
```

### 3. Key Things to Look For

#### In "Full portfolio data":
```javascript
{
  resume: "https://xxxxxx.supabase.co/storage/v1/object/public/resumes/..."
  // This should be present!
}
```

#### In "Resume URL being saved":
```
[Database Debug] Resume URL being saved: https://...
```

If this shows `undefined` or `null`, then the resume field is not being updated correctly.

### 4. Verify in Supabase

1. Open Supabase dashboard
2. Go to Table Editor
3. Open `profiles` table
4. Find your row (by user ID)
5. Check `resume_url` column
6. Should contain the Supabase storage URL

### 5. Verify in Storage

1. Go to Supabase Storage
2. Open `resumes` bucket
3. Should see your uploaded file: `{userId}/{timestamp}-{random}.pdf`

## Common Issues

### Issue 1: Resume shows "undefined"
**Cause:** The `resume` field is not in the portfolio data object
**Fix:** Check that `onChange` is updating the correct field

### Issue 2: Resume saves but disappears on refresh
**Cause:** Database save might be working but load is failing
**Fix:** Check `convertToLegacyFormat` includes resume field

### Issue 3: "No resume uploaded yet" after refresh
**Cause:** Resume URL not being read from correct location
**Fix:** Check ResumeSection reads from both `data.resume` and `data.profile?.resume_url`

## How to Test

### Full Test Flow:
```bash
1. Upload resume
2. Check console: "Resume URL being saved: https://..."
3. Wait 1 second (auto-save completes)
4. Refresh page (Cmd+R / Ctrl+R)
5. Resume should still be visible
```

### If Resume Disappears:

**Check localStorage:**
```javascript
// In browser console:
const data = JSON.parse(localStorage.getItem('portfolioData'));
console.log('Resume in localStorage:', data.resume);
```

**Check Supabase:**
```sql
-- In Supabase SQL Editor:
SELECT resume_url FROM profiles WHERE id = 'YOUR_USER_ID';
```

## Current Implementation

### Update (ResumeSection.tsx):
```typescript
onChange(prev => ({
  ...prev,
  resume: result.publicUrl,  // Flat structure
}));
```

### Save (lib/database.ts):
```typescript
const profileData = {
  // ...
  resume_url: portfolioData.resume,  // Maps flat to database
  // ...
};
```

### Load (lib/database.ts):
```typescript
const converted = {
  // ...
  resume: portfolioData.profile.resume_url,  // Maps database to flat
  // ...
};
```

### Read (ResumeSection.tsx):
```typescript
const resumeUrl = data.resume || data.profile?.resume_url;  // Backward compatible
```

## Debug Steps

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Upload resume**
4. **Look for:**
   - ✅ "Resume URL being saved: https://..."
   - ✅ "Profile saved successfully"
   - ✅ "All data saved successfully"
5. **Refresh page**
6. **Check if resume still there**

If you see all ✅ logs but resume still disappears, please share:
- The full console logs
- The value of `data.resume` in component
- The Supabase `profiles.resume_url` value

