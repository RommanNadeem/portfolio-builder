# Integration Guide: Notion-Like Flow

## 🎯 Quick Start

Update your ProjectsEditor to use the new Notion-like template-to-editor flow in 3 simple steps.

---

## Step 1: Update ProjectsEditor Button

**File:** `app/editor/sections/projects/ProjectsEditor.tsx`

### Current Code (Lines 159-176):

```tsx
{isNewProject ? (
  <button
    onClick={() => router.push(`/detail/project/${project.id}?mode=edit`)}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
  >
    <Plus className="w-4 h-4" />
    Add Details & Choose Template
  </button>
) : (
  <button
    onClick={() => router.push(`/detail/project/${project.id}?mode=edit`)}
    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-100 transition-all"
  >
    <FileEdit className="w-4 h-4" />
    {(project as any).template_type ? 'Edit Template Project' : 'Add Detailed Content & Sections'}
  </button>
)}
```

### New Code (Replace with):

```tsx
{isNewProject ? (
  <button
    onClick={() => router.push(`/detail/project-editor/${project.id}`)}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
  >
    <Plus className="w-4 h-4" />
    Choose Template & Start Editing
  </button>
) : (
  <button
    onClick={() => router.push(`/detail/project-editor/${project.id}`)}
    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-100 transition-all"
  >
    <FileEdit className="w-4 h-4" />
    {(project as any).template_type ? 'Continue Editing' : 'Choose Template'}
  </button>
)}
```

**Changes:**
- Updated route from `/detail/project/` to `/detail/project-editor/`
- Changed button text to match new flow
- Removed `?mode=edit` query parameter (not needed)

---

## Step 2: Add Small Detail Button

**Optional Enhancement:** Add a small edit icon next to the project title for quick access.

```tsx
// In the project card header (around line 48)
<div className="flex items-center gap-2">
  <div className="flex gap-1">
    <button
      onClick={() => onMove(project.id, 'up')}
      disabled={index === 0}
      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
      title="Move up"
    >
      <GripVertical className="w-4 h-4" />
    </button>
  </div>
  <div className="flex-1">
    <input
      value={project.title}
      onChange={(e) => onUpdate(project.id, { title: e.target.value })}
      placeholder="E-Commerce Platform Redesign"
      className="w-full px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500"
    />
  </div>
  {/* ✨ NEW: Quick edit button */}
  <button
    onClick={() => router.push(`/detail/project-editor/${project.id}`)}
    className="p-1 text-purple-600 hover:text-purple-700"
    title="Edit detailed page"
  >
    <FileEdit className="w-4 h-4" />
  </button>
  <button
    onClick={() => onDelete(project.id)}
    className="p-1 text-red-500 hover:text-red-700"
    title="Delete project"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</div>
```

---

## Step 3: Test the Integration

### Testing Checklist:

1. **Create New Project**
   - [ ] Click "Add Project" in editor
   - [ ] Enter project name
   - [ ] Click "Choose Template & Start Editing"
   - [ ] Should navigate to `/detail/project-editor/[id]`
   - [ ] Template selector should appear

2. **Select Template**
   - [ ] Search works
   - [ ] Filters work
   - [ ] Click template card
   - [ ] Customization screen appears

3. **Customize Template**
   - [ ] Can check/uncheck sections
   - [ ] Required sections locked
   - [ ] Click "Create Project"
   - [ ] Editor appears with blocks

4. **Edit Content**
   - [ ] Sections expand/collapse
   - [ ] Can type in fields
   - [ ] Auto-save works (check indicator)
   - [ ] Progress sidebar updates

5. **Preview Mode**
   - [ ] Toggle to Preview
   - [ ] Empty sections hidden
   - [ ] Filled sections show
   - [ ] Can toggle back to Edit

6. **Navigation**
   - [ ] Click back button
   - [ ] Returns to editor
   - [ ] Project saved
   - [ ] Can re-open and continue

---

## 📊 Data Flow

```
┌─────────────────┐
│ ProjectsEditor  │
│ (Main Editor)   │
└────────┬────────┘
         │
         │ Click "Choose Template"
         ↓
┌──────────────────────────────────────┐
│ /detail/project-editor/[id]          │
│                                      │
│ Step 1: Select Template              │
│  ↓                                   │
│ Step 2: Customize Template           │
│  ↓                                   │
│ Step 3: Edit Content                 │
│  • Auto-save to localStorage         │
│  • Update progress                   │
│  • Preview mode toggle               │
└──────────────────────────────────────┘
         │
         │ Click "← Back"
         ↓
┌─────────────────┐
│ ProjectsEditor  │
│ (Returns here)  │
└─────────────────┘
```

---

## 🔧 Optional: Migrate Existing Projects

If you have existing projects using the old detail page, you can migrate them:

```typescript
// Create a migration script
async function migrateExistingProjects() {
  const projects = getAllProjectsFromLocalStorage();
  
  for (const project of projects) {
    if (project.blocks && !project.template_type) {
      // Old format - migrate to new format
      const migratedProject = {
        ...project,
        template_type: 'blank', // or detect from blocks
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(
        `project_${project.id}`, 
        JSON.stringify(migratedProject)
      );
    }
  }
}
```

