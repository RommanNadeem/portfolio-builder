-- ============================================
-- VERIFY PROJECTS ARE SAVING
-- Run this to check your projects data
-- ============================================

-- 1. Check if projects table exists and has the right columns
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- 2. Check RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'projects';

-- 3. Count projects per user
SELECT 
  user_id,
  COUNT(*) as project_count,
  array_agg(title) as project_titles
FROM projects
GROUP BY user_id;

-- 4. Show all projects (limited to 10)
SELECT 
  id,
  user_id,
  title,
  description,
  tags,
  template_type,
  published,
  blocks IS NOT NULL as has_blocks,
  jsonb_array_length(COALESCE(blocks, '[]'::jsonb)) as blocks_count,
  created_at,
  updated_at
FROM projects
ORDER BY updated_at DESC
LIMIT 10;

-- 5. Check for recent updates (last 1 hour)
SELECT 
  id,
  title,
  updated_at,
  (NOW() - updated_at) as time_since_update
FROM projects
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;

