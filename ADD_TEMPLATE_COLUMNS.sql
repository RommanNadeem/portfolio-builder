-- Add new columns to projects table for template support

-- Add role column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS role TEXT;

-- Add template_type column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS template_type TEXT;

-- Add published status columns
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Add index for published projects
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(user_id, published);

-- Add index for template types
CREATE INDEX IF NOT EXISTS idx_projects_template_type ON projects(user_id, template_type);

COMMENT ON COLUMN projects.role IS 'User''s role in the project (e.g., Lead Designer)';
COMMENT ON COLUMN projects.template_type IS 'Template type ID (e.g., product-case-study, blank)';
COMMENT ON COLUMN projects.published IS 'Whether project is published and visible';
COMMENT ON COLUMN projects.published_at IS 'Timestamp when project was published';

