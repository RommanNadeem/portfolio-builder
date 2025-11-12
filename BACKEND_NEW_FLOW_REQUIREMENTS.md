# Backend Requirements: New AI Flow Implementation

## 🎯 What Changed from Original Implementation

### **Key Changes:**

1. ✅ **Category field added** - User selects project type
2. ✅ **6 tone options** - Full tone descriptions sent
3. ✅ **Length details expanded** - Complete guidance on content depth
4. ✅ **AI instructions added** - Per-block generation guidance
5. ✅ **Generation guide added** - Global quality standards

---

## 📦 New Request Structure

### **POST /api/generate-custom-case-study**

```json
{
  "category": "Product Launch",
  
  "available_blocks": [
    {
      "type": "hero",
      "description": "Project title and introduction with metadata",
      "fields": {
        "title": "required",
        "subtitle": "optional",
        "description": "optional",
        "meta.role": "optional",
        "meta.timeline": "optional",
        "meta.team": "optional",
        "meta.stackTags": "optional:array<string>"
      },
      "ai_instructions": {
        "generation_guide": "Create compelling hook. Extract project name for title. Use key achievement in subtitle.",
        "field_hints": {
          "title": "Project name - under 60 chars, specific",
          "subtitle": "Impact-focused tagline with metric if available",
          "meta.timeline": "Duration like '6 months', 'Q3 2024'"
        },
        "quality_rules": [
          "Title must be actual project name from content",
          "Subtitle should highlight biggest achievement",
          "Only populate meta if info in content"
        ],
        "extraction_patterns": [
          "Timeline: '6 months', 'Q3 2024', 'Jan-June'",
          "Team: 'team of X', 'X engineers'",
          "Tech: Framework names, languages"
        ]
      }
    },
    {
      "type": "metrics",
      "description": "Quantifiable outcomes and KPIs",
      "fields": {
        "metrics": "required:array<object>",
        "metrics[].label": "required",
        "metrics[].value": "required",
        "metrics[].description": "optional",
        "title": "optional"
      },
      "ai_instructions": {
        "generation_guide": "Extract ALL quantifiable data. Look for percentages, dollar amounts, user counts, performance improvements.",
        "field_hints": {
          "metrics[].label": "Metric name (e.g., 'User Growth', 'Revenue')",
          "metrics[].value": "Number with unit (e.g., '+275%', '$38K', '5,000 users')",
          "metrics[].description": "Context like 'from 1,200 to 4,500 users'"
        },
        "quality_rules": [
          "3-6 metrics (adjust based on target_length)",
          "Use actual numbers - never estimate",
          "Format values: +/- for changes, include units"
        ],
        "extraction_patterns": [
          "Numbers with %: growth metrics",
          "Numbers with $: financial metrics",
          "Before/after comparisons",
          "Words: increased, decreased, improved"
        ]
      }
    }
    // ... all 9 block types
  ],
  
  "content": {
    "files": [
      {
        "id": "abc123",
        "name": "project-spec.pdf",
        "type": "application/pdf",
        "size": 2458624,
        "file_data": "base64_encoded_string..."
      }
    ],
    "user_notes": "Built TaskFlow app. 6 months. 5K users. 40% efficiency gain. React Native + Node.js.",
    "project_metadata": {
      "title": "TaskFlow App",
      "description": "Team productivity tool",
      "tags": ["SaaS", "Productivity"]
    }
  },
  
  "generation_options": {
    "tone": "professional",
    "tone_description": "Corporate, polished, business-focused",
    "tone_characteristics": "Formal language, third-person perspective, business terminology",
    
    "target_length": "comprehensive",
    "length_details": {
      "reading_time": "8-15 minutes",
      "block_count_range": {
        "min": 10,
        "max": 15,
        "ideal": 12
      },
      "depth": "In-depth coverage with comprehensive details, context, and reflection",
      "word_count_estimate": "1500-2500 words",
      "content_focus": "Full narrative - extensive context, detailed problem, comprehensive solution...",
      "block_content_guidance": {
        "richtext_blocks": "250-400 words each",
        "bullets": "6-8 items per list",
        "metrics": "6-8 detailed metrics with context",
        "steps": "5-8 phases with full descriptions",
        "feature_grid": "6-8 items",
        "callouts": "2-3 callouts allowed"
      },
      "best_for": "Complex projects, flagship work, detailed case studies"
    },
    
    "auto_extract_metrics": true,
    "include_technical_details": false,
    "prefer_variety": true
  },
  
  "ai_generation_guide": {
    "writing_quality": [
      "Use actual data from provided content - no fabrication",
      "Be specific and concrete, not generic",
      "Include metrics and numbers whenever available",
      "Match the specified tone and writing style",
      "Follow the length guidelines"
    ],
    "content_extraction": {
      "metrics": "Look for: percentages, dollar amounts, user counts, growth numbers, before/after comparisons",
      "timeline": "Extract: project duration, launch dates, quarters, milestones",
      "team": "Find: team size, roles, composition",
      "tech": "Identify: frameworks, languages, tools, platforms",
      "challenges": "Look for: problems, issues, obstacles",
      "achievements": "Find: improvements, successes, outcomes"
    },
    "formatting": {
      "titles": "Under 60 characters, capitalize properly, no periods",
      "bullets": "One line each (max 100 chars), start with strong verbs",
      "metrics_format": "Include unit: '+275%', '$38K', '5,000 users'",
      "richtext_length": "Adjust based on target_length setting"
    },
    "quality_checks": {
      "no_hallucination": "If data not found, mark as '[DATA_NEEDED]' or omit optional fields",
      "no_generic_content": "Avoid vague phrases",
      "specific_over_vague": "Say 'Increased revenue by 217%' not 'improved revenue'",
      "use_provided_data": "Always prefer extracting from content"
    }
  }
}
```

