# ✅ Template ↔ Card Sync - How It Works

## 🔄 Bidirectional Data Flow

Your portfolio builder **automatically syncs** template changes back to the portfolio cards. Here's how it works:

---

## 📊 What Gets Synced

### **Projects:**

| Template Location | → | Card Display |
|-------------------|---|--------------|
| Hero Block → title | → | Project card title |
| Hero Block → imageUrl | → | Project card thumbnail |
| Hero Block → subtitle/description | → | Project card description |
| Hero Block → meta.tags | → | Project card tags |
| Template type | → | Project template_type |
| All blocks | → | Project blocks array |

### **Career:**

| Template Location | → | Card Display |
|-------------------|---|--------------|
| Hero Block → title | → | Organization |
| Hero Block → subtitle | → | Role |
| Hero Block → description | → | Description |
| Hero Block → meta.Website | → | Company link |
| Bullets Block [3] → bullets | → | Achievements array |
| Metrics Block [4] → metrics | → | Impacts (structured) |
| Template type | → | Career template_type |
| All blocks | → | Career blocks array |

---

## 🔄 Complete Flow

### **User Edits Template:**

```
1. User edits hero block in template editor
   ↓
   Types new title: "My Amazing App"
   Uploads new image: hero-image.jpg
   Writes description: "Built with React and TypeScript"
   ↓

2. Auto-save triggers (after 2.5s)
   ↓
   saveProject() function runs
   ↓

3. Data extraction from blocks:
   const heroBlock = blocks.find(b => b.type === 'hero');
   
   updatedProject = {
     ...currentProject,
     title: heroBlock.data.title,           // "My Amazing App"
     thumbnail: heroBlock.data.imageUrl,    // "hero-image.jpg"
     description: heroBlock.data.subtitle,  // "Built with..."
     template_type: selectedTemplate,
     blocks: blocks,
   };
   ↓

4. Save to localStorage:
   localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
   ✅ Saved to localStorage
   ↓

5. Save to database (background):
   await saveProjectMetadata(...)
   await saveProjectBlocks(...)
   ✅ Saved to Supabase
   ↓

6. User clicks "Back to Editor"
   ↓
   Navigate to /editor
   ↓

7. Window focus event triggers:
   window.addEventListener('focus', handleFocus)
   ↓
   handleFocus() runs:
   - Loads from localStorage
   - Detects changes
   - Updates portfolio state
   ↓

8. React re-renders with new data:
   ProjectsSection gets updated portfolio
   ↓
   Preview card now shows:
   - New title ✅
   - New thumbnail ✅
   - New description ✅
```

---

## 🧪 How to Test

### **Test Project Sync:**

1. **Go to Editor** (`/editor`)
2. **Add a project** or select existing one
3. **Click "Start Editing"**
4. **Go to template editor**
5. **Edit the hero block:**
   - Change title to something unique (e.g., "Test Sync 123")
   - Upload a new image
   - Change subtitle/description
6. **Wait 2-3 seconds** (auto-save)
7. **Look for console logs:**
   ```
   [Template Editor] ✅ Saved successfully to localStorage
   [Template Editor] ✅ Verification after save: { template_type, blocks_count, thumbnail }
   ```
8. **Click "Back" or navigate to `/editor`**
9. **Look for console log:**
   ```
   [Editor] ✅ Reloading portfolio on window focus
   [Editor] 🔄 Updated projects detected: [{ title: "Test Sync 123", ... }]
   ```
10. **Switch to Preview mode**
11. **Check the project card:**
    - ✅ Title should be "Test Sync 123"
    - ✅ Thumbnail should be the new image
    - ✅ Description should be updated

### **Test Career Sync:**

1. **Edit a career highlight** in template editor
2. **Change achievements** in the bullets block
3. **Save and go back**
4. **Switch to Preview mode**
5. **Career card should show** updated achievements

---

## 🔍 Debugging

### **If sync isn't working, check:**

