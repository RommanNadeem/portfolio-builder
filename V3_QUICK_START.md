# V3 Template System - Quick Start Guide

## ⚡ Get Started in 5 Minutes

This guide shows you how to integrate the V3 template system into your detail pages.

---

## 1. Import the Hook (10 seconds)

```typescript
import { useEntityDocument } from '@/app/editor/templates/v3';
```

---

## 2. Replace Your Load/Save Logic (2 minutes)

### Before (Old way - ~50 lines):

```typescript
const [projectData, setProjectData] = useState(null);
const [blocks, setBlocks] = useState([]);
const [saveStatus, setSaveStatus] = useState('saved');

// Manual load
useEffect(() => {
  const data = localStorage.getItem('portfolioData');
  const parsed = JSON.parse(data);
  const project = parsed.projects.find(p => p.id === id);
  setProjectData(project);
  setBlocks(project.blocks || []);
}, [id]);

// Manual save
const saveProject = useCallback(() => {
  const data = localStorage.getItem('portfolioData');
  const parsed = JSON.parse(data);
  const index = parsed.projects.findIndex(p => p.id === id);
  
  // Sync hero block to project
  const heroBlock = blocks[0];
  parsed.projects[index] = {
    ...parsed.projects[index],
    title: heroBlock.data.title,
    thumbnail: heroBlock.data.imageUrl,
    blocks: blocks,
  };
  
  localStorage.setItem('portfolioData', JSON.stringify(parsed));
  setSaveStatus('saved');
}, [id, blocks]);

// Auto-save
useEffect(() => {
  const timeout = setTimeout(saveProject, 2500);
  return () => clearTimeout(timeout);
}, [blocks, saveProject]);
```

### After (V3 way - ~15 lines):

```typescript
const {
  document,
  loading,
  error,
  saveStatus,
  updateBlocks,
  initializeTemplate,
  getBlocks,
  getTemplateType,
} = useEntityDocument({
  entityId: projectId,
  entityType: 'project',
  autoSave: true,
  autoSaveDelay: 2500,
});
```

**That's it!** All load, save, and sync logic is handled automatically.

---

## 3. Update Your Component (2 minutes)

```typescript
export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  
  const {
    document,
    loading,
    error,
    saveStatus,
    updateBlocks,
    initializeTemplate,
    getBlocks,
    getTemplateType,
  } = useEntityDocument({
    entityId: projectId,
    entityType: 'project',
    autoSave: true,
  });
  
  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Error state
  if (error || !document) {
    return <ErrorMessage error={error} />;
  }
  
  // Template selector (if no template chosen)
  if (!getTemplateType()) {
    return (
      <TemplateSelector
        onSelect={(template) => initializeTemplate(template)}
      />
    );
  }
  
  // Main editor
  return (
    <BaseTemplateEditor
      entityId={document.id}
      entityData={document.entity_data}
      blocks={getBlocks()}
      onBlocksChange={updateBlocks}
      saveStatus={saveStatus}
      // ... other props
    />
  );
}
```

---

## 4. Test It (1 minute)

1. Go to `/editor`
2. Click "Add New Project"
3. Click "Choose Template"
4. Select a template
5. Edit the hero block
6. Wait 2.5 seconds
7. Go back to `/editor`
8. ✅ Card should show updated data!

---

## 🎉 Done!

You've successfully integrated V3! The system now:

- ✅ Auto-loads entity data
- ✅ Pre-fills template blocks
- ✅ Auto-saves changes
- ✅ Syncs template ↔ entity bidirectionally
- ✅ Handles errors gracefully

---

## 📋 Full Example

Copy this entire component:

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEntityDocument } from '@/app/editor/templates/v3';
import { BaseTemplateEditor } from '@/app/editor/templates/BaseTemplateEditor';
import { TemplateSelector } from '@/app/editor/templates/TemplateSelector';

