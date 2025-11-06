# Detail Page Database Setup

## 🎯 Purpose
The detail page allows users to add rich, Notion-style content blocks to their projects. This requires a `blocks` column in the `projects` table.

---

## 📊 Database Migration Required

### Step 1: Add `blocks` Column to Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run the SQL in `ADD_BLOCKS_COLUMN.sql`:

```sql
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS blocks jsonb DEFAULT '[]'::jsonb;
```

### Step 2: Verify Column Was Added

Run this query to check:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'blocks';
```

You should see:
```
column_name | data_type
blocks      | jsonb
```

---

## 📦 What Gets Saved in `blocks`

Each block is a JSON object with this structure:

```typescript
{
  id: string;           // Unique block ID
  type: BlockType;      // h1, h2, h3, text, image, image-grid, video, embed
  content: string;      // Block text content
  metadata?: {
    url?: string;               // For images, videos, files
    fileType?: string;          // pdf, csv, video, figma
    images?: string[];          // For image grids
    gridLayout?: '1x2' | '1x3' | '2x3';  // Grid layout preference
  }
}
```

### Example:
```json
[
  {
    "id": "abc123",
    "type": "h1",
    "content": "Project Overview"
  },
  {
    "id": "def456",
    "type": "text",
    "content": "This project was built to solve..."
  },
  {
    "id": "ghi789",
    "type": "image",
    "content": "",
    "metadata": {
      "url": "data:image/jpeg;base64,..."
    }
  },
  {
    "id": "jkl012",
    "type": "image-grid",
    "content": "",
    "metadata": {
      "images": ["url1", "url2", "url3"],
      "gridLayout": "1x3"
    }
  }
]
```

---

## ✅ Code Changes Already Made

### 1. Database Save Function (`lib/database.ts`)
```typescript
await supabase.from('projects').upsert({
  // ... other fields ...
  blocks: p.blocks || [], // ✅ Now saves blocks
})
```

### 2. Data Loader (`lib/database.ts`)
```typescript
projects: portfolioData.projects.map(p => ({
  // ... other fields ...
  blocks: p.blocks || [] // ✅ Now loads blocks
}))
```

### 3. Detail Page Save Functions
- ✅ `updateProjectData()` - Saves to localStorage + DB
- ✅ `saveBlocks()` - Saves blocks to localStorage + DB
- ✅ Graceful error handling - works offline

---

## 🔄 Data Flow

```
Detail Page Edit
    ↓
localStorage (instant)
    ↓
Supabase `projects.blocks` (background)
    ↓
Loads in editor on refresh
```

---

## 🧪 Testing

After adding the column:

1. **Edit a project** in the main editor
2. **Click "Edit"** to open detail page
3. **Add content blocks** (headings, text, images)
4. **Check localStorage**: `portfolioData.projects[0].blocks`
5. **Check Supabase**: Query `projects` table, look at `blocks` column
6. **Refresh page** - content should persist

---

## ⚠️ Important Notes

- The `blocks` column uses **JSONB** type for efficient storage and querying
- Default value is `[]` (empty array)
- The column is **nullable** and will be created if it doesn't exist
- Old projects without blocks will default to empty array

---

## 🚀 Next Steps

1. Run the SQL migration in Supabase
2. Test creating a project with detail page content
3. Verify data persists after refresh
4. Check that data syncs between localStorage and database

---

**Migration file**: `ADD_BLOCKS_COLUMN.sql`