---

## 🎨 Customization Options

### 1. Change Route Path

If you want a different URL structure:

```tsx
// From:
/detail/project-editor/[id]

// To:
/editor/project/[id]
// or
/portfolio/edit/[id]
```

Update:
1. Folder structure: `app/editor/project/[id]/page.tsx`
2. ProjectsEditor route: `router.push(\`/editor/project/${id}\`)`

### 2. Disable Template Selection

To always use a specific template:

```tsx
// In page.tsx, skip selection step
useEffect(() => {
  if (!projectData) return;
  
  if (!projectData.template_type) {
    // Auto-select a default template
    setSelectedTemplate('blank');
    setFlowState('editing');
    const defaultBlocks = [createEmptyBlock('hero')];
    setBlocks(defaultBlocks);
  }
}, [projectData]);
```

### 3. Add More View Modes

```tsx
// Add tablet view
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

<button onClick={() => setDeviceMode('tablet')}>
  <Tablet className="w-4 h-4" />
</button>
```

### 4. Customize Progress Sidebar

```tsx
// Add custom metrics
<ProgressChecklist
  blocks={blocks}
  savedBlockIds={savedBlockIds}
  templateConfig={templateConfig}
  onSectionClick={scrollToSection}
  // ✨ NEW: Custom props
  showWordCount={true}
  showTimeEstimate={true}
  customMetrics={{
    images: blocks.filter(b => b.type === 'gallery').length,
    words: calculateTotalWords(blocks),
  }}
/>
```

---

## 🐛 Troubleshooting

### Issue: Template selector doesn't show

**Fix:** Ensure imports are correct:

```tsx
import { 
  TemplateSelector,
  TemplateCustomizer,
  // ... other imports
} from '@/app/editor/templates';
```

### Issue: Auto-save not working

**Check:**
1. `useEffect` dependency array includes `blocks`
2. Timeout is being set correctly
3. localStorage has write permissions

**Debug:**
```tsx
useEffect(() => {
  console.log('Blocks changed:', blocks);
  setSaveStatus('unsaved');
  // ... rest of auto-save logic
}, [blocks]);
```

### Issue: Preview mode shows empty sections

**Fix:** Check isEmpty logic:

```tsx
const isEmpty = !isSaved;
if (viewMode === 'preview' && isEmpty) {
  return null; // This should hide the section
}
```

### Issue: Drag and drop not working

**Verify:**
1. `@dnd-kit/core` installed
2. Sensors configured
3. Hero section (index 0) has `disabled={true}`

---

## 📦 Dependencies

Ensure these are installed:

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.0.8",
    "@dnd-kit/sortable": "^7.0.2",
    "@dnd-kit/utilities": "^3.2.1",
    "lucide-react": "^0.263.1",
    "next": "14.x",
    "react": "18.x"
  }
}
```

Install if missing:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Test all template types
- [ ] Test on mobile devices
- [ ] Verify auto-save works
- [ ] Check localStorage limits
- [ ] Test with long content
- [ ] Verify drag and drop on touch devices
- [ ] Test preview mode thoroughly
- [ ] Check accessibility (keyboard navigation)
- [ ] Verify back button behavior
- [ ] Test with slow connections

---

## 📊 Analytics Events (Optional)

Add tracking for user behavior:

```tsx
// Template selection
analytics.track('template_selected', {
  template_type: selectedTemplate,
  timestamp: Date.now(),
});

// Template customization
analytics.track('template_customized', {
  template_type: selectedTemplate,
  sections_selected: selectedSections.length,
});

// First save
analytics.track('project_first_save', {
  template_type: selectedTemplate,
  sections_completed: savedBlockIds.size,
});

// Project completion
if (progress === 100) {
  analytics.track('project_completed', {
    template_type: selectedTemplate,
    total_blocks: blocks.length,
    time_spent: calculateTimeSpent(),
  });
}
```

---

## 🎯 Success Metrics

Track these metrics to measure success:

1. **Completion Rate**: % of projects finished
2. **Time to First Save**: How quickly users start editing
3. **Template Usage**: Which templates are most popular
4. **Section Completion**: Which sections users struggle with
5. **Preview Usage**: How often users toggle preview
6. **Auto-save Frequency**: How often content is being saved

---

## ✅ You're Done!

Your portfolio builder now has a world-class, Notion-inspired editing experience! 🎉

**Next Steps:**
1. Update the ProjectsEditor button (Step 1)
2. Test the new flow
3. Deploy and enjoy!

---

## 📚 Related Documentation

- `NOTION_FLOW_COMPLETE.md` - Complete feature documentation
- `TEMPLATE_IMPROVEMENTS_GUIDE.md` - All template features
- `BEFORE_AFTER_COMPARISON.md` - What changed and why

**Questions?** Check the documentation or review the code comments in `page.tsx`!

