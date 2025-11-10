# Career Achievements Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Resume     │──────▶│  Onboarding  │──────▶│    Editor    │
│   Upload     │      │     Flow     │      │   (Main)     │
└──────────────┘      └──────────────┘      └──────────────┘
      │                      │                      │
      │ Extract ALL          │ Show First 3        │ Manage Featured
      │ Achievements         │ + "X more"          │ Star Icons
      │                      │                     │
      ▼                      ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ACHIEVEMENT STORAGE                               │
│  achievements: ["Achievement 1", "Achievement 2", ... "Achievement N"]│
│  featured_achievements: [0, 2, 4]  ← Indices of top 3               │
└─────────────────────────────────────────────────────────────────────┘
      │                      │                     │
      │                      │                     │
      ▼                      ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Portfolio   │      │   Detail     │      │   View All   │
│    Card      │      │     Page     │      │   (>4)       │
└──────────────┘      └──────────────┘      └──────────────┘
   Show Top 3          Show ALL              Show First 4
   + "View All"        Achievements          + "View All"
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CareerEditor.tsx                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Career Card                                                │    │
│  │  ┌──────────────────────────────────────────────────┐      │    │
│  │  │  Organization: Google                             │      │    │
│  │  │  Role: Senior Product Designer                    │      │    │
│  │  │  Description: Led product design...               │      │    │
│  │  │  Dates: Jan 2020 - Present                        │      │    │
│  │  └──────────────────────────────────────────────────┘      │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────┐      │    │
│  │  │  Featured Achievements (3 of 8) [Show All ▼]     │      │    │
│  │  │                                                   │      │    │
│  │  │  ⭐ Achievement 1 [Edit] [×]                      │      │    │
│  │  │  ☆ Achievement 2 [Edit] [×]                      │      │    │
│  │  │  ⭐ Achievement 3 [Edit] [×]                      │      │    │
│  │  │                                                   │      │    │
│  │  │  [+ Add Achievement]                              │      │    │
│  │  └──────────────────────────────────────────────────┘      │    │
│  │                                                             │    │
│  │  [Create Detailed Career Page]                             │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

                            │
                            │ Click "Create Detail Page"
                            ▼

┌─────────────────────────────────────────────────────────────────────┐
│              Career Detail Page (/detail/career-editor/[id])         │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Hero Section                                               │    │
│  │  • Organization (auto-populated)                            │    │
│  │  • Role (auto-populated)                                    │    │
│  │  • Description (auto-populated)                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Responsibilities (Bullets)                                 │    │
│  │  • ALL achievements auto-populated here                     │    │
│  │  • Edit syncs back to main editor                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Key Achievements (Feature Grid)                            │    │
│  │  • ALL achievements auto-populated here                     │    │
│  │  • Edit syncs back to main editor                           │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

                            │
                            │ Edits sync back
                            ▼

┌─────────────────────────────────────────────────────────────────────┐
│                        CareerPreview.tsx                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Career Highlights                                          │    │
│  │                                                             │    │
│  │  ┌─────────────────┐  ┌─────────────────┐                 │    │
│  │  │ Google          │  │ Meta            │                 │    │
│  │  │ Sr. Designer    │  │ Lead Designer   │                 │    │
│  │  │ • Achievement 1 │  │ • Achievement 1 │                 │    │
│  │  │ • Achievement 2 │  │ • Achievement 2 │                 │    │
│  │  │ • Achievement 3 │  │ • Achievement 3 │                 │    │
│  │  │ [View all 8 →] │  │                 │                 │    │
│  │  └─────────────────┘  └─────────────────┘                 │    │
│  │                                                             │    │
│  │  ┌─────────────────┐  ┌─────────────────┐                 │    │
│  │  │ Apple           │  │ Startup Inc     │                 │    │
│  │  │ Designer        │  │ Designer        │                 │    │
│  │  │ • Achievement 1 │  │ • Achievement 1 │                 │    │
│  │  │ • Achievement 2 │  │ • Achievement 2 │                 │    │
│  │  │ • Achievement 3 │  │ • Achievement 3 │                 │    │
│  │  └─────────────────┘  └─────────────────┘                 │    │
│  │                                                             │    │
│  │          [View All 6 Career Highlights ▼]                  │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────────┘

Resume Upload
     │
     ▼
┌─────────────────────────────┐
│   Railway Backend API       │
│   parseResume()             │
│   • Extracts ALL achievements│
│   • No limits               │
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│   Onboarding Mapper         │
│   • Maps to editor format   │
│   • Sets first 3 as featured│
│   featured_achievements: [0,1,2]
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│   localStorage              │
│   Key: 'portfolioData'      │
│   • Primary source of truth │
│   • Instant updates         │
└─────────────────────────────┘
     │
     ├─────────────────────────┐
     │                         │
     ▼                         ▼
