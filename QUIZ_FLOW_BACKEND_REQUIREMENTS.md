# 🎯 Quiz Flow - Backend Implementation Guide

## Overview

When users skip uploading their resume, they now go through an **interactive 8-question quiz** that collects information about them. The backend needs to transform these quiz answers into a complete portfolio structure using AI.

---

## 📤 API Endpoint Required

### `POST /api/generate-from-quiz`

Transforms quiz answers into structured portfolio data.

---

## 📋 Request Format

```json
{
  "name": "John Doe",
  "quiz_data": {
    "role": "Product Manager",
    "experienceLevel": "mid",
    "yearsOfExperience": "2-5 years",
    "industries": ["Technology", "SaaS", "E-commerce"],
    "topSkills": [
      "Product Strategy",
      "User Research",
      "Roadmap Planning",
      "Data Analysis",
      "Stakeholder Management"
    ],
    "workStyle": ["data-driven", "collaborative", "user-focused"],
    "recentProject": {
      "type": "new_product",
      "description": "Built a new analytics dashboard that helps teams track key metrics in real-time. Involved user research, design sprints, and iterative development over 4 months.",
      "impact": "Increased user engagement by 40%, reduced time to insights from 2 hours to 5 minutes"
    },
    "topAchievements": [
      "Led team that increased revenue by 150%",
      "Shipped feature used by 1M+ users",
      "Reduced customer churn from 15% to 8%"
    ],
    "careerGoals": "Looking to join a high-growth startup as a Senior PM where I can own product strategy and help scale the business from 0 to 1.",
    "targetAudience": "Hiring managers at Series A/B startups, VCs looking for PMs"
  }
}
```

---

## ✅ Response Format

```json
{
  "success": true,
  "data": {
    "heading": "Hi, I'm John Doe — Product Manager",
    "tagline": "Product Manager who turns data into decisions",
    "taglineSuggestions": [
      "Product Manager who turns data into decisions",
      "Data-driven PM focused on user impact",
      "Building products that scale — led 150% revenue growth"
    ],
    "whoAreYou": "I'm a Product Manager with 4 years of experience building products in Technology and SaaS. I love diving into data and collaborating with teams to ship features that make a real impact. My superpower is turning complex problems into simple, elegant solutions that users love.",
    "profession": "Product Manager",
    "companies": "Acme Corp, TechStart Inc",
    "careerHighlights": [
      {
        "id": "generated_1",
        "organization": "Acme Corp",
        "role": "Product Manager",
        "description": "Led product strategy for analytics platform",
        "achievements": [
          "Led team that increased revenue by 150%",
          "Shipped feature used by 1M+ users",
          "Built analytics dashboard increasing engagement by 40%"
        ],
        "startDate": "2021",
        "endDate": "Present",
        "current": true
      },
      {
        "id": "generated_2",
        "organization": "TechStart Inc",
        "role": "Associate Product Manager",
        "description": "Focused on user research and product discovery",
        "achievements": [
          "Reduced customer churn from 15% to 8%",
          "Conducted 50+ user interviews to inform roadmap",
          "Launched MVP in 3 months with 85% user satisfaction"
        ],
        "startDate": "2019",
        "endDate": "2021",
        "current": false
      }
    ]
  }
}
```

---

## 🧠 AI Generation Strategy

### 1. Generate Heading
**Input:** name, role
**Output:** `"Hi, I'm [Name] — [Role]"`

### 2. Generate Tagline
**Input:** role, skills, workStyle, achievements
**Strategy:**
- Combine role with key personality trait from workStyle
- Reference a major achievement if available
- Keep under 80 characters
- Generate 3 variations

**Examples:**
- "Product Manager who turns data into decisions"
- "Data-driven PM focused on user impact"
- "Building products that scale — led 150% revenue growth"

### 3. Generate "Who Are You" Section
**Input:** role, experienceLevel, yearsOfExperience, industries, workStyle, topSkills, topAchievements
**Strategy:**
- Opening: Introduce role and experience level
- Middle: Mention industries and work style/personality
- End: Highlight superpower or what drives them
- Length: 100-200 words
- Tone: First person, conversational but professional

**Template:**
```
I'm a [role] with [years] of experience building [what] in [industries]. 
I [personality trait from workStyle] and [another trait]. 
My superpower is [skill turned into narrative].
```

### 4. Generate Career Highlights (1-2 positions)
**Input:** role, experienceLevel, recentProject, topAchievements, industries
**Strategy:**
- Create 1-2 realistic company positions based on experience level
- Distribute achievements across positions
- Most recent position gets the recentProject data
- Generate plausible company names based on industries
- Add realistic date ranges based on experienceLevel

