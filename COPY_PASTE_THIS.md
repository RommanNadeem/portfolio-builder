# 📋 Copy-Paste This - Complete Test

## 🔷 PART 1: Supabase (Database)

**Where:** https://app.supabase.com → Your Project → SQL Editor → New Query

**Paste This:**

```sql
ALTER TABLE career_highlights ADD COLUMN IF NOT EXISTS impacts JSONB;
SELECT column_name FROM information_schema.columns WHERE table_name = 'career_highlights' AND column_name = 'impacts';
```

**Then:** Click "Run" button

**Expected:** You'll see `impacts` in the results

---

## 🔷 PART 2: Browser Console  

**Where:** Your app → Press F12 (or Cmd+Option+I on Mac) → Click "Console" tab

**Paste This:**

```javascript
localStorage.setItem('portfolioData', JSON.stringify({
  fullName: "John Smith",
  profession: "Marketing Manager",
  email: "test@email.com",
  phone: "555-1234",
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
    current: false,
    achievements: ["Led teams"],
    responsibilities: ["Led Global Sales Teams"],
    key_achievements: ["Achieved 12% growth", "Generated $3M in leads"],
    impacts: {
      business: [
        { value: "$3M", metric: "Leads Generated", description: "Generated quality leads", category: "business" },
        { value: "$0.98M", metric: "Revenue", description: "Digital marketing revenue", category: "business" }
      ],
      growth: [
        { value: "12%", metric: "Growth", description: "Revenue growth", category: "growth" }
      ]
    },
    companyGroup: "intech",
    sameCompanyCount: 2,
    hasMultipleRolesAtCompany: true,
    companyTenure: { firstStarted: "2014", lastEnded: "2019", totalRoles: 2 }
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

**Then:** Press Enter

**Page will reload and you'll see console logs!**

---

## 🔷 PART 3: Check Results

**After page reloads, look in console for:**

```
[Database Debug] Career has impacts to save: { impactsKeys: ["business", "growth"], ... }
```

**Then run this in Supabase SQL Editor:**

```sql
SELECT organization, impacts FROM career_highlights WHERE user_id = auth.uid();
```

**Should see impacts data!**

---

## ✅ Success Looks Like:

**Console:**
```
✅ Data loaded!
[Database Debug] Career has impacts to save: { businessImpacts: 2, ... }
[Database Debug] Prepared career for upsert: { hasImpacts: true }
```

**Database Query:**
```
organization: INTECH
impacts: {"business": [{"value": "$3M", ...}], "growth": [...]}
```

**Career Detail Page:**
- Overview section shows "INTECH" + "Marketing Manager"
- Impact & Results section shows 3 metric cards

---

**Just copy-paste the code blocks above into the right places!** Let me know what console logs you see after the page reloads. 🚀

