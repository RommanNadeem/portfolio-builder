# Backend AI Case Study Generation - Implementation Guide

## Overview

This guide provides complete instructions for implementing the AI case study generation endpoint on the Railway backend (FastAPI + Python).

---

## 📋 **Required Dependencies**

Add to `requirements.txt`:

```txt
# Existing
fastapi
uvicorn
openai
pydantic

# New for File Processing
pdfplumber>=0.9.0          # PDF extraction (best for tables)
python-docx>=0.8.11        # Word documents
openpyxl>=3.1.2            # Excel files
pandas>=2.0.0              # Data processing
python-pptx>=0.6.21        # PowerPoint files
beautifulsoup4>=4.12.0     # HTML/URL scraping
httpx>=0.24.0              # Async HTTP client
markdown>=3.4.0            # Markdown parsing

# Optional but recommended
redis>=4.5.0               # Caching
tiktoken>=0.4.0            # Token counting
structlog>=23.1.0          # Structured logging
```

---

## 🏗️ **Project Structure**

```
backend/
├── main.py                          # FastAPI app
├── routers/
│   └── ai_generation.py             # New router
├── services/
│   ├── file_processor.py            # File parsing logic
│   ├── content_aggregator.py        # Content merging
│   ├── prompt_builder.py            # Template-aware prompts
│   ├── llm_orchestrator.py          # OpenAI integration
│   └── response_validator.py        # Output validation
├── models/
│   └── ai_generation.py             # Pydantic models
└── utils/
    ├── metrics_detector.py          # Smart metric extraction
    └── entity_extractor.py          # NER utilities
```

---

## 📦 **1. Pydantic Models**

`models/ai_generation.py`:

```python
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TemplateSection(BaseModel):
    id: str
    label: str
    blockType: str
    required: bool
    description: str
    expected_fields: Dict[str, Any]
    ai_hints: str

class TemplateSchema(BaseModel):
    template_type: str
    template_name: str
    template_description: str
    sections: List[TemplateSection]
    block_definitions: Dict[str, Any]

class UploadedFile(BaseModel):
    id: str
    name: str
    type: str
    size: int
    file_data: str  # base64 encoded

class UserContext(BaseModel):
    profile: Optional[Dict[str, Any]] = None
    project_data: Optional[Dict[str, Any]] = None

class GenerationOptions(BaseModel):
    tone: str = "professional"
    auto_extract_metrics: bool = True
    include_technical_details: bool = False
    creativity_level: str = "balanced"
    target_length: str = "comprehensive"

class GenerateCaseStudyRequest(BaseModel):
    template_schema: TemplateSchema
    files: List[UploadedFile]
    user_context: UserContext
    user_notes: str
    generation_options: Optional[GenerationOptions] = GenerationOptions()
    metadata: Optional[Dict[str, Any]] = None

class GeneratedBlock(BaseModel):
    type: str
    id: str
    data: Dict[str, Any]
    confidence: int = Field(ge=0, le=100)
    sources: List[str] = []

class GenerateCaseStudyResponse(BaseModel):
    blocks: List[GeneratedBlock]
    overall_confidence: int = Field(ge=0, le=100)
    suggestions: List[str] = []
    missing_data: List[str] = []
    processing_time_ms: Optional[int] = None
```

---

## 🔧 **2. File Processor Service**

`services/file_processor.py`:

```python
import base64
import io
import asyncio
from typing import List, Dict, Any
import pdfplumber
from docx import Document
import pandas as pd
from pptx import Presentation
from bs4 import BeautifulSoup
import httpx

class FileProcessor:
    """Process various file types and extract text content"""
    
    async def process_files(self, files: List[Dict]) -> Dict[str, Any]:
        """Process all files in parallel"""
        tasks = []
        for file in files:
            tasks.append(self._process_single_file(file))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out errors
        processed = [r for r in results if not isinstance(r, Exception)]
        
        return self._merge_results(processed)
    
    async def _process_single_file(self, file: Dict) -> Dict[str, Any]:
        """Route to appropriate processor"""
        file_type = file['type']
        file_data = base64.b64decode(file['file_data'])
        
        if file_type == 'application/pdf':
            return await self._process_pdf(file_data, file['name'])
        elif 'word' in file_type or file_type.endswith('.document'):
            return await self._process_docx(file_data, file['name'])
        elif 'sheet' in file_type or file_type == 'text/csv':
            return await self._process_spreadsheet(file_data, file['name'], file_type)
        elif 'presentation' in file_type:
            return await self._process_pptx(file_data, file['name'])
        elif file_type == 'text/plain' or file_type == 'text/markdown':
            return await self._process_text(file_data, file['name'])
        else:
            return {'error': f'Unsupported file type: {file_type}'}
    
    async def _process_pdf(self, data: bytes, filename: str) -> Dict:
        """Extract text and tables from PDF"""
        pdf_file = io.BytesIO(data)
        text_content = []
        tables = []
        
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                # Extract text
                text = page.extract_text()
                if text:
                    text_content.append(text)
                
                # Extract tables
                page_tables = page.extract_tables()
                if page_tables:
                    tables.extend(page_tables)
        
        return {
            'type': 'pdf',
            'filename': filename,
            'content': {
                'raw_text': '\n\n'.join(text_content),
                'tables': tables,
                'page_count': len(text_content),
            }
        }
    
    async def _process_docx(self, data: bytes, filename: str) -> Dict:
        """Extract structured content from Word document"""
        doc_file = io.BytesIO(data)
        doc = Document(doc_file)
        
        paragraphs = []
        headings = []
        lists = []
        tables = []
        
        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue
            
            # Check if heading
            if para.style.name.startswith('Heading'):
                headings.append({
                    'level': para.style.name,
                    'text': text
                })
            else:
                paragraphs.append(text)
        
        # Extract tables
        for table in doc.tables:
            table_data = []
            for row in table.rows:
                table_data.append([cell.text for cell in row.cells])
            tables.append(table_data)
        
        return {
            'type': 'docx',
            'filename': filename,
            'content': {
                'raw_text': '\n\n'.join(paragraphs),
                'headings': headings,
                'tables': tables,
            }
        }
    
    async def _process_spreadsheet(self, data: bytes, filename: str, file_type: str) -> Dict:
        """Extract data from Excel/CSV"""
        file_obj = io.BytesIO(data)
        
        if 'csv' in file_type:
            df = pd.read_csv(file_obj)
        else:
            df = pd.read_excel(file_obj)
        
        # Detect metrics (numbers, percentages, currency)
        metrics = self._detect_metrics(df)
        
        return {
            'type': 'spreadsheet',
            'filename': filename,
            'content': {
                'raw_text': df.to_string(),
                'metrics': metrics,
                'row_count': len(df),
                'columns': list(df.columns),
            }
        }
    
    def _detect_metrics(self, df: pd.DataFrame) -> List[Dict]:
        """Smart metric detection from dataframe"""
        metrics = []
        
        for col in df.columns:
            col_lower = str(col).lower()
            
            # Look for metric-like columns
            metric_keywords = ['metric', 'kpi', 'result', 'performance', 'growth', 
                             'revenue', 'user', 'customer', 'conversion', 'rate']
            
            if any(keyword in col_lower for keyword in metric_keywords):
                for idx, value in df[col].items():
                    if pd.notna(value):
                        metrics.append({
                            'label': str(col),
                            'value': str(value),
                            'context': f'Row {idx + 1}'
                        })
        
        return metrics
    
    async def _process_pptx(self, data: bytes, filename: str) -> Dict:
        """Extract content from PowerPoint"""
        pptx_file = io.BytesIO(data)
        prs = Presentation(pptx_file)
        
        slides_content = []
        for slide in prs.slides:
            slide_text = []
            for shape in slide.shapes:
                if hasattr(shape, 'text'):
                    slide_text.append(shape.text)
            
            slides_content.append('\n'.join(slide_text))
        
        return {
            'type': 'pptx',
            'filename': filename,
            'content': {
                'raw_text': '\n\n---SLIDE---\n\n'.join(slides_content),
                'slide_count': len(slides_content),
            }
        }
    
    async def _process_text(self, data: bytes, filename: str) -> Dict:
        """Process plain text or markdown"""
        text = data.decode('utf-8')
        
        return {
            'type': 'text',
            'filename': filename,
            'content': {
                'raw_text': text,
            }
        }
    
    def _merge_results(self, results: List[Dict]) -> Dict[str, Any]:
        """Merge all extracted content"""
        all_text = []
        all_tables = []
        all_metrics = []
        sources = []
        
        for result in results:
            if 'error' in result:
                continue
            
            sources.append(result['filename'])
            content = result['content']
            
            # Collect text
            if 'raw_text' in content:
                all_text.append(f"\n\n--- FROM {result['filename']} ---\n\n")
                all_text.append(content['raw_text'])
            
            # Collect tables
            if 'tables' in content:
                all_tables.extend(content['tables'])
            
            # Collect metrics
            if 'metrics' in content:
                all_metrics.extend(content['metrics'])
        
        return {
            'merged_text': '\n'.join(all_text),
            'tables': all_tables,
            'metrics': all_metrics,
            'sources': sources,
        }
```

