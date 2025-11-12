# ⚡ Quick Start: Portfolio Publishing

## 🚨 **IMPORTANT: Run This First!**

Before testing, you **MUST** run the database migration:

### **Step 1: Apply Database Migration**

Go to **Supabase Dashboard**:
1. Open https://app.supabase.com
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy ALL contents from: `supabase/migrations/001_add_publishing_system.sql`
6. Paste and click **Run**

✅ You should see: "Success. No rows returned"

---

## 🧪 **Step 2: Test It Works**

```bash
# Restart your dev server
npm run dev
```

### **In Browser:**

1. Go to `/editor`
2. Look for **green "Publish Portfolio" button** at top
3. Click it
4. Choose a slug (e.g., "test-portfolio")
5. Click "Publish"
6. See success screen
7. Try the **Copy Link** button in the top bar
8. Visit: `http://localhost:3000/test-portfolio`

✅ If you see your portfolio → **IT WORKS!** 🎉

---

## ❌ **Troubleshooting**

### **Problem: Still seeing 404**

**Check:**
```sql
-- In Supabase SQL Editor, run:
SELECT * FROM published_portfolios;
```

- If **table doesn't exist** → Migration didn't run
- If **no rows** → Portfolio not published yet
- If **rows exist** → Check slug matches URL

### **Problem: Can't publish**

**Check browser console for errors:**
- "table published_portfolios does not exist" → Run migration
- "portfolio_slug violates unique constraint" → Slug already taken
- Other errors → Check setup guide

### **Problem: Validation errors**

Make sure you have:
- ✅ Full name filled in
- ✅ Profession/title filled in  
- ✅ At least 1 project OR career OR strength

---

## 📋 **What You Get**

After publishing:

**In Editor:**
```
[Live 🟢] [portfoliobuilder.com/your-slug [📋]] [View] [Update] [⋮]
```

**Public URLs:**
- Main: `localhost:3000/your-slug`
- Projects: `localhost:3000/your-slug/project/[id]`
- Careers: `localhost:3000/your-slug/career/[id]`

---

## 🎯 **Next Steps**

1. ✅ Run migration
2. ✅ Publish a test portfolio
3. ✅ View it publicly
4. ✅ Try copy button
5. ✅ Try unpublish

**That's it!** 🚀

For detailed info, see: `PHASE_1_SETUP_GUIDE.md`

