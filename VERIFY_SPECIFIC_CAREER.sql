-- ============================================
-- VERIFY CAREER HIGHLIGHT DATA FORMAT
-- For UUID: 0599ee92-a9e5-4cfe-851f-c929173c0f08
-- ============================================

-- Query 1: Check if the career exists and show ALL fields
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
  company_tenure IS NOT NULL as has_company_tenure,
  
  -- Show lengths
  jsonb_array_length(COALESCE(achievements, '[]'::jsonb)) as achievements_count,
  jsonb_array_length(COALESCE(responsibilities, '[]'::jsonb)) as responsibilities_count,
  jsonb_array_length(COALESCE(key_achievements, '[]'::jsonb)) as key_achievements_count,
  
  -- Show impact categories
  CASE 
    WHEN impacts IS NOT NULL THEN jsonb_object_keys(impacts)::text[]
    ELSE ARRAY[]::text[]
  END as impact_categories

FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 2: Show the ACTUAL impacts data (formatted)
SELECT 
  organization,
  role,
  jsonb_pretty(impacts) as impacts_formatted,
  jsonb_pretty(responsibilities) as responsibilities_formatted,
  jsonb_pretty(key_achievements) as key_achievements_formatted
FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 3: Validate impacts structure
SELECT 
  organization,
  
  -- Count impacts by category
  jsonb_array_length(COALESCE(impacts->'business', '[]'::jsonb)) as business_impacts,
  jsonb_array_length(COALESCE(impacts->'performance', '[]'::jsonb)) as performance_impacts,
  jsonb_array_length(COALESCE(impacts->'growth', '[]'::jsonb)) as growth_impacts,
  jsonb_array_length(COALESCE(impacts->'quality', '[]'::jsonb)) as quality_impacts,
  jsonb_array_length(COALESCE(impacts->'team', '[]'::jsonb)) as team_impacts,
  jsonb_array_length(COALESCE(impacts->'scale', '[]'::jsonb)) as scale_impacts,
  
  -- Show first business impact as example
  impacts->'business'->0 as first_business_impact,
  
  -- Validate structure of first impact
  impacts->'business'->0->>'value' as impact_value,
  impacts->'business'->0->>'metric' as impact_metric,
  impacts->'business'->0->>'description' as impact_description,
  impacts->'business'->0->>'category' as impact_category

FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 4: Check company metadata
SELECT 
  organization,
  company_group,
  company_occurrence,
  same_company_count,
  has_multiple_roles_at_company,
  same_company_roles,
  jsonb_pretty(company_tenure) as company_tenure_formatted
FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- Query 5: Show ALL raw data
SELECT * FROM career_highlights
WHERE id = '0599ee92-a9e5-4cfe-851f-c929173c0f08';

-- ============================================
-- EXPECTED RESULTS
-- ============================================

-- Query 1 should show:
-- has_impacts: true
-- has_responsibilities: true
-- has_key_achievements: true
-- responsibilities_count: 5
-- key_achievements_count: 7

-- Query 3 should show:
-- business_impacts: 3
-- performance_impacts: 1
-- growth_impacts: 1
-- impact_value: "$3M"
-- impact_metric: "Lead Value Generated"
-- impact_category: "business"

-- If any of these are NULL or wrong, the data didn't save correctly!