---

## 📤 Response Structure (UNCHANGED)

```json
{
  "blocks": [
    {
      "type": "hero",
      "id": "hero_1",
      "data": {
        "title": "TaskFlow: Team Productivity Reimagined",
        "subtitle": "40% efficiency gain, 5K users in first month",
        "meta": {
          "timeline": "6 months",
          "role": "Lead Designer"
        }
      },
      "confidence": 92,
      "sources": ["project-spec.pdf", "user_notes"]
    }
    // ... 9-14 more blocks
  ],
  "overall_confidence": 87,
  "structure_info": {
    "total_blocks": 11,
    "narrative_flow": "Context → Problem → Solution → Results",
    "design_rationale": "Structure emphasizes metrics while providing context..."
  },
  "suggestions": ["Consider adding screenshots"],
  "missing_data": ["No visual assets"]
}
```

---

## 🔧 What Backend Needs to Do

### **1. Use Category as Context Hint**

```python
category = request.category  # "Product Launch" or "Custom: Educational Platform"

# Use in prompt:
if "Product" in category:
    focus = "Emphasize product metrics, launch timeline, user growth"
elif "Design" in category:
    focus = "Emphasize design process, user research, iterations"
elif "Engineering" in category:
    focus = "Emphasize technical architecture, performance, scalability"
# etc...
```

---

### **2. Apply Tone Settings**

```python
tone = request.generation_options['tone']
tone_description = request.generation_options['tone_description']
tone_characteristics = request.generation_options['tone_characteristics']

# Use in system prompt:
system_prompt = f"""
You are an expert case study writer.

TONE: {tone} - {tone_description}
CHARACTERISTICS: {tone_characteristics}

Write in this exact tone throughout the case study.
"""
```

**6 Tone Options:**
- `professional` - Corporate, polished, business-focused
- `conversational` - Friendly, approachable, casual
- `technical` - Developer-focused, precise, detailed
- `confident` - Bold, assertive, results-oriented
- `academic` - Formal, research-oriented, analytical
- `storytelling` - Narrative-driven, engaging, journey-focused

---

### **3. Follow Length Guidelines**

```python
length_details = request.generation_options['length_details']

# Use block count range:
min_blocks = length_details['block_count_range']['min']  # 10
max_blocks = length_details['block_count_range']['max']  # 15
ideal_blocks = length_details['block_count_range']['ideal']  # 12

# Use content guidance:
richtext_length = length_details['block_content_guidance']['richtext_blocks']  # "250-400 words each"
bullets_count = length_details['block_content_guidance']['bullets']  # "6-8 items per list"
metrics_count = length_details['block_content_guidance']['metrics']  # "6-8 detailed metrics"

# Include in prompt:
f"""
TARGET LENGTH: {length_details['reading_time']} read
BLOCK COUNT: Create {ideal_blocks} blocks (range: {min_blocks}-{max_blocks})
CONTENT DEPTH: {length_details['depth']}

Per-block guidance:
- RichText blocks: {richtext_length}
- Bullet lists: {bullets_count}
- Metrics: {metrics_count}
"""
```