**Experience Level Mapping:**
- `entry` (0-2 years): 1 position, Junior/Associate titles
- `mid` (2-5 years): 2 positions, mid-level titles
- `senior` (5-10 years): 2-3 positions, Senior titles
- `expert` (10+ years): 2-3 positions, Lead/Principal/Director titles

**Title Generation:**
Based on role + experienceLevel:
- entry: "Junior [Role]", "Associate [Role]", "[Role]"
- mid: "[Role]", "Product [Role]"
- senior: "Senior [Role]", "Lead [Role]"
- expert: "Senior [Role]", "Lead [Role]", "Principal [Role]", "Director of [Area]"

**Company Name Generation:**
Based on industries:
- Technology: TechCorp, Innovate Labs, CloudStart
- SaaS: SaaSify, DataFlow, Metrics Inc
- E-commerce: ShopHub, BuyNow, MarketPlace
- Finance: FinanceFlow, PayStream, Capital Labs
- Healthcare: HealthTech, MediCare Solutions, WellnessHub

**Date Range Generation:**
Based on yearsOfExperience:
- Calculate years back from current year
- Most recent position: current or ended within last year
- Previous positions: fill remaining years

### 5. Generate Companies String
**Input:** careerHighlights
**Output:** Comma-separated company names: "Acme Corp, TechStart Inc"

---

## 🎨 Prompt Engineering Guide

### System Prompt
```
You are an expert career coach and portfolio writer. Your job is to transform 
quiz responses into compelling, professional portfolio content. 

Guidelines:
- Be authentic and believable
- Use first-person for "whoAreYou" section
- Make achievements specific and metric-driven when possible
- Create realistic career progressions
- Match tone to experience level (junior = enthusiastic, senior = confident)
- Avoid clichés and buzzwords
```

### User Prompt Template
```
Generate portfolio content for:

Name: {name}
Role: {role}
Experience: {experienceLevel} ({yearsOfExperience})
Industries: {industries_list}
Top Skills: {skills_list}
Work Style: {workStyle_list}

Recent Project:
Type: {project.type}
Description: {project.description}
Impact: {project.impact}

Top Achievements:
{achievements_list}

Career Goals: {careerGoals}
Target Audience: {targetAudience}

Generate:
1. Heading (format: "Hi, I'm [Name] — [Role]")
2. Three tagline variations (max 80 chars each)
3. "Who are you" bio (100-200 words, first person, conversational)
4. Career highlights (1-2 positions with realistic companies, titles, dates, achievements)
5. Companies list (comma-separated)

Output as JSON matching the response format.
```

---

## 🔧 Implementation Steps

### Step 1: Create Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional

class RecentProject(BaseModel):
    type: str
    description: str
    impact: str

class QuizData(BaseModel):
    role: str
    experienceLevel: str  # entry, mid, senior, expert
    yearsOfExperience: str
    industries: List[str]
    topSkills: List[str]
    workStyle: List[str]
    recentProject: RecentProject
    topAchievements: List[str]
    careerGoals: str
    targetAudience: str

class GenerateFromQuizRequest(BaseModel):
    name: str
    quiz_data: QuizData

class CareerHighlight(BaseModel):
    id: str
    organization: str
    role: str
    description: str
    achievements: List[str]
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    current: Optional[bool] = False

class GeneratedPortfolioData(BaseModel):
    heading: str
    tagline: str
    taglineSuggestions: List[str]
    whoAreYou: str
    profession: str
    companies: str
    careerHighlights: List[CareerHighlight]
```

### Step 2: Build AI Prompt

```python
def build_quiz_prompt(name: str, quiz_data: QuizData) -> str:
    prompt = f"""
Generate portfolio content for:

Name: {name}
Role: {quiz_data.role}
Experience: {quiz_data.experienceLevel} ({quiz_data.yearsOfExperience})
Industries: {', '.join(quiz_data.industries)}
Top Skills: {', '.join(quiz_data.topSkills)}
Work Style: {', '.join(quiz_data.workStyle)}

Recent Project:
Type: {quiz_data.recentProject.type}
Description: {quiz_data.recentProject.description}
Impact: {quiz_data.recentProject.impact}

Top Achievements:
{chr(10).join(f'{i+1}. {achievement}' for i, achievement in enumerate(quiz_data.topAchievements))}

Career Goals: {quiz_data.careerGoals}
Target Audience: {quiz_data.targetAudience}

Generate a complete portfolio structure following these rules:
1. Heading: "Hi, I'm {name} — {quiz_data.role}"
2. Three tagline variations (max 80 chars each, blend role + personality)
3. "Who are you" bio (100-200 words, first person, authentic)
4. Career highlights (1-2 positions based on experience level with realistic companies and dates)
5. Distribute achievements across positions naturally

Output valid JSON matching this structure:
{{
  "heading": string,
  "tagline": string,
  "taglineSuggestions": [string, string, string],
  "whoAreYou": string,
  "profession": string,
  "companies": string,
  "careerHighlights": [
    {{
      "id": "generated_1",
      "organization": string,
      "role": string,
      "description": string,
      "achievements": [string],
      "startDate": string,
      "endDate": string,
      "current": boolean
    }}
  ]
}}
"""
    return prompt
