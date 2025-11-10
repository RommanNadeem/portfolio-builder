-- Fix for profession check constraint issue

-- First, let's see what the constraint actually checks
SELECT 
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'profiles'
AND con.conname = 'check_profession';

-- OPTION 1: Remove the constraint entirely (recommended for flexibility)
-- This allows any value for profession, including empty strings
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS check_profession;

-- OPTION 2: Modify the constraint to allow non-empty strings
-- Only run this if you want to keep the constraint but make it less strict
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS check_profession;

ALTER TABLE profiles 
ADD CONSTRAINT check_profession 
CHECK (length(trim(profession)) > 0);

-- OPTION 3: Keep constraint but update the default in code (already done)
-- The code now defaults to 'Professional' instead of empty string
-- No SQL changes needed - constraint stays as is

-- Verify the fix
-- After running one of the options above, this should succeed:
INSERT INTO profiles (id, full_name, profession) 
VALUES (
    gen_random_uuid(), 
    'Test User', 
    'Professional'
) 
ON CONFLICT (id) DO NOTHING;

-- Clean up test
DELETE FROM profiles WHERE full_name = 'Test User';

