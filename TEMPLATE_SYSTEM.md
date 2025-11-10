# Template System Documentation - Updated Flow

## Overview

The Portfolio Builder features an intuitive template system that guides users through creating professional project showcases. The system is fully integrated into the detail page with a streamlined creation flow.

## User Flow

### Step 1: Create Project
1. User adds a new project from the editor
2. Enters **only the project name**
3. Sees a prominent **"Add Details & Choose Template"** button
4. Clicks to proceed to the detail page

### Step 2: Detail Page (Initial View)
User arrives at the detail page and sees:

**Header Section:**
- Project title (large, 48px)
- Editable placeholder fields:
  - **Description**: "Add a brief description of your project..."
  - **Role**: "Add your role..." (e.g., Lead Designer, Full-stack Developer)
  - **Tags**: "Add tags..." (e.g., React, UX Design, Mobile App)
  - **Link**: "Add project link..." (e.g., https://your-project.com)

**Body Section:**
- Large centered heading: "Choose a Template" ✨
- Subtitle explaining templates
- **Grid of all 8 templates** displayed as cards
- Each card shows:
  - Template icon and color theme
  - Template name
  - Description
  - Number of sections

### Step 3: Preview Template
When user clicks a template:
- **Template preview appears in the body** with:
  - Large icon and name
  - Template description
  - List of all sections with descriptions
  - Required section badges
- **"Use This Template" button** appears in top-right (gradient purple-blue)
- **Other 7 templates move to left sidebar** for easy switching
- User can click other templates in sidebar to preview them

### Step 4: Confirm Template
- User clicks "Use This Template"
- Template activates immediately
- Template blocks appear for editing
- Project metadata is saved with `template_type`
- User can now fill in template sections

### Step 5: Edit Content
- Click any field in the header to edit inline
- Fill in template blocks below
- Auto-save keeps everything updated
- Toggle to Preview mode to see final result

## Available Templates

### 1. **Blank Template** 📄
- Complete creative freedom
- No pre-defined structure

### 2. **Product Case Study** 🚀
Perfect for product launches
- Hero, Overview, Problem, Strategy, Process, Launch, Results, Learnings

### 3. **Product Design Case Study** 🎨
For design portfolios
- Hero, Context, Problem, Research, Ideation, Wireframes, Final Design, Impact, Reflection

### 4. **Creative / Branding Project** ✨
For branding work
- Hero, Brief, Concept, Process, Final Work, Feedback, Outcome

### 5. **Digital Marketing Campaign** 📊
For marketing professionals
- Hero, Objective, Strategy, Execution, Results, Insights

### 6. **User Research Project** 🔍
For research documentation
- Hero, Context, Research Plan, Findings, Themes, Recommendations

### 7. **Engineering / Technical Project** ⚙️
For technical portfolios
- Hero, Overview, Architecture, Challenges, Solutions, Performance, Outcomes

### 8. **Startup / Side Project** 💡
For entrepreneurial ventures
- Hero, Idea, MVP, Growth, Stack, Learnings

## Block Components

Each template uses reusable, professional block components:

- **Hero**: Title, subtitle, images, metadata
- **Callout**: Highlighted info with style variants
- **Rich Text**: Long-form content
- **Bullets**: Bullet point lists
- **Steps**: Numbered processes
- **Feature Grid**: Icon-based grid layouts
- **Gallery**: Image galleries (grid/carousel)
- **Metrics**: Display key numbers beautifully
- **Embed**: Figma, videos, PDFs

## Design Highlights

### Visual Hierarchy
1. **Project name**: 48px, bold, prominent
2. **Metadata fields**: Clear placeholders, inline editing
3. **Template grid**: Color-coded cards, 3-column layout
4. **Preview**: Gradient background, large display
5. **Use Template button**: Gradient accent, prominent

### User Experience
- **Click-to-edit**: All metadata fields editable inline
- **Visual feedback**: Hover states, color coding
- **Clear actions**: Prominent CTAs guide user
- **Progressive disclosure**: Templates → Preview → Edit
- **Persistent sidebar**: Easy template switching during preview

### Color System
- Gray: Blank template
- Blue: Product case study
- Purple: Design case study  
- Pink: Creative/branding
- Green: Marketing
- Indigo: Research
- Slate: Engineering
- Amber: Startup

## Technical Implementation

### Data Model
```typescript
interface Project {
  id: string;
  title: string;
  description?: string;
  role?: string;          // NEW: User's role
  tags: string[];
  link?: string;
  template_type?: string; // Template ID when selected
  blocks?: TemplateBlock[]; // Template content
}
```

### States
1. **New Project**: Only title, shows Add button
2. **Initial Detail View**: Shows all templates in grid
3. **Previewing Template**: One template in body, others in sidebar
4. **Template Active**: Template editor with blocks

### Auto-Save
- All changes debounced (500ms)
- Saves to localStorage instantly
- Syncs to Supabase after debounce
- Visual save indicator in header

## Benefits of New Flow

### For Users:
✅ **Simple start**: Just enter project name
✅ **Clear next step**: Prominent Add button
✅ **Visual choice**: See all templates at once
✅ **Informed decision**: Preview before committing
✅ **Easy switching**: Sidebar for template comparison
✅ **Placeholder guidance**: Clear hints for all fields
✅ **Role clarity**: New field for project role

### For Design:
✅ **Progressive disclosure**: Information revealed step-by-step
✅ **Spatial consistency**: Templates always in same area
✅ **Visual hierarchy**: Clear path through creation
✅ **Contextual actions**: Buttons appear when relevant

### For Development:
✅ **Single page**: All functionality in one component
✅ **Clear state management**: Distinct states for each phase
✅ **Reusable components**: Template cards, preview layout
✅ **Maintainable**: One source of truth for templates

## Developer Guide

### File Structure
```
app/detail/[type]/[id]/page.tsx     # Main detail page
app/editor/
  ├── templates/
  │   ├── types.ts                   # TypeScript types
  │   ├── configs.ts                 # Template definitions
  │   ├── blocks/                    # 9 block components
  │   ├── TemplateRenderer.tsx       # Renders blocks
  │   └── index.ts
  └── sections/projects/
      └── ProjectsEditor.tsx         # Shows Add button
```

### Adding a Template

Edit `app/editor/templates/configs.ts`:
```typescript
{
  id: 'new-template',
  name: 'New Template Name',
  description: 'Brief description',
  icon: '🎯',
  color: 'blue',
  sections: [
    { 
      id: 'hero', 
      label: 'Hero', 
      blockType: 'hero', 
      required: true,
      description: 'Main title and introduction'
    },
    // ... more sections
  ],
}
```

Template automatically appears in the grid!

## Future Enhancements

- [ ] Template categories/filtering
- [ ] Template search
- [ ] Custom template creation
- [ ] Template favorites
- [ ] AI-assisted content suggestions
- [ ] Template remixing
- [ ] Drag-and-drop block reordering
- [ ] Block duplication
- [ ] Version history
- [ ] Collaborative editing
- [ ] Export to PDF/HTML

## Summary

The new template system provides a **guided, visual, and intuitive experience** for creating professional project showcases. Users start simple (just a name), are presented with clear choices (template grid), can preview before committing (template preview), and then dive into editing with all the tools they need.

Every step is designed to reduce friction, provide clarity, and inspire confidence in the final result.