---

## 🧠 **3. LLM Orchestrator**

`services/llm_orchestrator.py`:

```python
import openai
import json
from typing import Dict, Any, List

class LLMOrchestrator:
    """Manages OpenAI API calls for case study generation"""
    
    def __init__(self, api_key: str):
        openai.api_key = api_key
    
    async def generate_case_study(
        self,
        template_schema: Dict,
        content: Dict,
        user_context: Dict,
        options: Dict
    ) -> Dict[str, Any]:
        """Generate complete case study using schema-driven approach"""
        
        # Build master prompt
        prompt = self._build_master_prompt(
            template_schema,
            content,
            user_context,
            options
        )
        
        # Call OpenAI
        response = await openai.ChatCompletion.acreate(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert case study writer. You generate structured, compelling case studies based on provided content and templates."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=4000
        )
        
        # Parse response
        result = json.loads(response.choices[0].message.content)
        
        return result
    
    def _build_master_prompt(
        self,
        schema: Dict,
        content: Dict,
        context: Dict,
        options: Dict
    ) -> str:
        """Build comprehensive prompt with schema"""
        
        sections_str = json.dumps(schema['sections'], indent=2)
        
        prompt = f"""You are generating a professional case study.

CONTENT PROVIDED:
{content['merged_text'][:8000]}  # Truncate if too long

{'METRICS FOUND:' if content.get('metrics') else ''}
{json.dumps(content.get('metrics', [])[:20], indent=2) if content.get('metrics') else ''}

USER CONTEXT:
{json.dumps(context, indent=2)}

TEMPLATE STRUCTURE TO FILL:
{sections_str}

INSTRUCTIONS:
1. Analyze all content carefully
2. For each section in the template:
   - Read the section's 'blockType' and 'expected_fields'
   - Read the 'ai_hints' for guidance
   - Extract or generate content that fits those exact fields
3. Use a {options['tone']} tone
4. Be specific and quantifiable where possible
5. If a required field cannot be filled, mark as "[DATA_NEEDED]"
6. If an optional field cannot be filled, omit it

OUTPUT FORMAT (MUST BE VALID JSON):
{{
  "blocks": [
    {{
      "type": "<blockType>",
      "id": "<section_id>",
      "data": {{ /* exact fields from schema */ }},
      "confidence": <0-100>,
      "sources": ["filename1.pdf", "user_notes"]
    }}
  ],
  "overall_confidence": <0-100>,
  "suggestions": ["suggestion1", "suggestion2"],
  "missing_data": ["missing1", "missing2"]
}}

Generate the case study now."""
        
        return prompt
```

