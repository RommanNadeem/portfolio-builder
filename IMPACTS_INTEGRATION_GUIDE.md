# Structured Impacts Integration Guide

## Overview

The backend now sends **structured, categorized impacts** that provide more context and measurable results for career highlights.

## Impact Data Structure

### Backend Response Format

```json
{
  "careerHighlights": [
    {
      "id": "uuid",
      "organization": "Google",
      "role": "Senior Product Designer",
      "achievements": ["..."],  // Legacy field
      "responsibilities": ["..."],  // Generic duties
      "key_achievements": ["..."],  // Impact descriptions
      
      "impacts": {
        "business": [
          {
            "value": "$2M",
            "metric": "Revenue Generated",
            "description": "Launched premium tier generating $2M ARR",
            "category": "business"
          },
          {
            "value": "45%",
            "metric": "Conversion Rate",
            "description": "Improved checkout flow increasing conversions by 45%",
            "category": "business"
          }
        ],
        "performance": [
          {
            "value": "60%",
            "metric": "Load Time Reduction",
            "description": "Reduced page load from 3.2s to 800ms",
            "category": "performance"
          }
        ],
        "growth": [
          {
            "value": "32%",
            "metric": "User Engagement",
            "description": "Increased daily active users by 32%",
            "category": "growth"
          }
        ],
        "quality": [
          {
            "value": "85%",
            "metric": "Code Coverage",
            "description": "Improved test coverage from 45% to 85%",
            "category": "quality"
          }
        ],
        "team": [
          {
            "value": "5",
            "metric": "Designers Mentored",
            "description": "Mentored 5 junior designers to mid-level",
            "category": "team"
          }
        ],
        "scale": [
          {
            "value": "10x",
            "metric": "Request Capacity",
            "description": "Scaled system to handle 10x more requests",
            "category": "scale"
          }
        ]
      }
    }
  ]
}
```

## Impact Categories

### 1. **Business** 💰
Revenue, sales, conversions, business metrics
- Revenue generated
- Cost savings
- Conversion rates
- Customer acquisition
- ROI improvements

### 2. **Performance** ⚡
Speed, efficiency, optimization
- Load time reduction
- Response time improvements
- Query optimization
- Cache hit rates
- Processing speed

### 3. **Growth** 📈
User growth, engagement, retention
- User growth
- Engagement metrics
- Retention rates
- Active users
- Session duration

### 4. **Quality** ✅
Reliability, testing, bugs, uptime
- Code coverage
- Bug reduction
- Uptime improvements
- Test automation
- Quality scores

### 5. **Team** 👥
People, mentorship, hiring, culture
- Team size grown
- People mentored
- Hiring contributions
- Team efficiency
- Culture initiatives

### 6. **Scale** 🚀
Scalability, capacity, infrastructure
- Request capacity
- Data volume handled
- Infrastructure scale
- System capacity
- Geographic expansion

## How It Flows Through the System

### Step 1: Backend Sends Structured Impacts

```python
# Backend response
{
  "impacts": {
    "business": [
      {
        "value": "$2M",
        "metric": "Revenue Generated",
        "description": "Launched premium tier generating $2M ARR",
        "category": "business"
      }
    ]
  }
}
```

### Step 2: Onboarding Receives and Stores

```typescript
// app/onboarding-v2/flow/page.tsx
careerHighlights: parsed.careerHighlights.map(h => ({
  ...h,
  impacts: h.impacts || undefined, // Store impacts
}))
```

### Step 3: Saved to Database

```typescript
// lib/database.ts
{
  impacts: h.impacts || null, // JSONB field in database
}
```

### Step 4: Career Detail Page Populates

```typescript
// app/detail/career-editor/[id]/page.tsx

// Impact & Results section (index 4) populated with:
metrics: [
  {
    label: "Revenue Generated",
    value: "$2M",
    description: "Launched premium tier generating $2M ARR",
    category: "business"
  },
  // ... all other impacts
]
```

## Display in Career Detail Page

### Impact & Results Section Preview

```
┌─────────────────────────────────────────────────┐
│ IMPACT & RESULTS                                │
├─────────────────────────────────────────────────┤
│                                                 │
│ 💰 Business Impact                             │
│ ┌─────────────────────────────────────────────┐│
│ │ $2M                                         ││
│ │ Revenue Generated                           ││
│ │ Launched premium tier generating $2M ARR    ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ 45%                                         ││
│ │ Conversion Rate                             ││
│ │ Improved checkout flow                      ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ ⚡ Performance                                  │
│ ┌─────────────────────────────────────────────┐│
│ │ 60%                                         ││
│ │ Load Time Reduction                         ││
│ │ Reduced page load from 3.2s to 800ms        ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ 📈 Growth                                       │
│ ┌─────────────────────────────────────────────┐│
│ │ 32%                                         ││
│ │ User Engagement                             ││
│ │ Increased daily active users by 32%         ││
│ └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

## Database Schema

```sql
-- Add impacts column
ALTER TABLE career_highlights 
ADD COLUMN IF NOT EXISTS impacts JSONB DEFAULT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_career_highlights_impacts 
ON career_highlights USING GIN (impacts);
```

## Data Flow Diagram

```
Backend Parse Resume
        ↓
