# Section Reconciliation System

## Overview

The section reconciliation system ensures that all users automatically get new portfolio sections when they're added to the platform, **without requiring database migrations**.

## How It Works

### The Problem (Before)

When we added FAQs, Services, and Resume sections, users who signed up before these features were released had outdated `section_order` values in their database:

```json
// Old users
["career", "projects", "strengths", "testimonials"]

// New users
["career", "projects", "strengths", "services", "testimonials", "faqs", "resume"]
```

Old users couldn't see the new sections because their `section_order` was permanently set to the old array.

### The Solution (After)

The reconciliation system automatically merges each user's stored `section_order` with the master list of available sections:

1. **Master List** (`lib/section-reconciliation.ts`): Single source of truth for all available sections
2. **Reconciliation Function**: Runs automatically every time portfolio data is loaded or saved
3. **Smart Merging**: Preserves user's custom order while adding any missing sections

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User logs in and loads portfolio                            │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Database returns: ["career", "projects", "strengths",       │
│                    "testimonials"]                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ reconcileSectionOrder() runs automatically                  │
│ • Keeps user's order: ["career", "projects", "strengths",  │
│                        "testimonials"]                      │
│ • Adds missing: ["services", "faqs", "resume"]             │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Result: ["career", "projects", "strengths", "testimonials", │
│          "services", "faqs", "resume"]                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ User sees all sections (including new ones!)                │
│ When they save, the reconciled order is persisted           │
└─────────────────────────────────────────────────────────────┘
```

## Adding New Sections (For Developers)

To add a new section in the future (e.g., "blog"):

### Step 1: Update the Master List

Edit `lib/section-reconciliation.ts`:

```typescript
export const AVAILABLE_SECTIONS = [
  'career',
  'projects',
  'strengths',
  'services',
  'testimonials',
  'faqs',
  'resume',
  'blog'  // ← Add your new section here
] as const;
```

### Step 2: Deploy

That's it! No migration needed. All users will automatically see the "blog" section on their next login.

### Step 3: Create the Section Component

Obviously you'll need to create the actual section component and add it to the editor, but the reconciliation system will handle making it visible to all users.

## Benefits

✅ **No migrations needed** - Just update the array and deploy  
✅ **Automatic for all users** - Old users get new sections automatically  
✅ **Preserves preferences** - User's custom section order is maintained  
✅ **Future-proof** - Works for all future feature additions  
✅ **Backwards compatible** - Existing portfolios continue working  

## Technical Details

### Where Reconciliation Happens

The `reconcileSectionOrder()` function is called in two places:

1. **`convertToLegacyFormat()`** - When loading portfolio data from database
2. **`saveCompletePortfolio()`** - When saving portfolio data to database

This ensures users always see the latest sections, and the reconciled order gets persisted on their next save.

### Code Locations

- **Master list & reconciliation logic**: `lib/section-reconciliation.ts`
- **Database integration**: `lib/database.ts` (lines 14, 351, 816)
- **Type definitions**: `lib/types.ts`

## Testing

To verify reconciliation is working:

1. Check database logs (if DEBUG_DATABASE is enabled)
2. Look for: `[Database Debug] ✨ Reconciled section order for user:`
3. Verify new sections appear in editor and public portfolio

## Rollback

If you need to remove a section in the future:

1. Remove it from `AVAILABLE_SECTIONS` array
2. Deploy
3. The reconciliation system will automatically filter it out for all users






