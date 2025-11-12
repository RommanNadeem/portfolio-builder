# Slug Troubleshooting Guide

This guide helps diagnose and fix 404 errors with portfolio slugs on **buildspace.me**.

## 🔍 Understanding Portfolio URLs

### URL Structure
```
https://www.buildspace.me/{slug}
```

**Examples:**
- ✅ `https://www.buildspace.me/john-doe`
- ✅ `https://www.buildspace.me/jane-smith`
- ✅ `https://www.buildspace.me/alex123`

### Sub-pages (Career & Projects)
```
https://www.buildspace.me/{slug}/career/{id}
https://www.buildspace.me/{slug}/project/{id}
```

## ❌ Common 404 Causes

### 1. Portfolio Not Published
**Symptom:** Slug works in editor but shows 404 publicly

**Check:**
1. Go to your editor at `/editor`
2. Look for "Publish" button status
3. If it says "Publish Portfolio", you haven't published yet

**Fix:**
```
1. Click "Publish Portfolio" button in editor
2. Confirm your slug
3. Click "Publish" in the modal
4. Wait for success confirmation
5. Try your URL again: https://www.buildspace.me/your-slug
```

### 2. Slug Not Claimed
**Symptom:** Never set up a slug

**Fix:**
```
1. Go to /editor
2. Click "Publish Portfolio"
3. Choose your custom slug (e.g., "john-doe")
4. Click "Claim URL"
5. Then click "Publish Portfolio"
```

### 3. Portfolio Unpublished
**Symptom:** Worked before, now shows 404

**Check:** Did you unpublish it?

**Fix:**
```
1. Go to /editor
2. Click "Publish Portfolio" again
3. Confirm and publish
```

### 4. Reserved Slug Conflict
**Symptom:** Can't claim certain slugs

**Reserved slugs include:**
- `editor`, `dashboard`, `settings`
- `signin`, `signup`, `admin`
- `api`, `auth`, `detail`
- `debug-data`, `debug-published`
- [Full list in `/lib/reserved-slugs.ts`]

**Fix:** Choose a different slug

### 5. Invalid Slug Format
**Symptom:** Slug rejected during creation

**Rules:**
- 3-30 characters
- Lowercase letters (a-z)
- Numbers (0-9)
- Hyphens (-) allowed
- Must start and end with letter/number
- No consecutive hyphens (--)
- Cannot be only numbers

**Examples:**
- ✅ `john-doe` (valid)
- ✅ `jane123` (valid)
- ✅ `alex-smith-pm` (valid)
- ❌ `Jo` (too short)
- ❌ `John_Doe` (underscore not allowed)
- ❌ `-john` (starts with hyphen)
- ❌ `john--doe` (consecutive hyphens)
- ❌ `12345` (only numbers)

## 🔧 Step-by-Step Diagnosis

### Step 1: Check Database (for developers)
```sql
-- Check if slug exists in profiles
SELECT id, full_name, portfolio_slug, is_portfolio_published 
FROM profiles 
WHERE portfolio_slug = 'your-slug';

-- Check if portfolio is published
SELECT portfolio_slug, is_active, published_at 
FROM published_portfolios 
WHERE portfolio_slug = 'your-slug';
```

### Step 2: Check Browser Console
1. Open your portfolio URL: `https://www.buildspace.me/your-slug`
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to Console tab
4. Look for log messages:

**Good (working):**
```
[Publishing] 🔍 Looking up published portfolio for slug: "your-slug"
[Publishing] ✅ Found published portfolio for: "your-slug"
[Public Portfolio] Successfully loaded portfolio for: your-slug
```

**Bad (404):**
```
[Publishing] 🔍 Looking up published portfolio for slug: "your-slug"
[Publishing] ⚠️ No published portfolio found for slug: "your-slug"
[Public Portfolio] Portfolio not found for slug: your-slug
```

### Step 3: Check Server Logs (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Logs" tab
4. Search for your slug name
5. Look for error messages

### Step 4: Verify Environment Variables
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Verify these are set:
   - `NEXT_PUBLIC_APP_URL` = `https://www.buildspace.me`
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase key

