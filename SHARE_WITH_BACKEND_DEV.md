# 📨 Share This With Backend Developer

## 🎯 Quick Context

We've built an AI case study generation feature. The frontend is complete and currently using the **template-based** endpoint which is working. Now we want to add **AI-designed custom structures** where the AI decides the best case study structure instead of using predefined templates.

---

## 📋 What Backend Needs to Implement

### **New Endpoint:**
```
POST /api/generate-custom-case-study
```

This will complement (not replace) the existing `/api/generate-case-study` endpoint.

---

## 📚 Implementation Guide

**Read this file:** `BACKEND_AI_CUSTOM_STRUCTURE_PROMPT.md`

This contains:
- ✅ Complete request/response schemas
- ✅ Three-stage AI implementation (Analysis → Design → Generate)
- ✅ Full code examples with prompts
- ✅ Testing scenarios
- ✅ Performance targets
- ✅ Cost analysis

**Estimated time:** 3-4 days

---

## 🔑 Key Differences from Current Endpoint

### **Current Endpoint** (`/api/generate-case-study`):
- Receives: Fixed template with predefined sections
- Returns: Content for those exact sections
- Example: Always 8 blocks for "Product Case Study"

### **New Endpoint** (`/api/generate-custom-case-study`):
- Receives: Catalog of 9 available block types
- Returns: Custom structure with 5-15 blocks
- Example: AI designs 11 blocks: Hero → Callout → RichText → Bullets → Steps → FeatureGrid → Metrics → Callout → Bullets → RichText → Bullets

---

## 🧠 Three-Stage Process

### **Stage 1: Content Analysis**
```python
# Analyze what type of project and what content is available
analysis = await analyze_content(files, notes)
# Returns: project_type, content_strengths, available_info
```

### **Stage 2: Structure Design**
```python
# Design optimal block structure
structure = await design_structure(analysis, available_blocks, options)
# Returns: List of blocks to create, narrative flow, rationale
```

### **Stage 3: Content Generation**
```python
# Generate content for the designed structure
content = await generate_content(files, structure, available_blocks)
# Returns: Filled blocks with data
```

---

## 📊 Request Example

```json
{
  "available_blocks": [
    {
      "type": "hero",
      "description": "Project title and introduction",
      "fields": {...},
      "best_for": "Strong opening",
      "usage_guidelines": "Keep title under 60 chars"
    },
    // ... 8 more block types
  ],
  "content": {
    "files": [{...}],
    "user_notes": "Built mobile app, 5K users, 40% efficiency gain",
    "project_metadata": {
      "title": "TaskFlow",
      "tags": ["SaaS", "Productivity"]
    }
  },
  "generation_options": {
    "tone": "professional",
    "target_length": "comprehensive",
    "max_blocks": 15,
    "min_blocks": 10,
    "prefer_variety": true
  }
}
```

## 📤 Response Example

```json
{
  "blocks": [
    {
      "type": "hero",
      "id": "hero_1",
      "data": {...},
      "confidence": 92
    },
    // ... 10 more custom blocks
  ],
  "overall_confidence": 87,
  "structure_info": {
    "total_blocks": 11,
    "narrative_flow": "Context → Problem → Solution → Results",
    "design_rationale": "This structure leverages strong metrics...",
    "estimated_reading_time": "7-9 minutes"
  },
  "suggestions": ["Add screenshots if available"],
  "missing_data": ["No visual assets"]
}
```

---

## ✅ Success Criteria

When implemented correctly:

1. **Endpoint responds** (not 404)
2. **Returns valid JSON** matching response schema
3. **Block count is variable** (5-15 based on content)
4. **Structure makes sense** (logical flow)
5. **Includes structure_info** (narrative flow, rationale)
6. **Processing time** < 50 seconds
7. **Confidence scores** 70%+

---

## 🧪 Quick Test

After implementation, test with:

```bash
curl -X POST https://your-backend.railway.app/api/generate-custom-case-study \
  -H "Content-Type: application/json" \
  -d '{
    "available_blocks": [...],
    "content": {
      "files": [],
      "user_notes": "Built a SaaS product. 10K users. Increased efficiency 40%.",
      "project_metadata": {"title": "Test"}
    },
    "generation_options": {
      "target_length": "standard",
      "max_blocks": 10
    }
  }'
```

**Expected:**
- Returns 7-10 blocks
- Includes structure_info
- No errors

---

## 💡 Implementation Tips

1. **Reuse existing code:**
   - File processing (already done)
   - Content extraction (already done)
   - OpenAI setup (already done)

2. **New code needed:**
   - Content analysis function
   - Structure design function
   - Integration of 3 stages

3. **Testing:**
   - Start with simple content
   - Verify structure makes sense
   - Check all block types can be generated

---

## 🚨 Important Notes

1. **Keep existing endpoint:**
   - `/api/generate-case-study` still needed
   - Both modes should work
   - Don't break what's working!

2. **Structure design is key:**
   - This is the most important stage
   - Good structure = great case study
   - Bad structure = confusing narrative

3. **Cost management:**
   - Consider using GPT-3.5-turbo for analysis
   - Cache structure designs for similar projects
   - Monitor token usage

---

## 📞 Questions?

**Before starting:**
- Review the complete guide: `BACKEND_AI_CUSTOM_STRUCTURE_PROMPT.md`
- Check existing `/api/generate-case-study` implementation
- Understand the three-stage process

**During implementation:**
- Test each stage independently
- Verify structure design outputs make sense
- Check content generation fills blocks correctly

**After implementation:**
- Test with diverse content
- Verify frontend integration works
- Monitor performance and costs

---

## 🎊 Expected Outcome

Once implemented, users will experience:

1. Upload project files
2. AI analyzes → "This is a product launch with strong metrics"
3. AI designs → "I'll create 11 blocks: Hero → Callout → Problem → Solution → Features → Metrics → Reflection"
4. AI generates → Complete custom case study
5. User sees → Perfect structure tailored to their project!

**This makes your AI incredibly intelligent and your product stand out!** ✨

---

## 📂 File to Read

**Primary:** `BACKEND_AI_CUSTOM_STRUCTURE_PROMPT.md`

This has everything needed:
- Request/response specs
- Three-stage implementation
- Complete code examples
- Testing guide
- Performance targets

**Estimated implementation: 3-4 days**

---

**Ready to build the most intelligent case study generator!** 🚀

