# 🚀 Phase 1: Portfolio Publishing - Setup Guide

## ✅ What's Been Implemented

Phase 1 of portfolio publishing is now complete! Here's what you can do:

- ✅ Claim a unique portfolio URL (e.g., `portfoliobuilder.com/johndoe`)
- ✅ Publish your portfolio with one click
- ✅ Public portfolio pages with SEO optimization
- ✅ Project and career detail pages
- ✅ Copy link button directly in the editor
- ✅ Unpublish functionality
- ✅ Update published portfolio

---

## 📋 Setup Instructions

### **Step 1: Run Database Migration**

The publishing feature requires new database tables. You need to run the migration:

#### **Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the contents of `supabase/migrations/001_add_publishing_system.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)

#### **Option B: Using Supabase CLI**

```bash
# If you have Supabase CLI installed
supabase migration up

# Or apply the specific migration
psql $DATABASE_URL -f supabase/migrations/001_add_publishing_system.sql
```

### **Step 2: Verify Tables Were Created**

In Supabase Dashboard → **Table Editor**, you should see:
- ✅ `published_portfolios` table
- ✅ New columns in `profiles` table:
  - `portfolio_slug`
  - `is_portfolio_published`
  - `last_published_at`

### **Step 3: Set Environment Variable (if needed)**

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Or your production URL:
# NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### **Step 4: Restart Your Dev Server**

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🎯 How to Use Publishing

### **First Time Publishing:**

1. **Open the Editor** (`/editor`)
2. You'll see a **"Publish Portfolio"** button at the top
3. Click it to open the publish modal
4. **Choose your URL slug** (e.g., "john-doe")
   - Real-time availability check
   - Suggestions if taken
5. Review validation warnings
6. Click **"Publish Portfolio"**
7. 🎉 Success! Your portfolio is now live

### **After Publishing:**

The publishing bar shows:
```
[Live 🟢] [portfoliobuilder.com/your-slug [📋]] [View] [Update] [⋮]
```

- **Copy button (📋)** - Copies your portfolio URL
- **View** - Opens your live portfolio in new tab
- **Update** - Re-publish after making changes
- **More menu (⋮)** - Additional options (Unpublish)

### **Viewing Your Published Portfolio:**

Your portfolio is accessible at:
```
http://localhost:3000/your-slug
```

**Subpages:**
- Projects: `http://localhost:3000/your-slug/project/[project-id]`
- Careers: `http://localhost:3000/your-slug/career/[career-id]`

---

## 🔧 Troubleshooting

### **Issue: "Portfolio Not Found" when accessing URL**

**Cause:** Database migration hasn't been run yet

**Solution:** 
1. Run the migration (Step 1 above)
2. Restart dev server
3. Try publishing again

### **Issue: "Cannot read properties of undefined"**

**Cause:** Missing data in published snapshot

**Solution:**
1. Make sure you have:
   - Full name filled in
   - Profession/title filled in
   - At least one project, career, or strength
2. Try publishing again

### **Issue: Slug availability check not working**

**Cause:** Database tables don't exist yet

**Solution:** Run the migration (Step 1)

### **Issue: 500 error when accessing public URL**

**Check console logs:**
```bash
# Look for errors like:
[Publishing] No published portfolio found for slug: your-slug
```

This means the portfolio isn't published yet or the slug doesn't match.

---

## 📊 Database Schema

### **published_portfolios Table**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User who owns this portfolio (unique) |
| portfolio_slug | TEXT | URL slug (globally unique) |
| published_data | JSONB | Complete portfolio snapshot |
| version | INTEGER | Version number |
| is_active | BOOLEAN | Whether portfolio is live |
| published_at | TIMESTAMP | When published |

### **profiles Table (New Columns)**

| Column | Type | Description |
|--------|------|-------------|
| portfolio_slug | TEXT | User's claimed slug (globally unique) |
| is_portfolio_published | BOOLEAN | Publish status flag |
| last_published_at | TIMESTAMP | Last publish time |

---

## 🎨 Features Implemented

### **1. Slug Management**
- Global uniqueness check
- Reserved slug protection
- Real-time availability
- Smart suggestions if taken

### **2. Publishing**
- One-click publish
- Validation before publish
- Success screen with shareable link
- Version tracking

### **3. Public Routes**
- Main portfolio: `/[slug]`
- Project details: `/[slug]/project/[id]`
- Career details: `/[slug]/career/[id]`
- SEO optimized (meta tags, OG images)
- ISR caching for performance

### **4. Editor Integration**
- Publishing bar at top of editor
- Status indicator (Live/Draft)
- Copy link button (prominent)
- Update and unpublish options

---

## 🚫 Known Limitations (Phase 1)

These are NOT implemented yet (future phases):

- ❌ Draft vs published diff detection
- ❌ "Revert to published" functionality
- ❌ Version history
- ❌ Changing slug after publish
- ❌ Friendly slugs for subpages (uses UUIDs)
- ❌ Analytics tracking
- ❌ Custom domains

---

## 📝 Testing Checklist

Test these scenarios:

### **Publishing Flow**
- [ ] Choose a unique slug
- [ ] See availability check work
- [ ] Get suggestions if slug is taken
- [ ] Publish successfully
- [ ] See success screen with link
- [ ] Copy link button works

### **Public Access**
- [ ] Main portfolio loads at `/your-slug`
- [ ] All sections visible
- [ ] Projects show correctly
- [ ] Careers show correctly
- [ ] Click project → detail page loads
- [ ] Click career → detail page loads
- [ ] Back buttons work

### **Editor Updates**
- [ ] Publishing bar shows "Live" status
- [ ] URL with copy button visible
- [ ] Copy button works (icon changes to ✓)
- [ ] "View" button opens portfolio
- [ ] "Update" button re-publishes
- [ ] "Unpublish" works

### **Edge Cases**
- [ ] Try to publish with no content (should show error)
- [ ] Try to claim reserved slug (should show error)
- [ ] Try to access non-existent slug (404)
- [ ] Unpublish and verify URL shows 404

---

## 🐛 Debug Mode

If you need to debug, the publishing functions have console logs:

```typescript
// In lib/publishing.ts, set:
const DEBUG = true;

// You'll see logs like:
[Publishing] Starting publish for user: xxx
[Publishing] Slug claimed: johndoe
[Publishing] Snapshot prepared: { projects: 5, careers: 3, ... }
[Publishing] ✅ Portfolio published successfully
```

---

## 🎯 Next Steps (Future Phases)

**Phase 2 - Draft Management:**
- Detect changes since last publish
- "Revert to published" button
- Change tracking

**Phase 3 - Advanced Features:**
- Version history
- Analytics
- SEO settings
- Change slug after publish

---

## 📞 Need Help?

1. **Check console for errors** - Both browser and terminal
2. **Verify migration ran** - Check Supabase table editor
3. **Restart dev server** - Sometimes needed after migration
4. **Check environment variables** - Make sure NEXT_PUBLIC_APP_URL is set

---

## ✨ Success Criteria

You'll know everything is working when:

1. ✅ You can click "Publish Portfolio" in editor
2. ✅ Choose a slug with real-time availability check
3. ✅ Publish successfully
4. ✅ Copy link button works in publishing bar
5. ✅ Your portfolio loads at `localhost:3000/your-slug`
6. ✅ All sections render correctly
7. ✅ Project/career detail pages work
8. ✅ Can unpublish and URL shows 404

---

**Phase 1 is complete! 🎉 Start by running the database migration.**