```

### Step 3: API Endpoint

```python
from fastapi import APIRouter, HTTPException
import openai
import json

router = APIRouter()

@router.post('/api/generate-from-quiz')
async def generate_from_quiz(request: GenerateFromQuizRequest):
    try:
        # Build prompt
        prompt = build_quiz_prompt(request.name, request.quiz_data)
        
        # Call OpenAI
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert career coach and portfolio writer. Generate authentic, compelling portfolio content. Output valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse response
        generated_data = json.loads(response.choices[0].message.content)
        
        # Validate and return
        portfolio_data = GeneratedPortfolioData(**generated_data)
        
        return {
            "success": True,
            "data": portfolio_data.dict()
        }
        
    except Exception as e:
        print(f"[Quiz Generation] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🧪 Testing

### Test Case 1: Entry Level Product Manager

```bash
curl -X POST http://localhost:8000/api/generate-from-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Chen",
    "quiz_data": {
      "role": "Product Manager",
      "experienceLevel": "entry",
      "yearsOfExperience": "0-2 years",
      "industries": ["SaaS", "Technology"],
      "topSkills": ["User Research", "Product Strategy", "Agile/Scrum"],
      "workStyle": ["user-focused", "collaborative"],
      "recentProject": {
        "type": "feature",
        "description": "Led development of new onboarding flow",
        "impact": "Reduced drop-off by 30%"
      },
      "topAchievements": [
        "Shipped first major feature to 10K users",
        "Conducted 25+ user interviews"
      ],
      "careerGoals": "Grow into Senior PM role at product-led company",
      "targetAudience": "Startup hiring managers"
    }
  }'
```

**Expected:**
- 1 career position (Junior/Associate level)
- Enthusiastic, learning-focused tone
- Recent dates (current year)

### Test Case 2: Senior Software Engineer

```bash
curl -X POST http://localhost:8000/api/generate-from-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Kumar",
    "quiz_data": {
      "role": "Software Engineer",
      "experienceLevel": "senior",
      "yearsOfExperience": "5-10 years",
      "industries": ["Finance", "Enterprise"],
      "topSkills": ["System Design", "Python", "Cloud Services", "Leadership"],
      "workStyle": ["technical", "strategic"],
      "recentProject": {
        "type": "optimization",
        "description": "Redesigned payment processing system",
        "impact": "Reduced latency from 2s to 200ms, saved $500K/year"
      },
      "topAchievements": [
        "Architected microservices platform handling 1M requests/day",
        "Led team of 5 engineers",
        "Reduced infrastructure costs by 40%"
      ],
      "careerGoals": "Move into technical leadership or Staff Engineer role",
      "targetAudience": "Tech leads and engineering directors"
    }
  }'
```

**Expected:**
- 2-3 career positions (Senior, Lead titles)
- Confident, technical tone
- Date range spanning 5-10 years
- Technical achievements with metrics

---

## ✨ Quality Checks

Before returning response, validate:
1. ✅ Heading follows exact format: "Hi, I'm [Name] — [Role]"
2. ✅ All 3 tagline suggestions are under 80 characters
3. ✅ whoAreYou is 100-200 words
4. ✅ Number of career positions matches experience level
5. ✅ All achievements are distributed across positions
6. ✅ Dates are realistic and in chronological order
7. ✅ Most recent position reflects recentProject data
8. ✅ Companies list is comma-separated company names

---

## 🚀 Deployment

1. Add endpoint to your FastAPI app
2. Test with all 4 experience levels
3. Deploy to Railway
4. Frontend will immediately start calling `/api/generate-from-quiz`

---

## 📊 Success Metrics

- **Response Time:** < 5 seconds
- **Success Rate:** > 95%
- **Quality:** Generated content should be indistinguishable from manually written portfolios
- **Variety:** Same quiz answers should generate slightly different content each time

---

## 🎯 Summary

**What:** Transform 8-question quiz answers into complete portfolio
**When:** User skips resume upload in onboarding
**Input:** Name + quiz answers (role, experience, skills, project, achievements)
**Output:** Heading, taglines, bio, career highlights
**Method:** AI prompt engineering with structured JSON output
**Time:** < 5 seconds

This makes the manual onboarding flow **just as good as resume upload**! 🎉

