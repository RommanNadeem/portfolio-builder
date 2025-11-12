# 📤 Request Schema - Detailed Explanation

## 📋 Complete Request Structure

See **`REQUEST_EXAMPLE.json`** for a real, working example with actual data.

---

## 🔍 Schema Breakdown

### **1. `category` (String)**

```json
"category": "Product Launch"
```

**Options:**
- "Product Launch"
- "Product Design"
- "Engineering/Technical"
- "Marketing Campaign"
- "User Research"
- "Creative/Branding"
- "Startup/Business"
- "Custom: [user's custom text]"

**Purpose:** Helps AI understand project type for better structure design

---

### **2. `available_blocks` (Array of 9 Objects)**

Each block object has 4 fields:

```json
{
  "type": "hero",                    // Block type identifier
  "description": "Project title...", // What this block is for
  "fields": {...},                   // Field specifications
  "ai_instructions": {...}           // Generation guidance (optional)
}
```

#### **2a. `type` (String)**
One of: `hero`, `callout`, `richtext`, `bullets`, `steps`, `feature_grid`, `gallery`, `metrics`, `embed`

#### **2b. `description` (String)**
Human-readable explanation of the block's purpose

#### **2c. `fields` (Object)**
Field specifications in format: `"field_name": "required|optional:type"`

**Examples:**
```json
"fields": {
  "title": "required",
  "subtitle": "optional",
  "meta.role": "optional",
  "meta.stackTags": "optional:array<string>",
  "variant": "optional:enum(info,success,warning,error)"
}
```

**Format explained:**
- `"title": "required"` → Must be filled
- `"subtitle": "optional"` → Can be omitted
- `"meta.role": "optional"` → Nested field (use dot notation)
- `"bullets": "required:array<string>"` → Array type specified
- `"variant": "optional:enum(info,success)"` → Allowed values listed

#### **2d. `ai_instructions` (Object) - OPTIONAL**

```json
"ai_instructions": {
  "generation_guide": "How to generate this block...",
  "field_hints": {
    "title": "Specific guidance for title field",
    "subtitle": "Specific guidance for subtitle field"
  },
  "quality_rules": [
    "Rule 1: Be specific",
    "Rule 2: Use actual data"
  ],
  "extraction_patterns": [
    "Look for: 'X months', 'Q1 2024'",
    "Find: team size mentions"
  ]
}
```

**These guide AI generation but don't appear in response!**

---

### **3. `content` (Object)**

```json
"content": {
  "files": [...],           // Uploaded files (base64)
  "user_notes": "...",      // Additional details from user
  "project_metadata": {...} // Basic project info
}
```

#### **3a. `files` (Array)**

Each file object:
```json
{
  "id": "unique-uuid",
  "name": "document.pdf",
  "type": "application/pdf",
  "size": 2458624,
  "file_data": "base64_encoded_content..."
}
```

**File types:** PDF, Word (.docx), Excel (.xlsx), CSV, PowerPoint (.pptx), Text (.txt, .md)

**`file_data`** is the entire file encoded as base64 string.

#### **3b. `user_notes` (String)**

Free-form text user provides:
```
"Built TaskFlow app. 6 months. 5K users. 40% efficiency..."
```

Can include:
- Metrics
- Timeline
- Team info
- Technologies
- Challenges
- Achievements

#### **3c. `project_metadata` (Object)**

Basic project info already in system:
```json
{
  "title": "TaskFlow App",
  "description": "Team productivity tool",
  "tags": ["SaaS", "Productivity", "Mobile"]
}
```

---

### **4. `generation_options` (Object)**

