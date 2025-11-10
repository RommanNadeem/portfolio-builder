# Frontend: Responsibilities vs Key Achievements Implementation Guide

## Overview

This guide shows how to use the separated `responsibilities` and `key_achievements` fields in the frontend to create more impactful career highlights.

## Data Structure

```typescript
interface CareerHighlight {
  // Basic info
  organization: string;
  role: string;
  
  // Legacy field - kept for backwards compatibility
  achievements: string[];
  
  // NEW: Separated fields
  responsibilities?: string[];    // Generic duties/tasks
  key_achievements?: string[];   // Impact-focused with metrics
  
  featured_achievements?: number[]; // Indices of KEY_ACHIEVEMENTS to show on card
}
```

## Usage Patterns

### Pattern 1: Backwards Compatibility

For users who haven't updated to the new backend yet:

```typescript
function getDisplayAchievements(highlight: CareerHighlight): string[] {
  // Use key_achievements if available, fall back to achievements
  return highlight.key_achievements && highlight.key_achievements.length > 0
    ? highlight.key_achievements
    : highlight.achievements;
}

function getResponsibilities(highlight: CareerHighlight): string[] {
  // Use responsibilities if available, otherwise empty
  return highlight.responsibilities || [];
}
```

### Pattern 2: Featured Achievements (Portfolio Cards)

```typescript
function getFeaturedAchievements(highlight: CareerHighlight): string[] {
  // Get key achievements (impact-focused)
  const keyAchievements = highlight.key_achievements || highlight.achievements;
  
  if (!keyAchievements || keyAchievements.length === 0) return [];
  
  // Use featured indices if set
  if (highlight.featured_achievements && highlight.featured_achievements.length > 0) {
    return highlight.featured_achievements
      .filter(idx => idx < keyAchievements.length)
      .map(idx => keyAchievements[idx]);
  }
  
  // Default to first 3 key achievements
  return keyAchievements.slice(0, 3);
}
```

### Pattern 3: Career Detail Page

```typescript
function populateCareerTemplate(highlight: CareerHighlight, template: Template) {
  // Responsibilities go in "Responsibilities" bullets section
  if (highlight.responsibilities && highlight.responsibilities.length > 0) {
    const responsibilitiesSection = template.sections.find(s => s.type === 'bullets');
    if (responsibilitiesSection) {
      responsibilitiesSection.data.bullets = highlight.responsibilities;
    }
  }
  
  // Key achievements go in "Key Achievements" feature grid
  if (highlight.key_achievements && highlight.key_achievements.length > 0) {
    const achievementsSection = template.sections.find(s => s.type === 'feature_grid');
    if (achievementsSection) {
      achievementsSection.data.items = highlight.key_achievements.map(achievement => ({
        title: achievement,
        body: '',
        iconKey: '⭐'
      }));
    }
  }
  
  // Fall back to legacy achievements if new fields not present
  if (!highlight.key_achievements && highlight.achievements) {
    const achievementsSection = template.sections.find(s => s.type === 'feature_grid');
    if (achievementsSection) {
      achievementsSection.data.items = highlight.achievements.map(achievement => ({
        title: achievement,
        body: '',
        iconKey: '⭐'
      }));
    }
  }
}
```

## UI Implementation Examples

### CareerPreview Component

