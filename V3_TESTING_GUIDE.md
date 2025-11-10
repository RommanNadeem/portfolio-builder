# V3 Template System - Testing Guide

## 🧪 How to Test the V3 Data Flow

This guide walks you through testing the V3 template system to ensure data flows correctly between V2 portfolio entities and V3 template blocks.

---

## Manual Testing Steps

### Prerequisites

1. Have at least one project in your portfolio
2. Have at least one career highlight in your portfolio
3. Be on the `/editor` page

---

### Test 1: Load Existing Project

**Goal:** Verify that V3 can load a project from the portfolio

```typescript
// Open browser console
import { entityDocumentManager } from './app/editor/templates/v3';

// Get a project ID from localStorage
const portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
const projectId = portfolioData.projects[0].id;

// Load it
const result = await entityDocumentManager.loadFromPortfolio(projectId, 'project');

// Check result
console.log('Success:', result.success);
console.log('Document:', result.document);
```

**Expected:**
- ✅ `result.success === true`
- ✅ `result.document.entity_data.title` matches project title
- ✅ `result.document.template.blocks` is an array

---

### Test 2: Initialize Template

**Goal:** Verify that templates pre-fill with entity data

```typescript
import { templateInitializerFactory } from './app/editor/templates/v3';

// Get entity
const project = portfolioData.projects[0];

// Initialize template
const blocks = templateInitializerFactory.initializeTemplate(
  'project',
  project,
  'product-case-study'
);

// Check hero block
const heroBlock = blocks[0];
console.log('Hero title:', heroBlock.data.title);
console.log('Matches project:', heroBlock.data.title === project.title);
```

**Expected:**
- ✅ `blocks.length > 0`
- ✅ Hero block title matches project title
- ✅ Hero block has image if project has thumbnail

---

### Test 3: Save and Sync

**Goal:** Verify that template changes sync back to entity

```typescript
// Load document
const result = await entityDocumentManager.loadFromPortfolio(projectId, 'project');
const document = result.document;

// Modify hero block
document.template.blocks[0].data.title = 'NEW TITLE';
document.template.blocks[0].data.imageUrl = 'https://example.com/new.jpg';

// Save
const saveResult = await entityDocumentManager.saveToPortfolio(document);

// Check sync
console.log('Save success:', saveResult.success);
console.log('Updated entity:', saveResult.updated_entity);
console.log('Title synced:', saveResult.updated_entity.title === 'NEW TITLE');
console.log('Thumbnail synced:', saveResult.updated_entity.thumbnail === 'https://example.com/new.jpg');
```

**Expected:**
- ✅ Save succeeds
- ✅ Entity title updated to 'NEW TITLE'
- ✅ Entity thumbnail updated to new URL
- ✅ Changes visible in localStorage

---

### Test 4: Career Achievements Sync

**Goal:** Verify career achievements sync bidirectionally

```typescript
// Load career
const career = portfolioData.careerHighlights[0];
const careerId = career.id;
const result = await entityDocumentManager.loadFromPortfolio(careerId, 'career');

// Initialize if needed
if (result.document.template.blocks.length === 0) {
  const blocks = templateInitializerFactory.initializeTemplate(
    'career',
    career,
    'career-experience'
  );
  result.document.template.blocks = blocks;
}

// Modify achievements block (index 3)
const achievementsBlock = result.document.template.blocks[3];
achievementsBlock.data.bullets = [
  'Led migration to microservices',
  'Reduced latency by 40%',
  'Mentored 5 junior developers',
];

// Save
const saveResult = await entityDocumentManager.saveToPortfolio(result.document);

// Check sync
console.log('Achievements:', saveResult.updated_entity.achievements);
console.log('Count:', saveResult.updated_entity.achievements.length);
console.log('Synced:', saveResult.updated_entity.achievements.length === 3);
```

**Expected:**
- ✅ Entity achievements array has 3 items
- ✅ Achievements match block bullets
- ✅ Featured achievements preserved if any

---

### Test 5: Impact Data Sync

**Goal:** Verify structured impact data converts correctly

```typescript
// Load career with impacts
const career = portfolioData.careerHighlights.find(c => c.impacts);
const result = await entityDocumentManager.loadFromPortfolio(career.id, 'career');

// Initialize template
const blocks = templateInitializerFactory.initializeTemplate(
  'career',
  career,
  'career-experience'
);

// Check impacts block (index 4)
const impactsBlock = blocks[4];
console.log('Impacts block:', impactsBlock);
console.log('Metrics:', impactsBlock.data.metrics);

// Verify structure
const hasMetrics = impactsBlock.data.metrics.length > 0;
const firstMetric = impactsBlock.data.metrics[0];
console.log('Has value:', !!firstMetric.value);
console.log('Has label:', !!firstMetric.label);
console.log('Has category:', !!firstMetric.category);
```

**Expected:**
- ✅ Impacts converted to metrics array
- ✅ Each metric has value, label, description
- ✅ Category preserved (business, performance, etc.)

---

## Automated Test Suite

Run the automated test suite in browser console:

```typescript
// Import test utility
import { testV3DataFlow } from './app/editor/templates/v3/tests/testDataFlow';

// Run all tests
const results = await testV3DataFlow();

// Results will be logged to console
// Check for any failures
```