```json
"generation_options": {
  "tone": "professional",
  "tone_description": "Corporate, polished, business-focused",
  "tone_characteristics": "Formal language, third-person...",
  
  "target_length": "comprehensive",
  "length_details": {
    "reading_time": "8-15 minutes",
    "block_count_range": {"min": 10, "max": 15, "ideal": 12},
    "depth": "In-depth coverage...",
    "word_count_estimate": "1500-2500 words",
    "content_focus": "Full narrative...",
    "block_content_guidance": {
      "richtext_blocks": "250-400 words each",
      "bullets": "6-8 items per list",
      "metrics": "6-8 detailed metrics"
    },
    "best_for": "Complex projects..."
  },
  
  "auto_extract_metrics": true,
  "include_technical_details": false,
  "prefer_variety": true
}
```

#### **Tone Options (6):**
1. `professional` - Corporate, polished
2. `conversational` - Friendly, casual
3. `technical` - Developer-focused
4. `confident` - Bold, assertive
5. `academic` - Formal, research-oriented
6. `storytelling` - Narrative-driven

Each includes `tone_description` and `tone_characteristics`.

#### **Length Options (3):**
1. `brief` - 3-5 min, 5-7 blocks
2. `standard` - 5-8 min, 7-10 blocks
3. `comprehensive` - 8-15 min, 10-15 blocks

Each includes complete `length_details` object with guidance.

---

### **5. `ai_generation_guide` (Object)**

```json
"ai_generation_guide": {
  "writing_quality": [
    "Use actual data - no fabrication",
    "Be specific not generic",
    "Include metrics when available",
    "Match specified tone",
    "Follow length guidelines"
  ],
  "content_extraction": {
    "metrics": "Look for: percentages, dollar amounts...",
    "timeline": "Extract: duration, dates, quarters...",
    "team": "Find: team size, roles...",
    "tech": "Identify: frameworks, languages..."
  },
  "formatting": {
    "titles": "Under 60 chars, capitalize properly",
    "bullets": "One line each, start with verbs",
    "metrics_format": "Include unit: +275%, $38K"
  },
  "quality_checks": {
    "no_hallucination": "If not found, mark [DATA_NEEDED]",
    "no_generic_content": "Avoid vague phrases",
    "specific_over_vague": "Use exact numbers"
  }
}
```

**Purpose:** Global quality standards that apply to all blocks

---

### **6. `metadata` (Object) - OPTIONAL**

```json
"metadata": {
  "frontend_version": "3.0",
  "timestamp": "2024-11-12T18:45:23.456Z",
  "user_id": "user_abc123",
  "request_id": "req_def456"
}
```

For tracking and debugging.

---

## 📊 Size Breakdown

**Typical request:**
- available_blocks: ~30 KB
- files (base64): ~300-500 KB (largest part)
- user_notes: ~1-5 KB
- generation_options: ~3 KB
- ai_generation_guide: ~2 KB
- metadata: ~0.5 KB

**Total: ~340-540 KB**

---

## 🎯 Key Points

### **What Backend Uses:**

1. **category** → Context for structure design
2. **fields** → Know what to return in response
3. **ai_instructions** → How to generate each block
4. **tone info** → Writing style to apply
5. **length_details** → How many blocks, how long each
6. **ai_generation_guide** → Global quality rules
7. **content** → Actual data to work with

### **What Backend Returns:**

```json
{
  "blocks": [
    {
      "type": "hero",
      "id": "generated_id",
      "data": {
        "title": "Generated title",
        "subtitle": "Generated subtitle",
        "meta": {"timeline": "6 months"}
      },
      "confidence": 92,
      "sources": ["project-spec.pdf", "user_notes"]
    }
  ],
  "overall_confidence": 87,
  "structure_info": {...}
}
```

**Notice:** No `ai_instructions`, no `generation_guide` in response - those were just for generation!

---

## 📝 Files Available

1. **`REQUEST_EXAMPLE.json`** - Complete working example
2. **`REQUEST_SCHEMA_EXPLAINED.md`** - This file (detailed explanation)
3. **`BACKEND_NEW_FLOW_REQUIREMENTS.md`** - Implementation guide
4. **`BACKEND_MODEL_FIX.md`** - Pydantic model fixes

---

**Use `REQUEST_EXAMPLE.json` for testing with Postman or curl!** 🚀