export default function ProjectEditorV3() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  
  const {
    document,
    loading,
    error,
    saveStatus,
    updateBlocks,
    initializeTemplate,
    getBlocks,
    getTemplateType,
  } = useEntityDocument({
    entityId: projectId,
    entityType: 'project',
    autoSave: true,
    autoSaveDelay: 2500,
    onSaveSuccess: (result) => {
      console.log('✅ Saved:', result);
    },
    onSaveError: (error) => {
      console.error('❌ Save failed:', error);
    },
  });
  
  const blocks = getBlocks();
  const templateType = getTemplateType();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }
  
  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Failed to load project</h2>
          <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => router.push('/editor')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Back to Editor
          </button>
        </div>
      </div>
    );
  }
  
  if (!templateType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => router.push('/editor')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">
                {document.entity_data.title || 'Untitled Project'}
              </h1>
              <p className="text-sm text-gray-500">Choose a template to get started</p>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <TemplateSelector
            onSelect={(template) => initializeTemplate(template)}
            currentTemplate={null}
          />
        </div>
      </div>
    );
  }
  
  return (
    <BaseTemplateEditor
      entityId={document.id}
      entityData={document.entity_data}
      flowState="editing"
      selectedTemplate={templateType as any}
      blocks={blocks}
      expandedSections={new Set([0])}
      savedBlockIds={new Set(blocks.map((b: any) => b.id))}
      viewMode="edit"
      deviceMode="desktop"
      showSlashMenu={false}
      saveStatus={saveStatus === 'saved' ? 'saved' : saveStatus === 'saving' ? 'saving' : 'unsaved'}
      onFlowStateChange={() => {}}
      onTemplateSelect={initializeTemplate}
      onBlocksChange={updateBlocks}
      onBlockChange={(index, block) => {
        const newBlocks = [...blocks];
        newBlocks[index] = block;
        updateBlocks(newBlocks);
      }}
      onBlockDelete={(index) => {
        updateBlocks(blocks.filter((_, i) => i !== index));
      }}
      onBlockAdd={() => {}}
      onToggleSection={() => {}}
      onViewModeChange={() => {}}
      onDeviceModeChange={() => {}}
      onSlashMenuToggle={() => {}}
      onBack={() => router.push('/editor')}
      entityTypeName="Project"
      entityType="project"
      backLabel="Back to Projects"
      breadcrumbs={['Portfolio', 'Projects', document.entity_data.title || 'Untitled']}
    />
  );
}
```

---

## 🔄 For Career Pages

Just change two things:

```typescript
// Change entityType
const { ... } = useEntityDocument({
  entityId: careerId,
  entityType: 'career',  // ← Change this
  autoSave: true,
});

// And entity type name
<BaseTemplateEditor
  entityTypeName="Career"  // ← Change this
  entityType="career"      // ← Change this
  // ...
/>
```

---

## 💡 Tips

### Tip 1: Debug Logging

V3 logs everything to console automatically:

```
[EntityDocumentManager] Loading project with ID: abc123
[EntityDocumentManager] Found project: {...}
[ProjectInitializer] Pre-filling hero block
[EntityDocumentManager] ✅ Saved to localStorage successfully
```

### Tip 2: Save Callbacks

Use callbacks for user feedback:

```typescript
useEntityDocument({
  // ...
  onSaveSuccess: (result) => {
    toast.success('Changes saved!');
  },
  onSaveError: (error) => {
    toast.error(`Save failed: ${error}`);
  },
});
```

### Tip 3: Manual Save

Need to save immediately?

```typescript
const { save } = useEntityDocument({ ... });

// Force save right now
const result = await save();
if (result.success) {
  console.log('Saved!');
}
```

---

## 📚 Next Steps

1. ✅ **Integrated V3?** Great! Try editing and saving.
2. 📖 **Want more details?** Read [`V3_TEMPLATE_SYSTEM_COMPLETE.md`](./V3_TEMPLATE_SYSTEM_COMPLETE.md)
3. 🧪 **Want to test?** See [`V3_TESTING_GUIDE.md`](./V3_TESTING_GUIDE.md)
4. 🎯 **Production ready?** Review [`V3_IMPLEMENTATION_SUMMARY.md`](./V3_IMPLEMENTATION_SUMMARY.md)

---

## ❓ FAQ

**Q: Will this break my existing detail pages?**  
A: No! V3 works alongside V2. Migrate pages one at a time.

**Q: What if entity has no template yet?**  
A: Show `TemplateSelector`, call `initializeTemplate(templateType)` on selection.

**Q: How does auto-save work?**  
A: Debounced 2.5s. Change blocks → wait 2.5s → auto-saves.

**Q: Can I disable auto-save?**  
A: Yes! Set `autoSave: false` and use `save()` manually.

**Q: Where's the data stored?**  
A: localStorage (instant) + Supabase (background).

---

🎉 **You're ready to use V3!** Integration takes ~5 minutes per page.

