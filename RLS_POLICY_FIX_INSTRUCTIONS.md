# 🔒 Fix Profiles RLS Policy Error

## 🐛 **The Problem**

**Error:**
```
Failed to save profile: new row violates row-level security policy for table "profiles"
```

**Cause:**
- Supabase Row-Level Security (RLS) policies are blocking users from saving their own profiles
- The policies are either missing, misconfigured, or too restrictive

---

## ✅ **The Solution**

### **Step 1: Run SQL Migration**

1. Go to **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `FIX_PROFILES_RLS_POLICY.sql`
4. Click **Run**

### **Step 2: Verify Policies**

Run this query in SQL Editor:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';
```

**Expected Result:**
You should see 4 policies:
- ✅ `Users can view their own profile` (SELECT)
- ✅ `Users can insert their own profile` (INSERT)
- ✅ `Users can update their own profile` (UPDATE)
- ✅ `Users can delete their own profile` (DELETE)

---

## 🔍 **What the Fix Does**

### **Policy Details:**

```sql
-- Users can only see their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can only create their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

**Security:**
- ✅ Users can ONLY access their own data (via `auth.uid() = id`)
- ✅ Users cannot see other users' profiles
- ✅ Users cannot modify other users' profiles
- ✅ Prevents data leaks
- ✅ Complies with best practices

---

## 🧪 **Test After Applying**

### **Test 1: Save Portfolio**
1. Go to `/editor`
2. Make any change
3. Wait for auto-save (2-3 seconds)
4. **Should see:** "✅ Saved successfully"
5. **Should NOT see:** RLS policy error

### **Test 2: Check Database**
1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → **profiles**
3. **Should see:** Your profile row with updated data
4. Verify `updated_at` timestamp is recent

### **Test 3: Check Console**
1. Open browser DevTools → Console
2. Make changes in editor
3. **Should see:** 
   - `[usePortfolioData] ✅ Successfully saved to Supabase database`
4. **Should NOT see:**
   - RLS policy errors
   - 401 errors
   - Permission denied errors

---

## 🆘 **If Still Not Working**

### **Check 1: User Authentication**

Make sure you're logged in:

```javascript
// In browser console
const { data } = await supabase.auth.getUser();
console.log('Current user:', data.user?.id);
```

If no user → You're not logged in, authentication issue

### **Check 2: Profile Exists**

Check if your profile exists:

```sql
-- In Supabase SQL Editor
SELECT * FROM profiles WHERE id = 'your-user-id-here';
```

If empty → Profile doesn't exist, need to create it first

### **Check 3: RLS is Enabled**

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';
```

Should show `rowsecurity = true`

### **Check 4: Policy Syntax**

Make sure policies use `auth.uid()` not `current_user`:

```sql
-- Correct:
USING (auth.uid() = id)

-- Wrong:
USING (current_user = id)
```

---

## 🔧 **Alternative: Disable RLS (NOT RECOMMENDED)**

**⚠️ ONLY for development/testing:**

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**WARNING:** This removes all security. Anyone can read/modify any profile. **Never use in production!**

---

## 💡 **Why This Happens**

**Common Causes:**
1. ❌ RLS enabled but no policies created
2. ❌ Policies created for wrong user type (anon vs authenticated)
3. ❌ Policy condition doesn't match (wrong column check)
4. ❌ User ID mismatch (session user vs profile id)

**Our Fix:**
- ✅ Creates proper policies for authenticated users
- ✅ Uses `auth.uid()` (correct function)
- ✅ Checks `id` column (correct column)
- ✅ Covers all operations (SELECT, INSERT, UPDATE, DELETE)

---

## 📋 **After Fixing**

Once the SQL migration is run:

1. ✅ **Refresh the app** (hard refresh: Cmd+Shift+R)
2. ✅ **Make a change** in the editor
3. ✅ **Auto-save should work** without errors
4. ✅ **Data persists** to Supabase

---

## 🎯 **Quick Fix Steps**

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Paste `FIX_PROFILES_RLS_POLICY.sql` contents
4. Click **Run**
5. Refresh your app
6. Test saving

**Time:** 2 minutes  
**Difficulty:** Easy  
**Risk:** Low (only affects profiles table)

---

**Status:** SQL migration ready to run  
**File:** `FIX_PROFILES_RLS_POLICY.sql`  
**Next Step:** Run in Supabase SQL Editor

