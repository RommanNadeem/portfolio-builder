# 🚀 Quick Start: Using the New Unified Architecture

## Overview

The new architecture provides ready-to-use hooks and components that handle 80% of section logic. You just customize the card UI and data structure.

---

## 📦 What You Get For Free

Every section automatically includes:
- ✅ **State management** - Add, update, delete, reorder items
- ✅ **Auto-save** - Debounced saves to database/localStorage
- ✅ **Save status** - Visual feedback (saving/saved/error)
- ✅ **Drag-and-drop** - Reorder items with smooth animations
- ✅ **Empty states** - Beautiful UI when no items exist
- ✅ **Validation** - Optional validation framework
- ✅ **Type safety** - Full TypeScript support

---

## 🎯 5-Minute Section Creation

### **Step 1: Define Your Type**

Create `sections/your-section/types.ts`:

```typescript
import { BaseItem } from '@/app/editor/core/types';

// Extend BaseItem to get id, created_at, updated_at, order_index
export interface YourItem extends BaseItem {
  title: string;
  description: string;
  // ... your custom fields
}
```

### **Step 2: Create Your Card**

Create `sections/your-section/YourItemCard.tsx`:

```typescript
'use client';

import { ItemCard } from '@/app/editor/core/components';
import { YourItem } from './types';

interface YourItemCardProps {
  item: YourItem;
  onUpdate: (id: string, updates: Partial<YourItem>) => void;
  onDelete: (id: string) => void;
  // ... optional move actions
}

export function YourItemCard({ item, onUpdate, onDelete }: YourItemCardProps) {
  return (
    <ItemCard
      id={item.id}
      onDelete={() => onDelete(item.id)}
    >
      {/* Your custom UI here */}
      <input
        value={item.title}
        onChange={(e) => onUpdate(item.id, { title: e.target.value })}
        className="w-full px-3 py-2 border rounded"
      />
      <textarea
        value={item.description}
        onChange={(e) => onUpdate(item.id, { description: e.target.value })}
        className="w-full px-3 py-2 border rounded"
      />
    </ItemCard>
  );
}
```

### **Step 3: Create Your Section**

Create `sections/your-section/YourSection.tsx`:

```typescript
'use client';

import { useSectionManager, SectionContainer, ItemList } from '@/app/editor/core';
import { YourItem } from './types';
import { YourItemCard } from './YourItemCard';

interface YourSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
}

export function YourSection({ data, onChange }: YourSectionProps) {
  // 🎯 This one hook does ALL the heavy lifting
  const {
    items,
    add,
    update,
    remove,
    reorderByIndex,
    saveStatus,
    itemCount,
  } = useSectionManager<YourItem>({
    initialData: data.yourItems || [],
    onSave: async (items) => {
      // Save to parent state
      onChange(prev => ({ ...prev, yourItems: items }));
    },
    autoSave: true,
    autoSaveDelay: 2500,
  });

  // Handler for adding new items
  const handleAdd = () => {
    add({
      title: '',
      description: '',
      // ... other fields (no need for id, created_at, etc)
    });
  };

  // 🎨 Render with shared components
  return (
    <SectionContainer
      title="Your Section"
      icon="🎯"
      description="Optional description"
      onAdd={handleAdd}
      addLabel="Add Item"
      isEmpty={items.length === 0}
      emptyMessage="No items yet. Add your first one!"
      status={saveStatus}
      itemCount={itemCount}
    >
      <ItemList
        items={items}
        onReorder={reorderByIndex}
        renderItem={(item, index) => (
          <YourItemCard
            item={item}
            onUpdate={update}
            onDelete={remove}
          />
        )}
      />
    </SectionContainer>
  );
}
```

**That's it!** You now have a fully functional section with:
- ✅ Add/Edit/Delete
- ✅ Drag-and-drop reordering
- ✅ Auto-save
- ✅ Empty states
- ✅ Save status

---

## 🎨 Real Example: Testimonials V2

See the complete reference implementation at:
```
app/editor/sections/testimonials-v2/
```

**Files:**
- `types.ts` - 70 lines
- `TestimonialCard.tsx` - 120 lines
- `TestimonialsSection.tsx` - 130 lines
- `index.ts` - 5 lines

**Total: ~325 lines** (vs ~500 lines in old pattern)

---

## 🔧 Core Exports

### **From `@/app/editor/core`:**

```typescript
// Types
import type {
  BaseItem,
  DetailableItem,
  SectionType,
  SaveStatus,
  // ... all types
} from '@/app/editor/core';

// Hooks
import {
  useSectionManager,  // ⭐ Main hook - use this!
  useAutoSave,        // Usually not needed directly
  useImageUpload,     // For image uploads
} from '@/app/editor/core';

// Components
import {
  SectionContainer,   // ⭐ Wrapper for your section
  SectionHeader,      // Usually not needed directly
  SectionEmpty,       // Usually not needed directly
  ItemList,           // ⭐ For rendering list of items
  ItemCard,           // ⭐ Base card component
} from '@/app/editor/core';
```

---

## 🎛️ `useSectionManager` API

### **Options:**

```typescript
const manager = useSectionManager<YourItem>({
  // Required
  initialData: YourItem[],           // Initial items
  
  // Optional
  onSave?: (items) => Promise<void>, // Save callback
  validation?: (item) => ValidationResult, // Validation function
  autoSave?: boolean,                // Enable auto-save (default: true)
  autoSaveDelay?: number,            // Delay in ms (default: 2500)
  localStorageKey?: string,          // Backup to localStorage
  maxItems?: number,                 // Maximum items allowed
});
```

### **Returns:**

