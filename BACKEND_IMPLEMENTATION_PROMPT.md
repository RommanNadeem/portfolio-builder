# Backend Implementation Prompt: AI Case Study Generator

## Context

We have a portfolio builder application where users create project case studies. The frontend is complete and ready. We need to implement a backend endpoint that receives uploaded files (PDFs, Word docs, Excel, etc.) along with a template schema, processes them with AI, and returns structured content matching the template.

## Core Concept: Schema-Driven Generation

**The key innovation**: The frontend sends us the exact structure it needs (template schema), and we generate content that matches it perfectly. No hardcoding of templates in backend!

```
Frontend sends:
{
  "template_schema": {
    "sections": [
      {
        "id": "hero",
        "blockType": "hero",
        "expected_fields": {
          "title": {"type": "string", "required": true},
          "subtitle": {"type": "string", "required": false},
          "meta": {...}
        },
        "ai_hints": "Extract project name as title..."
      }
    ]
  },
  "files": [...],
  "user_notes": "..."
}

Backend returns:
{
  "blocks": [
    {
      "type": "hero",
      "id": "hero",
      "data": {
        "title": "Extracted/Generated Title",
        "subtitle": "Generated subtitle",
        "meta": {...}
      },
      "confidence": 85
    }
  ]
}
```

---

## Technical Requirements

### Stack
- **Framework**: FastAPI (Python)
- **Deployment**: Railway
- **AI**: OpenAI GPT-4 Turbo
- **File Processing**: pdfplumber, python-docx, pandas, python-pptx

### Dependencies to Install
```txt
fastapi>=0.104.0
uvicorn>=0.24.0
openai>=1.3.0
pydantic>=2.5.0
pdfplumber>=0.9.0
python-docx>=0.8.11
openpyxl>=3.1.2
pandas>=2.0.0
python-pptx>=0.6.21
beautifulsoup4>=4.12.0
httpx>=0.24.0
python-multipart>=0.0.6
```

### Environment Variables
```
OPENAI_API_KEY=sk-...
```

---

## API Specification

### Endpoint
```
POST /api/generate-case-study
Content-Type: application/json
```

### Request Schema
```json
{
  "template_schema": {
    "template_type": "product-case-study",
    "template_name": "Product Case Study",
    "sections": [
      {
        "id": "hero",
        "label": "Hero",
        "blockType": "hero",
        "required": true,
        "description": "Main title and introduction",
        "expected_fields": {
          "title": {"type": "string", "required": true},
          "subtitle": {"type": "string", "required": false},
          "description": {"type": "string", "required": false},
          "meta": {
            "role": {"type": "string", "required": false},
            "timeline": {"type": "string", "required": false}
          }
        },
        "ai_hints": "Extract project name, create compelling subtitle"
      }
    ]
  },
  "files": [
    {
      "id": "file_1",
      "name": "project-spec.pdf",
      "type": "application/pdf",
      "size": 2400000,
      "file_data": "base64_encoded_string"
    }
  ],
  "user_context": {
    "project_data": {
      "title": "TaskFlow App",
      "description": "A productivity tool",
      "tags": ["SaaS", "Productivity"]
    }
  },
  "user_notes": "This was a 6-month project...",
  "generation_options": {
    "tone": "professional",
    "auto_extract_metrics": true,
    "include_technical_details": false
  }
}
```

### Response Schema
```json
{
  "blocks": [
    {
      "type": "hero",
      "id": "hero",
      "data": {
        "title": "TaskFlow: Team Productivity Reimagined",
        "subtitle": "How we built an app that increased team productivity by 40%",
        "meta": {
          "role": "Lead Engineer",
          "timeline": "6 months"
        }
      },
      "confidence": 85,
      "sources": ["project-spec.pdf", "user_notes"]
    }
  ],
  "overall_confidence": 85,
  "suggestions": [
    "Consider adding specific metrics to Results section",
    "Include user feedback if available"
  ],
  "missing_data": [
    "No metrics found in uploaded files"
  ],
  "processing_time_ms": 25340
}
```

---

## Implementation Steps

### Step 1: File Processing

**Objective**: Extract text, tables, and metrics from uploaded files.

**Supported File Types**:
- PDF (.pdf) → Extract text + tables
- Word (.docx, .doc) → Extract with structure (headings, lists)
- Excel (.xlsx, .xls, .csv) → Detect metrics automatically
- PowerPoint (.pptx, .ppt) → Extract slide content
- Text (.txt, .md) → Direct processing

**Key Functions Needed**:

```python
class FileProcessor:
    async def process_files(self, files: List[Dict]) -> Dict:
        """
        Process all files in parallel
        Return: {
            'merged_text': str,
            'tables': List[List],
            'metrics': List[Dict],
            'sources': List[str]
        }
        """
        # Process each file based on type
        # Extract text, preserve structure
        # Detect metrics (numbers with %, $, etc.)
        # Merge all content
```

**Smart Metric Detection**:
```python
# Look for patterns like:
# "Revenue grew 245%" → metric: {label: "Revenue Growth", value: "245%"}
# "5,000 users" → metric: {label: "Users", value: "5,000"}
# Excel columns: "Metric" + "Value" → auto-detect
```

