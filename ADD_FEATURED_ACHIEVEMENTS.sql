-- Migration: Add featured_achievements and achievements_order columns to career_highlights table
-- Description: Adds support for marking top 3 achievements as "featured" to display on portfolio cards
-- Date: 2025-11-10

-- Add featured_achievements column (stores indices of featured achievements, max 3)
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS featured_achievements JSONB DEFAULT NULL;

-- Add achievements_order column (stores custom ordering of achievements)
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS achievements_order JSONB DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN career_highlights.featured_achievements IS 'Array of indices (0-based) indicating which achievements are featured (max 3). Featured achievements appear on the portfolio card preview.';
COMMENT ON COLUMN career_highlights.achievements_order IS 'Array of indices (0-based) indicating custom ordering of achievements. If null, achievements appear in their natural array order.';

-- Create index for better query performance when filtering by featured achievements
CREATE INDEX IF NOT EXISTS idx_career_highlights_featured 
ON career_highlights USING GIN (featured_achievements);

-- Migration rollback (if needed)
-- To rollback this migration, run:
-- ALTER TABLE career_highlights DROP COLUMN IF EXISTS featured_achievements;
-- ALTER TABLE career_highlights DROP COLUMN IF EXISTS achievements_order;
-- DROP INDEX IF EXISTS idx_career_highlights_featured;