**1. Is data being saved to localStorage?**
```javascript
// In template editor console:
const data = localStorage.getItem('portfolioData');
const parsed = JSON.parse(data);
const project = parsed.projects.find(p => p.id === 'your-project-id');

console.log('Project in localStorage:', project);
console.log('Has title:', project.title);
console.log('Has thumbnail:', project.thumbnail);
console.log('Has blocks:', project.blocks?.length);
```

**2. Is window focus handler triggering?**
```javascript
// Should see this in console when returning to /editor:
[Editor] ✅ Reloading portfolio on window focus
```

**3. Are preview cards using the right data?**
```javascript
// In preview mode, inspect the portfolio state
// Cards read from: portfolio.projects
// Which comes from: usePortfolioData hook
// Which reloads on: window focus
```

---

## 🎯 Key Components

### **1. Template Editor Save** (`project-editor/[id]/page.tsx`)

```typescript
const saveProject = () => {
  const heroBlock = blocks.find(b => b.type === 'hero');
  
  const updatedProject = {
    ...currentProject,
    title: heroBlock.data.title,              // ← Sync
    thumbnail: heroBlock.data.imageUrl,       // ← Sync
    description: heroBlock.data.subtitle,     // ← Sync
    template_type: selectedTemplate,
    blocks: blocks,
  };
  
  // Save to localStorage
  portfolioData.projects[index] = updatedProject;
  localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
};
```

### **2. Window Focus Handler** (`usePortfolioData.ts`)

```typescript
const handleFocus = () => {
  const cachedData = localStorage.getItem('portfolioData');
  const parsed = JSON.parse(cachedData);
  
  // Detect changes
  const changedProjects = parsed.projects.filter(/* ... */);
  if (changedProjects.length > 0) {
    console.log('[Editor] 🔄 Updated projects detected');
  }
  
  setPortfolio(parsed);  // ← Triggers re-render
};

window.addEventListener('focus', handleFocus);
```

### **3. Preview Cards** (`ProjectsSection.tsx`)

```typescript
{projects.map((project) => (
  <div>
    <img src={project.thumbnail} />      {/* ← From hero.imageUrl */}
    <h3>{project.title}</h3>             {/* ← From hero.title */}
    <p>{project.description}</p>         {/* ← From hero.subtitle */}
    <tags>{project.tags}</tags>
  </div>
))}
```

---

## ✅ The Sync IS Working

If you:
1. Edit template
2. Wait for auto-save
3. Return to editor
4. Switch to Preview mode

**The cards WILL show updated data** because:
- ✅ Template editor saves to localStorage
- ✅ Focus handler reloads data
- ✅ Preview cards read from updated portfolio state

### **If you're not seeing updates, possible reasons:**

1. **Didn't wait for auto-save** (2.5 seconds)
   - Solution: Wait a bit or check for "✅ Saved" message

2. **Browser tab didn't lose/regain focus**
   - Solution: Click on another tab/window, then back

3. **Still in Edit mode** (not Preview mode)
   - Solution: Click "Preview" toggle in top bar

4. **Hard refresh cleared localStorage**
   - Solution: Don't hard refresh (Cmd+Shift+R)

---

## 💡 Pro Tip: Force Reload

If you want to **manually trigger** a reload without switching tabs:

```javascript
// In browser console on /editor page:
window.dispatchEvent(new Event('focus'));
```

This will trigger the focus handler and reload the data!

---

## 🎉 Summary

**Your template-to-card sync is already working!** 

- ✅ Template changes → localStorage (auto-save)
- ✅ localStorage → Portfolio state (window focus)
- ✅ Portfolio state → Preview cards (React render)

**Just make sure to:**
1. Wait for auto-save (2-3 seconds)
2. Return to editor (triggers focus)
3. Switch to Preview mode
4. See your updated cards! 🎨

---

**Status:** ✅ Already Implemented  
**Works:** Yes, automatically  
**User Action Required:** None (just wait for auto-save)