### Step 2: Content Aggregation

**Objective**: Merge and structure all extracted content for AI consumption.

```python
class ContentAggregator:
    def aggregate(self, processed_files: List) -> Dict:
        """
        Merge content intelligently:
        - Deduplicate overlapping content
        - Preserve source attribution
        - Structure by type (text, tables, metrics)
        """
```

### Step 3: Prompt Building (MOST IMPORTANT)

**Objective**: Build a schema-aware prompt that tells GPT-4 exactly what to generate.

```python
def build_prompt(schema: Dict, content: Dict, options: Dict) -> str:
    """
    Create a prompt that:
    1. Includes all extracted content
    2. Shows the exact template structure needed
    3. Provides field specifications for each section
    4. Includes AI hints from schema
    5. Specifies output format (JSON)
    """
    
    prompt = f"""You are an expert case study writer.

CONTENT PROVIDED:
{content['merged_text'][:8000]}  # Truncate if too long

METRICS FOUND:
{json.dumps(content['metrics'][:20], indent=2)}

TEMPLATE STRUCTURE TO FILL:
{json.dumps(schema['sections'], indent=2)}

INSTRUCTIONS:
1. For each section in the template:
   - Read the 'blockType' and 'expected_fields'
   - Read the 'ai_hints' for guidance
   - Extract or generate content matching those fields EXACTLY
2. Use a {options['tone']} tone
3. Be specific and quantifiable
4. If a required field cannot be filled, mark as "[DATA_NEEDED]"
5. If optional field cannot be filled, omit it

OUTPUT FORMAT (MUST BE VALID JSON):
{{
  "blocks": [
    {{
      "type": "hero",
      "id": "hero",
      "data": {{
        "title": "...",
        "subtitle": "...",
        "meta": {{...}}
      }},
      "confidence": 85,
      "sources": ["file.pdf"]
    }}
  ],
  "overall_confidence": 85,
  "suggestions": ["..."],
  "missing_data": ["..."]
}}

Generate now."""
    
    return prompt
```

### Step 4: OpenAI Integration

**Objective**: Call GPT-4 with structured output.

```python
async def generate_with_openai(prompt: str) -> Dict:
    """
    Call OpenAI with JSON mode
    """
    response = await openai.ChatCompletion.acreate(
        model="gpt-4-turbo-preview",  # Or gpt-4-1106-preview
        messages=[
            {
                "role": "system",
                "content": "You are an expert case study writer. Generate structured, professional case studies."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format={"type": "json_object"},  # IMPORTANT!
        temperature=0.7,
        max_tokens=4000
    )
    
    return json.loads(response.choices[0].message.content)
```

### Step 5: Validation

**Objective**: Ensure generated output matches frontend schema.

```python
def validate_output(blocks: List, schema: Dict) -> Dict:
    """
    Check:
    1. Block count matches sections count
    2. Block types match
    3. Required fields are present
    4. Data types are correct
    
    Return validation result + any fixes needed
    """
```

---

## Complete Code Structure

```python
# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import time

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class UploadedFile(BaseModel):
    id: str
    name: str
    type: str
    size: int
    file_data: str

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
    sections: List[TemplateSection]

class GenerationOptions(BaseModel):
    tone: str = "professional"
    auto_extract_metrics: bool = True
    include_technical_details: bool = False

class GenerateCaseStudyRequest(BaseModel):
    template_schema: TemplateSchema
    files: List[UploadedFile]
    user_context: Dict[str, Any]
    user_notes: str
    generation_options: Optional[GenerationOptions] = None

class GeneratedBlock(BaseModel):
    type: str
    id: str
    data: Dict[str, Any]
    confidence: int
    sources: List[str]

class GenerateCaseStudyResponse(BaseModel):
    blocks: List[GeneratedBlock]
    overall_confidence: int
    suggestions: List[str] = []
    missing_data: List[str] = []
    processing_time_ms: Optional[int] = None

# Services (implement these in separate files)
from services.file_processor import FileProcessor
from services.llm_orchestrator import LLMOrchestrator

file_processor = FileProcessor()
llm_orchestrator = LLMOrchestrator()

@app.post("/api/generate-case-study", response_model=GenerateCaseStudyResponse)
async def generate_case_study(request: GenerateCaseStudyRequest):
    """
    Main endpoint for AI case study generation
    """
    start_time = time.time()
    
    try:
        # 1. Process files
        processed_content = await file_processor.process_files(request.files)
        
        # 2. Add user notes
        if request.user_notes:
            processed_content['merged_text'] += f"\n\n---USER NOTES---\n\n{request.user_notes}"
        
        # 3. Generate with AI
        result = await llm_orchestrator.generate(
            template_schema=request.template_schema.dict(),
            content=processed_content,
            user_context=request.user_context,
            options=request.generation_options.dict() if request.generation_options else {}
        )
        
        # 4. Add processing time
        result['processing_time_ms'] = int((time.time() - start_time) * 1000)
        
        return GenerateCaseStudyResponse(**result)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

---

## File Processor Implementation

```python
# services/file_processor.py
import base64
import io
import asyncio
import pdfplumber
from docx import Document
import pandas as pd
from pptx import Presentation