---

## Integration Testing

### Test Full User Flow

1. **Create New Project**
   ```
   - Go to /editor
   - Click "Add New Project"
   - Fill in title, description
   - Click "Choose Template & Start Editing"
   - Should navigate to /detail/project-editor/[id]
   - Template selector should show
   ```

2. **Select Template**
   ```
   - Choose "Product Case Study"
   - Hero block should pre-fill with project data
   - All sections should be visible
   ```

3. **Edit Content**
   ```
   - Edit hero title
   - Add achievements
   - Upload images
   - Wait for auto-save (2.5s)
   - Check save status indicator
   ```

4. **Navigate Back**
   ```
   - Click "Back to Editor"
   - Project card should show updated title
   - Project card should show updated thumbnail
   - CTA should say "Continue Editing"
   ```

5. **Verify Persistence**
   ```
   - Refresh page
   - Go back to project detail
   - All changes should be preserved
   ```

---

## Visual Testing Checklist

- [ ] Hero block shows correct title
- [ ] Hero block shows correct image
- [ ] Metadata fields populated (year, role, etc.)
- [ ] Career timeline formatted correctly
- [ ] Achievements list populated
- [ ] Impacts/metrics show correctly
- [ ] Company tenure information displays
- [ ] Save indicator shows correct status
- [ ] Auto-save triggers after edits
- [ ] Error messages display on failures
- [ ] Loading states show appropriately

---

## Data Integrity Checks

### Project Data

```typescript
// Check project before and after
const before = portfolioData.projects.find(p => p.id === projectId);

// ... make changes ...

const after = JSON.parse(localStorage.getItem('portfolioData')).projects.find(p => p.id === projectId);

// Compare
console.log('Title changed:', before.title !== after.title);
console.log('Thumbnail changed:', before.thumbnail !== after.thumbnail);
console.log('Blocks saved:', after.blocks.length > 0);
console.log('Template type set:', !!after.template_type);
console.log('Has detail page:', after.has_detail_page === true);
```

### Career Data

```typescript
// Check career before and after
const before = portfolioData.careerHighlights.find(c => c.id === careerId);

// ... make changes ...

const after = JSON.parse(localStorage.getItem('portfolioData')).careerHighlights.find(c => c.id === careerId);

// Compare
console.log('Organization:', after.organization);
console.log('Role:', after.role);
console.log('Achievements synced:', after.achievements.length);
console.log('Responsibilities synced:', after.responsibilities?.length || 0);
console.log('Impacts preserved:', !!after.impacts);
```

---

## Performance Testing

### Load Time

```typescript
console.time('Load Document');
const result = await entityDocumentManager.loadFromPortfolio(projectId, 'project');
console.timeEnd('Load Document');
// Should be < 100ms
```

### Save Time

```typescript
console.time('Save Document');
const saveResult = await entityDocumentManager.saveToPortfolio(document);
console.timeEnd('Save Document');
// Should be < 200ms
```

### Template Initialization

```typescript
console.time('Initialize Template');
const blocks = templateInitializerFactory.initializeTemplate('project', entity, 'product-case-study');
console.timeEnd('Initialize Template');
// Should be < 50ms
```

---

## Edge Cases to Test

1. **Empty Entity**
   - Create project with no description
   - Should still load and initialize

2. **Missing Fields**
   - Career without achievements
   - Should show empty bullets block

3. **Legacy Data**
   - Old project with `pageContent` instead of `blocks`
   - Should convert gracefully

4. **Large Data**
   - Career with 50+ achievements
   - Should handle without performance issues

5. **Special Characters**
   - Title with emojis
   - Description with markdown
   - Should preserve formatting

---

## Debugging Tips

### Enable Debug Logging

```typescript
// V3 already has debug logging enabled
// Check console for detailed logs like:
// [EntityDocumentManager] Loading project with ID: ...
// [EntityDocumentManager] Syncing template to project entity...
// [ProjectInitializer] Pre-filling hero block
```

### Inspect Document State

```typescript
// Use hook in component
const { document } = useEntityDocument({ ... });

// Log full state
console.log('Document:', document);
console.log('Sync state:', document?.sync_state);
console.log('Is synced:', document?.sync_state.is_synced);
```

### Check localStorage

```typescript
// View current portfolio data
const data = JSON.parse(localStorage.getItem('portfolioData'));
console.table(data.projects);
console.table(data.careerHighlights);
```

---

## Common Issues & Solutions

### Issue: "Project not found in portfolio"
**Solution:** Ensure project exists in localStorage before navigating to detail page

### Issue: Template doesn't pre-fill
**Solution:** Check that entity has data and initializer is working

### Issue: Changes don't sync back
**Solution:** Verify `syncTemplateToEntity` is extracting data from correct block indices

### Issue: Auto-save not triggering
**Solution:** Check debounce delay and ensure `autoSave: true`

---

## Success Criteria

All tests should pass with:
- ✅ Load times < 100ms
- ✅ Save times < 200ms
- ✅ Zero data loss
- ✅ Bidirectional sync working
- ✅ No console errors
- ✅ Visual UI correct
- ✅ Works with existing V2 sections

---

**Ready to test!** Start with manual tests, then run automated suite, then do integration testing. 🚀

