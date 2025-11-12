# 🐛 Backend 404 Error - Debugging Guide

## Problem
Frontend is calling `/api/generate-case-study` but getting 404 "Not Found"

---

## Quick Checks

### 1. Verify Backend is Running

**Test the health endpoint:**
```bash
curl https://portfoliobuilder-backend-production.up.railway.app/health
```

**Expected:** `{"status":"healthy"}` or similar
**If 404:** Backend is not running or URL is wrong

---

### 2. Check Endpoint Path

The frontend is calling: `/api/generate-case-study`

**Test if endpoint exists:**
```bash
curl -X POST https://portfoliobuilder-backend-production.up.railway.app/api/generate-case-study \
  -H "Content-Type: application/json" \
  -d '{}'
```

**If 404:** Endpoint doesn't exist or has different path

---

## Common Issues & Fixes

### Issue 1: Endpoint Path Mismatch

**Frontend expects:** `/api/generate-case-study`

**Backend might have:**
- ❌ `/generate-case-study` (missing `/api`)
- ❌ `/api/generate_case_study` (underscore instead of dash)
- ❌ `/generate_case_study` (missing `/api` AND underscore)

**Fix in Backend:**
```python
# Make sure endpoint is defined as:
@router.post("/api/generate-case-study")  # ← Exact path
async def generate_case_study(request: GenerateCaseStudyRequest):
    ...
```

OR if using router with prefix:
```python
# In router file:
router = APIRouter(prefix="/api")  # ← Has /api prefix

@router.post("/generate-case-study")  # ← Will be /api/generate-case-study
async def generate_case_study(request: GenerateCaseStudyRequest):
    ...

# In main.py:
app.include_router(router)  # ← Don't add another prefix here
```

---

### Issue 2: Router Not Registered

**Check in backend `main.py`:**
```python
from fastapi import FastAPI
from routers import ai_generation  # ← Import

app = FastAPI()

# Make sure router is included:
app.include_router(ai_generation.router)  # ← This line needed!
```

---

### Issue 3: Wrong HTTP Method

**Backend might be expecting GET instead of POST**

**Fix:**
```python
# Should be POST, not GET:
@router.post("/api/generate-case-study")  # ← POST
async def generate_case_study(...):
    ...
```

---

### Issue 4: Case Sensitivity

**Endpoint paths are case-sensitive!**

**Frontend calls:** `/api/generate-case-study` (lowercase)
**Backend must match:** `/api/generate-case-study` (lowercase)

❌ Wrong: `/api/Generate-Case-Study`
❌ Wrong: `/API/generate-case-study`
✅ Correct: `/api/generate-case-study`

---

## Debugging Steps

### Step 1: List All Available Endpoints

**Add this to backend `main.py`:**
```python
@app.get("/routes")
async def list_routes():
    """Debug endpoint to show all registered routes"""
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "methods": route.methods if hasattr(route, 'methods') else None
        })
    return {"routes": routes}
```

**Then visit:**
```
https://portfoliobuilder-backend-production.up.railway.app/routes
```

**Look for:** `/api/generate-case-study` with method `POST`

---

### Step 2: Check Railway Logs

**On Railway dashboard:**
1. Go to your backend deployment
2. Click "Logs" tab
3. Look for errors like:
   - `ImportError: No module named 'routers'`
   - `AttributeError: ...`
   - Route registration errors

---

### Step 3: Test Locally First

