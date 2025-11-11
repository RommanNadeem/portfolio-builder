# Career Template Data Mapping - Updated

## Overview
Fixed the data mapping between career cards (left nav) and career template hero block to use proper meta fields instead of subtitle.

## New Data Mapping

### Career Card (Left Nav) ↔ Template Hero Block

| Career Card Field | Template Hero Field | Notes |
|------------------|---------------------|-------|
| `organization` | `hero.title` | Company name (main heading) |
| `role` | `hero.meta.role` | Position/role (now in meta, not subtitle) |
| `description` | `hero.description` | Career description |
| `start_date` | `hero.meta.startDate` | Start date (e.g., "Jan 2020") |
| `end_date` | `hero.meta.endDate` | End date or "Present" |
| `link` | `hero.meta.Website` | Company website URL |

### Why This Change?

**Before (Problematic):**
```typescript
// Career role was in subtitle
hero.subtitle = career.role  // ❌ Confusing - subtitle should be optional
```

**After (Clean):**
```typescript
// Career role is in meta (structured data)
hero.meta.role = career.role  // ✅ Clear, specific field
hero.subtitle = ''             // ✅ Empty for career templates
```

## Template Display Logic

### Preview Mode

**Career Template:**
```
[Company Name]          ← hero.title
[Role/Position]         ← hero.meta.role (displayed as subtitle)
[Description]           ← hero.description

📅 Jan 2020 - Dec 2022  ← meta.startDate - meta.endDate
🌐 Visit Website        ← meta.Website (if provided)
```

**Project Template:**
```
[Project Title]         ← hero.title
[Subtitle]              ← hero.subtitle
[Description]           ← hero.description
[Hero Image]            ← hero.imageUrl

🎯 YOUR ROLE • ⏱️ TIMELINE • 📅 YEAR
```

### Edit Mode

**Career Template Fields:**
1. **Company Name** (large title input) - `hero.title`
2. **Description** (textarea) - `hero.description`
3. **Company Website** (URL input) - `hero.meta.Website`
4. **Role / Position** (input) - `hero.meta.role`
5. **Timeline** (two month/year pickers) - `hero.meta.startDate` and `hero.meta.endDate`

**Project Template Fields:**
1. **Title** (large title input) - `hero.title`
2. **Subtitle** (input) - `hero.subtitle`
3. **Description** (textarea) - `hero.description`
4. **Hero Image** (upload/URL) - `hero.imageUrl`
5. **Meta fields** (inline) - role, timeline, year, etc.

## Files Updated

### 1. EntityToTemplateAdapter.ts
**Changed:** How career data is converted to template blocks

```typescript
// Before
data: {
  title: entity.organization,
  subtitle: entity.role,  // ❌ Using subtitle for role
  meta: {
    Timeline: "Jan 2020 - Present"  // ❌ Combined string
  }
}

// After
data: {
  title: entity.organization,
  subtitle: '',  // ✅ Empty for career
  meta: {
    role: entity.role,        // ✅ Separate role field
    startDate: entity.start_date,  // ✅ Separate dates
    endDate: entity.end_date,
    Website: entity.link
  }
}
```

### 2. EntityDocumentManager.ts
**Changed:** How template data is synced back to career card

```typescript
// Now reads from meta.role instead of subtitle
if (heroData.meta?.role) {
  updated.role = heroData.meta.role;
}

// Now reads from meta.startDate/endDate instead of Timeline
if (heroData.meta?.startDate) {
  updated.start_date = heroData.meta.startDate;
}
if (heroData.meta?.endDate) {
  updated.end_date = heroData.meta.endDate;
  updated.current = heroData.meta.endDate === 'Present';
}

// Backwards compatible with old Timeline format
if (!heroData.meta?.startDate && heroData.meta?.Timeline) {
  // Parse old format: "Jan 2020 - Present"
  // ... fallback logic
}
```

### 3. HeroBlock.tsx
**Changed:** 
- Hide subtitle field for career templates
- Show role field in meta section with label
- Display role as subtitle in preview mode
- Separate project vs career meta fields in preview

## Benefits

### 1. **Clearer Data Structure**
- Role is in a dedicated field (`meta.role`)
- Not overloading subtitle for multiple purposes
- Each field has a clear purpose

### 2. **Better UX**
- Career template has labeled "Role / Position" field
- Month/Year pickers for dates (consistent with left nav)
- Company website field clearly labeled

### 3. **Type Safety**
- All new fields are typed in HeroBlock interface
- TypeScript catches errors at compile time

### 4. **Backwards Compatibility**
- Old templates with `subtitle` for role still work
- Old `Timeline` format still parses correctly
- No breaking changes for existing data

## Testing Scenarios

### Scenario 1: New Career Entry
1. User fills career card in left nav
2. Clicks "Edit" to open template
3. ✅ Company name appears in title
4. ✅ Role appears in "Role / Position" field
5. ✅ Dates appear in month/year pickers
6. ✅ Company website shows if provided

### Scenario 2: Edit Role in Template
1. User changes role in template editor
2. Saves and returns to main editor
3. ✅ Role updates in left nav career card
4. ✅ Data syncs correctly

### Scenario 3: Old Data Migration
1. Existing career with `subtitle = role`
2. Opens template
3. ✅ Role displays in "Role / Position" field
4. ✅ Data converts to new format on save

## Data Flow Diagram

```
Left Nav Career Card
  organization: "Google"
  role: "Senior PM"
  start_date: "Jan 2020"
  end_date: "Present"
  link: "https://google.com"
        ↓
   [EntityToTemplateAdapter]
        ↓
Template Hero Block
  title: "Google"
  subtitle: ""
  meta: {
    role: "Senior PM"
    startDate: "Jan 2020"
    endDate: "Present"
    Website: "https://google.com"
  }
        ↓
   [EntityDocumentManager]
        ↓
Career Card (Updated)
  organization: "Google"
  role: "Senior PM"
  start_date: "Jan 2020"
  current: true
  link: "https://google.com"
```

## Migration Notes

### For Existing Careers
- Old format: `subtitle` contains role → Will display in "Role / Position" field
- On first save: Converts to `meta.role` format
- No data loss, seamless migration

### For New Careers
- Directly uses `meta.role` format
- Clean, structured data from the start

---

**Status:** ✅ Complete
**Date:** November 11, 2025
**Impact:** Proper separation of career vs project template data
**Breaking Changes:** None (backwards compatible)

