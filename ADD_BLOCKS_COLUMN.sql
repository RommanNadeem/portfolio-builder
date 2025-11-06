-- Add blocks column to projects table for detail page content
-- Run this in your Supabase SQL Editor

-- Add blocks column if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS blocks jsonb DEFAULT '[]'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN projects.blocks IS 'Notion-style blocks for project detail pages';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'blocks';

