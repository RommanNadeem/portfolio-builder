# 🔍 Backend Endpoint Status

## ⚠️ Current Issue

The frontend is trying to call `/api/generate-custom-case-study` but getting an error. This is expected because **this is the NEW endpoint** that needs to be implemented.

---

## 📊 Endpoint Status

### ✅ **Working Endpoint:**
```
POST /api/generate-case-study (Template-based)
Status: Working ✅
```

### ⏳ **New Endpoint Needed:**
```
POST /api/generate-custom-case-study (AI-designed structure)
Status: Not implemented yet ⏳
```

---

## 🔧 Quick Fix Options

### **Option 1: Use Template-Based for Now** (5 minutes)

Temporarily disable custom structure mode in frontend:

In `app/detail/project-editor/[id]/page.tsx`, change line ~180:

```typescript
// TEMPORARY: Use template-based until custom endpoint ready
const { data: result, error } = await generateCaseStudy({
  template_schema: buildTemplateSchema('product-case-study'),
  // ... map the new request to old format
});
```

---

### **Option 2: Implement New Backend Endpoint** (3-5 hours)

Follow: `BACKEND_NEW_FLOW_REQUIREMENTS.md`

Create new endpoint that accepts enhanced request format.

---

### **Option 3: Fallback Logic** (15 minutes)

Try new endpoint, fall back to old if not available:

```typescript
const handleAIGenerateFromWizard = async (data: AIGenerationData) => {
  try {
    // Try new endpoint first
    const { data: result, error } = await generateCustomCaseStudy({...});
    
    if (error) {
      console.log('New endpoint not available, using template-based fallback');
      // Fall back to template-based
      const fallbackResult = await generateCaseStudy({...});
      // Use fallback result
    }
  } catch (err) {
    // Handle error
  }
};
```

---

## 🎯 What Frontend is Currently Sending

Check browser console for:
```
[Railway API] Request payload size: XXXXX bytes
```

The request includes:
- ✅ category
- ✅ available_blocks (with ai_instructions)
- ✅ enhanced tone info
- ✅ detailed length info
- ✅ ai_generation_guide

**This is correct!** Backend just needs to accept it.

---

## 📋 Backend Developer Checklist

To fix this, backend needs to:

1. **Create new endpoint:**
   ```python
   @app.post("/api/generate-custom-case-study")
   async def generate_custom_case_study(request: GenerateCustomRequest):
       # Implementation
       pass
   ```

2. **Accept new request structure:**
   - category: str
   - enhanced generation_options
   - ai_generation_guide
   - ai_instructions in blocks

3. **Deploy to Railway**

4. **Test endpoint:**
   ```bash
   curl -X POST $BACKEND_URL/api/generate-custom-case-study \
     -H "Content-Type: application/json" \
     -d '{"category": "test", ...}'
   ```

---

## 🐛 Current Error Explained

**Error:** `Failed to fetch`

**Meaning:** One of these:
1. Endpoint doesn't exist (404)
2. CORS error
3. Network issue
4. Backend not responding

**Check:**
```bash
# Is backend running?
curl https://portfoliobuilder-backend-production.up.railway.app/health

# Does new endpoint exist?
curl -X POST https://portfoliobuilder-backend-production.up.railway.app/api/generate-custom-case-study
```

---

## ✅ Verification Steps

### **Step 1: Check Backend Health**
```bash
curl https://portfoliobuilder-backend-production.up.railway.app/health
```
Expected: `{"status": "healthy"}`

### **Step 2: Check Available Endpoints**
```bash
curl https://portfoliobuilder-backend-production.up.railway.app/debug/routes
```
Look for: `/api/generate-custom-case-study`

### **Step 3: Test New Endpoint**
```bash
curl -X POST https://portfoliobuilder-backend-production.up.railway.app/api/generate-custom-case-study \
  -H "Content-Type: application/json" \
  -d '{}'
```

**If 404:** Endpoint not implemented
**If 422:** Endpoint exists! Just validation error (this is good!)
**If 500:** Endpoint exists but has error

---

## 📝 For Backend Developer

**Share this:**

> The new AI flow frontend is complete and trying to call `/api/generate-custom-case-study`. 
> 
> This endpoint needs to be implemented following: `BACKEND_NEW_FLOW_REQUIREMENTS.md`
> 
> Quick reference: `BACKEND_WHATS_NEW.md`
> 
> The old `/api/generate-case-study` endpoint should stay - we need both!

---

## 🚀 When Endpoint is Ready

Once backend implements the new endpoint:

1. Frontend will automatically work
2. Users can generate AI-designed case studies
3. No frontend changes needed

The frontend is **ready and waiting**! 🎯

---

## 💡 Temporary Workaround

If you want to test the UI flow without the backend:

**Mock the API call:**
```typescript
// In lib/railway-api.ts, temporarily add:
export async function generateCustomCaseStudy(request: any) {
  console.log('MOCK: Returning dummy data for testing');
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
  
  return {
    data: {
      blocks: [
        {
          type: 'hero',
          id: 'hero_1',
          data: {
            title: 'Test Project',
            subtitle: 'AI-generated test content'
          },
          confidence: 85,
          sources: []
        }
      ],
      overall_confidence: 85,
      structure_info: {
        total_blocks: 1,
        narrative_flow: 'Test',
        design_rationale: 'This is mock data for testing'
      }
    },
    error: null
  };
}
```

This lets you test the UI flow while backend is being implemented!

---

**Summary:** Backend needs to implement `/api/generate-custom-case-study` endpoint. Frontend is ready! 🚀

