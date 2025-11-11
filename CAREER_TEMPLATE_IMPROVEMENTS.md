# Career Template Improvements

## Summary
Implemented several UX improvements to the career template editor to better match the career highlights workflow and reduce clutter in preview mode.

## Changes Made

### 1. ✅ Removed Image Upload/URL for Career Templates

**File:** `app/editor/templates/blocks/HeroBlock.tsx`

- Image upload and URL input fields are now **hidden for career templates**
- Only available for project templates where visuals are more important
- Keeps career template focused on text content and professional information

**Implementation:**
```typescript
{/* Hero Image - Only for Project Templates */}
{!isCareerTemplate && (
  // Image upload UI
)}
```

### 2. ✅ Added Company Website URL Field

**File:** `app/editor/templates/blocks/HeroBlock.tsx`

- New dedicated "Company Website" field in hero section for career templates
- Displays as clickable link in preview mode
- Stored in `data.meta.Website`

**UI in Edit Mode:**
- Clean label: "Company Website"
- Standard input field with rounded corners
- Placeholder: "https://company.com"

**UI in Preview Mode:**
- Shows as blue badge with globe icon: 🌐 "Visit Website"
- Clickable link that opens in new tab

### 3. ✅ Timeline UI with Month/Year Pickers

**File:** `app/editor/templates/blocks/HeroBlock.tsx`

- Replaced plain text timeline field with **MonthYearPicker components**
- Consistent with left navigation career highlight cards
- Two separate fields: Start Date and End Date
- Uses the same dropdown calendar UI

**Features:**
- Clean layout with labeled sections
- "Role / Position" field with better placeholder
- "Timeline" section with two month/year pickers
- Separated by dash (—) for visual clarity
- Fixed positioning to prevent overflow issues

**Preview Display:**
- Shows as: 📅 "Jan 2020 - Dec 2022" (or "Present")
- Only displays when both dates are filled

### 4. ✅ Removed Default Section Headings

**File:** `app/editor/templates/configs.ts`

**Problem:** Sections like "Responsibilities", "Key Achievements", etc. were showing default headings even when empty.

**Solution:** Changed all block creation to **NOT** set default titles:

```typescript
// Before
data: { 
  title: sectionConfig?.label || '',  // Used section label as default
  bullets: [''] 
}

// After  
data: { 
  title: '',  // Don't use default title - let user add if needed
  bullets: [''] 
}
```

**Affected Block Types:**
- ✅ CalloutBlock
- ✅ RichTextBlock
- ✅ BulletsBlock (Responsibilities, Achievements)
- ✅ StepsBlock
- ✅ FeatureGridBlock
- ✅ GalleryBlock  
- ✅ MetricsBlock

**Result:** 
- Sections only show headings in preview if user explicitly adds them
- Cleaner preview mode with no empty headings
- Users have full control over which sections get titles

### 5. ✅ Updated TypeScript Types

**File:** `app/editor/templates/types.ts`

Added new fields to `HeroBlock` meta interface:
```typescript
meta?: {
  // Existing fields...
  startDate?: string;  // Career template: start date (e.g., "Jan 2020")
  endDate?: string;    // Career template: end date (e.g., "Dec 2022" or "Present")
  Website?: string;    // Career template: company website URL
}
```

## User Experience Improvements

### Before
- Career templates had image upload UI (not needed)
- Plain text input for timeline (inconsistent with left nav)
- Default section headings showed even when empty ("Responsibilities", etc.)
- Timeline format was free-form text

### After
- Clean, focused career template UI
- Consistent month/year picker across the platform
- Preview only shows headings when user adds content
- Professional timeline display with proper date formatting
- Company website easily accessible

## Files Changed

1. ✅ `app/editor/templates/blocks/HeroBlock.tsx` - Main hero block improvements
2. ✅ `app/editor/templates/configs.ts` - Removed default titles
3. ✅ `app/editor/templates/types.ts` - Added new meta fields

## Technical Details

### Conditional Rendering by Template Type

The hero block now adapts based on `entityType`:

```typescript
const isCareerTemplate = entityType === 'career';

{isCareerTemplate ? (
  // Career-specific UI: Month/Year pickers, Company URL
) : (
  // Project-specific UI: Image upload, inline meta fields
)}
```

### Month/Year Picker Integration

Reused the existing `MonthYearPicker` component:
- Fixed positioning (portal-style)
- Dropdown calendar with year navigation
- Consistent styling with career cards
- No overflow issues

### Preview Mode Logic

Blocks check for content before showing titles:
```typescript
{data.title && (
  <h2 className="text-3xl font-bold text-gray-900 mb-6">{data.title}</h2>
)}
```

## Testing Checklist

- [x] Image upload hidden for career templates
- [x] Image upload still works for project templates
- [x] Company website field appears for career templates
- [x] Month/Year pickers work for start and end dates
- [x] Timeline displays correctly in preview
- [x] Empty sections don't show headings in preview
- [x] Sections with content show headings in preview
- [x] No TypeScript/linter errors
- [x] UI is consistent with left nav career cards

## Migration Notes

**Existing Data:**
- Old career templates with `timeline` text field will continue to work
- New templates will use `startDate` and `endDate`
- Both formats display correctly in preview mode

**No Breaking Changes:**
- All changes are additive or conditional
- Existing templates remain functional
- Backwards compatible

---

**Status:** ✅ Complete
**Date:** November 11, 2025
**Impact:** Better UX for career templates, cleaner preview mode

