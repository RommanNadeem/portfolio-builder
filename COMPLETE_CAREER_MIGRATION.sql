-- ============================================
-- COMPLETE CAREER HIGHLIGHTS MIGRATION
-- All New Columns for Enhanced Career System
-- Date: 2025-11-10
-- ============================================

-- This migration adds support for:
-- 1. Featured achievements
-- 2. Responsibilities vs Key Achievements separation
-- 3. Structured impacts
-- 4. Company grouping metadata

BEGIN;

-- ============================================
-- ADD ALL NEW COLUMNS
-- ============================================

ALTER TABLE career_highlights 
-- Achievement management
ADD COLUMN IF NOT EXISTS featured_achievements JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS achievements_order JSONB DEFAULT NULL,

-- Separated responsibilities and achievements
ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS key_achievements JSONB DEFAULT '[]',

-- Structured impacts
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL,

-- Company grouping metadata
ADD COLUMN IF NOT EXISTS company_group TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_occurrence INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS same_company_count INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS has_multiple_roles_at_company BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS same_company_roles JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_tenure JSONB DEFAULT NULL;

-- ============================================
-- ADD COMMENTS FOR DOCUMENTATION
-- ============================================

-- Legacy field
COMMENT ON COLUMN career_highlights.achievements IS 
'Legacy field - combined list of all bullets for backwards compatibility';

-- Achievement management
COMMENT ON COLUMN career_highlights.featured_achievements IS 
'Array of indices (0-based) of key achievements to show on portfolio card (max 3)';

COMMENT ON COLUMN career_highlights.achievements_order IS 
'Array of indices (0-based) for custom ordering of achievements';

-- Separated fields
COMMENT ON COLUMN career_highlights.responsibilities IS 
'Generic job duties and ongoing tasks without specific metrics';

COMMENT ON COLUMN career_highlights.key_achievements IS 
'Impact-focused accomplishments with measurable outcomes and metrics';

-- Structured impacts
COMMENT ON COLUMN career_highlights.impacts IS 
'Structured impacts object: {business: [], performance: [], growth: [], quality: [], team: [], scale: []}. Each impact has {value, metric, description, category}';

-- Company grouping
COMMENT ON COLUMN career_highlights.company_group IS 
'Normalized company name for grouping (e.g., "google")';

COMMENT ON COLUMN career_highlights.company_occurrence IS 
'Which occurrence this is if multiple roles at same company (1, 2, 3)';

COMMENT ON COLUMN career_highlights.same_company_count IS 
'Total number of roles at this company';

COMMENT ON COLUMN career_highlights.has_multiple_roles_at_company IS 
'True if user had multiple roles at this company';

COMMENT ON COLUMN career_highlights.same_company_roles IS 
'Array of other role titles at the same company';

COMMENT ON COLUMN career_highlights.company_tenure IS 
'Overall tenure at company: {firstStarted, lastEnded, isContinuous, totalRoles}';

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_career_highlights_featured 
ON career_highlights USING GIN (featured_achievements);

CREATE INDEX IF NOT EXISTS idx_career_highlights_responsibilities 
ON career_highlights USING GIN (responsibilities);

CREATE INDEX IF NOT EXISTS idx_career_highlights_key_achievements 
ON career_highlights USING GIN (key_achievements);

CREATE INDEX IF NOT EXISTS idx_career_highlights_impacts 
ON career_highlights USING GIN (impacts);

CREATE INDEX IF NOT EXISTS idx_career_highlights_company_group 
ON career_highlights (company_group);

CREATE INDEX IF NOT EXISTS idx_career_highlights_same_company_roles 
ON career_highlights USING GIN (same_company_roles);

-- ============================================
-- VERIFY MIGRATION
-- ============================================

DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns 
  WHERE table_name = 'career_highlights'
  AND column_name IN ('featured_achievements', 'achievements_order', 'responsibilities', 
                      'key_achievements', 'impacts', 'company_group', 'company_occurrence',
                      'same_company_count', 'has_multiple_roles_at_company', 
                      'same_company_roles', 'company_tenure');
  
  IF col_count = 11 THEN
    RAISE NOTICE '✅ SUCCESS: All 11 new columns added successfully!';
  ELSE
    RAISE NOTICE '⚠️  WARNING: Only % of 11 columns were added. Check for errors.', col_count;
  END IF;
END $$;

-- Show all new columns
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'career_highlights'
AND column_name IN ('featured_achievements', 'achievements_order', 'responsibilities', 
                    'key_achievements', 'impacts', 'company_group', 'company_occurrence',
                    'same_company_count', 'has_multiple_roles_at_company', 
                    'same_company_roles', 'company_tenure')
ORDER BY column_name;

COMMIT;

-- ============================================
-- EXPECTED OUTPUT
-- ============================================
-- You should see 11 rows:
-- achievements_order               | jsonb   | YES
-- company_group                    | text    | YES
-- company_occurrence               | integer | YES
-- company_tenure                   | jsonb   | YES
-- featured_achievements            | jsonb   | YES
-- has_multiple_roles_at_company    | boolean | YES
-- impacts                          | jsonb   | YES
-- key_achievements                 | jsonb   | YES
-- responsibilities                 | jsonb   | YES
-- same_company_count               | integer | YES
-- same_company_roles               | jsonb   | YES

-- ============================================
-- TEST THE MIGRATION
-- ============================================

-- Test inserting a career with all new fields
-- INSERT INTO career_highlights (
--   id, user_id, organization, role, description,
--   achievements, responsibilities, key_achievements,
--   impacts, company_group, company_occurrence,
--   same_company_count, has_multiple_roles_at_company,
--   same_company_roles, company_tenure
-- ) VALUES (
--   gen_random_uuid(),
--   auth.uid(),
--   'Google',
--   'Staff Engineer',
--   'Test career',
--   '["Achievement 1"]'::jsonb,
--   '["Responsibility 1"]'::jsonb,
--   '["Key Achievement 1"]'::jsonb,
--   '{"business": [{"value": "$2M", "metric": "Revenue", "description": "Test", "category": "business"}]}'::jsonb,
--   'google',
--   1,
--   3,
--   true,
--   '["Senior Engineer", "Engineer"]'::jsonb,
--   '{"firstStarted": "2020", "lastEnded": "Present", "isContinuous": true, "totalRoles": 3}'::jsonb
-- );

-- ============================================
-- ROLLBACK (Run separately if needed)
-- ============================================

-- BEGIN;
-- 
-- ALTER TABLE career_highlights 
-- DROP COLUMN IF EXISTS featured_achievements,
-- DROP COLUMN IF EXISTS achievements_order,
-- DROP COLUMN IF EXISTS responsibilities,
-- DROP COLUMN IF EXISTS key_achievements,
-- DROP COLUMN IF EXISTS impacts,
-- DROP COLUMN IF EXISTS company_group,
-- DROP COLUMN IF EXISTS company_occurrence,
-- DROP COLUMN IF EXISTS same_company_count,
-- DROP COLUMN IF EXISTS has_multiple_roles_at_company,
-- DROP COLUMN IF EXISTS same_company_roles,
-- DROP COLUMN IF EXISTS company_tenure;
-- 
-- DROP INDEX IF EXISTS idx_career_highlights_featured;
-- DROP INDEX IF EXISTS idx_career_highlights_responsibilities;
-- DROP INDEX IF EXISTS idx_career_highlights_key_achievements;
-- DROP INDEX IF EXISTS idx_career_highlights_impacts;
-- DROP INDEX IF EXISTS idx_career_highlights_company_group;
-- DROP INDEX IF EXISTS idx_career_highlights_same_company_roles;
-- 
-- COMMIT;

