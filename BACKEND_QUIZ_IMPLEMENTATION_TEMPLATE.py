"""
Quiz Flow Backend Implementation Template
Quick-start code for /api/generate-from-quiz endpoint

Copy this into your FastAPI backend and customize as needed.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import openai
import json
from datetime import datetime

router = APIRouter()

# ==================== Models ====================

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

# ==================== Helper Functions ====================

def build_quiz_prompt(name: str, quiz_data: QuizData) -> str:
    """Build the AI prompt from quiz data"""
    
    # Format achievements as numbered list
    achievements_list = '\n'.join(
        f"{i+1}. {achievement}" 
        for i, achievement in enumerate(quiz_data.topAchievements)
        if achievement.strip()
    )
    
    prompt = f"""Generate a professional portfolio structure for this person:

BASIC INFO:
- Name: {name}
- Role: {quiz_data.role}
- Experience Level: {quiz_data.experienceLevel} ({quiz_data.yearsOfExperience})

BACKGROUND:
- Industries: {', '.join(quiz_data.industries)}
- Top Skills: {', '.join(quiz_data.topSkills)}
- Work Style: {', '.join(quiz_data.workStyle)}

RECENT PROJECT:
- Type: {quiz_data.recentProject.type}
- Description: {quiz_data.recentProject.description}
- Impact: {quiz_data.recentProject.impact or 'Not specified'}

TOP ACHIEVEMENTS:
{achievements_list}

GOALS:
- Career Goals: {quiz_data.careerGoals}
- Target Audience: {quiz_data.targetAudience}

INSTRUCTIONS:
Generate a complete, realistic portfolio structure following these rules:

1. HEADING: "Hi, I'm {name} — {quiz_data.role}"

2. TAGLINES: Create 3 variations (max 80 chars each):
   - Blend role with personality from work_style
   - Reference a top achievement if compelling
   - Make them memorable and authentic

3. BIO (whoAreYou): Write 100-200 words in first person:
   - Opening: Introduce role and experience
   - Middle: Mention industries and work style traits
   - Highlight the recent project naturally
   - End with "superpower" or what drives them
   - Tone: Professional but conversational

4. CAREER HIGHLIGHTS: Create realistic positions:
   - {get_position_count_guidance(quiz_data.experienceLevel)}
   - Generate plausible company names based on industries
   - Distribute all achievements across positions
   - Most recent position should incorporate the recent project
   - Add realistic date ranges based on experience level
   - Use appropriate titles for experience level

5. COMPANIES STRING: Comma-separated list of companies

OUTPUT FORMAT: Return ONLY valid JSON matching this structure:
{{
  "heading": "Hi, I'm {name} — {quiz_data.role}",
  "tagline": "First tagline (will be selected by default)",
  "taglineSuggestions": ["tagline1", "tagline2", "tagline3"],
  "whoAreYou": "First person bio...",
  "profession": "{quiz_data.role}",
  "companies": "Company1, Company2",
  "careerHighlights": [
    {{
      "id": "generated_1",
      "organization": "Company Name",
      "role": "Job Title",
      "description": "Brief description",
      "achievements": ["achievement1", "achievement2"],
      "startDate": "2021",
      "endDate": "Present",
      "current": true
    }}
  ]
}}

