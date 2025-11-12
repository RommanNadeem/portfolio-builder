# 🔔 Backend Updates Required - New AI Flow

## 📋 Quick Summary

The frontend has been updated with a better AI flow. **5 new fields** have been added to the request. Here's what changed and what you need to update.

---

## 🆕 New Fields in Request

### **1. `category` (string)**
```json
"category": "Product Launch"
// or
"category": "Custom: Educational Platform"
```

**What to do:**
- Use as context hint in prompts
- Helps AI understand project type
- Example: If "Product", emphasize metrics and growth

---

### **2. Enhanced Tone Info**

**Old:**
```json
"tone": "professional"
```

**New:**
```json
"tone": "professional",
"tone_description": "Corporate, polished, business-focused",
"tone_characteristics": "Formal language, third-person perspective, business terminology"
```

**What to do:**
- Use full description in system prompt
- Apply characteristics to writing style
- 6 options now: professional, conversational, technical, confident, academic, storytelling

---

### **3. Expanded Length Details**

**Old:**
```json
"target_length": "comprehensive"
```

**New:**
```json
"target_length": "comprehensive",
"length_details": {
  "reading_time": "8-15 minutes",
  "block_count_range": {"min": 10, "max": 15, "ideal": 12},
  "depth": "In-depth coverage with comprehensive details...",
  "word_count_estimate": "1500-2500 words",
  "block_content_guidance": {
    "richtext_blocks": "250-400 words each",
    "bullets": "6-8 items per list",
    "metrics": "6-8 detailed metrics"
  },
  "best_for": "Complex projects, flagship work"
}
```

**What to do:**
- Create exactly `ideal` number of blocks (12 for comprehensive)
- Follow word count guidance per block type
- Adjust depth based on `depth` field

---

### **4. AI Instructions Per Block**

**New in each block:**
```json
{
  "type": "hero",
  "fields": {...},
  "ai_instructions": {
    "generation_guide": "Create compelling hook. Extract project name...",
    "field_hints": {
      "title": "Project name - under 60 chars",
      "subtitle": "Impact-focused with metric if available"
    },
    "quality_rules": [
      "Title must be actual project name",
      "Only populate meta if info in content"
    ],
    "extraction_patterns": [
      "Timeline: '6 months', 'Q3 2024'",
      "Team: 'team of X', 'X engineers'"
    ]
  }
}
```

**What to do:**
- Read `generation_guide` for overall approach
- Use `field_hints` for each field
- Follow `quality_rules` strictly
- Use `extraction_patterns` to find data

---

### **5. Global Generation Guide**

**New top-level field:**
```json
"ai_generation_guide": {
  "writing_quality": [
    "Use actual data - no fabrication",
    "Be specific not generic",
    "Include metrics when available"
  ],
  "content_extraction": {
    "metrics": "Look for: percentages, dollar amounts...",
    "timeline": "Extract: duration, dates, quarters...",
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

**What to do:**
- Include in master prompt
- Apply quality standards globally
- Use extraction rules
- Follow formatting guidelines

---

## 🔧 Code Changes Needed

### **Update 1: Request Model**

```python
class GenerateCaseStudyRequest(BaseModel):
    category: str  # ADD THIS
    available_blocks: List[BlockCatalogItem]
    # ... existing fields
    
class GenerationOptions(BaseModel):
    tone: str
    tone_description: str  # ADD THIS
    tone_characteristics: str  # ADD THIS
    target_length: str
    length_details: Dict[str, Any]  # ADD THIS (was simpler before)
    # ... existing fields

# ADD THIS
class AIGenerationGuide(BaseModel):
    writing_quality: List[str]
    content_extraction: Dict[str, str]
    formatting: Dict[str, str]
    quality_checks: Dict[str, str]

# UPDATE REQUEST TO INCLUDE
class GenerateCaseStudyRequest(BaseModel):
    # ... existing
    ai_generation_guide: AIGenerationGuide  # ADD THIS
