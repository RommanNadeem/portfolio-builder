# Career Template Hero Section - Website Field Added ✅

## Overview

The career template hero section now has a **Company Website** field and no longer shows image upload functionality. This makes the hero section more relevant for career experiences.

## Changes Made

### 1. HeroBlock Component
**File:** `/app/editor/templates/blocks/HeroBlock.tsx`

**Added:**
- New prop `entityType?: 'project' | 'career'` to determine block behavior
- "Company Website" input field (only visible for career templates)
- Conditional rendering of image upload section (hidden for career templates)

**Removed (for career templates):**
- Image upload button
- Image URL input field
- Image preview/management

### 2. Component Chain Updates

Updated the prop chain to pass `entityType` through all components:

**BaseTemplateEditor → NotionStyleSection → TemplateRenderer → HeroBlock**

**Files Updated:**
- `/app/editor/templates/BaseTemplateEditor.tsx`
- `/app/editor/templates/NotionStyleSection.tsx`
- `/app/editor/templates/TemplateRenderer.tsx`
- `/app/detail/career-editor/[id]/page.tsx`

### 3. Career Detail Page

**File:** `/app/detail/career-editor/[id]/page.tsx`

**Added:**
- `entityType="career"` prop passed to `BaseTemplateEditor`
- This triggers career-specific behavior in the hero block

## User Experience

### Career Template Hero Section (NEW)

```
┌─────────────────────────────────────────┐
│ Organization Name                        │  ← Title
│ Role/Position                           │  ← Subtitle
│ Description of the role...              │  ← Description
│                                         │
│ Company Website                         │
│ https://company.com                     │  ← NEW Website Field
│                                         │
│ YOUR ROLE • TIMELINE • YEAR            │  ← Meta fields
└─────────────────────────────────────────┘
```

### Project Template Hero Section (UNCHANGED)

```
┌─────────────────────────────────────────┐
│ Project Name                            │  ← Title
│ Subtitle                                │  ← Subtitle
│ Description...                          │  ← Description
│                                         │
│ [Hero Image Upload/URL]                │  ← Image still available
│                                         │
│ YOUR ROLE • TIMELINE • YEAR            │  ← Meta fields
└─────────────────────────────────────────┘
```

## Features

### Company Website Field

**Location:** Below description, above meta fields

**Features:**
- Clean input with label
- URL validation (type="url")
- Placeholder: "https://company.com"
- Stored in `data.meta.Website`
- Shows in preview mode with metadata

**Styling:**
- Border style input
- Purple focus ring
- Full width
- Consistent with other form fields

### Image Section (Project Only)

**Behavior:**
- ✅ **Shows for project templates**
- ❌ **Hidden for career templates**
- Keeps all existing upload functionality for projects
- No breaking changes to project templates

## Database Storage

### Company Website Data

Stored in the hero block's meta object:

```javascript
{
  type: 'hero',
  data: {
    title: 'Google',
    subtitle: 'Senior Product Designer',
    description: 'Led design for core products...',
    meta: {
      role: 'Senior Product Designer',
      timeline: '2020 - 2023',
      Website: 'https://google.com'  // ← New field
    }
  }
}
```

### Auto-Save

- Changes save automatically after 2.5 seconds
- Same as other fields in template editor
- Stored in localStorage and synced to database

## Preview Mode

The website appears in the meta section at the bottom of the hero:

```
Google
Senior Product Designer
Led design for core products and managed a team of 5 designers...

📅 2020 - 2023 • 🎯 Senior Product Designer • 🌐 https://google.com
```

## Benefits

✅ **Career-Specific:** Website field makes sense for career experiences
✅ **Clean Interface:** Removes unused image upload for careers
✅ **No Breaking Changes:** Projects still have full image functionality
✅ **Consistent:** Same auto-save and preview behavior
✅ **Type-Safe:** Uses TypeScript for proper prop passing

## Testing

### To Test Company Website Field:

1. Open a career detail page
2. Look at the Hero section
3. Should see "Company Website" input
4. Should NOT see image upload
5. Enter a URL (e.g., https://google.com)
6. Wait 2.5 seconds for auto-save
7. Switch to preview mode
8. Website should appear in meta section

### To Verify Projects Unchanged:

1. Open a project detail page
2. Look at the Hero section
3. Should see image upload/URL input
4. Should NOT see "Company Website" field
5. Image functionality should work as before

## Code Flow

```
Career Detail Page
  ↓
  entityType="career"
  ↓
BaseTemplateEditor
  ↓
  entityType prop
  ↓
NotionStyleSection
  ↓
  entityType prop
  ↓
TemplateRenderer
  ↓
  entityType prop
  ↓
HeroBlock
  ↓
  if (entityType === 'career'):
    - Show website field
    - Hide image section
  else:
    - Hide website field (project-only)
    - Show image section
```

## Migration Notes

### No Migration Required

This is a **non-breaking change**:
- Existing career highlights work as-is
- Existing projects work as-is
- New field is optional
- No database schema changes needed
- `meta.Website` can be null/undefined

### Optional Enhancement

Users can now add company websites to their career highlights by:
1. Opening the career detail page
2. Editing the hero section
3. Adding the website URL
4. It will be saved and displayed automatically

---

**Status:** ✅ Complete and ready to use
**Impact:** Career templates only
**Breaking Changes:** None
**Test it:** Open a career detail page and see the website field!

