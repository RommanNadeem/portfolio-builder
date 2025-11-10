-- Migration: Add impacts column to career_highlights table
-- Description: Stores structured, categorized impact metrics from backend
-- Date: 2025-11-10

-- Add impacts column (stores categorized impacts as JSONB object)
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN career_highlights.impacts IS 'Structured impacts object with categories: business, performance, growth, quality, team, scale. Each category contains array of {value, metric, description, category}.';

-- Create index for better query performance when filtering by impacts
CREATE INDEX IF NOT EXISTS idx_career_highlights_impacts 
ON career_highlights USING GIN (impacts);

-- Example of valid impacts data:
-- {
--   "business": [
--     {
--       "value": "$2M",
--       "metric": "Revenue Generated",
--       "description": "Launched premium tier generating $2M ARR",
--       "category": "business"
--     }
--   ],
--   "performance": [
--     {
--       "value": "60%",
--       "metric": "Load Time Reduction",
--       "description": "Reduced page load from 3s to 800ms",
--       "category": "performance"
--     }
--   ],
--   "growth": [...],
--   "quality": [...],
--   "team": [...],
--   "scale": [...]
-- }

-- Migration rollback (if needed)
-- To rollback this migration, run:
-- ALTER TABLE career_highlights DROP COLUMN IF EXISTS impacts;
-- DROP INDEX IF EXISTS idx_career_highlights_impacts;

