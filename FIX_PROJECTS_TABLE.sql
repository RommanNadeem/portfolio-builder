-- ============================================
-- FIX PROJECTS TABLE - Complete Template Support
-- Run this in Supabase SQL Editor to enable template data saving
-- ============================================
-- 
-- This migration adds all necessary columns for:
-- - Template blocks (Notion-style content)
-- - Template types (product-case-study, blank, etc.)
-- - User role in project
-- - Publishing status
-- 
-- After running this, projects will save properly with all template data.
-- ============================================

BEGIN;

-- ============================================
-- 1. ENSURE RLS POLICY IS CORRECT
-- ============================================

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Users can read own projects" ON projects;

-- Create comprehensive policy
CREATE POLICY "Users can manage own projects"
ON projects FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. ADD MISSING COLUMNS
-- ============================================

-- Add blocks column for detail page content
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN projects.blocks IS 'Notion-style blocks for project detail pages';

-- Add role column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS role TEXT;

COMMENT ON COLUMN projects.role IS 'User''s role in the project (e.g., Lead Designer)';

-- Add template_type column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS template_type TEXT;

COMMENT ON COLUMN projects.template_type IS 'Template type ID (e.g., product-case-study, blank)';

-- Add published status columns
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

COMMENT ON COLUMN projects.published IS 'Whether project is published and visible';
COMMENT ON COLUMN projects.published_at IS 'Timestamp when project was published';

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Add index for published projects
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(user_id, published);

-- Add index for template types
CREATE INDEX IF NOT EXISTS idx_projects_template_type ON projects(user_id, template_type);

-- Add index for blocks (GIN for JSONB search)
CREATE INDEX IF NOT EXISTS idx_projects_blocks ON projects USING GIN (blocks);

-- ============================================
-- 4. VERIFY THE SETUP
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Projects table migration complete!';
  RAISE NOTICE 'Verifying columns...';
END $$;

-- Show all project columns
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Show RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'projects';

-- ============================================
-- 5. TEST THE SETUP (Optional but recommended)
-- ============================================

-- Test inserting a sample project with template data
DO $$
DECLARE
  test_user_id UUID := auth.uid();
  test_project_id UUID := gen_random_uuid();
BEGIN
  IF test_user_id IS NOT NULL THEN
    -- Insert a test project with all template fields
    INSERT INTO projects (
      id, 
      user_id, 
      title, 
      description,
      tags,
      blocks,
      template_type,
      role,
      published,
      display_order
    ) VALUES (
      test_project_id,
      test_user_id,
      'Test Project (DELETE ME)',
      'Testing template data save',
      ARRAY['test']::TEXT[],
      '[{"id":"1","type":"hero","data":{"title":"Test"}}]'::jsonb,
      'product-case-study',
      'Lead Designer',
      false,
      9999
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Verify it worked
    IF EXISTS (SELECT 1 FROM projects WHERE id = test_project_id) THEN
      RAISE NOTICE '✅ TEST PASSED: Sample project inserted successfully!';
      RAISE NOTICE '   You can delete it from the projects table in your Supabase dashboard.';
      RAISE NOTICE '   Project ID: %', test_project_id;
    ELSE
      RAISE NOTICE '⚠️  TEST FAILED: Could not insert sample project. Check RLS policies.';
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Skipping test: No authenticated user. This is normal if running from SQL editor.';
    RAISE NOTICE '   Template columns are ready - test by editing a project in your app!';
  END IF;
END $$;

COMMIT;

-- ============================================
-- EXPECTED RESULT
-- ============================================

-- You should see these columns in the projects table:
-- 
-- CORE FIELDS:
-- - id (uuid, primary key)
-- - user_id (uuid, foreign key)
-- - title (text)
-- - description (text)
-- - thumbnail_url (text)
-- - tags (jsonb array)
-- - link (text)
-- - page_content (text)
-- - sections (jsonb array)
-- - display_order (integer)
-- - created_at (timestamptz)
-- - updated_at (timestamptz)
--
-- NEW TEMPLATE FIELDS:
-- - blocks (jsonb) ✨ Notion-style template blocks
-- - template_type (text) ✨ Template identifier
-- - role (text) ✨ User's role in the project
-- - published (boolean) ✨ Publication status
-- - published_at (timestamptz) ✨ Publication timestamp
--
-- RLS POLICIES:
-- - "Users can manage own projects" for ALL operations
--
-- INDEXES:
-- - idx_projects_published (for published projects)
-- - idx_projects_template_type (for template queries)
-- - idx_projects_blocks (for JSONB searches)
--
-- ============================================
-- VERIFICATION CHECKLIST
-- ============================================
--
-- ✅ Migration completed successfully
-- ✅ All columns exist (check output above)
-- ✅ RLS policies are correct
-- ✅ Indexes created for performance
-- ✅ Test project inserted (if authenticated)
--
-- NEXT STEPS:
-- 1. Go to your app at /editor
-- 2. Edit a project and choose a template
-- 3. Add blocks and content
-- 4. Check browser console for success messages:
--    [Detail DB] ✅ Metadata saved successfully
--    [Detail DB] ✅ Blocks saved successfully
-- 5. Verify in Supabase dashboard that blocks and template_type are saved
--
-- If you see any errors about missing columns, re-run this migration.
-- ============================================

