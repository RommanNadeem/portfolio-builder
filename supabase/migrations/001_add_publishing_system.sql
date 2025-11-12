-- ============================================
-- PHASE 1: PORTFOLIO PUBLISHING MVP
-- GLOBALLY UNIQUE SLUGS (ONE SLUG PER PLATFORM)
-- ============================================

-- 1. Add publishing columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS portfolio_slug TEXT,
  ADD COLUMN IF NOT EXISTS is_portfolio_published BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMP WITH TIME ZONE;

-- ⭐ CRITICAL: GLOBAL UNIQUE CONSTRAINT
-- This ensures NO TWO USERS can have the same slug
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS unique_portfolio_slug;
  
ALTER TABLE profiles 
  ADD CONSTRAINT unique_portfolio_slug UNIQUE (portfolio_slug);

-- ⭐ Index for fast lookups (global search)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_portfolio_slug 
  ON profiles(portfolio_slug) 
  WHERE portfolio_slug IS NOT NULL;

-- Slug format constraint (3-30 chars, lowercase alphanumeric + hyphens)
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS check_slug_format;
  
ALTER TABLE profiles 
  ADD CONSTRAINT check_slug_format 
  CHECK (
    portfolio_slug IS NULL OR 
    portfolio_slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'
  );

-- ============================================
-- 2. Published Portfolios Table
-- ============================================

CREATE TABLE IF NOT EXISTS published_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Portfolio slug (denormalized for fast public lookups)
  portfolio_slug TEXT NOT NULL,
  
  -- Complete portfolio snapshot
  published_data JSONB NOT NULL,
  
  -- Metadata
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- ONE published portfolio per user
  CONSTRAINT unique_user_portfolio UNIQUE(user_id),
  
  -- Ensure slug uniqueness in published table
  CONSTRAINT unique_published_slug UNIQUE(portfolio_slug)
);

-- ⭐ CRITICAL INDEX: Fast public lookups by slug (most common query)
CREATE UNIQUE INDEX IF NOT EXISTS idx_published_slug_active 
  ON published_portfolios(portfolio_slug) 
  WHERE is_active = true;

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_published_user 
  ON published_portfolios(user_id);

-- ============================================
-- 3. Row Level Security (RLS)
-- ============================================

ALTER TABLE published_portfolios ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public portfolios are viewable by everyone" ON published_portfolios;
DROP POLICY IF EXISTS "Users can manage their own published portfolio" ON published_portfolios;

-- ⭐ PUBLIC ACCESS: Anyone can view published portfolios (no auth required)
CREATE POLICY "Public portfolios are viewable by everyone"
  ON published_portfolios 
  FOR SELECT
  USING (is_active = true);

-- ⭐ PRIVATE ACCESS: Users can only manage their own
CREATE POLICY "Users can manage their own published portfolio"
  ON published_portfolios 
  FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 4. Triggers & Functions
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_published_portfolios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_published_portfolios_timestamp ON published_portfolios;

CREATE TRIGGER trigger_update_published_portfolios_timestamp
  BEFORE UPDATE ON published_portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_published_portfolios_updated_at();

-- ============================================
-- 5. Comments for documentation
-- ============================================

COMMENT ON COLUMN profiles.portfolio_slug IS 
  'Globally unique slug for portfolio URL. Format: 3-30 chars, lowercase a-z, 0-9, hyphens only';
  
COMMENT ON TABLE published_portfolios IS 
  'Published portfolio snapshots. One per user, slug must be globally unique.';
  
COMMENT ON COLUMN published_portfolios.published_data IS 
  'Complete portfolio snapshot as JSONB including profile, projects, careers, strengths, testimonials, and social links';

