# 🔍 Backend AI Generation - Verification Checklist

## Backend URL Configuration

**Current Backend URL**: `https://portfoliobuilder-backend-production.up.railway.app`

Verify this is correct in your `.env.local`:
```bash
NEXT_PUBLIC_RAILWAY_BACKEND_URL=https://portfoliobuilder-backend-production.up.railway.app
```

---

## ✅ Step-by-Step Verification

### 1. Health Check Test

**Test backend is running:**

```bash
# Terminal
curl https://portfoliobuilder-backend-production.up.railway.app/health

# Expected Response:
{"status":"healthy"}
```

**Browser Test:**
Open: `https://portfoliobuilder-backend-production.up.railway.app/health`

✅ **Pass if**: Returns `{"status":"healthy"}`
❌ **Fail if**: 404, 502, or connection refused

---

### 2. API Endpoint Test

**Test the case study generation endpoint exists:**

```bash
curl -X POST https://portfoliobuilder-backend-production.up.railway.app/api/generate-case-study \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

✅ **Pass if**: Returns validation error (means endpoint exists)
❌ **Fail if**: 404 error (endpoint not found)

---

### 3. Frontend Integration Test

**Test from the actual UI:**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Create a test project:**
   - Go to `/editor`
   - Create a new project
   - Give it a title: "Test AI Generation"

3. **Select a template:**
   - Choose "Product Case Study"
   - You should see the AI prompt screen

4. **Try AI Generation:**
   - Click "Generate with AI"
   - Upload a test file (PDF, Word doc, or just type in notes)
   - Click "Generate Case Study"

**Expected Flow:**
```
Upload Modal → Processing (20-40 sec) → Preview Modal → Accept → Editor
```

---

### 4. Detailed Verification Tests

#### Test A: Simple Text Generation

**Upload a text file or just use notes:**

```
Notes:
Built a mobile app called "TaskFlow" for team productivity.
- Launched in 6 months
- Increased team efficiency by 40%
- 5,000 users in first month
- Built with React Native, Node.js, PostgreSQL
- Led a team of 5 engineers
```

**Expected Result:**
- ✅ Hero block with title "TaskFlow"
- ✅ Metrics showing "40% efficiency increase", "5,000 users"
- ✅ Tech stack in meta fields
- ✅ Confidence score 70%+

---

#### Test B: PDF Processing

**Upload a PDF with project information**

**Expected Result:**
- ✅ Text extracted from PDF
- ✅ Content mapped to template sections
- ✅ Source attribution shows "filename.pdf"

---

#### Test C: Excel Metrics

**Upload an Excel with metrics:**

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Users | 1,200 | 4,500 | +275% |
| Revenue | $12k | $38k | +217% |

**Expected Result:**
- ✅ Metrics block populated with extracted data
- ✅ Percentage changes calculated
- ✅ Confidence score 90%+

---

### 5. Error Handling Tests

#### Test D: Empty Request
- Try generating without files or notes
- ✅ Should show error: "Please upload files or add notes"

#### Test E: Large File
- Upload file > 10MB
- ✅ Should show error: "File too large (max 10MB)"

#### Test F: Unsupported File
- Upload .zip or .exe file
- ✅ Should show error: "Unsupported file type"

---

### 6. Response Validation

**Check the backend response structure:**

When generation succeeds, verify in browser DevTools (Network tab):

```json
{
  "blocks": [
    {
      "type": "hero",
      "id": "hero",
      "data": {
        "title": "...",
        "subtitle": "...",
        "meta": {...}
      },
      "confidence": 85,
      "sources": ["file.pdf", "user_notes"]
    }
  ],
  "overall_confidence": 85,
  "suggestions": ["..."],
  "missing_data": ["..."],
  "processing_time_ms": 25340
}
```

**Verify:**
- ✅ `blocks` array matches template sections count
- ✅ Each block has `type`, `id`, `data`, `confidence`
- ✅ `data` object has expected fields from schema
- ✅ `overall_confidence` is 0-100
- ✅ `processing_time_ms` is present

---

### 7. CORS Verification

**Check browser console for CORS errors:**

Open DevTools → Console

❌ **If you see:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Backend needs to add:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

✅ **Pass if**: No CORS errors in console

---

### 8. Performance Tests

**Verify reasonable performance:**

| Metric | Expected | Acceptable |
|--------|----------|------------|
| **Processing Time** | 20-30 sec | < 45 sec |
| **Confidence Score** | 80-90% | > 70% |
| **Success Rate** | 95%+ | > 90% |

**Test with different file sizes:**
- Small (< 1MB): Should be ~15-25 sec
- Medium (1-5MB): Should be ~25-35 sec
- Large (5-10MB): Should be ~35-45 sec

---

### 9. Content Quality Check

**Manual review of generated content:**

- ✅ **Relevance**: Content matches uploaded files
- ✅ **Completeness**: Most sections filled appropriately
- ✅ **Accuracy**: No hallucinated facts
- ✅ **Tone**: Matches selected option (professional/casual/technical)
- ✅ **Structure**: Proper formatting, no broken text

---

### 10. Edge Cases

#### Test G: Multiple Files
- Upload 3-5 files of different types
- ✅ Content from all files merged properly
- ✅ No duplicate information

#### Test H: No Metrics Available
- Upload files with no numbers/metrics
- ✅ Should suggest adding metrics in `missing_data`
- ✅ Metrics blocks should show "[DATA_NEEDED]" or be minimal

#### Test I: Different Templates
- Test with different templates:
  - Product Case Study
  - Engineering Project
  - Design Case Study
- ✅ Each generates appropriate sections
- ✅ Content style matches template type

---

## 🚨 Common Issues & Fixes

### Issue 1: "Failed to generate case study"
**Check:**
- Backend logs for errors
- OpenAI API key is set
- OpenAI account has credits
- Request payload is valid JSON

### Issue 2: Empty or Invalid Blocks
**Check:**
- Backend is using `response_format={"type": "json_object"}`
- Prompt includes template schema correctly
- Validation logic is working

### Issue 3: Slow Generation (> 60 sec)
**Check:**
- File sizes (reduce if > 5MB)
- OpenAI model (use gpt-4-turbo-preview, not gpt-4)
- Backend timeout settings

### Issue 4: Low Confidence Scores (< 50%)
**Check:**
- Uploaded files have relevant content
- Prompt building includes all necessary context
- Template schema is being sent correctly

### Issue 5: CORS Errors
**Check:**
- Backend has CORS middleware configured
- `allow_origins` includes frontend URL
- Railway deployment has environment variables

---

## 📊 Backend Logs to Check

**On Railway dashboard, check logs for:**

✅ **Good logs:**
```
INFO: Processing 3 files...
INFO: Extracted 2,340 tokens from files
INFO: Calling OpenAI API...
INFO: Generation successful, confidence: 85%
INFO: Response sent in 28,450ms
```

❌ **Bad logs:**
```
ERROR: OpenAI API key not found
ERROR: Invalid JSON in response
ERROR: File processing failed: ...
```

---

## ✅ Final Verification Checklist

Complete this checklist:

### Backend Setup
- [ ] Backend deployed to Railway
- [ ] Environment variable `OPENAI_API_KEY` is set
- [ ] Health endpoint returns 200
- [ ] CORS is configured properly

### API Endpoint
- [ ] `/api/generate-case-study` endpoint exists
- [ ] Accepts POST requests
- [ ] Returns proper JSON structure
- [ ] Error handling works

### File Processing
- [ ] PDF text extraction works
- [ ] Word document parsing works
- [ ] Excel metric detection works
- [ ] Multiple files merge correctly

### AI Generation
- [ ] OpenAI API calls succeed
- [ ] Generated content matches template schema
- [ ] Confidence scores are reasonable
- [ ] Processing time is acceptable

### Frontend Integration
- [ ] Upload modal works
- [ ] Processing modal shows progress
- [ ] Preview modal displays content
- [ ] Accept button updates editor
- [ ] Auto-save works after accepting

### Error Handling
- [ ] File size limits enforced
- [ ] Unsupported files rejected
- [ ] Network errors shown to user
- [ ] Timeout errors handled gracefully

### Quality
- [ ] Generated content is relevant
- [ ] No hallucinated information
- [ ] Metrics extracted correctly
- [ ] Proper formatting maintained

---

## 🎯 Success Criteria

**Backend is verified if:**

✅ All 10 tests pass
✅ Health check returns 200
✅ End-to-end flow works without errors
✅ Generated content quality is good
✅ Performance is acceptable (< 45 sec)
✅ Error handling is robust

---

## 🐛 Debugging Tips

### Enable Verbose Logging

**Frontend (browser console):**
```javascript
// In railway-api.ts, the console.logs are already there
// Check DevTools → Console for:
[Railway API] Generating case study: {...}
[Railway API] Success: /api/generate-case-study
```

**Backend (Railway logs):**
```python
# Add at the start of endpoint:
print(f"Received request: {request.dict()}")

# After file processing:
print(f"Processed content length: {len(processed_content['merged_text'])}")

# After AI generation:
print(f"Generated {len(result['blocks'])} blocks")
```

### Test Individual Components

**Test file processing separately:**
```bash
curl -X POST $BACKEND_URL/api/test-file-processing \
  -F "file=@test.pdf"
```

**Test OpenAI separately:**
```python
# In backend, create test endpoint:
@app.get("/api/test-openai")
async def test_openai():
    response = await openai.ChatCompletion.acreate(
        model="gpt-4-turbo-preview",
        messages=[{"role": "user", "content": "Say hello"}]
    )
    return {"status": "success"}
```

---

## 📞 Need Help?

If tests fail, check in this order:

1. **Backend logs** (Railway dashboard)
2. **Browser console** (DevTools)
3. **Network tab** (Request/response details)
4. **Environment variables** (Railway settings)
5. **OpenAI dashboard** (API usage & errors)

---

## 🎊 When All Tests Pass

**Congratulations!** Your AI case study generation is working! 

Next steps:
1. Test with real user projects
2. Gather feedback on quality
3. Monitor costs and performance
4. Iterate on prompts if needed

---

**Ready to verify? Start with Test #1 (Health Check) and work through the list!** 🚀