**3 Length Options:**
- `brief` - 3-5 min, 5-7 blocks, 600-900 words
- `standard` - 5-8 min, 7-10 blocks, 1000-1400 words
- `comprehensive` - 8-15 min, 10-15 blocks, 1500-2500 words

---

### **4. Use AI Instructions Per Block**

```python
for block in request.available_blocks:
    # Each block has its own instructions
    generation_guide = block['ai_instructions']['generation_guide']
    field_hints = block['ai_instructions']['field_hints']
    quality_rules = block['ai_instructions']['quality_rules']
    extraction_patterns = block['ai_instructions'].get('extraction_patterns', [])
    
    # Include in prompt section for this block type
    prompt += f"""
    
Block: {block['type']}
Guide: {generation_guide}
Quality: {', '.join(quality_rules)}
    """
```

---

### **5. Apply Global Generation Guide**

```python
generation_guide = request.ai_generation_guide

# Include in prompt:
f"""
QUALITY STANDARDS:
{chr(10).join('- ' + rule for rule in generation_guide['writing_quality'])}

CONTENT EXTRACTION:
{json.dumps(generation_guide['content_extraction'], indent=2)}

FORMATTING RULES:
{json.dumps(generation_guide['formatting'], indent=2)}

QUALITY CHECKS:
{json.dumps(generation_guide['quality_checks'], indent=2)}
"""
```

---

## 🧠 Updated Prompt Structure

### **Complete Prompt Template:**

```python
def build_ai_prompt(request):
    category = request.category
    content = processed_content['merged_text']
    metrics = processed_content['metrics']
    tone_info = request.generation_options
    length_info = request.generation_options['length_details']
    gen_guide = request.ai_generation_guide
    
    prompt = f"""
You are an expert case study writer.

PROJECT CATEGORY: {category}

CONTENT PROVIDED:
{content[:10000]}

EXTRACTED METRICS:
{json.dumps(metrics[:20], indent=2)}

TONE & STYLE:
- Tone: {tone_info['tone']} - {tone_info['tone_description']}
- Characteristics: {tone_info['tone_characteristics']}
- Write in this exact tone throughout

TARGET LENGTH:
- Reading time: {length_info['reading_time']}
- Block count: {length_info['block_count_range']['ideal']} blocks (range: {length_info['block_count_range']['min']}-{length_info['block_count_range']['max']})
- Depth: {length_info['depth']}
- Word count: {length_info['word_count_estimate']}

BLOCK CONTENT GUIDANCE:
{json.dumps(length_info['block_content_guidance'], indent=2)}

AVAILABLE BLOCKS TO USE:
{format_blocks_with_instructions(request.available_blocks)}

QUALITY STANDARDS:
{format_generation_guide(gen_guide)}

DESIGN THE STRUCTURE:
1. Analyze content and decide which blocks to use
2. Create {length_info['block_count_range']['ideal']} blocks
3. Follow the narrative flow appropriate for {category}
4. Use block-specific instructions for each type
5. Match tone and length requirements

OUTPUT (JSON):
{{
  "blocks": [
    {{
      "type": "hero",
      "id": "generated_id",
      "data": {{...}},
      "confidence": 90,
      "sources": ["file.pdf"]
    }}
  ],
  "overall_confidence": 87,
  "structure_info": {{
    "total_blocks": 11,
    "narrative_flow": "Context → Problem → Solution → Results",
    "design_rationale": "Structure emphasizes...",
    "estimated_reading_time": "7-9 minutes"
  }},
  "suggestions": [...],
  "missing_data": [...]
}}
"""
    return prompt
```

---

## 📋 Implementation Checklist

### **What to Update in Existing Backend:**

- [ ] **1. Accept `category` field**
  ```python
  category: str  # Add to request model
  ```

- [ ] **2. Use expanded tone info**
  ```python
  tone: str
  tone_description: str
  tone_characteristics: str
  ```

- [ ] **3. Use length_details object**
  ```python
  length_details: Dict[str, Any]  # Complete length guidance
  ```

- [ ] **4. Parse ai_instructions from blocks**
  ```python
  for block in available_blocks:
      if 'ai_instructions' in block:
          use_in_prompt(block['ai_instructions'])
  ```

