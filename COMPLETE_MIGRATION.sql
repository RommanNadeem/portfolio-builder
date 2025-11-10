-- ============================================
-- COMPLETE DATABASE MIGRATION
-- Career Achievements Enhancement - All Changes
-- Date: 2025-11-10
-- ============================================

-- Run this entire file in Supabase SQL Editor to apply all changes at once

BEGIN;

-- ============================================
-- 1. FIX RLS POLICIES (Fixes save errors)
-- ============================================

-- Career Highlights
DROP POLICY IF EXISTS "Users can manage own career highlights" ON career_highlights;
DROP POLICY IF EXISTS "Users can insert own career highlights" ON career_highlights;
DROP POLICY IF EXISTS "Users can update own career highlights" ON career_highlights;
DROP POLICY IF EXISTS "Users can delete own career highlights" ON career_highlights;
DROP POLICY IF EXISTS "Users can read own career highlights" ON career_highlights;

CREATE POLICY "Users can manage own career highlights"
ON career_highlights FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Social Links
DROP POLICY IF EXISTS "Users can manage own social links" ON social_links;
DROP POLICY IF EXISTS "Users can insert own social links" ON social_links;
DROP POLICY IF EXISTS "Users can update own social links" ON social_links;
DROP POLICY IF EXISTS "Users can delete own social links" ON social_links;
DROP POLICY IF EXISTS "Users can read own social links" ON social_links;

CREATE POLICY "Users can manage own social links"
ON social_links FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Projects
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;
CREATE POLICY "Users can manage own projects"
ON projects FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Strengths
DROP POLICY IF EXISTS "Users can manage own strengths" ON strengths;
CREATE POLICY "Users can manage own strengths"
ON strengths FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Testimonials  
DROP POLICY IF EXISTS "Users can manage own testimonials" ON testimonials;
CREATE POLICY "Users can manage own testimonials"
ON testimonials FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. ADD NEW COLUMNS TO career_highlights
-- ============================================

-- Featured achievements (indices of top 3 to show on card)
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS featured_achievements JSONB DEFAULT NULL;

-- Custom achievement ordering
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS achievements_order JSONB DEFAULT NULL;

-- Generic job responsibilities/duties
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]';

-- Impact-focused accomplishments with metrics
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS key_achievements JSONB DEFAULT '[]';

-- Structured, categorized impacts
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL;

-- ============================================
-- 3. ADD COLUMN COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN career_highlights.achievements IS 
'Legacy field - combined list of all bullets for backwards compatibility';

COMMENT ON COLUMN career_highlights.featured_achievements IS 
'Array of indices (0-based) indicating which key achievements are featured (max 3). Featured achievements appear on the portfolio card preview.';

COMMENT ON COLUMN career_highlights.achievements_order IS 
'Array of indices (0-based) indicating custom ordering of achievements. If null, achievements appear in their natural array order.';

COMMENT ON COLUMN career_highlights.responsibilities IS 
'Generic job duties and ongoing tasks without specific metrics or outcomes';

COMMENT ON COLUMN career_highlights.key_achievements IS 
'Impact-focused accomplishments with measurable outcomes, metrics, and quantifiable results';

COMMENT ON COLUMN career_highlights.impacts IS 
'Structured impacts object with categories: business, performance, growth, quality, team, scale. Each category contains array of {value, metric, description, category}.';

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_career_highlights_featured 
ON career_highlights USING GIN (featured_achievements);

CREATE INDEX IF NOT EXISTS idx_career_highlights_responsibilities 
ON career_highlights USING GIN (responsibilities);

CREATE INDEX IF NOT EXISTS idx_career_highlights_key_achievements 
ON career_highlights USING GIN (key_achievements);

CREATE INDEX IF NOT EXISTS idx_career_highlights_impacts 
ON career_highlights USING GIN (impacts);

-- ============================================
-- 5. VERIFY THE CHANGES
-- ============================================

-- Show all columns to verify
DO $$
BEGIN
  RAISE NOTICE 'Migration complete! Verifying columns...';
END $$;

SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'career_highlights'
AND column_name IN ('featured_achievements', 'achievements_order', 'responsibilities', 'key_achievements', 'impacts')
ORDER BY column_name;

COMMIT;

-- ============================================
-- ROLLBACK (If needed - run separately)
-- ============================================

-- DO NOT RUN UNLESS YOU WANT TO UNDO ALL CHANGES
-- BEGIN;
-- 
-- ALTER TABLE career_highlights 
-- DROP COLUMN IF EXISTS featured_achievements,
-- DROP COLUMN IF EXISTS achievements_order,
-- DROP COLUMN IF EXISTS responsibilities,
-- DROP COLUMN IF EXISTS key_achievements,
-- DROP COLUMN IF EXISTS impacts;
-- 
-- DROP INDEX IF EXISTS idx_career_highlights_featured;
-- DROP INDEX IF EXISTS idx_career_highlights_responsibilities;
-- DROP INDEX IF EXISTS idx_career_highlights_key_achievements;
-- DROP INDEX IF EXISTS idx_career_highlights_impacts;
-- 
-- COMMIT;

-- ============================================
-- EXPECTED RESULT
-- ============================================

-- You should see output showing 5 new columns:
-- featured_achievements  | jsonb
-- achievements_order     | jsonb
-- responsibilities       | jsonb
-- key_achievements       | jsonb
-- impacts                | jsonb

-- If you see all 5, the migration was successful! ✅