**Run backend locally:**
```bash
cd backend/
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Visit:**
```
http://localhost:8000/docs
```

**You should see:**
- Swagger UI with all endpoints
- `/api/generate-case-study` listed
- Can test it right there!

---

## Most Likely Causes

### Cause 1: Missing `/api` prefix (80% probability)

**Backend has:**
```python
@app.post("/generate-case-study")  # ← Missing /api
```

**Should be:**
```python
@app.post("/api/generate-case-study")  # ← With /api
```

---

### Cause 2: Router not included (15% probability)

**Backend missing:**
```python
app.include_router(ai_generation.router)
```

---

### Cause 3: Typo in path (5% probability)

**Backend has:**
```python
@app.post("/api/generate-case-study")  # ← Note the dash vs underscore
```

**Check both frontend and backend use exact same spelling!**

---

## Quick Fix Guide

**Ask backend developer to verify:**

1. ✅ **Endpoint decorator:**
   ```python
   @router.post("/api/generate-case-study")
   # or
   @app.post("/api/generate-case-study")
   ```

2. ✅ **Router registered:**
   ```python
   app.include_router(router)
   ```

3. ✅ **Function signature:**
   ```python
   async def generate_case_study(request: GenerateCaseStudyRequest):
       ...
   ```

4. ✅ **No typos in path**

5. ✅ **Deployed to Railway** (not just running locally)

---

## Test After Fix

**Once backend is fixed, test with:**

```bash
curl -X POST https://portfoliobuilder-backend-production.up.railway.app/api/generate-case-study \
  -H "Content-Type: application/json" \
  -d '{
    "template_schema": {
      "template_type": "test",
      "template_name": "Test",
      "sections": []
    },
    "files": [],
    "user_context": {},
    "user_notes": "test"
  }'
```

**Should return:**
- ✅ JSON response (even if validation error)
- ❌ NOT 404

---

## Alternative: Check Backend Code

**Share this with backend dev:**

```python
# main.py - COMPLETE MINIMAL EXAMPLE

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# CORS - IMPORTANT!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple models for testing
class GenerateCaseStudyRequest(BaseModel):
    template_schema: Dict[str, Any]
    files: List[Dict[str, Any]]
    user_context: Dict[str, Any]
    user_notes: str

class GenerateCaseStudyResponse(BaseModel):
    blocks: List[Dict[str, Any]]
    overall_confidence: int
    suggestions: List[str] = []
    missing_data: List[str] = []

# THE ENDPOINT - EXACT PATH
@app.post("/api/generate-case-study", response_model=GenerateCaseStudyResponse)
async def generate_case_study(request: GenerateCaseStudyRequest):
    """
    Main endpoint - must match frontend path EXACTLY
    """
    # For now, return dummy response to test connection
    return GenerateCaseStudyResponse(
        blocks=[],
        overall_confidence=0,
        suggestions=["Backend is working!"],
        missing_data=[]
    )

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Debug endpoint
@app.get("/debug/routes")
async def list_routes():
    routes = []
    for route in app.routes:
        if hasattr(route, 'path'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods) if hasattr(route, 'methods') else []
            })
    return {"routes": routes}
```

**To deploy:**
1. Save as `main.py`
2. Push to Railway
3. Test: `curl https://YOUR-URL/api/generate-case-study`
4. Should NOT get 404

---

## Still Not Working?

**Check these:**

1. **Railway URL correct?**
   ```bash
   echo $NEXT_PUBLIC_RAILWAY_BACKEND_URL
   # Should be: https://portfoliobuilder-backend-production.up.railway.app
   ```

2. **Railway deployed successfully?**
   - Check Railway dashboard for deployment status
   - Look for "Deployed" status, not "Failed"

3. **Port configuration?**
   ```python
   # Railway needs PORT from environment
   import os
   port = int(os.getenv("PORT", 8000))
   
   if __name__ == "__main__":
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=port)
   ```

4. **Procfile correct?**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

---

## Contact Backend Dev With This

**Send this message:**

> Hey! The frontend is getting a 404 when calling `/api/generate-case-study`. 
> 
> Can you:
> 1. Verify the endpoint path is exactly: `/api/generate-case-study` (POST)
> 2. Check if the router is registered in main.py
> 3. Test locally at http://localhost:8000/docs
> 4. Share the `/debug/routes` output
> 
> See BACKEND_404_DEBUG.md for details!

---

## Once Fixed

The error will change from:
```
❌ Not Found (404)
```

To either:
```
✅ Success (200) with data
OR
⚠️ Validation error (422) - but endpoint exists!
```

Then we can debug the actual generation logic if needed!

---

**TL;DR: Backend needs to have endpoint at `/api/generate-case-study` (POST) and it's currently missing or at wrong path.**