┌───────────────┐     ┌──────────────────┐
│   Supabase    │     │   React State    │
│   Database    │     │   • UI state     │
│   • Persists  │     │   • Expanded     │
│   • Syncs     │     │   • Selected     │
│   • 2.5s      │     └──────────────────┘
│     debounce  │
└───────────────┘
```

## Featured Achievements Logic

```
┌─────────────────────────────────────────────────────────────────────┐
│                  FEATURED ACHIEVEMENTS SELECTION                     │
└─────────────────────────────────────────────────────────────────────┘

User has 8 achievements:
┌─────────────────────────────────────────────────────────────────────┐
│  Index  │  Achievement                         │  Featured?  │ Star │
│─────────┼──────────────────────────────────────┼─────────────┼──────│
│    0    │  Shipped 15+ features                │     ✅      │  ⭐   │
│    1    │  Improved engagement by 32%          │     ❌      │  ☆   │
│    2    │  Mentored 5 junior designers         │     ✅      │  ⭐   │
│    3    │  Won company design award            │     ❌      │  ☆   │
│    4    │  Led redesign of mobile app          │     ✅      │  ⭐   │
│    5    │  Increased conversion by 20%         │     ❌      │  ☆   │
│    6    │  Spoke at 3 conferences              │     ❌      │  ☆   │
│    7    │  Published design system             │     ❌      │  ☆   │
└─────────────────────────────────────────────────────────────────────┘

                            │
                            ▼
                            
featured_achievements: [0, 2, 4]

                            │
                            ▼

┌─────────────────────────────────────────────────────────────────────┐
│                    PORTFOLIO CARD DISPLAYS                           │
│                                                                      │
│  • Shipped 15+ features                                             │
│  • Mentored 5 junior designers                                      │
│  • Led redesign of mobile app                                       │
│                                                                      │
│  [View all 8 achievements →]                                        │
└─────────────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STATE LAYERS                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐
│   UI State (React)          │
│   • expandedAchievements    │
│   • showAll                 │
│   • isEditing               │
│   Lifecycle: Component      │
└─────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Application State         │
│   (localStorage)            │
│   • achievements[]          │
│   • featured_achievements[] │
│   • achievements_order[]    │
│   Lifecycle: Session        │
└─────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Persistent State          │
│   (Supabase)                │
│   • All career data         │
│   • Cross-device sync       │
│   • Backup                  │
│   Lifecycle: Permanent      │
└─────────────────────────────┘
```

## Achievement Operations

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CRUD OPERATIONS                                  │
└─────────────────────────────────────────────────────────────────────┘

CREATE Achievement:
  handleAddAchievement(careerId)
    ↓
  achievements.push(newAchievement)
    ↓
  Update localStorage
    ↓
  Auto-save to database (debounced)

────────────────────────────────────────────────────────────────────────

UPDATE Achievement:
  handleAchievementUpdate(careerId, index, newText)
    ↓
  achievements[index] = newText
    ↓
  Update localStorage
    ↓
  Auto-save to database (debounced)

────────────────────────────────────────────────────────────────────────

DELETE Achievement:
  handleRemoveAchievement(careerId, index)
    ↓
  achievements.splice(index, 1)
    ↓
  Adjust featured_achievements indices
    ↓
  Update localStorage
    ↓
  Auto-save to database (debounced)

────────────────────────────────────────────────────────────────────────

TOGGLE Featured:
  toggleFeatured(careerId, index)
    ↓
  IF index in featured_achievements:
    Remove from featured_achievements
  ELSE IF featured_achievements.length < 3:
    Add to featured_achievements
  ELSE:
    Replace last featured with this index
    ↓
  Update localStorage
    ↓
  Auto-save to database (debounced)
```

## Sync Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TWO-WAY SYNC FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐                           ┌──────────────────┐
│  Career Editor   │◄─────────Sync─────────────▶│   Detail Page    │
│  (Main)          │                           │  (Template)      │
└──────────────────┘                           └──────────────────┘
         │                                              │
         │                                              │
         ├──────────────────┬───────────────────────────┤
         │                  │                           │
         ▼                  ▼                           ▼
┌──────────────┐   ┌──────────────┐          ┌──────────────┐
│ achievements │   │   featured   │          │   blocks     │
│     []       │   │ achievements │          │     []       │
└──────────────┘   └──────────────┘          └──────────────┘
         │                  │                           │
         │                  │                           │
         └──────────────────┴───────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   localStorage   │
                  │  'portfolioData' │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │    Supabase      │
                  │career_highlights │
                  └──────────────────┘