```

---

### **Update 2: Prompt Building**

```python
def build_prompt(request):
    prompt = f"""
You are an expert case study writer.

PROJECT CATEGORY: {request.category}  # NEW

TONE: {request.generation_options.tone} - {request.generation_options.tone_description}  # ENHANCED
STYLE: {request.generation_options.tone_characteristics}  # NEW

TARGET LENGTH:  # ENHANCED
- Reading time: {request.generation_options.length_details['reading_time']}
- Block count: {request.generation_options.length_details['block_count_range']['ideal']} blocks
- Word count: {request.generation_options.length_details['word_count_estimate']}

CONTENT:
{content}

AVAILABLE BLOCKS:
{format_blocks_with_instructions(request.available_blocks)}  # NOW INCLUDES AI_INSTRUCTIONS

QUALITY STANDARDS:  # NEW
{format_generation_guide(request.ai_generation_guide)}

OUTPUT (JSON):
...
"""
    return prompt
```

---

### **Update 3: Use Block Instructions**

```python
def format_blocks_with_instructions(blocks):
    result = []
    for block in blocks:
        block_info = f"""
Type: {block['type']}
Fields: {block['fields']}

INSTRUCTIONS:  # NEW
{block['ai_instructions']['generation_guide']}

Field Hints:  # NEW
{json.dumps(block['ai_instructions']['field_hints'], indent=2)}

Quality Rules:  # NEW
{', '.join(block['ai_instructions']['quality_rules'])}
        """
        result.append(block_info)
    return '\n\n'.join(result)
```

---

## ✅ Testing

### **Test 1: Verify New Fields Accepted**

Send test request with:
```json
{
  "category": "Test",
  "generation_options": {
    "tone_description": "test",
    "tone_characteristics": "test",
    "length_details": {...}
  },
  "ai_generation_guide": {...}
}
```

Expected: No validation errors

---

### **Test 2: Verify Tone Applied**

Generate with tone="storytelling"

Expected response should have:
- Narrative flow
- Personal journey language
- Engaging, story-driven content

---

### **Test 3: Verify Length Respected**

Generate with target_length="brief"

Expected response:
- 5-7 blocks only (not 10-15)
- Shorter content per block
- Concise, focused

---

## 📊 What Stays the Same

✅ **Response structure** - Unchanged
✅ **File processing** - Same as before
✅ **OpenAI integration** - Same API calls
✅ **Content extraction** - Same logic

**You're just enhancing the prompts with more context!**

---

## ⚡ Quick Implementation

### **Minimal Changes:**

1. Add 5 new fields to Pydantic model (5 min)
2. Update prompt building to include them (15 min)
3. Test with new request format (10 min)

**Total: ~30 minutes for basic integration**

### **Full Implementation:**

1. Use category to customize structure (30 min)
2. Apply tone characteristics precisely (30 min)
3. Respect length guidelines fully (30 min)
4. Parse and use AI instructions (45 min)
5. Apply generation guide (30 min)

**Total: ~2.5 hours for complete integration**

---

## 🎯 Critical Points

### **Must Do:**
1. ✅ Accept new fields without breaking
2. ✅ Include in prompts
3. ✅ Don't return ai_instructions in response

### **Should Do:**
1. ✅ Use category for better context
2. ✅ Apply tone descriptions
3. ✅ Follow length guidance precisely

### **Nice to Have:**
1. ✅ Parse extraction_patterns for smarter extraction
2. ✅ Use quality_rules for validation
3. ✅ Apply field_hints for better field generation

---

## 📞 Questions?

**Check:** `BACKEND_NEW_FLOW_REQUIREMENTS.md` for:
- Complete request example
- Full prompt template
- Implementation details
- Testing scenarios

---

## 🎊 Impact

**These updates make AI generation:**
- 🎯 More accurate (category context)
- 🎨 Better styled (precise tone)
- 📏 Right length (detailed guidance)
- ✨ Higher quality (instructions + guide)

**All with minimal backend changes!**

---

**TL;DR:** 
- 5 new fields in request
- Use them in prompts
- Response stays same
- ~30 min to 2.5 hours implementation
- Huge quality improvement!

---

**File to read:** `BACKEND_NEW_FLOW_REQUIREMENTS.md` 📚