```typescript
{
  // State
  items: YourItem[],              // Current items
  errors: Record<string, string[]>, // Validation errors
  hasErrors: boolean,              // Any errors?
  itemCount: number,              // Number of items
  canAddMore: boolean,            // Can add more? (respects maxItems)
  saveStatus: SaveStatus,         // 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null,         // When last saved
  
  // CRUD Operations
  add: (item) => void,            // Add new item
  update: (id, updates) => void,  // Update item
  remove: (id) => void,           // Delete item
  reorder: (id, 'up'|'down') => void,  // Move up/down
  reorderByIndex: (from, to) => void,  // Drag-drop reorder
  
  // Bulk Operations
  bulkUpdate: (updates[]) => void,    // Update multiple
  bulkDelete: (ids[]) => void,        // Delete multiple
  
  // Utilities
  setItems: (items) => void,          // Replace all items
  save: () => Promise<void>,          // Manual save
  validateItem: (item) => ValidationResult, // Validate single item
}
```

---

## 🎨 Component Props

### **SectionContainer**

```typescript
<SectionContainer
  // Header
  title="Your Section"           // Required
  icon="🎯"                      // Optional emoji
  description="Description"      // Optional subtitle
  
  // Actions
  onAdd={() => ...}              // Add button handler
  addLabel="Add Item"            // Button text (default: "Add Item")
  
  // Content
  children={...}                 // Your content (ItemList)
  isEmpty={items.length === 0}   // Show empty state?
  emptyMessage="No items yet"    // Empty state message
  emptyIcon="🎯"                 // Empty state icon
  
  // Status
  status={saveStatus}            // Save status indicator
  itemCount={items.length}       // Show count
  maxItems={10}                  // Show limit
  
  // Styling
  className="custom-class"       // Additional classes
  collapsible={true}             // Make collapsible
  defaultCollapsed={false}       // Start collapsed?
/>
```

### **ItemList**

```typescript
<ItemList
  items={items}                  // Required: your items array
  onReorder={reorderByIndex}     // Required for drag-drop
  renderItem={(item, index) => ( // Required: render function
    <YourCard item={item} />
  )}
  keyExtractor={(item) => item.id}  // Optional (default: item.id)
  className="custom-class"       // Optional
  enableDragDrop={true}          // Optional (default: true)
/>
```

### **ItemCard**

```typescript
<ItemCard
  id={item.id}                   // Required
  
  // Actions
  onEdit={() => ...}             // Edit button
  onDelete={() => ...}           // Delete button
  onOpenDetail={() => ...}       // Detail page button
  onMoveUp={() => ...}           // Move up button
  onMoveDown={() => ...}         // Move down button
  
  // State
  canMoveUp={index > 0}          // Enable move up?
  canMoveDown={index < max}      // Enable move down?
  isDraggable={true}             // Enable drag? (default: true)
  
  // Content
  children={...}                 // Your card content
  
  // Styling
  className="custom-class"       // Additional classes
  actionsPosition="top-right"    // 'top-right' | 'bottom-right' | 'floating'
>
  {/* Your content here */}
</ItemCard>
```

---

## 🖼️ Image Upload Example

```typescript
import { useImageUpload } from '@/app/editor/core';

function YourComponent() {
  const { upload, uploading, progress, error } = useImageUpload();

  const handleFileSelect = async (file: File) => {
    const result = await upload({
      file,
      folder: 'thumbnails',      // 'thumbnails' | 'hero-images' | 'avatars' | 'gallery'
      entityType: 'project',      // Optional: 'project' | 'career' | 'profile'
      entityId: projectId,        // Optional: for organization
    });

    if (result.url) {
      // Success! Use the URL
      onUpdate({ thumbnail: result.url });
    } else {
      // Handle error
      console.error(result.error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <p>Uploading... {progress}%</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
```

---

## 🎓 Best Practices

### **1. Type Safety**
```typescript
// ✅ DO: Extend BaseItem
export interface YourItem extends BaseItem {
  title: string;
}

// ❌ DON'T: Create from scratch
export interface YourItem {
  id: string;
  title: string;
}
```

### **2. Auto-Save**
```typescript
// ✅ DO: Let it auto-save
const manager = useSectionManager({
  autoSave: true,
  autoSaveDelay: 2500,
});

// ❌ DON'T: Save manually on every change
const manager = useSectionManager({ autoSave: false });
onChange(/* every keystroke */); // Too many saves!
```

### **3. Validation**
```typescript
// ✅ DO: Provide validation function
useSectionManager({
  validation: (item) => {
    if (!item.title) return { valid: false, errors: ['Title required'] };
    return { valid: true };
  }
});

// Validation runs automatically on add/update
```

### **4. Component Structure**
```typescript
// ✅ DO: Keep card components separate
sections/your-section/
├── YourSection.tsx      // Main section (uses core)
├── YourItemCard.tsx     // Card UI (custom)
├── types.ts             // Types
└── index.ts             // Exports

// ❌ DON'T: Put everything in one file
sections/your-section.tsx  // 500 lines, hard to maintain
```

---

## 🚀 Next Steps

1. **Study the reference:** Look at `testimonials-v2/` for a complete example
2. **Start simple:** Migrate a simple section first (Strengths, Companies)
3. **Test thoroughly:** Ensure auto-save, reordering, and validation work
4. **Iterate:** Add features as needed

---

## 📚 Additional Resources

- **Architecture Diagram:** See `UNIFIED_ARCHITECTURE_COMPLETE.md`
- **Type Reference:** See `app/editor/core/types/`
- **Component Examples:** See `app/editor/sections/testimonials-v2/`

---

## 💬 Need Help?

- Check existing sections for patterns
- All core files are well-documented with JSDoc comments
- Types provide IntelliSense in your IDE

**Happy coding! 🎉**

