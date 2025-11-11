# Section Order Persistence Fix

## Problem
The rearranging of sections on the home page was resetting after refresh. This happened because the `sectionOrder` was only stored in localStorage but not persisted to the database.

## Root Cause
1. When sections were reordered, the change was saved to `localStorage` immediately
2. The auto-save functionality would save the portfolio to the database
3. However, the `sectionOrder` field was **not included** in the database save operation
4. When the page refreshed, it would load data from the database (which didn't have the custom order)
5. This caused the section order to reset to the default

## Solution
I've implemented a complete fix to persist the section order to the database:

### Changes Made

#### 1. Updated TypeScript Types (`lib/types.ts`)
Added new fields to the `Profile` interface:
- `section_order?: string[]` - Stores the custom order of draggable sections
- `navigation?: any` - Stores navigation settings (like CTA URL)
- `footer_text?: string` - Footer text content
- `footer_signature?: string` - Footer signature

#### 2. Updated Database Save (`lib/database.ts`)
Modified `saveCompletePortfolio()` to save the section order:
```typescript
const profileData = {
  // ... existing fields ...
  section_order: portfolioData.sectionOrder || ['career', 'projects', 'strengths', 'testimonials'],
  navigation: portfolioData.navigation || null,
  footer_text: portfolioData.footerText || null,
  footer_signature: portfolioData.footerSignature || null
};
```

#### 3. Updated Database Load (`lib/database.ts`)
Modified `convertToLegacyFormat()` to load the section order from the database:
```typescript
const converted = {
  // ... existing fields ...
  sectionOrder: portfolioData.profile.section_order || ['career', 'projects', 'strengths', 'testimonials'],
  navigation: portfolioData.profile.navigation || undefined,
  footerText: portfolioData.profile.footer_text || undefined,
  footerSignature: portfolioData.profile.footer_signature || undefined,
  // ... rest of fields ...
};
```

## Database Migration Required

**IMPORTANT:** You need to run the SQL migration to add the new columns to your database.

### Steps to Apply Migration

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `ADD_SECTION_ORDER_TO_PROFILES.sql`
4. Run the migration

The migration will add these columns to the `profiles` table:
- `section_order` (JSONB) - Default: `["career", "projects", "strengths", "testimonials"]`
- `navigation` (JSONB) - Default: `NULL`
- `footer_text` (TEXT) - Default: `NULL`
- `footer_signature` (TEXT) - Default: `NULL`

## Testing

After running the migration:

1. **Clear your browser cache** or use incognito mode to ensure fresh data
2. Open your portfolio editor (`/editor`)
3. Rearrange the sections by dragging and dropping
4. Wait for auto-save to complete (check the "Last saved" indicator)
5. **Refresh the page** (Cmd+R or Ctrl+R)
6. ✅ The section order should **persist** after refresh

## How It Works Now

### Data Flow

1. **User drags a section** → `SortableSections` component detects the change
2. **Section order updates** → `handleSectionReorder()` in `page.tsx` updates state
3. **State change triggers save** → `updatePortfolio()` updates the portfolio state
4. **Auto-save kicks in** → After 500ms delay, `useAutoSave` saves to localStorage
5. **Database save** → `saveCompletePortfolio()` saves to Supabase (including `section_order`)
6. **On refresh** → `usePortfolioData` loads from database, includes `section_order`
7. **Section order restored** → Page renders with the custom order

### Default Order
If no custom order is saved, the default order is:
```javascript
['career', 'projects', 'strengths', 'testimonials']
```

## Files Changed

1. ✅ `lib/types.ts` - Added fields to Profile interface
2. ✅ `lib/database.ts` - Updated save and load functions
3. ✅ `ADD_SECTION_ORDER_TO_PROFILES.sql` - Database migration script

## No Breaking Changes

- Existing portfolios will use the default section order
- The migration is safe to run on production
- All existing functionality remains unchanged
- This fix is fully backward compatible

## Additional Benefits

The fix also prepares the database for storing:
- Navigation settings (CTA URL)
- Footer customization (text and signature)

These fields are now properly saved and loaded from the database.

## Troubleshooting

### If section order still resets after migration:

1. **Check if migration ran successfully:**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'profiles' AND column_name = 'section_order';
   ```

2. **Verify data is being saved:**
   - Open browser console (F12)
   - Look for `[Database Debug] Attempting to save profile:` log
   - Check if `section_order` is included in the logged data

3. **Force a save:**
   - Rearrange sections
   - Click the "Save" button if available
   - Wait 5 seconds for auto-save
   - Check console for save confirmation

4. **Clear localStorage and reload:**
   - Open DevTools → Application → Local Storage
   - Delete `portfolioData` key
   - Refresh page to force database reload

## Status

✅ Code changes complete
✅ Migration script created
⏳ Awaiting database migration
⏳ Awaiting user testing

---

**Next Steps for You:**
1. Run the SQL migration in Supabase
2. Test the section reordering
3. Confirm it persists after refresh
4. Let me know if you encounter any issues!