```typescript
export function CareerPreview({ highlights }: { highlights: CareerHighlight[] }) {
  return (
    <div>
      {highlights.map(highlight => {
        // Get key achievements for display
        const keyAchievements = highlight.key_achievements || highlight.achievements || [];
        const featured = getFeaturedAchievements(highlight);
        
        return (
          <div key={highlight.id} className="career-card">
            <h3>{highlight.organization}</h3>
            <p>{highlight.role}</p>
            
            {/* Show key achievements prominently */}
            {featured.length > 0 && (
              <div className="key-achievements">
                <h4>Key Achievements</h4>
                <ul>
                  {featured.map((achievement, idx) => (
                    <li key={idx}>
                      <strong>⭐</strong> {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Indicate if more achievements exist */}
            {keyAchievements.length > 3 && (
              <p className="more-link">
                View all {keyAchievements.length} achievements →
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### CareerEditor Component

```typescript
export function CareerEditor({ highlight, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'responsibilities'>('achievements');
  
  return (
    <div>
      {/* Tab Selector */}
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('achievements')}
          className={activeTab === 'achievements' ? 'active' : ''}
        >
          Key Achievements ({highlight.key_achievements?.length || 0})
        </button>
        <button 
          onClick={() => setActiveTab('responsibilities')}
          className={activeTab === 'responsibilities' ? 'active' : ''}
        >
          Responsibilities ({highlight.responsibilities?.length || 0})
        </button>
      </div>
      
      {/* Key Achievements Tab */}
      {activeTab === 'achievements' && (
        <div>
          <p className="hint">
            Focus on measurable impact, metrics, and specific accomplishments.
            Include numbers, percentages, and quantifiable results.
          </p>
          {(highlight.key_achievements || []).map((achievement, idx) => (
            <div key={idx} className="achievement-item">
              <button
                onClick={() => toggleFeatured(idx)}
                className={isFeatured(idx) ? 'featured' : ''}
              >
                <Star />
              </button>
              <textarea
                value={achievement}
                onChange={(e) => updateKeyAchievement(idx, e.target.value)}
                placeholder="e.g., Increased user engagement by 32% through A/B testing..."
              />
              <button onClick={() => removeKeyAchievement(idx)}>
                <Trash />
              </button>
            </div>
          ))}
          <button onClick={addKeyAchievement}>
            + Add Key Achievement
          </button>
        </div>
      )}
      
      {/* Responsibilities Tab */}
      {activeTab === 'responsibilities' && (
        <div>
          <p className="hint">
            General duties and ongoing tasks. These won't appear on your
            portfolio card but will be included in your detailed career page.
          </p>
          {(highlight.responsibilities || []).map((resp, idx) => (
            <div key={idx} className="responsibility-item">
              <textarea
                value={resp}
                onChange={(e) => updateResponsibility(idx, e.target.value)}
                placeholder="e.g., Managed a team of 5 engineers..."
              />
              <button onClick={() => removeResponsibility(idx)}>
                <Trash />
              </button>
            </div>
          ))}
          <button onClick={addResponsibility}>
            + Add Responsibility
          </button>
        </div>
      )}
    </div>
  );
}
```

## Onboarding Integration

### After Resume Upload

```typescript
async function handleResumeUpload(file: File) {
  const { data: parsed } = await parseResume(file);
  
  const careerHighlights = (parsed.careerHighlights || []).map(exp => {
    // Check if backend provides separated fields
    const hasNewFields = exp.key_achievements && exp.key_achievements.length > 0;
    
    if (hasNewFields) {
      // Use new separated fields
      const featuredCount = Math.min(3, exp.key_achievements.length);
      
      return {
        id: exp.id,
        organization: exp.organization,
        role: exp.role,
        // Keep achievements for backwards compatibility
        achievements: exp.achievements,
        // Use separated fields
        responsibilities: exp.responsibilities,
        key_achievements: exp.key_achievements,
        // Feature top 3 key achievements
        featured_achievements: Array.from({ length: featuredCount }, (_, i) => i),
        // ... other fields
      };
    } else {
      // Fall back to legacy format
      return {
        id: exp.id,
        organization: exp.organization,
        role: exp.role,
        achievements: exp.achievements,
        // Default to featuring first 3
        featured_achievements: Array.from(
          { length: Math.min(3, exp.achievements.length) }, 
          (_, i) => i
        ),
        // ... other fields
      };
    }
  });
  
  setData({ ...data, careerHighlights });
}
```

## Display Guidelines

### Portfolio Card (Main View)
**Show:** Key Achievements only (top 3 featured)
**Reason:** Maximum impact, catch attention with measurable results

### Career Detail Page
**Show:** Both sections separately
- **Key Achievements** - Prominent feature grid at top
- **Responsibilities** - Bullet list in dedicated section

### Resume Export
**Show:** Both combined
- Key achievements first (most impactful)
- Responsibilities after

## Styling Recommendations

```css
/* Key Achievements - Make them stand out */
.key-achievements li {
  position: relative;
  padding-left: 24px;
  font-weight: 500;
  color: #1a1a1a;
}

.key-achievements li::before {
  content: '⭐';
  position: absolute;
  left: 0;
  font-size: 16px;
}

/* Highlight metrics in achievements */
.key-achievements strong {
  color: #2563eb; /* Blue for numbers/metrics */
  font-weight: 600;
}

/* Responsibilities - More subtle */
.responsibilities li {
  position: relative;
  padding-left: 20px;
  color: #666;
  font-size: 14px;
}

.responsibilities li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #999;
}
```

## Migration Strategy

### Phase 1: Soft Launch (Current)
- Types updated to include new fields
- Backend can send new fields (optional)
- Frontend supports both old and new formats
- Featured achievements work with either field

### Phase 2: Backend Deployment
- Backend starts classifying bullets
- Sends both `achievements` (legacy) and new fields
- Frontend gradually adopts new fields
- No breaking changes

### Phase 3: UI Enhancement
- Add separate tabs in editor for achievements vs responsibilities
- Update preview to emphasize key achievements
- Add tooltips explaining the difference
- Add examples/placeholders

### Phase 4: Gradual Deprecation
- New users only see new fields
- Existing users can migrate (one-time prompt)
- Legacy `achievements` field kept for very old data

## Testing Checklist

- [ ] Resume upload with new backend format works
- [ ] Resume upload with legacy format still works
- [ ] Featured achievements pull from key_achievements
- [ ] Responsibilities appear in detail page
- [ ] Backwards compatibility maintained
- [ ] Database saves both fields correctly
- [ ] Migration doesn't break existing portfolios
- [ ] UI clearly distinguishes between types

---

**Status:** Frontend types updated, ready for backend integration
**Backwards Compatible:** Yes - falls back to legacy `achievements` field
**Breaking Changes:** None