---

## 🚀 **4. Main API Endpoint**

`routers/ai_generation.py`:

```python
from fastapi import APIRouter, HTTPException
from models.ai_generation import GenerateCaseStudyRequest, GenerateCaseStudyResponse
from services.file_processor import FileProcessor
from services.llm_orchestrator import LLMOrchestrator
import time
import os

router = APIRouter(prefix="/api", tags=["AI Generation"])

file_processor = FileProcessor()
llm_orchestrator = LLMOrchestrator(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/generate-case-study", response_model=GenerateCaseStudyResponse)
async def generate_case_study(request: GenerateCaseStudyRequest):
    """
    Generate AI-powered case study from uploaded files and template schema
    """
    start_time = time.time()
    
    try:
        # Step 1: Process files
        processed_content = await file_processor.process_files(request.files)
        
        # Step 2: Add user notes to content
        if request.user_notes:
            processed_content['merged_text'] += f"\n\n--- USER NOTES ---\n\n{request.user_notes}"
            processed_content['sources'].append('user_notes')
        
        # Step 3: Generate with LLM
        result = await llm_orchestrator.generate_case_study(
            template_schema=request.template_schema.dict(),
            content=processed_content,
            user_context=request.user_context.dict(),
            options=request.generation_options.dict()
        )
        
        # Step 4: Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)
        result['processing_time_ms'] = processing_time
        
        return GenerateCaseStudyResponse(**result)
        
    except Exception as e:
        print(f"Error generating case study: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate case study: {str(e)}"
        )
```

---

## 🔌 **5. Register Router in Main App**

`main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ai_generation

app = FastAPI(title="Portfolio Builder Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ai_generation.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

---

## ⚙️ **6. Environment Variables**

Add to Railway environment:

```
OPENAI_API_KEY=sk-...
```

---

## 🧪 **7. Testing**

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test endpoint
curl -X POST http://localhost:8000/api/generate-case-study \
  -H "Content-Type: application/json" \
  -d @test_payload.json
```

---

## 📊 **8. Performance Optimizations**

### Caching (Optional but Recommended)

```python
import hashlib
import redis

cache = redis.Redis(host='localhost', port=6379, db=0)

def get_cache_key(request: GenerateCaseStudyRequest) -> str:
    """Generate cache key from request"""
    content = (
        request.template_schema.template_type +
        str([f.name for f in request.files]) +
        request.user_notes
    )
    return hashlib.sha256(content.encode()).hexdigest()

# In endpoint:
cache_key = get_cache_key(request)
cached = cache.get(cache_key)
if cached:
    return json.loads(cached)

# ... generate ...

cache.setex(cache_key, 86400, json.dumps(result))  # 24h TTL
```

---

## 🚀 **Deployment to Railway**

1. **Push to GitHub**
2. **Connect to Railway**
3. **Set Environment Variables** (OPENAI_API_KEY)
4. **Deploy**

Railway will automatically:
- Detect `requirements.txt`
- Install dependencies
- Run the FastAPI server

---

## ✅ **Testing Checklist**

- [ ] PDF extraction works
- [ ] Word document parsing works
- [ ] Excel metrics detection works
- [ ] OpenAI API key configured
- [ ] Returns valid JSON matching schema
- [ ] Error handling works
- [ ] CORS configured properly
- [ ] Frontend can call endpoint successfully

---

## 🎯 **Success Criteria**

- ✅ Processes 3-5 files in under 30 seconds
- ✅ Returns structured blocks matching frontend schema
- ✅ Confidence scores are meaningful (70%+ typical)
- ✅ Handles errors gracefully
- ✅ Cost per generation: $0.02-$0.05

---

This implementation provides a production-ready AI case study generation backend that adapts to any template schema sent from the frontend!

