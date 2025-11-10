-- ============================================
-- CHECK IF IMPACTS ARE BEING SAVED
-- Run these queries in Supabase SQL Editor
-- ============================================

-- 1. Check if the impacts column exists
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'career_highlights'
AND column_name = 'impacts';

-- Expected result: 
-- impacts | jsonb | YES | NULL
-- If you see no rows, the column doesn't exist yet!


-- ============================================
-- 2. Check if any career highlights have impacts data
SELECT 
  id,
  organization,
  role,
  impacts IS NOT NULL as has_impacts,
  impacts
FROM career_highlights
WHERE user_id = auth.uid()  -- Your data only
ORDER BY created_at DESC
LIMIT 5;

-- This shows if your careers have impacts data


-- ============================================
-- 3. Check a specific career highlight's full data
-- Replace 'YOUR_CAREER_ID' with actual career ID
SELECT 
  id,
  organization,
  role,
  achievements,
  responsibilities,
  key_achievements,
  impacts,
  jsonb_pretty(impacts) as impacts_formatted
FROM career_highlights
WHERE id = 'YOUR_CAREER_ID';

-- This shows all the data fields including formatted impacts


-- ============================================
-- 4. Count how many careers have each field populated
SELECT 
  COUNT(*) as total_careers,
  COUNT(achievements) as has_achievements,
  COUNT(responsibilities) as has_responsibilities,
  COUNT(key_achievements) as has_key_achievements,
  COUNT(impacts) as has_impacts
FROM career_highlights
WHERE user_id = auth.uid();

-- Shows overview of which fields are populated


-- ============================================
-- 5. If impacts column doesn't exist, create it:
-- ============================================

-- Run this ONLY if query #1 returned no rows:
-- ALTER TABLE career_highlights 
-- ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL;
-- 
-- CREATE INDEX IF NOT EXISTS idx_career_highlights_impacts 
-- ON career_highlights USING GIN (impacts);


-- ============================================
-- EXPECTED IMPACTS DATA FORMAT
-- ============================================

-- When impacts are saved correctly, you should see:
-- {
--   "business": [
--     {
--       "value": "$2M",
--       "metric": "Revenue Generated",
--       "description": "Launched premium tier generating $2M ARR",
--       "category": "business"
--     }
--   ],
--   "performance": [...],
--   "growth": [...],
--   ...
-- }