class FileProcessor:
    async def process_files(self, files: List[Dict]) -> Dict:
        tasks = []
        for file in files:
            tasks.append(self._process_single_file(file))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return self._merge_results([r for r in results if not isinstance(r, Exception)])
    
    async def _process_single_file(self, file: Dict) -> Dict:
        file_data = base64.b64decode(file['file_data'])
        file_type = file['type']
        
        if file_type == 'application/pdf':
            return self._process_pdf(file_data, file['name'])
        elif 'word' in file_type:
            return self._process_docx(file_data, file['name'])
        elif 'sheet' in file_type or file_type == 'text/csv':
            return self._process_spreadsheet(file_data, file['name'], file_type)
        # ... etc
    
    def _process_pdf(self, data: bytes, filename: str) -> Dict:
        pdf_file = io.BytesIO(data)
        text = []
        tables = []
        
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                if page_text := page.extract_text():
                    text.append(page_text)
                if page_tables := page.extract_tables():
                    tables.extend(page_tables)
        
        return {
            'filename': filename,
            'content': {
                'raw_text': '\n\n'.join(text),
                'tables': tables
            }
        }
    
    def _merge_results(self, results: List[Dict]) -> Dict:
        all_text = []
        all_metrics = []
        sources = []
        
        for result in results:
            sources.append(result['filename'])
            all_text.append(f"\n---{result['filename']}---\n")
            all_text.append(result['content']['raw_text'])
            
            if 'metrics' in result['content']:
                all_metrics.extend(result['content']['metrics'])
        
        return {
            'merged_text': '\n'.join(all_text),
            'metrics': all_metrics,
            'sources': sources
        }
```

---

## LLM Orchestrator Implementation

```python
# services/llm_orchestrator.py
import openai
import json
import os

class LLMOrchestrator:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
    
    async def generate(self, template_schema: Dict, content: Dict, 
                      user_context: Dict, options: Dict) -> Dict:
        
        prompt = self._build_prompt(template_schema, content, options)
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are an expert case study writer."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=4000
        )
        
        return json.loads(response.choices[0].message.content)
    
    def _build_prompt(self, schema: Dict, content: Dict, options: Dict) -> str:
        return f"""Generate a case study matching this exact structure.

CONTENT:
{content['merged_text'][:8000]}

METRICS:
{json.dumps(content.get('metrics', [])[:20], indent=2)}

TEMPLATE STRUCTURE:
{json.dumps(schema['sections'], indent=2)}

OUTPUT (JSON):
{{
  "blocks": [...],
  "overall_confidence": 85,
  "suggestions": [...],
  "missing_data": [...]
}}"""
```

---

## Testing

### Local Test
```bash
# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test with curl
curl -X POST http://localhost:8000/api/generate-case-study \
  -H "Content-Type: application/json" \
  -d '{
    "template_schema": {...},
    "files": [...],
    "user_notes": "Test project",
    "generation_options": {"tone": "professional"}
  }'
```

### Success Criteria
- ✅ Accepts files and decodes base64
- ✅ Extracts text from PDFs correctly
- ✅ Detects metrics from spreadsheets
- ✅ Calls OpenAI successfully
- ✅ Returns JSON matching response schema
- ✅ Processing time < 40 seconds
- ✅ Confidence scores are meaningful
- ✅ CORS works for frontend

---

## Deployment to Railway

1. Create `requirements.txt` with all dependencies
2. Create `Procfile`: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Set environment variable: `OPENAI_API_KEY`
4. Deploy
5. Test with production URL

---

## Expected Performance

- **Processing Time**: 20-40 seconds
- **Cost per Generation**: $0.02-$0.05
- **Success Rate**: 90%+ with good content
- **Confidence Score**: 70-90% typical

---

## Important Notes

1. **Schema Adherence**: The most critical aspect is respecting the `expected_fields` from the frontend schema
2. **JSON Output**: MUST use `response_format={"type": "json_object"}` in OpenAI call
3. **Error Handling**: Gracefully handle missing data, mark as "[DATA_NEEDED]"
4. **File Size**: Backend should validate file sizes (10MB limit per file)
5. **Rate Limiting**: Consider implementing rate limits
6. **Logging**: Log all generations for debugging and improvement

---

## Questions to Ask During Implementation

1. Should we implement caching for similar requests?
2. What should timeout be for OpenAI calls?
3. Do we need retry logic for OpenAI API failures?
4. Should we store generation history in database?

---

## Success = Frontend Works Seamlessly

When complete, the frontend should:
1. Upload files successfully
2. Receive structured blocks back
3. See confidence scores
4. Get helpful suggestions
5. Be able to accept and use the content immediately

The backend's job is to be a smart adapter between raw files and structured template blocks!

---

**Ready to implement? Start with Step 1 (File Processing), then Step 4 (OpenAI Integration), then connect them with the main endpoint.**

