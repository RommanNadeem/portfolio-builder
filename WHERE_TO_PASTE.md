# 📍 Exactly Where to Paste - Visual Guide

## Part 1: Database (Supabase) - 1 minute

### Step 1: Open Supabase
1. Go to https://app.supabase.com in your browser
2. Click on your project

### Step 2: Open SQL Editor
1. Look at the **left sidebar**
2. Click **"SQL Editor"** (looks like `</>` icon)
3. Click **"New Query"** button (top right)

### Step 3: Paste SQL
**Copy this:**
```sql
ALTER TABLE career_highlights ADD COLUMN IF NOT EXISTS impacts JSONB;
SELECT column_name FROM information_schema.columns WHERE table_name = 'career_highlights' AND column_name = 'impacts';
```

**Paste into:** The big text area in the center of the screen

### Step 4: Run It
1. Click **"Run"** button (or press Cmd+Enter / Ctrl+Enter)
2. Wait for green success message
3. Should see result showing: `impacts`

✅ Done with database!

---

## Part 2: Browser Console - 1 minute

### Step 1: Open Your App
1. Go to your portfolio builder app
2. Navigate to `/editor` page

### Step 2: Open Developer Console
**On Mac:** Press `Cmd + Option + I`  
**On Windows:** Press `F12` or `Ctrl + Shift + I`

You'll see a panel appear at the bottom or side of your browser.

### Step 3: Click "Console" Tab
At the top of the developer panel, click the **"Console"** tab

### Step 4: Paste JavaScript
**Copy this entire block:**

```javascript
localStorage.setItem('portfolioData', JSON.stringify({
  fullName: "John Smith",
  profession: "Global Marketing Manager",
  email: "test@email.com",
  phone: "+1 555-1234",
  tagline: "Marketing executive",
  whoAreYou: "Experienced leader",
  companies: "INTECH",
  sliderCompanies: "INTECH",
  careerHighlights: [{
    id: crypto.randomUUID(),
    organization: "INTECH",
    role: "Marketing Manager",
    description: "Led marketing",
    startDate: "2014",
    endDate: "2019",
    achievements: [],
    responsibilities: ["Led teams"],
    key_achievements: ["Achieved 12% growth"],
    impacts: {
      business: [
        { value: "$3M", metric: "Leads", description: "Generated $3M in leads", category: "business" }
      ]
    }
  }],
  socialLinks: [],
  strengths: [],
  projects: [],
  testimonials: [],
  customSections: []
}));
console.log('✅ Data loaded!');
location.reload();
```

**Paste into:** The console at the bottom where you see `>` prompt

### Step 5: Press Enter
1. Press **Enter**
2. You'll see `✅ Data loaded!`
3. Page will refresh automatically

### Step 6: Watch the Console
After page reloads, the console will automatically show logs like:

```
[Database Debug] Career has impacts to save: ...
```

---

## Part 3: Verify It Worked - 30 seconds

### Back in Supabase SQL Editor:

**Paste this:**
```sql
SELECT organization, impacts FROM career_highlights WHERE user_id = auth.uid();
```

**Click "Run"**

**You should see:**
```
organization: INTECH
impacts: {"business": [{"value": "$3M", ...}]}
```

If you see impacts data → ✅ **IT WORKED!**

---

## Visual Reference

```
SUPABASE:
┌─────────────────────────────────────────┐
│ Left Sidebar                            │
│ ├─ Dashboard                            │
│ ├─ Table Editor                         │
│ ├─ SQL Editor  ← CLICK HERE             │
│ └─ ...                                  │
└─────────────────────────────────────────┘

      ↓ After clicking SQL Editor

┌─────────────────────────────────────────┐
│ [New Query] ← CLICK                     │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ ALTER TABLE career_highlights...    ││ ← PASTE SQL HERE
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│ [RUN] ← CLICK THIS                      │
└─────────────────────────────────────────┘
```

```
BROWSER CONSOLE:
┌─────────────────────────────────────────┐
│ Your App                                │
│ ┌─────────────────────────────────────┐│
│ │ Editor Page                         ││
│ └─────────────────────────────────────┘│
│                                         │
│ Press F12 or Cmd+Option+I               │
│                 ↓                       │
│ ┌─────────────────────────────────────┐│
│ │ Elements | Console | Network        ││
│ │          ↑ CLICK                    ││
│ │─────────────────────────────────────││
│ │ >  ← PASTE JAVASCRIPT HERE          ││
│ │                                     ││
│ └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

Try it now! The scripts are in:
- `TEST_BACKEND_DATA.js` - Full backend data
- `QUICK_TEST.md` - Simplified version

Just copy-paste into the right places as shown above! 🎯
