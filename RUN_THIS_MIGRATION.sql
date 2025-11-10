-- ============================================
-- 🚀 RUN THIS COMPLETE MIGRATION
-- Copy and paste this entire file into Supabase SQL Editor
-- ============================================

BEGIN;

-- Step 1: Fix RLS Policies (Critical!)
DROP POLICY IF EXISTS "Users can manage own career highlights" ON career_highlights;
CREATE POLICY "Users can manage own career highlights"
ON career_highlights FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own social links" ON social_links;
CREATE POLICY "Users can manage own social links"
ON social_links FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 2: Add ALL new columns at once
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS featured_achievements JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS achievements_order JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS key_achievements JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_group TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_occurrence INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS same_company_count INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS has_multiple_roles_at_company BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS same_company_roles JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_tenure JSONB DEFAULT NULL;

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_career_highlights_featured 
ON career_highlights USING GIN (featured_achievements);

CREATE INDEX IF NOT EXISTS idx_career_highlights_impacts 
ON career_highlights USING GIN (impacts);

CREATE INDEX IF NOT EXISTS idx_career_highlights_company_group 
ON career_highlights (company_group);

COMMIT;

-- ============================================
-- VERIFY IT WORKED
-- ============================================

SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'career_highlights'
AND column_name IN ('impacts', 'responsibilities', 'key_achievements', 
                    'company_group', 'company_tenure')
ORDER BY column_name;

-- You should see 5 rows. If yes, migration successful! ✅

