# Career Detail Page - Data Mapping Guide

## How Backend Data Populates the Career Detail Page

### Backend Data Structure
```json
{
  "organization": "Google",
  "role": "Staff Software Engineer",
  "description": "Led architecture and development...",
  "startDate": "Jan 2023",
  "endDate": "Present",
  "current": true,
  "link": "https://google.com",
  
  "responsibilities": [
    "Led daily standup meetings",
    "Managed cross-functional collaboration"
  ],
  
  "key_achievements": [
    "Increased user engagement by 45%",
    "Reduced API latency from 2s to 800ms",
    "Launched premium features generating $2M ARR"
  ],
  
  "impacts": {
    "business": [
      {
        "value": "$2M",
        "metric": "Revenue Generated",
        "description": "Launched premium tier generating $2M ARR",
        "category": "business"
      }
    ],
    "performance": [...],
    "growth": [...],
    "quality": [...],
    "team": [...],
    "scale": [...]
  },
  
  "companyGroup": "google",
  "companyOccurrence": 1,
  "sameCompanyCount": 3,
  "hasMultipleRolesAtCompany": true,
  "sameCompanyRoles": ["Senior Engineer", "Engineer"],
  "companyTenure": {
    "firstStarted": "Jan 2020",
    "lastEnded": "Present",
    "isContinuous": true,
    "totalRoles": 3
  }
}
```

## Career Detail Page Sections

### Section 1: Overview (Hero Block)

**Populates:**
```typescript
title: "Google"                    // ← organization
subtitle: "Staff Software Engineer"  // ← role
description: "Led architecture..."  // ← description

meta: {
  "Timeline": "Jan 2023 - Present",           // ← startDate, endDate, current
  "Company Tenure": "Jan 2020 - Present",     // ← companyTenure.firstStarted/lastEnded
  "Roles at Company": "3 roles",              // ← sameCompanyCount
  "Website": "https://google.com"             // ← link
}
```

**Preview:**
```
┌─────────────────────────────────────────────┐
│ Google                                      │
│ Staff Software Engineer                     │
│                                             │
│ Led architecture and development of         │
│ large-scale distributed systems...          │
│                                             │
│ Timeline: Jan 2023 - Present                │
│ Company Tenure: Jan 2020 - Present          │
│ Roles at Company: 3 roles                   │
│ Website: google.com                         │
└─────────────────────────────────────────────┘
```

---

### Section 2: Context (Callout Block)

**Populates:**
```typescript
title: "Company Context"
body: `
Multiple roles at Google:
• Staff Software Engineer
• Senior Engineer
• Engineer

Overall tenure: Jan 2020 - Present (3 roles) • Continuous employment
`
```

**Preview:**
```
┌─────────────────────────────────────────────┐
│ 💡 Company Context                          │
│                                             │
│ Multiple roles at Google:                   │
│ • Staff Software Engineer                   │
│ • Senior Engineer                           │
│ • Engineer                                  │
│                                             │
│ Overall tenure: Jan 2020 - Present          │
│ (3 roles) • Continuous employment           │
└─────────────────────────────────────────────┘
```

---

### Section 3: Responsibilities (Bullets Block)

**Populates:**
```typescript
bullets: [
  "Led daily standup meetings",
  "Managed cross-functional collaboration"
]
// ← responsibilities array
```

**Preview:**
```
┌─────────────────────────────────────────────┐
│ Responsibilities                            │
│                                             │
│ • Led daily standup meetings                │
│ • Managed cross-functional collaboration    │
└─────────────────────────────────────────────┘
```

---

### Section 4: Key Achievements (Bullets Block)

**Populates:**
```typescript
bullets: [
  "Increased user engagement by 45%",
  "Reduced API latency from 2s to 800ms",
  "Launched premium features generating $2M ARR"
]
// ← key_achievements array
```

**Preview:**
```
┌─────────────────────────────────────────────┐
│ Key Achievements                            │
│                                             │
│ • Increased user engagement by 45%          │
│ • Reduced API latency from 2s to 800ms      │
│ • Launched premium features generating $2M  │
└─────────────────────────────────────────────┘
```

---

### Section 5: Impact & Results (Metrics Block)

**Populates:**
```typescript
metrics: [
  {
    label: "Revenue Generated",
    value: "$2M",
    description: "Launched premium tier generating $2M ARR",
    category: "business"
  },
  {
    label: "Latency Reduction",
    value: "60%",
    description: "Reduced API response from 2s to 800ms",
    category: "performance"
  },
  // ... all impacts from all categories
]
// ← impacts.business[], impacts.performance[], impacts.growth[], etc.
```

**Preview:**
```
┌─────────────────────────────────────────────┐
│ Impact & Results                            │
│                                             │
│ ┌─────────────┐  ┌─────────────┐          │
│ │   $2M       │  │   60%       │          │
│ │ Revenue     │  │ Latency     │          │
│ │ Generated   │  │ Reduction   │          │
│ └─────────────┘  └─────────────┘          │
│                                             │
│ ┌─────────────┐  ┌─────────────┐          │
│ │   45%       │  │   99.9%     │          │
│ │ User        │  │ System      │          │
│ │ Engagement  │  │ Uptime      │          │
│ └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────┘
```

## Data Flow Summary

