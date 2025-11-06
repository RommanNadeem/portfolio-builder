# 📊 Data Flow: Onboarding → Editor

## ✅ Complete Integration

The data collected during onboarding now properly flows to the portfolio editor!

---

## 🔄 Data Flow Diagram

```
1. User uploads resume/LinkedIn
        ↓
2. Railway Backend parses & extracts data
        ↓
3. AI generates taglines & about section
        ↓
4. Data saved to localStorage ('onboarding_draft')
        ↓
5. Preview page loads data for editing
        ↓
6. User refines/confirms data
        ↓
7. Data converted to Editor format
        ↓
8. Saved to localStorage ('portfolioData')
        ↓
9. Editor/Dashboard loads and displays data
        ↓
10. Data saved to Supabase database
```

---

## 📝 Data Format Mapping

### **Onboarding Format** (from Railway API)
```typescript
{
  name: "John Doe",
  role: "Software Engineer",
  tagline: "Building products that scale",
  about: "I'm a software engineer...",
  email: "john@example.com",
  phone: "+1 234 567 8900",
  location: "San Francisco, CA",
  experiences: [
    {
      id: "exp-1",
      company: "Google",
      title: "Senior Engineer",
      startDate: "Jan 2020",
      endDate: "Present",
      location: "Mountain View, CA",
      highlights: [
        "Led team of 5 engineers",
        "Increased performance by 40%"
      ]
    }
  ],
  links: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/..." },
    { platform: "GitHub", url: "https://github.com/..." }
  ],
  source: "resume" // or "linkedin"
}
```

### **Editor Format** (expected by dashboard/editor)
```typescript
{
  fullName: "John Doe",             // ← from 'name'
  profession: "Software Engineer",   // ← from 'role'
  tagline: "Building products...",   // ← same
  whoAreYou: "I'm a software...",   // ← from 'about'
  email: "john@example.com",         // ← same
  phone: "+1 234 567 8900",          // ← same
  companies: "Google, Meta",         // ← extracted from experiences
  sliderCompanies: "Google, Meta",   // ← same as companies
  careerHighlights: [                // ← from 'experiences'
    {
      id: "exp-1",
      organization: "Google",        // ← from 'company'
      role: "Senior Engineer",       // ← from 'title'
      description: "Led team...",    // ← from highlights[0]
      achievements: [                // ← from 'highlights'
        "Led team of 5 engineers",
        "Increased performance by 40%"
      ],
      startDate: "Jan 2020",        // ← same
      endDate: "Present",           // ← same
      current: true,                 // ← derived from endDate
      link: "",
      isPageBlock: false,
      pageContent: "",
      sections: []
    }
  ],
  socialLinks: [                     // ← from 'links'
    {
      id: "link-0",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/...",
      icon: "linkedin"              // ← auto-generated
    }
  ],
  strengths: [],                     // ← empty (not collected in onboarding)
  projects: [],                      // ← empty (not collected yet)
  testimonials: [],                  // ← empty (not collected yet)
  customSections: [],                // ← empty
  profileImage: null,                // ← empty (added later)
  resume: null                       // ← empty
}
```

---

## 🔧 Conversion Logic

The conversion is handled by `lib/onboarding-mapper.ts`:

### **Key Mappings:**
- `name` → `fullName`
- `role` → `profession`
- `about` → `whoAreYou`
- `experiences` → `careerHighlights`
  - `company` → `organization`
  - `title` → `role`
  - `highlights[0]` → `description`
  - `highlights` → `achievements`
- `links` → `socialLinks`
  - Auto-generates icon based on platform

### **Derived Fields:**
- `companies`: First 3 company names from experiences
- `current`: `true` if endDate contains "present"
- `icon`: Automatically mapped from platform name

---

## 📂 Storage Locations

### **LocalStorage Keys:**

| Key | Purpose | Format | When Created |
|-----|---------|--------|--------------|
| `onboarding_draft` | Temporary onboarding data | Onboarding format | During onboarding |
| `portfolioData` | Editor-ready data | Editor format | After preview confirmation |

### **Supabase Tables:**

