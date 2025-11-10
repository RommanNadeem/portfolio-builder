-- Migration: Add responsibilities and key_achievements columns
-- Description: Separates generic duties from impact-focused accomplishments
-- Date: 2025-11-10

-- Add new columns
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS key_achievements JSONB DEFAULT '[]';

-- Add comments for documentation
COMMENT ON COLUMN career_highlights.achievements IS 'Legacy field - combined list of all bullets for backwards compatibility';
COMMENT ON COLUMN career_highlights.responsibilities IS 'Generic job duties and ongoing tasks without specific metrics or outcomes';
COMMENT ON COLUMN career_highlights.key_achievements IS 'Impact-focused accomplishments with measurable outcomes, metrics, and quantifiable results';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_career_highlights_responsibilities 
ON career_highlights USING GIN (responsibilities);

CREATE INDEX IF NOT EXISTS idx_career_highlights_key_achievements 
ON career_highlights USING GIN (key_achievements);

-- Optional: Migrate existing data
-- This copies all achievements to key_achievements if they contain metrics
-- Uncomment if you want to run automatic migration
/*
UPDATE career_highlights
SET 
  key_achievements = (
    SELECT jsonb_agg(elem)
    FROM jsonb_array_elements_text(achievements) elem
    WHERE elem::text ~* '\d+%|\d+x|\$\d+|increased|improved|reduced|decreased|generated|saved|delivered|shipped'
  ),
  responsibilities = (
    SELECT jsonb_agg(elem)
    FROM jsonb_array_elements_text(achievements) elem
    WHERE elem::text !~* '\d+%|\d+x|\$\d+|increased|improved|reduced|decreased|generated|saved|delivered|shipped'
  )
WHERE responsibilities IS NULL OR key_achievements IS NULL;
*/

-- Migration rollback (if needed)
-- To rollback this migration, run:
-- ALTER TABLE career_highlights DROP COLUMN IF EXISTS responsibilities;
-- ALTER TABLE career_highlights DROP COLUMN IF EXISTS key_achievements;
-- DROP INDEX IF EXISTS idx_career_highlights_responsibilities;
-- DROP INDEX IF EXISTS idx_career_highlights_key_achievements;

