-- Add section_order column to profiles table
-- This enables persistence of the custom section order for draggable sections
-- 
-- Run this SQL in your Supabase SQL Editor

-- Add section_order column as JSONB array
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS section_order JSONB DEFAULT '["career", "projects", "strengths", "testimonials"]'::jsonb;

-- Add navigation column as JSONB object (for CTA URL, etc.)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS navigation JSONB DEFAULT NULL;

-- Add footer fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS footer_text TEXT DEFAULT NULL;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS footer_signature TEXT DEFAULT NULL;

-- Add comment to document the column
COMMENT ON COLUMN profiles.section_order IS 'Custom order of draggable sections (career, projects, strengths, testimonials)';
COMMENT ON COLUMN profiles.navigation IS 'Navigation settings including CTA URL';
COMMENT ON COLUMN profiles.footer_text IS 'Footer text content';
COMMENT ON COLUMN profiles.footer_signature IS 'Footer signature';

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('section_order', 'navigation', 'footer_text', 'footer_signature')
ORDER BY column_name;

-- Expected result: Should see 4 columns (section_order, navigation, footer_text, footer_signature)