| Table | Description | Loaded By |
|-------|-------------|-----------|
| `profiles` | Basic user info | Editor, Dashboard |
| `career_highlights` | Work experience | Editor, Dashboard |
| `social_links` | Social media links | Editor, Dashboard |
| `projects` | Portfolio projects | Editor, Dashboard |
| `strengths` | Skills/strengths | Editor, Dashboard |
| `testimonials` | User testimonials | Editor, Dashboard |
| `custom_sections` | Custom content | Editor, Dashboard |

---

## 🎯 Complete User Journey

### **1. Onboarding** (`/onboarding-v2/start`)
```
User uploads resume → Railway parses → AI generates copy
→ Data saved to 'onboarding_draft'
```

### **2. Preview** (`/onboarding-v2/preview`)
```
Load 'onboarding_draft' → User edits → Auto-saves updates
→ User clicks Continue → Convert to editor format
→ Save to 'portfolioData'
```

### **3. Details** (`/onboarding-v2/details`)
```
User adds additional info (optional)
→ Click Continue
```

### **4. Publish** (`/onboarding-v2/publish`)
```
Load 'portfolioData' → Save to Supabase
→ User gets portfolio URL
```

### **5. Editor** (`/editor`)
```
Load from Supabase OR 'portfolioData'
→ User edits portfolio → Saves to Supabase
```

---

## ✅ What's Automatically Populated

When user completes onboarding, the editor will have:

| Field | Source | Status |
|-------|--------|--------|
| Full Name | Resume/LinkedIn | ✅ Auto-filled |
| Role/Profession | Resume/LinkedIn | ✅ Auto-filled |
| Tagline | AI generated | ✅ Auto-filled |
| About (Who Are You) | AI generated | ✅ Auto-filled |
| Email | Resume/LinkedIn | ✅ Auto-filled |
| Phone | Resume/LinkedIn | ✅ Auto-filled |
| Work Experience | Resume/LinkedIn | ✅ Auto-filled |
| Social Links | LinkedIn (if used) | ✅ Auto-filled |
| Companies | Derived from experience | ✅ Auto-filled |
| Profile Image | - | ❌ Empty (user adds) |
| Projects | - | ❌ Empty (user adds) |
| Strengths | - | ❌ Empty (user adds) |
| Testimonials | - | ❌ Empty (user adds) |

---

## 🔄 Testing the Flow

### **Test Complete Flow:**

1. **Start onboarding:**
   ```
   http://localhost:3000/onboarding-v2/start
   ```

2. **Upload a resume** (or use LinkedIn)

3. **Preview and refine:**
   - Edit role, tagline, about section
   - Check work experience is populated

4. **Save and continue:**
   - Click "Continue" button

5. **Go to editor:**
   ```
   http://localhost:3000/editor
   ```

6. **Verify data:**
   - ✅ Name should be populated
   - ✅ Role should match what you set
   - ✅ Tagline should be there
   - ✅ "Who Are You" should have your about text
   - ✅ Career Highlights should show your work experience
   - ✅ Email/phone should be there

---

## 🐛 Troubleshooting

### **Data not showing in editor:**
1. Check browser console for errors
2. Verify localStorage has 'portfolioData':
   ```javascript
   // In browser console:
   console.log(JSON.parse(localStorage.getItem('portfolioData')))
   ```
3. Clear localStorage and try again:
   ```javascript
   localStorage.clear()
   ```

### **Missing fields:**
- Some fields may not be extracted if resume format is unusual
- User can manually add/edit in preview or editor

### **Format errors:**
- Check `lib/onboarding-mapper.ts` for conversion logic
- Verify the mapping matches your data structure

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `lib/onboarding-mapper.ts` | Converts onboarding → editor format |
| `app/onboarding-v2/start/page.tsx` | Collects resume/LinkedIn data |
| `app/onboarding-v2/preview/page.tsx` | Preview & edit, saves converted data |
| `app/editor/page.tsx` | Portfolio editor, loads 'portfolioData' |
| `lib/database.ts` | Supabase operations |
| `lib/types.ts` | TypeScript type definitions |

---

## ✨ Summary

✅ **Data flows seamlessly from onboarding to editor**  
✅ **All collected information is preserved**  
✅ **Fields are properly mapped**  
✅ **User can edit at any stage**  
✅ **Everything saves to Supabase for persistence**

**The integration is complete!** 🎉

