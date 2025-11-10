# 🚀 Quick Test - 2 Steps

## Step 1: Run SQL (30 seconds)

**Supabase SQL Editor** → Paste and Run:

```sql
ALTER TABLE career_highlights ADD COLUMN IF NOT EXISTS impacts JSONB;
SELECT column_name FROM information_schema.columns WHERE table_name = 'career_highlights' AND column_name = 'impacts';
```

✅ Should return 1 row: `impacts`

---

## Step 2: Load Test Data & Watch Console (1 minute)

**Browser Console (F12)** → Paste and Run:

```javascript
// Load test data
localStorage.setItem('portfolioData', JSON.stringify({
  fullName: "John Smith",
  profession: "Global Marketing Manager",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  tagline: "Marketing executive",
  whoAreYou: "Experienced marketing leader",
  companies: "INTECH",
  sliderCompanies: "INTECH",
  profileImage: null,
  resume: null,
  careerHighlights: [{
    id: crypto.randomUUID(),
    organization: "INTECH Process Automation",
    role: "Global Marketing Manager",
    description: "Led global marketing initiatives",
    startDate: "Jul 2014",
    endDate: "Feb 2019",
    current: false,
    link: "",
    achievements: ["Led teams", "Achieved 12% growth"],
    responsibilities: ["Led Global Sales Teams", "Provided strategic direction"],
    key_achievements: ["Achieved 12% growth", "Generated $0.98M revenue", "Generated $3M in leads"],
    impacts: {
      business: [
        { value: "$3M", metric: "Lead Value", description: "Generated quality leads worth $3M", category: "business" },
        { value: "$0.98M", metric: "Revenue", description: "Generated revenue from digital marketing", category: "business" }
      ],
      performance: [
        { value: "165%", metric: "Revenue Increase", description: "Increased product category revenue", category: "performance" }
      ],
      growth: [
        { value: "12%", metric: "Revenue Growth", description: "Highest ever revenues", category: "growth" }
      ]
    },
    companyGroup: "intech",
    sameCompanyCount: 2,
    hasMultipleRolesAtCompany: true,
    sameCompanyRoles: ["Marketing Manager"],
    companyTenure: { firstStarted: "May 2017", lastEnded: "Feb 2019", totalRoles: 2 }
  }],
  socialLinks: [],
  strengths: [],
  projects: [],
  testimonials: [],
  customSections: []
}));

console.log('✅ Test data loaded!');
location.reload();
```

**After reload, watch for:**
```
[Database Debug] Career has impacts to save: { businessImpacts: 2, ... }
[Database Debug] Career highlights upsert result: ...
```

---

## Step 3: Verify (1 minute)

**A. Check Database** (Supabase SQL):
```sql
SELECT organization, impacts FROM career_highlights WHERE user_id = auth.uid() LIMIT 1;
```

Should show impacts data!

**B. Check Career Detail Page:**
1. Go to `/editor`
2. Click "Create Detailed Career Page"
3. Should see 5 sections with data
4. Impact & Results should show 5 metrics

---

**That's it! If impacts still NULL in database, copy the console logs and share them with me.** 🔍