- [ ] **5. Include ai_generation_guide**
  ```python
  ai_generation_guide: Dict[str, Any]  # Global quality standards
  ```

---

## 🎯 Key Changes Summary

| Field | Old | New |
|-------|-----|-----|
| **Category** | ❌ Not sent | ✅ "Product Launch" or custom |
| **Tone** | Simple string | Full description + characteristics |
| **Length** | Simple string | Complete details object |
| **Block specs** | Just fields | Fields + AI instructions |
| **Quality guide** | ❌ Not sent | ✅ Complete generation guide |

---

## 💡 How to Use New Fields

### **Category:**
```python
# Tailor structure to category
if category == "Product Launch":
    emphasize = ["metrics", "timeline", "growth"]
elif category == "Product Design":
    emphasize = ["process", "research", "iterations"]
```

### **Tone:**
```python
# Apply to system prompt
system_prompt = f"Write in {tone} style: {tone_description}"
```

### **Length Details:**
```python
# Control block count
target_blocks = length_details['block_count_range']['ideal']

# Control word counts
richtext_words = extract_word_count(length_details['block_content_guidance']['richtext_blocks'])
# "250-400 words" → 250-400
```

### **AI Instructions:**
```python
# Per-block guidance
for block in blocks_to_create:
    instructions = find_block_instructions(block['type'])
    apply_to_generation(instructions)
```

### **Generation Guide:**
```python
# Global quality control
quality_standards = ai_generation_guide['writing_quality']
extraction_rules = ai_generation_guide['content_extraction']
formatting_rules = ai_generation_guide['formatting']
```

---

## ✅ Testing

### **Test Request:**

```python
{
  "category": "Product Launch",
  "available_blocks": [...],  # 9 blocks with instructions
  "content": {
    "files": [],
    "user_notes": "Built SaaS app. 10K users. 40% efficiency. 6 months."
  },
  "generation_options": {
    "tone": "professional",
    "tone_description": "Corporate, polished",
    "tone_characteristics": "Formal language, business terminology",
    "target_length": "standard",
    "length_details": {
      "reading_time": "5-8 minutes",
      "block_count_range": {"min": 7, "max": 10, "ideal": 8},
      "block_content_guidance": {
        "richtext_blocks": "200-300 words each",
        "bullets": "4-6 items per list"
      }
    }
  },
  "ai_generation_guide": {...}
}
```

**Expected:**
- Creates 8 blocks (ideal for standard length)
- Professional tone throughout
- Each richtext ~200-300 words
- Metrics section with 4-6 metrics

---

## 🚀 Benefits of New Structure

### **For AI Quality:**
✅ Better context (category hints)
✅ Precise tone control (full descriptions)
✅ Accurate length (detailed guidance)
✅ Per-block quality rules
✅ Extraction patterns improve accuracy

### **For Consistency:**
✅ Same structure every time
✅ Predictable word counts
✅ Reliable block counts
✅ Consistent tone application

### **For Debugging:**
✅ Clear instructions to review
✅ Know what AI was told to do
✅ Can tweak individual block instructions
✅ Separate concerns (instructions vs response)

---

## ⚠️ Important Notes

1. **Instructions don't appear in response**
   - Only `fields` data is returned
   - `ai_instructions` guide generation only

2. **All existing fields still work**
   - Backward compatible
   - Just enhanced with more context

3. **Field format:** `"field_name": "required|optional:type"`
   - Parse to determine if required
   - Extract type/enum values if specified

4. **Tone must match exactly**
   - "professional" → formal business language
   - "storytelling" → narrative, journey-focused

5. **Length is strict**
   - Respect block count ranges
   - Follow word count guidance
   - Match reading time target

---

## 🎊 Summary

**Updated Request Adds:**
1. `category` - Project type hint
2. `tone_description` + `tone_characteristics` - Full tone guidance
3. `length_details` - Complete length specification
4. `ai_instructions` per block - Generation rules
5. `ai_generation_guide` - Global quality standards

**Response Stays Same:**
- Just blocks with data
- Confidence scores
- Structure info
- Suggestions

**Backend should:**
- Use category for context
- Apply tone throughout
- Follow length guidelines precisely
- Use AI instructions for quality
- Respect generation guide standards

---

**This provides AI with everything it needs to create perfect case studies!** ✨