## 🎯 Testing Checklist

Use this checklist to verify your slug works:

### In Editor
- [ ] Can access `/editor`
- [ ] Can see "Publish Portfolio" button
- [ ] Slug is shown in the publish modal
- [ ] Slug is claimed (no red error)
- [ ] Portfolio is published (green checkmark)

### Public Access
- [ ] Visit `https://www.buildspace.me/your-slug`
- [ ] Page loads (no 404)
- [ ] Profile information displays correctly
- [ ] Projects/career sections show correctly
- [ ] Images load properly

### Sharing
- [ ] Copy link works
- [ ] Shared link opens in new tab correctly
- [ ] Link works when shared via email/message
- [ ] Works in incognito/private browsing

## 🚑 Quick Fixes

### Fix 1: Re-publish Portfolio
```
1. Go to /editor
2. Make any small change (add a space, remove it)
3. Wait for autosave
4. Click "Publish Portfolio"
5. Confirm and publish
```

### Fix 2: Clear Cache
```
1. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Try in incognito/private window
4. Try different browser
```

### Fix 3: Check Supabase Connection
```
1. Go to Supabase Dashboard
2. Check if project is paused (free tier)
3. Verify database is active
4. Check RLS policies are enabled
```

### Fix 4: Redeploy on Vercel
```
1. Go to Vercel Dashboard
2. Select your project
3. Go to Deployments
4. Click "..." on latest deployment
5. Click "Redeploy"
```

## 📊 Database Queries for Debugging

### Check User's Slug Status
```sql
SELECT 
  p.full_name,
  p.portfolio_slug,
  p.is_portfolio_published,
  p.last_published_at,
  pp.is_active as published_active,
  pp.published_at
FROM profiles p
LEFT JOIN published_portfolios pp ON pp.user_id = p.id
WHERE p.id = 'user-uuid-here';
```

### Find All Active Published Portfolios
```sql
SELECT 
  portfolio_slug,
  published_at,
  is_active
FROM published_portfolios
WHERE is_active = true
ORDER BY published_at DESC;
```

### Check for Duplicate Slugs (should be impossible)
```sql
SELECT 
  portfolio_slug, 
  COUNT(*) as count
FROM published_portfolios
WHERE is_active = true
GROUP BY portfolio_slug
HAVING COUNT(*) > 1;
```

## 🔐 Security & RLS Check

### Verify RLS Policies
```sql
-- Check if RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'published_portfolios';

-- List policies
SELECT * FROM pg_policies 
WHERE tablename = 'published_portfolios';
```

**Expected policies:**
1. ✅ "Public portfolios are viewable by everyone" (FOR SELECT)
2. ✅ "Users can manage their own published portfolio" (FOR ALL)

## 📱 Mobile Testing

Test on mobile devices:
1. Visit `https://www.buildspace.me/your-slug` on mobile
2. Check responsive design
3. Test all links work
4. Verify images load
5. Check career/project sub-pages

## 🆘 Still Not Working?

### Checklist:
- [ ] Portfolio is published (not just saved)
- [ ] Slug is claimed in profiles table
- [ ] Entry exists in published_portfolios table
- [ ] is_active = true in published_portfolios
- [ ] Environment variables are set correctly
- [ ] Database is accessible (not paused)
- [ ] Tried hard refresh / different browser
- [ ] Checked server logs for errors

### Get Help:
1. Check server logs in Vercel
2. Check browser console for errors
3. Verify database connection
4. Check Supabase logs
5. Review recent deployments

## ✅ Success Indicators

Your slug is working if:
- ✅ `https://www.buildspace.me/your-slug` loads your portfolio
- ✅ No 404 error
- ✅ Profile information displays
- ✅ Projects and career sections show
- ✅ Share link works
- ✅ Works in incognito mode
- ✅ Works on mobile devices

## 📞 Support Resources

- **Documentation:** See `PRODUCTION_SETUP.md`
- **Technical Details:** See `PRODUCTION_URL_FIX.md`
- **Database Schema:** See `supabase/migrations/001_add_publishing_system.sql`
- **Reserved Slugs:** See `lib/reserved-slugs.ts`

