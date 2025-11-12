# Quick Start: New Portfolio Sections

## Step 1: Run Database Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `NEW_SECTIONS_SCHEMA.sql`
4. Paste and run the SQL query
5. Verify tables created: `faqs`, `services`

**Expected Result:**
- ✅ 2 new tables created
- ✅ RLS policies enabled
- ✅ Indexes created
- ✅ Triggers set up

## Step 2: Test in Editor

1. Navigate to `/editor` in your app
2. You should see three new sections after the drag & drop banner:
   - **Services** (purple icon)
   - **FAQs** (blue question mark icon)
   - **Resume** (green file icon)

### Test FAQs:
1. Click "Add FAQ" button
2. Fill in question and answer
3. (Optional) Add category
4. Click preview to see collapsible accordion
5. Drag FAQ to reorder

### Test Services:
1. Click "Add Service" button
2. Pick an emoji icon
3. Fill in title, description
4. Add price (e.g., "$500") and duration (e.g., "2 weeks")
5. Click "Add Feature" to add bullet points
6. Add CTA button text and URL
7. Click star icon to mark as featured
8. Preview shows grid layout with featured badge

### Test Resume:
1. If you uploaded resume during onboarding, you'll see "Resume Uploaded"
2. Click "Preview" to open fullscreen viewer
3. Click "Download" to download PDF
4. If no resume, you'll see empty state

## Step 3: Test Publishing

1. Click "Publish" in the editor
2. Choose/confirm your portfolio slug
3. Publish portfolio
4. Visit your public URL: `yoursite.com/your-slug`
5. Verify all sections render correctly:
   - Services grid with featured badges
   - FAQs with collapsible accordion
   - Resume with view/download buttons

## Step 4: Verify Database

Check Supabase tables:

```sql
-- Check FAQs
SELECT * FROM faqs WHERE user_id = 'YOUR_USER_ID';

-- Check Services  
SELECT * FROM services WHERE user_id = 'YOUR_USER_ID';

-- Check section order in profile
SELECT section_order FROM profiles WHERE id = 'YOUR_USER_ID';
```

## Section Ordering

Default order: `career → projects → strengths → services → testimonials → faqs → resume`

To change order:
1. Drag sections in the editor
2. Order saves automatically
3. Published portfolio respects this order

## SQL Query to Run

```sql
-- ============================================
-- NEW PORTFOLIO SECTIONS: FAQs, Services
-- ============================================

-- 1. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_user_id ON faqs(user_id);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(user_id, display_order);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own FAQs" ON faqs;
DROP POLICY IF EXISTS "Users can insert their own FAQs" ON faqs;
DROP POLICY IF EXISTS "Users can update their own FAQs" ON faqs;
DROP POLICY IF EXISTS "Users can delete their own FAQs" ON faqs;

CREATE POLICY "Users can view their own FAQs"
  ON faqs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FAQs"
  ON faqs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FAQs"
  ON faqs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own FAQs"
  ON faqs FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_faqs_timestamp ON faqs;
CREATE TRIGGER trigger_update_faqs_timestamp
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_faqs_updated_at();

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  price TEXT,
  duration TEXT,
  features JSONB,
  cta_text TEXT,
  cta_url TEXT,
  display_order INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(user_id, display_order);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own services" ON services;
DROP POLICY IF EXISTS "Users can insert their own services" ON services;
DROP POLICY IF EXISTS "Users can update their own services" ON services;
DROP POLICY IF EXISTS "Users can delete their own services" ON services;

CREATE POLICY "Users can view their own services"
  ON services FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services"
  ON services FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services"
  ON services FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_services_timestamp ON services;
CREATE TRIGGER trigger_update_services_timestamp
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_services_updated_at();

COMMENT ON TABLE faqs IS 'Frequently Asked Questions section for user portfolios';
COMMENT ON TABLE services IS 'Services offered by the portfolio owner';
COMMENT ON COLUMN services.features IS 'Array of features/bullet points for the service (stored as JSONB)';
COMMENT ON COLUMN services.is_featured IS 'Highlight this service (e.g., most popular, recommended)';

GRANT ALL ON faqs TO authenticated;
GRANT ALL ON services TO authenticated;
```

## Troubleshooting

### Tables not created?
- Check Supabase logs for errors
- Ensure `uuid_generate_v4()` extension is enabled
- Verify `profiles` table exists (referenced by foreign key)

### Sections not showing?
- Clear browser cache
- Check browser console for errors
- Verify database connection in `.env`

### Publishing not working?
- Check that data exists in tables
- Verify portfolio slug is set
- Check browser network tab for API errors

### Resume not showing?
- Verify `profiles.resume_url` has a valid URL
- Check file is accessible (not expired/deleted)
- Ensure URL points to a PDF

## Features Summary

### FAQs
- Collapsible accordion UI
- Question, answer, optional category
- Auto-hide when empty
- Drag & drop reordering

### Services  
- Grid layout (1-3 columns responsive)
- Icon, title, description
- Price, duration
- Feature list with checkmarks
- CTA button
- Featured badge

### Resume
- Fullscreen PDF viewer
- Download button
- View in new tab
- Auto-hide when no resume

## Need Help?

See `NEW_SECTIONS_IMPLEMENTATION.md` for complete technical documentation.

