-- Check current profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Expected columns for profiles table:
-- If any are missing, run the appropriate ALTER TABLE commands below

-- Ensure all required columns exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS heading TEXT,
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS who_are_you TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS companies TEXT,
ADD COLUMN IF NOT EXISTS slider_companies TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- If profiles table doesn't exist at all, create it:
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  heading TEXT,
  profession TEXT,
  email TEXT,
  phone TEXT,
  tagline TEXT,
  who_are_you TEXT,
  profile_image_url TEXT,
  resume_url TEXT,
  companies TEXT,
  slider_companies TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own profile
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Create policy for users to read their own profile
CREATE POLICY IF NOT EXISTS "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

