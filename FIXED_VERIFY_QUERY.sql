-- ============================================
-- FIXED VERIFICATION QUERIES
-- For UUID: 0599ee92-a9e5-4cfe-851f-c929173c0f08
-- ============================================

-- Query 1: Simple existence check (FIXED - no CASE issues)
SELECT 
  id,
  organization,
  role,
  description,
  start_date,
  end_date,
  is_current,
  
  -- Check which fields are populated
  achievements IS NOT NULL as has_achievements,
  responsibilities IS NOT NULL as has_responsibilities,
  key_achievements IS NOT NULL as has_key_achievements,
  impacts IS NOT NULL as has_impacts,
  company_group IS NOT NULL as has_company_group,
  
  -- Show array lengths
  jsonb_array_length(COALESCE(achievements, '[]'::jsonb)) as achievements_count,
  jsonb_array_length(COALESCE(responsibilities, '[]'::jsonb)) as responsibilities_count,
  jsonb_array_length(COALESCE(key_achievements, '[]'::jsonb)) as key_achievements_count

FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 2: Show formatted data
SELECT 
  organization,
  role,
  jsonb_pretty(impacts) as impacts_formatted,
  jsonb_pretty(responsibilities) as responsibilities_formatted,
  jsonb_pretty(key_achievements) as key_achievements_formatted,
  jsonb_pretty(company_tenure) as company_tenure_formatted
FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 3: Count impacts by category
SELECT 
  organization,
  role,
  
  -- Count impacts in each category
  jsonb_array_length(COALESCE(impacts->'business', '[]'::jsonb)) as business_impacts,
  jsonb_array_length(COALESCE(impacts->'performance', '[]'::jsonb)) as performance_impacts,
  jsonb_array_length(COALESCE(impacts->'growth', '[]'::jsonb)) as growth_impacts,
  jsonb_array_length(COALESCE(impacts->'quality', '[]'::jsonb)) as quality_impacts,
  jsonb_array_length(COALESCE(impacts->'team', '[]'::jsonb)) as team_impacts,
  jsonb_array_length(COALESCE(impacts->'scale', '[]'::jsonb)) as scale_impacts,
  
  -- Total impacts
  (
    jsonb_array_length(COALESCE(impacts->'business', '[]'::jsonb)) +
    jsonb_array_length(COALESCE(impacts->'performance', '[]'::jsonb)) +
    jsonb_array_length(COALESCE(impacts->'growth', '[]'::jsonb)) +
    jsonb_array_length(COALESCE(impacts->'quality', '[]'::jsonb)) +
    jsonb_array_length(COALESCE(impacts->'team', '[]'::jsonb)) +
    jsonb_array_length(COALESCE(impacts->'scale', '[]'::jsonb))
  ) as total_impacts

FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 4: Show first impact from each category (validate structure)
SELECT 
  organization,
  
  -- First business impact
  impacts->'business'->0->>'value' as business_value,
  impacts->'business'->0->>'metric' as business_metric,
  impacts->'business'->0->>'description' as business_description,
  
  -- First performance impact
  impacts->'performance'->0->>'value' as performance_value,
  impacts->'performance'->0->>'metric' as performance_metric,
  
  -- First growth impact
  impacts->'growth'->0->>'value' as growth_value,
  impacts->'growth'->0->>'metric' as growth_metric

FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 5: Check company metadata
SELECT 
  organization,
  company_group,
  company_occurrence,
  same_company_count,
  has_multiple_roles_at_company,
  same_company_roles,
  company_tenure
FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- EXPECTED RESULTS
-- ============================================

-- Query 1 should show:
-- organization: INTECH Process Automation
-- has_impacts: true (or t)
-- has_responsibilities: true
-- has_key_achievements: true
-- achievements_count: 6
-- responsibilities_count: 5
-- key_achievements_count: 7

-- Query 3 should show:
-- business_impacts: 3
-- performance_impacts: 1
-- growth_impacts: 1
-- total_impacts: 5

-- Query 4 should show:
-- business_value: "$3M"
-- business_metric: "Lead Value Generated"
-- business_description: "Generated quality business leads..."
-- performance_value: "165%"
-- growth_value: "12%"

-- Query 5 should show:
-- company_group: "intech process automation"
-- same_company_count: 2
-- has_multiple_roles_at_company: true

-- ============================================
-- If ANY of these are NULL or wrong:
-- ============================================

-- The data is NOT in the correct format or didn't save!
-- Check these possibilities:

-- 1. Column doesn't exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'career_highlights' 
AND column_name IN ('impacts', 'responsibilities', 'key_achievements', 'company_tenure');

-- 2. Row doesn't exist for this UUID
SELECT COUNT(*) FROM career_highlights WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- 3. Show ALL columns to see what's there
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'career_highlights'
ORDER BY ordinal_position;