```
Backend Resume Parse
        ↓
{
  responsibilities: [...],
  key_achievements: [...],
  impacts: { business: [...], performance: [...], ... },
  companyTenure: {...},
  sameCompanyRoles: [...]
}
        ↓
Onboarding Flow
        ↓
localStorage.portfolioData
        ↓
Career Detail Page Load
        ↓
Template Initialization
        ├─ Section 1 (Hero): organization, role, timeline, tenure
        ├─ Section 2 (Context): company metadata, other roles
        ├─ Section 3 (Responsibilities): responsibilities[]
        ├─ Section 4 (Key Achievements): key_achievements[]
        └─ Section 5 (Impact & Results): impacts.* → metrics[]
```

## Template Section Mapping

| Section | Index | Type | Data Source | Fields Used |
|---------|-------|------|-------------|-------------|
| Overview | 0 | hero | Basic + Meta | organization, role, description, startDate, endDate, current, link, companyTenure, sameCompanyCount |
| Context | 1 | callout | Company Meta | hasMultipleRolesAtCompany, sameCompanyRoles, companyTenure |
| Responsibilities | 2 | bullets | Classified | responsibilities[] |
| Key Achievements | 3 | bullets | Classified | key_achievements[] |
| Impact & Results | 4 | metrics | Structured | impacts.business[], impacts.performance[], impacts.growth[], impacts.quality[], impacts.team[], impacts.scale[] |
| Notable Projects | 5 | steps | Manual | (user adds manually) |
| Skills & Growth | 6 | bullets | Manual | (user adds manually) |
| Reflection | 7 | richtext | Manual | (user adds manually) |

## Auto-Population Logic

```typescript
// Section 1: Hero (Always populated)
if (careerData.organization) {
  heroBlock.data.title = careerData.organization;
  heroBlock.data.subtitle = careerData.role;
  heroBlock.data.description = careerData.description;
  heroBlock.data.meta = {
    Timeline: `${startDate} - ${endDate}`,
    "Company Tenure": companyTenure.firstStarted + " - " + companyTenure.lastEnded,
    "Roles at Company": sameCompanyCount + " roles"
  };
}

// Section 2: Context (Only if multiple roles)
if (hasMultipleRolesAtCompany && sameCompanyRoles.length > 0) {
  contextBlock.data.title = "Company Context";
  contextBlock.data.body = `Multiple roles at ${organization}...`;
}

// Section 3: Responsibilities
if (responsibilities && responsibilities.length > 0) {
  responsibilitiesBlock.data.bullets = responsibilities;
}

// Section 4: Key Achievements
if (key_achievements && key_achievements.length > 0) {
  achievementsBlock.data.bullets = key_achievements;
}

// Section 5: Impact & Results
if (impacts) {
  const allImpacts = [];
  Object.entries(impacts).forEach(([category, items]) => {
    items.forEach(impact => {
      allImpacts.push({
        label: impact.metric,
        value: impact.value,
        description: impact.description
      });
    });
  });
  impactsBlock.data.metrics = allImpacts;
}
```

## What You Need To Do

### 1. Run the SQL Migration

**Open Supabase SQL Editor** and run `RUN_THIS_MIGRATION.sql`:

```sql
-- This adds all 11 new columns
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS key_achievements JSONB DEFAULT '[]',
-- ... and 8 more columns
```

### 2. Test with Backend Data

Upload a resume or manually create test data in browser console:

```javascript
const portfolio = JSON.parse(localStorage.getItem('portfolioData'));

portfolio.careerHighlights[0] = {
  ...portfolio.careerHighlights[0],
  impacts: {
    business: [
      {
        value: "$2M",
        metric: "Revenue Generated",
        description: "Launched premium tier",
        category: "business"
      }
    ]
  },
  responsibilities: ["Led meetings", "Managed team"],
  key_achievements: ["Increased X by 45%", "Reduced Y by 60%"]
};

localStorage.setItem('portfolioData', JSON.stringify(portfolio));
location.reload();
```

### 3. Open Career Detail Page

Navigate to `/detail/career-editor/[id]` and check console for:

```
[Career Template] Loaded career data: { impacts: 'Present', ... }
[Career Template] ✅ Pre-filled hero block with metadata
[Career Template] ✅ Pre-filled context section
[Career Template] Pre-filled responsibilities: 2
[Career Template] Pre-filled key achievements: 2
[Career Template] ✅ Pre-filled impacts: 1 metrics
```

### 4. Check Preview Mode

Click "Preview" button - you should see all populated sections!

## Troubleshooting

**If impacts section is empty:**
1. Check console: `[Career Template] Checking impacts... { hasImpacts: true/false }`
2. If false: impacts data missing from localStorage
3. If true but not showing: Check console for conversion errors

**If career highlights disappear:**
1. Check RLS policies are updated (Step 1 above)
2. Hard refresh browser (Cmd+Shift+R)
3. Check console for database save errors

**If company context empty:**
1. Check if `hasMultipleRolesAtCompany` is true
2. Check if `sameCompanyRoles` array has items
3. Check console logs for context population

---

**Quick Test Checklist:**
- [ ] Run SQL migration
- [ ] Hard refresh browser
- [ ] Upload resume or add test data
- [ ] Open career detail page
- [ ] Check all 5 sections populated
- [ ] Switch to Preview mode
- [ ] Verify sections show correctly
- [ ] Check console for success messages