Sync Triggers:
  • User edits achievement in editor → Update localStorage → Debounced save
  • User edits achievement in detail page → Update localStorage → Update editor
  • User navigates between pages → Load from localStorage
  • Auto-save timer (2.5s) → Save to database
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────┐
│                    career_highlights table                           │
└─────────────────────────────────────────────────────────────────────┘

Column Name              Type        Nullable   Default      Notes
──────────────────────────────────────────────────────────────────────
id                      UUID         NO         gen_random   PK
user_id                 UUID         NO         -            FK
organization            TEXT         NO         -            
role                    TEXT         NO         -            
description             TEXT         YES        NULL         
link                    TEXT         YES        NULL         
achievements            JSONB        YES        []           All achievements
featured_achievements   JSONB        YES        NULL         ← NEW (indices)
achievements_order      JSONB        YES        NULL         ← NEW (order)
start_date              TEXT         YES        NULL         
end_date                TEXT         YES        NULL         
is_current              BOOLEAN      YES        false        
blocks                  JSONB        YES        NULL         Template blocks
template_type           TEXT         YES        NULL         
published               BOOLEAN      YES        false        
published_at            TIMESTAMPTZ  YES        NULL         
display_order           INT          YES        NULL         
created_at              TIMESTAMPTZ  YES        now()        
updated_at              TIMESTAMPTZ  YES        now()        

Indexes:
  • PRIMARY KEY on id
  • INDEX on user_id
  • INDEX on display_order
  • GIN INDEX on featured_achievements ← NEW
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE STRATEGY                              │
└─────────────────────────────────────────────────────────────────────┘

1. Lazy Loading
   ┌────────────────────────────┐
   │  First 4 careers loaded    │
   │  Rest loaded on "View All" │
   │  Reduces initial render     │
   └────────────────────────────┘

2. Debounced Saves
   ┌────────────────────────────┐
   │  User types...             │
   │  Wait 2.5 seconds          │
   │  Then save to database     │
   │  Prevents excessive writes │
   └────────────────────────────┘

3. localStorage First
   ┌────────────────────────────┐
   │  Read/write localStorage   │
   │  (instant, synchronous)    │
   │  Database in background    │
   │  (async, debounced)        │
   └────────────────────────────┘

4. Indexed Queries
   ┌────────────────────────────┐
   │  GIN index on JSONB        │
   │  Fast featured queries     │
   │  Efficient sorting         │
   └────────────────────────────┘

5. Smart Rendering
   ┌────────────────────────────┐
   │  Only featured on cards    │
   │  Full list on demand       │
   │  Reduces DOM nodes         │
   └────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING STRATEGY                           │
└─────────────────────────────────────────────────────────────────────┘

Defensive Programming:
  ✓ Null checks everywhere
  ✓ Array bounds validation
  ✓ Fallback to defaults
  ✓ Try-catch on database ops

Graceful Degradation:
  Database fails → Use localStorage
  localStorage fails → Show error, keep working
  Invalid data → Show defaults
  Missing fields → Auto-initialize

User Feedback:
  • Save indicator shows status
  • Console logs for debugging
  • Error messages user-friendly
  • No silent failures
```

## Testing Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TEST COVERAGE                                 │
└─────────────────────────────────────────────────────────────────────┘

Unit Tests (Potential):
  ✓ getFeaturedAchievements()
  ✓ toggleFeatured()
  ✓ handleRemoveAchievement()
  ✓ Index adjustment logic

Integration Tests (Potential):
  ✓ Editor → Detail page sync
  ✓ localStorage → Database sync
  ✓ Onboarding → Editor flow

Manual Tests (Completed):
  ✓ Add/edit/delete achievements
  ✓ Feature/unfeature achievements
  ✓ View all functionality
  ✓ Cross-page sync
  ✓ Database persistence
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

1. Database Migration
   ┌────────────────────────────┐
   │  Run SQL migration         │
   │  ADD_FEATURED_ACHIEVEMENTS │
   │  Creates new columns       │
   └────────────────────────────┘
               │
               ▼
2. Frontend Build
   ┌────────────────────────────┐
   │  TypeScript compile        │
   │  Lint check                │
   │  Bundle optimization       │
   └────────────────────────────┘
               │
               ▼
3. Staging Deploy
   ┌────────────────────────────┐
   │  Test all flows            │
   │  Verify database           │
   │  Check performance         │
   └────────────────────────────┘
               │
               ▼
4. Production Deploy
   ┌────────────────────────────┐
   │  Deploy frontend           │
   │  Monitor errors            │
   │  User feedback             │
   └────────────────────────────┘
```

---

**Architecture:** ✅ Scalable, Maintainable, Performant  
**Documentation:** ✅ Comprehensive  
**Status:** 🟢 Production Ready

