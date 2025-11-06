# Onboarding Flow Redesign

## Overview
Complete redesign of the onboarding flow to match the editor's design system with a step-by-step approach and live preview building gradually.

## New Flow Structure

### Flow Steps (9 Total)

1. **Name Input** - Simple centered form asking for user's name
2. **Resume Upload** - Upload resume or skip to manual entry
3. **Choose Heading** - Select or customize main portfolio heading with live preview
4. **Select Tagline** - Choose from AI-generated suggestions or write custom tagline
5. **About Section** - Add optional "who are you" description
6. **Social Links** - Add LinkedIn, GitHub, Twitter, etc. (optional)
7. **Contact Info** - Add email and phone number (optional)
8. **Profile Picture** - Upload profile photo (optional)
9. **Signup** - Create account with email/password

### Design System Alignment

The new onboarding uses the same design patterns as the core editor:

- **Split-pane layout** - Left side for editing, right side for live preview
- **Progress indicator** - Progress bar at top showing step X of 9
- **Same color scheme** - Gray backgrounds, white cards, indigo/purple accents
- **Same typography** - Matching font sizes, weights, and line heights
- **Same form controls** - Input styles, buttons, and interactions

## Key Features

### Live Preview
- Preview panel on the right shows portfolio building gradually
- Each step adds to the preview in real-time
- Users see exactly how their portfolio will look

### AI-Powered Suggestions
- Resume parsing extracts information automatically
- AI generates tagline suggestions based on role and companies
- AI generates "about" section suggestions

### Flexible Entry Points
- **Resume Upload** - Fast path with AI extraction
- **Manual Entry** - Start from scratch with guided steps
- **Skip Options** - Most fields are optional, can complete later

### Progressive Data Collection
- Start with essentials (name)
- Add optional fields step by step
- No overwhelming forms

## Technical Implementation

### New Components

1. **OnboardingLayout** (`app/onboarding-v2/components/OnboardingLayout.tsx`)
   - Reusable split-pane layout
   - Progress bar and navigation
   - Handles back/next navigation

2. **PortfolioPreview** (`app/onboarding-v2/components/PortfolioPreview.tsx`)
   - Live preview component
   - Shows heading, tagline, about, profile image, social links
   - Matches final portfolio styling

3. **Main Flow** (`app/onboarding-v2/flow/page.tsx`)
   - Single page managing all 9 steps
   - State management for onboarding data
   - Step transitions and validation

### Data Flow

```
1. User completes steps 1-8
   ↓
2. Data stored in React state
   ↓
3. On step 9, data saved to sessionStorage
   ↓
4. User completes signup
   ↓
5. Account created via Supabase Auth
   ↓
6. Data saved to Supabase database
   ↓
7. User redirected to /editor (bypassing dashboard)
```

### Session Storage Keys
- `onboardingData` - Full portfolio data object
- `onboardingEmail` - Email from step 9
- `onboardingPassword` - Password from step 9

### Local Storage Flags
- `freshAuth` - Indicates user just signed up
- `bypassDashboard` - Skip dashboard, go straight to editor

## Updated Files

### New Files
- `app/onboarding-v2/components/OnboardingLayout.tsx`
- `app/onboarding-v2/components/PortfolioPreview.tsx`
- `app/onboarding-v2/flow/page.tsx`

### Modified Files
- `app/onboarding-v2/start/page.tsx` - Now redirects to flow
- `app/onboarding-v2/signup/page.tsx` - Updated to work with new flow
  - Pre-fills email/password from step 9
  - Shows preview summary
  - Redirects to /editor after signup

## Data Format

The onboarding flow collects data in this format:

```typescript
interface OnboardingData {
  fullName: string;
  heading: string;
  tagline: string;
  taglineSuggestions: string[];
  whoAreYou: string;
  email: string;
  phone: string;
  profileImage: string | null;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    icon: string;
  }>;
  source: 'resume' | 'manual';
}
```

This format is fully compatible with the existing `saveCompletePortfolio` function in `lib/database.ts`.

## User Experience Improvements

1. **Visual Feedback** - See portfolio building in real-time
2. **Less Friction** - Optional fields, skip anytime
3. **Consistent Design** - Same look and feel as editor
4. **AI Assistance** - Smart suggestions for content
5. **Fast Onboarding** - Can complete in under 60 seconds
6. **Direct to Editor** - Bypass dashboard for new users

## Future Enhancements

- Add more AI suggestions for social links
- Auto-detect profile picture from LinkedIn
- Add more resume parsing intelligence
- Support more import sources (LinkedIn, PDF, etc.)
- Add onboarding analytics tracking
- A/B test different step orders

## Testing Notes

To test the new flow:

1. Visit `/onboarding-v2/flow` or click "Get Started" on landing page
2. Enter your name
3. Upload a resume or skip
4. Complete the 9 steps
5. Create account on step 9
6. Verify redirect to /editor
7. Check that data is saved in database

## Migration Notes

- Old onboarding flow files can be deprecated
- `/onboarding-v2/start` now redirects to `/onboarding-v2/flow`
- All new signups go through the new flow
- Existing signup page reused and enhanced
- Database schema unchanged - full compatibility

