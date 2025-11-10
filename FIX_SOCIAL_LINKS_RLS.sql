-- Fix Row Level Security (RLS) policies for social_links table
-- This error occurs when RLS policies are too restrictive

-- First, check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'social_links';

-- Option 1: Update existing policies to be more permissive (RECOMMENDED)
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own social links" ON social_links;
DROP POLICY IF EXISTS "Users can update own social links" ON social_links;
DROP POLICY IF EXISTS "Users can delete own social links" ON social_links;
DROP POLICY IF EXISTS "Users can read own social links" ON social_links;

-- Create comprehensive policy that allows all operations
CREATE POLICY "Users can manage own social links"
ON social_links
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Option 2: If that doesn't work, temporarily disable RLS (NOT RECOMMENDED for production)
-- Only use this for testing to confirm it's an RLS issue
-- ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;

-- Option 3: Check if the issue is with the user_id being NULL
-- Ensure user_id is set correctly
UPDATE social_links
SET user_id = auth.uid()
WHERE user_id IS NULL AND created_at > NOW() - INTERVAL '1 day';

-- Verify the fix
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'social_links';

