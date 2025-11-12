# ⚠️ Backend Note: Block IDs Must Be Unique

## Issue Found

The backend was generating blocks with duplicate IDs:
```
richtext_1 (appears multiple times)
```

This causes React rendering errors.

---

## ✅ Frontend Fix Applied

I've added frontend protection to ensure unique IDs:

```typescript
// Frontend now regenerates IDs to guarantee uniqueness
const blocksWithUniqueIds = result.blocks.map((block, index) => ({
  ...block,
  id: `${block.type}_${index}_${crypto.randomUUID().slice(0, 8)}`,
}));
```

**This works!** But it's better if backend generates unique IDs correctly.

---

## 🔧 Backend Improvement (Optional)

### **Current backend (problematic):**
```python
blocks = []
richtext_counter = 1

# Creates duplicate IDs if multiple richtext blocks
for section in structure:
    if section['block_type'] == 'richtext':
        block_id = f"richtext_{richtext_counter}"  # ❌ Resets or duplicates
        blocks.append({"type": "richtext", "id": block_id, ...})
```

### **Better approach:**
```python
import uuid

blocks = []

for section in structure:
    # Generate truly unique ID
    block_id = f"{section['block_type']}_{str(uuid.uuid4())[:8]}"
    
    # Or use sequential with global counter
    block_id = f"{section['block_type']}_{len(blocks)}"
    
    blocks.append({
        "type": section['block_type'],
        "id": block_id,  # Guaranteed unique
        "data": {...}
    })
```

### **Best approach:**
```python
import uuid

def generate_unique_block_id(block_type: str, index: int) -> str:
    """Generate unique block ID"""
    unique_suffix = str(uuid.uuid4())[:8]
    return f"{block_type}_{index}_{unique_suffix}"

# Usage
for index, section in enumerate(structure):
    block = {
        "type": section['block_type'],
        "id": generate_unique_block_id(section['block_type'], index),
        "data": {...}
    }
    blocks.append(block)
```

---

## ✅ Current Status

**Frontend:** ✅ Protected against duplicate IDs (works now!)

**Backend:** ⚠️ Should fix ID generation (but not blocking)

---

## 🎯 Priority

**Low priority** - Frontend handles it, but would be cleaner if backend fixed.

**If backend has time:**
- Use `uuid.uuid4()` for unique IDs
- Or use sequential index with block type
- Ensure no two blocks ever have same ID

---

**Not urgent, but good to fix eventually!** 👍