Extract & Categorize Impacts
        ↓
{
  impacts: {
    business: [...],
    performance: [...],
    growth: [...],
    ...
  }
}
        ↓
Onboarding Flow
        ↓
careerHighlights with impacts
        ↓
saveCompletePortfolio()
        ↓
Database (impacts JSONB column)
        ↓
Career Detail Page
        ↓
Impact & Results Section
(Metrics block with all impacts)
```

## TypeScript Types

```typescript
interface Impact {
  value: string;        // "$2M", "60%", "10x"
  metric: string;       // "Revenue Generated", "Load Time"
  description: string;  // Full description
  category: string;     // "business", "performance", etc.
}

interface CareerImpacts {
  business?: Impact[];
  performance?: Impact[];
  growth?: Impact[];
  quality?: Impact[];
  team?: Impact[];
  scale?: Impact[];
}

interface CareerHighlight {
  // ... other fields
  impacts?: CareerImpacts;
}
```

## Usage Examples

### Display Total Impact Count

```typescript
function getTotalImpactCount(impacts: CareerImpacts | undefined): number {
  if (!impacts) return 0;
  
  return Object.values(impacts).reduce((total, category) => {
    return total + (category?.length || 0);
  }, 0);
}

// Usage
const count = getTotalImpactCount(highlight.impacts);
console.log(`${count} measurable impacts`);
```

### Get Impacts by Category

```typescript
function getImpactsByCategory(impacts: CareerImpacts | undefined, category: keyof CareerImpacts): Impact[] {
  return impacts?.[category] || [];
}

// Usage
const businessImpacts = getImpactsByCategory(highlight.impacts, 'business');
```

### Display on Portfolio Card

```typescript
function getTopImpacts(impacts: CareerImpacts | undefined, limit: number = 3): Impact[] {
  if (!impacts) return [];
  
  // Prioritize business and growth impacts for portfolio cards
  const priorityOrder: (keyof CareerImpacts)[] = ['business', 'growth', 'performance', 'quality', 'team', 'scale'];
  
  const allImpacts: Impact[] = [];
  for (const category of priorityOrder) {
    const categoryImpacts = impacts[category] || [];
    allImpacts.push(...categoryImpacts);
  }
  
  return allImpacts.slice(0, limit);
}
```

## Benefits

### For Users
- ✅ Clear categorization of different types of impact
- ✅ Measurable results prominently displayed
- ✅ Easy to see business value, technical improvements, team growth

### For Recruiters
- ✅ Quick scan of quantifiable achievements
- ✅ Understand full scope of impact
- ✅ See both technical and business contributions

### For System
- ✅ Structured data enables better analytics
- ✅ Can aggregate impacts across careers
- ✅ Easy to generate insights and reports

## Validation

```typescript
function validateImpact(impact: any): boolean {
  return (
    typeof impact.value === 'string' &&
    typeof impact.metric === 'string' &&
    typeof impact.description === 'string' &&
    typeof impact.category === 'string' &&
    ['business', 'performance', 'growth', 'quality', 'team', 'scale'].includes(impact.category)
  );
}

function validateImpacts(impacts: any): boolean {
  if (!impacts || typeof impacts !== 'object') return false;
  
  const validCategories = ['business', 'performance', 'growth', 'quality', 'team', 'scale'];
  
  for (const [category, items] of Object.entries(impacts)) {
    if (!validCategories.includes(category)) return false;
    if (!Array.isArray(items)) return false;
    if (!items.every(validateImpact)) return false;
  }
  
  return true;
}
```

## Testing

### Test Data

```typescript
const testCareerWithImpacts = {
  id: 'test-123',
  organization: 'Google',
  role: 'Senior Engineer',
  impacts: {
    business: [
      {
        value: '$2M',
        metric: 'Revenue Generated',
        description: 'Launched premium tier',
        category: 'business'
      }
    ],
    performance: [
      {
        value: '60%',
        metric: 'Load Time',
        description: 'Reduced from 3s to 800ms',
        category: 'performance'
      }
    ]
  }
};
```

### Verify Flow

1. Upload resume with impacts
2. Check onboarding data has impacts
3. Save to database
4. Load career detail page
5. Verify Impact & Results section populated

---

**Status:** ✅ Fully Integrated  
**Backwards Compatible:** ✅ Yes (falls back to achievements)  
**Database Migration:** Required (see ADD_IMPACTS_COLUMN.sql)