IMPORTANT: 
- Be authentic and believable
- Make achievements specific with metrics when possible
- Match tone to experience level (junior=enthusiastic, senior=confident)
- Create realistic company names for the industries
- Ensure all dates are chronological and make sense
- Output ONLY the JSON, no markdown or explanations
"""
    
    return prompt

def get_position_count_guidance(experience_level: str) -> str:
    """Get guidance on how many positions to create"""
    guidance = {
        'entry': 'Create 1 position (Junior/Associate level)',
        'mid': 'Create 2 positions (mid-level titles)',
        'senior': 'Create 2-3 positions (Senior/Lead titles)',
        'expert': 'Create 2-3 positions (Senior/Lead/Principal/Director titles)'
    }
    return guidance.get(experience_level, 'Create 1-2 positions')

# ==================== API Endpoint ====================

@router.post('/api/generate-from-quiz')
async def generate_from_quiz(request: GenerateFromQuizRequest):
    """
    Transform quiz answers into complete portfolio data using AI
    
    Args:
        request: User name and quiz data
        
    Returns:
        Generated portfolio structure ready to use
    """
    try:
        print(f"[Quiz Generation] Starting for: {request.name}")
        print(f"[Quiz Generation] Role: {request.quiz_data.role}, Level: {request.quiz_data.experienceLevel}")
        
        # Build the prompt
        prompt = build_quiz_prompt(request.name, request.quiz_data)
        
        print(f"[Quiz Generation] Calling OpenAI...")
        
        # Call OpenAI GPT-4
        response = openai.chat.completions.create(
            model="gpt-4",  # or "gpt-4-turbo-preview" for faster/cheaper
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert career coach and portfolio writer. 
You create authentic, compelling portfolio content that feels professional yet personal.
Always output valid JSON matching the exact structure requested.
Be specific, use metrics, and make content believable."""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,  # Balance creativity and consistency
            response_format={"type": "json_object"},  # Force JSON output
            max_tokens=1500  # Adjust based on needs
        )
        
        # Extract and parse the response
        content = response.choices[0].message.content
        print(f"[Quiz Generation] Raw AI response length: {len(content)} chars")
        
        generated_data = json.loads(content)
        
        # Validate the structure
        portfolio_data = GeneratedPortfolioData(**generated_data)
        
        print(f"[Quiz Generation] ✅ Success! Generated portfolio for {request.name}")
        print(f"[Quiz Generation] - {len(portfolio_data.careerHighlights)} career positions")
        print(f"[Quiz Generation] - {len(portfolio_data.taglineSuggestions)} tagline variations")
        
        return {
            "success": True,
            "data": portfolio_data.dict()
        }
        
    except json.JSONDecodeError as e:
        print(f"[Quiz Generation] ❌ JSON Parse Error: {str(e)}")
        print(f"[Quiz Generation] Raw content: {content[:500]}...")
        raise HTTPException(
            status_code=500,
            detail=f"AI returned invalid JSON: {str(e)}"
        )
        
    except Exception as e:
        print(f"[Quiz Generation] ❌ Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate portfolio: {str(e)}"
        )

# ==================== Example Usage ====================

"""
To use this endpoint:

1. Add to your FastAPI app:
   
   from this_file import router
   app.include_router(router)

2. Set up OpenAI:
   
   import openai
   openai.api_key = os.getenv("OPENAI_API_KEY")

3. Test with curl:
   
   curl -X POST http://localhost:8000/api/generate-from-quiz \
     -H "Content-Type: application/json" \
     -d @test_quiz.json

Where test_quiz.json contains the request format shown in QUIZ_FLOW_BACKEND_REQUIREMENTS.md
"""

# ==================== Testing ====================

def test_prompt_building():
    """Test that prompt builds correctly"""
    from pydantic import BaseModel
    
    # Create sample quiz data
    quiz_data = QuizData(
        role="Product Manager",
        experienceLevel="mid",
        yearsOfExperience="2-5 years",
        industries=["SaaS", "Technology"],
        topSkills=["Product Strategy", "User Research", "Data Analysis"],
        workStyle=["data-driven", "collaborative"],
        recentProject=RecentProject(
            type="new_product",
            description="Built analytics dashboard",
            impact="Increased engagement by 40%"
        ),
        topAchievements=[
            "Led team that grew revenue by 150%",
            "Shipped feature to 1M users"
        ],
        careerGoals="Grow into Senior PM",
        targetAudience="Startup hiring managers"
    )
    
    prompt = build_quiz_prompt("John Doe", quiz_data)
    
    assert "John Doe" in prompt
    assert "Product Manager" in prompt
    assert "2-5 years" in prompt
    assert "SaaS" in prompt
    assert "data-driven" in prompt
    
    print("✅ Prompt building works correctly")
    print(f"Prompt length: {len(prompt)} chars")
    
    return prompt

if __name__ == "__main__":
    # Run test
    prompt = test_prompt_building()
    print("\n=== SAMPLE PROMPT ===")
    print(prompt)

