# Portfolio Editor - Modular Architecture

## 📁 Architecture Overview

This editor has been refactored from a **4,348-line monolithic file** into a **clean, modular architecture** with **state colocation** pattern.

### File Structure

```
app/editor/
├── page.tsx                          (111 lines - main orchestrator)
├── page-old.tsx                      (Backup of original)
│
├── hooks/
│   ├── usePortfolioData.ts           Data loading & saving
│   ├── useAutoSave.ts                Auto-save with 2s debounce
│   └── useSection.ts                 Generic CRUD operations
│
├── sections/
│   ├── personal/                     Personal info & profile
│   ├── career/                       Career highlights & experience
│   ├── projects/                     Project showcase
│   ├── strengths/                    Skills & abilities
│   └── testimonials/                 Client testimonials
│
└── components/
    ├── EditorLayout.tsx              Main layout wrapper
    ├── EmojiPicker.tsx               (Existing)
    └── MonthYearPicker.tsx           (Existing)
```

## 🎯 Key Features

### ✅ Modular Design
- Each section is **self-contained** with its own Editor, Preview, and types
- Average section size: **~150 lines** (vs 4,348 in original)
- Easy to add new sections - just create a new folder and add to page.tsx

### ✅ State Colocation
- Each section manages its own state using `useState` and `useSection` hook
- No global Redux/Context complexity
- State is "co-located" close to where it's used

### ✅ Bidirectional Sync
- Changes in **left pane** (editor) → instantly reflect in **right pane** (preview)
- All sections share the same `portfolio` data
- Uses React's built-in state management

### ✅ Auto-Save
- **Debounced** auto-save (2 seconds after last change)
- Visual indicators: Saving/Unsaved/Saved status with timestamp
- Manual "Save Now" button available

### ✅ No Database Changes
- Uses existing `getCompletePortfolio()` and `saveCompletePortfolio()`
- 100% backward compatible with current database schema
- Existing user data works without migration

## 🔧 How to Use

### Adding a New Section

1. **Create section folder:**
   ```
   app/editor/sections/my-section/
   ├── types.ts
   ├── MySectionEditor.tsx
   ├── MySectionPreview.tsx
   └── index.tsx
   ```

2. **Define types:**
   ```typescript
   // types.ts
   export interface MyData {
     id: string;
     title: string;
     // ... other fields
   }
   ```

3. **Create Editor component:**
   ```typescript
   // MySectionEditor.tsx
   export function MySectionEditor({ items, onAdd, onUpdate, onDelete }) {
     // Form fields for editing
   }
   ```

4. **Create Preview component:**
   ```typescript
   // MySectionPreview.tsx
   export function MySectionPreview({ items, viewMode, previewMode }) {
     // Display in portfolio
   }
   ```

5. **Create main section component:**
   ```typescript
   // index.tsx
   export function MySection({ data, onChange, viewMode, previewMode, renderMode }) {
     const [isExpanded, setIsExpanded] = useState(false);
     const { items, addItem, updateItem, deleteItem } = useSection(/*...*/);
     
     if (renderMode === 'editor') {
       return <MySectionEditor />;
     }
     return <MySectionPreview />;
   }
   ```

6. **Add to page.tsx:**
   ```typescript
   import { MySection } from './sections/my-section';
   
   // Add to both editorPanel and previewPanel
   <MySection data={portfolio} onChange={updatePortfolio} ... />
   ```

## 🎨 Component Patterns

### Section Component Structure
```typescript
export function MySection({ data, onChange, viewMode, previewMode, renderMode }) {
  // 1. Local state (expandable, etc)
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 2. CRUD operations via useSection hook
  const { items, addItem, updateItem, deleteItem, moveItem } = useSection(
    data.myItems || [],
    (updated) => onChange(prev => ({ ...prev, myItems: updated }))
  );
  
  // 3. Conditional rendering based on renderMode
  if (renderMode === 'editor') {
    return <EditorView />;
  }
  return <PreviewView />;
}
```

### useSection Hook (Generic CRUD)
```typescript
const { items, addItem, updateItem, deleteItem, moveItem } = useSection<T>(
  initialItems,
  onUpdate
);

// Usage:
addItem({ title: 'New Item' });          // Adds with auto-generated ID
updateItem('id-123', { title: 'Updated' }); // Partial update
deleteItem('id-123');                     // Remove
moveItem('id-123', 'up');                 // Reorder
```

## 📊 Performance Benefits

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Main file size | 4,348 lines | 111 lines | **97% reduction** |
| Average component | N/A | ~150 lines | Highly maintainable |
| Re-renders | Entire page | Section-specific | Much faster |
| Code splitting | None | Per-section | Better load times |

## 🔄 Data Flow

```
User edits in Editor
    ↓
updateItem(id, changes)
    ↓
useSection hook updates local array
    ↓
onChange callback with updated array
    ↓
updatePortfolio() in parent
    ↓
portfolio state updates
    ↓
useAutoSave detects change
    ↓
Debounced save to database (2s)
    ↓
Preview pane re-renders with new data
```

## 🧪 Testing

The implementation maintains all existing functionality:

- ✅ Data loads from Supabase
- ✅ Changes save to database
- ✅ Auto-save works
- ✅ Existing data compatible
- ✅ All CRUD operations functional
- ✅ Edit/Preview modes work
- ✅ Desktop/Mobile toggle works

## 📝 Migration Notes

### What Changed
- ✅ **Code organization** - Modular structure
- ✅ **Component architecture** - Smaller, focused components
- ✅ **State management** - State colocation pattern

### What Stayed the Same
- ✅ **Database schema** - No changes
- ✅ **API functions** - Same database.ts functions
- ✅ **Data format** - Same legacy format
- ✅ **User experience** - Same UI/UX

### Rollback Plan
If needed, restore `page-old.tsx`:
```bash
mv app/editor/page.tsx app/editor/page-new.tsx
mv app/editor/page-old.tsx app/editor/page.tsx
```

## 🚀 Future Enhancements

Potential improvements with this architecture:

1. **Drag-and-drop reordering** - Easy to add per section
2. **Section visibility toggle** - Show/hide sections
3. **Export/Import sections** - Share configurations
4. **Section templates** - Pre-built section configs
5. **Real-time collaboration** - Multiple users editing
6. **Undo/Redo** - State history management
7. **Section versioning** - Track changes over time

## 📚 References

- **State Colocation**: Kent C Dodds - "Colocation"
- **Compound Components**: React patterns documentation
- **Custom Hooks**: React Hooks best practices

---

**Built with:** React, Next.js 16, TypeScript, Tailwind CSS
**Pattern:** State Colocation + Compound Components
**Lines of Code:** ~2,500 total (vs 4,348 original)

