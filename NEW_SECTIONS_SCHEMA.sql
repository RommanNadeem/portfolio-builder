-- ============================================
-- NEW PORTFOLIO SECTIONS: FAQs, Services, Resume Filename
-- ============================================

-- 0. Add resume_file_name column to profiles table
-- ============================================
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS resume_file_name TEXT;

COMMENT ON COLUMN profiles.resume_file_name IS 
  'Original filename of uploaded resume for proper download naming';

-- 1. FAQs Table
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- FAQ Content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT, -- Optional categorization (e.g., "General", "Services", "Process")
  
  -- Display
  display_order INTEGER,
  is_visible BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for FAQs
CREATE INDEX IF NOT EXISTS idx_faqs_user_id ON faqs(user_id);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(user_id, display_order);

-- RLS for FAQs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own FAQs" ON faqs;
DROP POLICY IF EXISTS "Users can insert their own FAQs" ON faqs;
DROP POLICY IF EXISTS "Users can update their own FAQs" ON faqs;
DROP POLICY IF EXISTS "Users can delete their own FAQs" ON faqs;

CREATE POLICY "Users can view their own FAQs"
  ON faqs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FAQs"
  ON faqs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FAQs"
  ON faqs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own FAQs"
  ON faqs FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_faqs_timestamp ON faqs;

CREATE TRIGGER trigger_update_faqs_timestamp
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_faqs_updated_at();

-- ============================================
-- 2. Services Table
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Service Content
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- Emoji or icon identifier
  price TEXT, -- Optional pricing (e.g., "$500", "Contact for quote", "Free")
  duration TEXT, -- Optional duration (e.g., "2 weeks", "1 month")
  
  -- Features/Details
  features JSONB, -- Array of features/bullet points
  
  -- Call to Action
  cta_text TEXT, -- e.g., "Book Now", "Learn More", "Contact"
  cta_url TEXT, -- URL for CTA button
  
  -- Display
  display_order INTEGER,
  is_featured BOOLEAN DEFAULT false, -- Highlight certain services
  is_visible BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Services
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(user_id, display_order);

-- RLS for Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own services" ON services;
DROP POLICY IF EXISTS "Users can insert their own services" ON services;
DROP POLICY IF EXISTS "Users can update their own services" ON services;
DROP POLICY IF EXISTS "Users can delete their own services" ON services;

CREATE POLICY "Users can view their own services"
  ON services FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services"
  ON services FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services"
  ON services FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_services_timestamp ON services;

CREATE TRIGGER trigger_update_services_timestamp
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_services_updated_at();

-- ============================================
-- 3. Comments for documentation
-- ============================================

COMMENT ON TABLE faqs IS 
  'Frequently Asked Questions section for user portfolios';

COMMENT ON COLUMN faqs.category IS 
  'Optional category for grouping FAQs (e.g., General, Services, Process)';

COMMENT ON TABLE services IS 
  'Services offered by the portfolio owner';

COMMENT ON COLUMN services.features IS 
  'Array of features/bullet points for the service (stored as JSONB)';

COMMENT ON COLUMN services.is_featured IS 
  'Highlight this service (e.g., most popular, recommended)';

-- ============================================
-- 4. Grant permissions (if needed)
-- ============================================

-- Grant usage on tables to authenticated users
GRANT ALL ON faqs TO authenticated;
GRANT ALL ON services TO authenticated;

