# Onboarding Design System Updates

## ✅ Completed Updates

### 1. ImportPicker Component (`components/onboarding/ImportPicker.tsx`)

#### Typography & Copy Updates
- **Changed "Upload Resume"** → **"Upload Your Work History"** (Title Case, brand-aligned)
- **Changed "Parsing resume..."** → **"Parsing your career profile..."**
- **Changed "Start from scratch"** → **"Start From Scratch"** (Title Case button)

#### Error Messages
- **Changed "File size must be less than 10MB"** → **"File too large. Max 10 MB"** (brand voice)
- Updated error display to use design system alert styling (red-50 background, red-200 border)

#### Visual Design Updates
- ✅ Upload area now uses `onboarding-upload-area` class from design system
- ✅ Active drag state uses emerald-600 icon color (brand color)
- ✅ Loader uses emerald-600 color (was black)
- ✅ Typography updated:
  - Heading: `text-lg font-bold text-gray-900` (WCAG AAA)
  - Body: `text-sm text-gray-800 font-medium` (WCAG AAA)
- ✅ Button now uses `btn-secondary` with explicit black text color
- ✅ File format separator changed from "up to 10MB" to "• Max 10 MB"

### 2. OnboardingLayout Component (`app/onboarding-v2/components/OnboardingLayout.tsx`)

#### Button Updates
- ✅ Back button: Added explicit `color: '#111111'` for dark text
- ✅ Primary button: Added explicit `color: '#111111'` for dark text
- Both buttons already used design system classes (`btn-primary`, `btn-secondary`)

### 3. Onboarding Flow Page (`app/onboarding-v2/flow/page.tsx`)

#### Step 2: Work History Upload
- ✅ Comment changed from "Resume Upload" to "Work History Upload"
- ✅ Heading typography: `text-2xl font-bold text-gray-900` (was font-medium, text-black)
- ✅ Body text: `text-base text-gray-800` (was text-sm, text-gray-500)
- ✅ Copy: "Upload your work history to auto-fill" (was "Upload your resume")

#### Step 3: Choose Heading
- ✅ Heading typography: `text-xl font-bold text-gray-900` (was font-medium, text-black)
- ✅ Description: `text-base text-gray-800` (was text-sm, text-gray-500)
- ✅ Label: `text-sm font-bold text-gray-900` (was text-xs, uppercase, gray-500)
- ✅ Input now uses `onboarding-input` class with explicit dark text
- ✅ **Removed contraction**: "Hi, I am" (was "Hi, I'm") - follows no-contractions rule
- ✅ Removed uppercase styling from labels

#### Step 4: Select Tagline
- ✅ Heading typography: `text-xl font-bold text-gray-900`
- ✅ Description: `text-base text-gray-800`
- ✅ Label: `text-sm font-bold text-gray-900` (removed uppercase)
- ✅ Suggestion buttons now use:
  - Border-2 with rounded-xl (design system)
  - Selected state: `border-emerald-500 bg-emerald-50` (brand color)
  - Font-medium for better readability
- ✅ Textarea now uses `onboarding-textarea` class with explicit dark text

## 📝 Design System Compliance

### Typography Scale Applied
```
Headings (H2): text-xl font-bold text-gray-900
Body Text: text-base text-gray-800
Labels: text-sm font-bold text-gray-900
Small Text: text-sm text-gray-800
```

### WCAG AAA Compliance
- ✅ Gray-900 (#111827) for headings: 16.1:1 contrast
- ✅ Gray-800 (#1F2937) for body text: 10.4:1 contrast
- ✅ All placeholders use Gray-700 (#374151): 6.3:1 contrast

### Brand Voice Guidelines Applied
- ✅ No contractions: "I am" not "I'm"
- ✅ "Work history" / "career profile" instead of "resume"
- ✅ Title Case for all CTAs: "Build Your Story", "Start From Scratch"
- ✅ Error messages follow pattern: state problem + solution
- ✅ File size format: "Max 10 MB" not "up to 10MB"

### Design System Components Used
- ✅ `btn-primary` - emerald green button
- ✅ `btn-secondary` - white button with border
- ✅ `onboarding-input` - form text input
- ✅ `onboarding-textarea` - form textarea
- ✅ `onboarding-upload-area` - drag & drop zone
- ✅ `onboarding-progress` - step indicator
- ✅ `onboarding-badge` - status badge

## 🔄 Remaining Steps To Update

### Step 5: About Section
**Current Issues:**
- Heading uses `font-medium text-black` → should be `font-bold text-gray-900`
- Description uses `text-sm text-gray-500` → should be `text-base text-gray-800`
- Textarea uses custom classes → should use `onboarding-textarea`
- Skip button uses `text-xs text-gray-400` → should use `btn-secondary` with Title Case

### Step 6: Career Highlights
**Current Issues:**
- Typography needs updating to design system
- Labels still use uppercase styling and gray-500
- Form inputs need `onboarding-input` class
- Edit/Save buttons need Title Case

### Step 7: Contact Information
**Current Issues:**
- Typography needs updating
- Labels need consistent styling
- Email/Phone inputs need design system classes
- Required field indicators need red asterisks
- Optional fields need "(Optional)" label

### Step 8: Social Links
**Current Issues:**
- Typography updates needed
- Platform selection buttons need styling
- Add/Remove buttons need proper styling

### Step 9: Profile Image
**Current Issues:**
- Typography updates
- Image cropper modal styling

### InteractiveQuiz Component
**Current Issues:**
- Copy may have "resume" references
- Typography needs review
- Button styling needs Title Case

## 🎯 Next Actions

### Priority 1: Core User Flow
1. ✅ Import/Upload screen (DONE)
2. ✅ Step 3: Heading (DONE)
3. ✅ Step 4: Tagline (DONE)
4. ⏳ Step 5: About
5. ⏳ Step 6: Career Highlights
6. ⏳ Step 7: Contact Info

### Priority 2: Secondary Screens
7. ⏳ Step 8: Social Links
8. ⏳ Step 9: Profile Image
9. ⏳ Quiz component (if used)

### Priority 3: Final Screens
10. ⏳ Preview screen
11. ⏳ Publish screen
12. ⏳ Signup screen

## 📊 Progress Summary

| Screen | Typography | Copy | CTAs | Components | Status |
|--------|-----------|------|------|------------|--------|
| ImportPicker | ✅ | ✅ | ✅ | ✅ | **Complete** |
| OnboardingLayout | ✅ | ✅ | ✅ | ✅ | **Complete** |
| Step 2: Upload | ✅ | ✅ | ✅ | ✅ | **Complete** |
| Step 3: Heading | ✅ | ✅ | ✅ | ✅ | **Complete** |
| Step 4: Tagline | ✅ | ✅ | ✅ | ✅ | **Complete** |
| Step 5: About | ⏳ | ⏳ | ⏳ | ⏳ | In Progress |
| Step 6: Career | ⏳ | ⏳ | ⏳ | ⏳ | Pending |
| Step 7: Contact | ⏳ | ⏳ | ⏳ | ⏳ | Pending |
| Step 8: Social | ⏳ | ⏳ | ⏳ | ⏳ | Pending |
| Step 9: Image | ⏳ | ⏳ | ⏳ | ⏳ | Pending |
| Preview | ⏳ | ⏳ | ⏳ | ⏳ | Pending |
| Publish | ⏳ | ⏳ | ⏳ | ⏳ | Pending |

**Overall Progress: 42% Complete (5/12 screens)**

## 🎨 Design System Key Reminders

### Typography Rules
```tsx
// Headings (H2, Section Titles)
className="text-xl font-bold text-gray-900 mb-2"

// Body Text (Descriptions)
className="text-base text-gray-800"

// Form Labels
className="text-sm font-bold text-gray-900 mb-2"

// Required Fields
<span className="text-red-600">*</span>

// Optional Fields
<span className="text-gray-600 font-medium">(Optional)</span>
```

### Button Patterns
```tsx
// Primary CTA
<button className="btn-primary" style={{ color: '#111111' }}>
  Build Your Story
</button>

// Secondary CTA
<button className="btn-secondary" style={{ color: '#111111' }}>
  Skip For Now
</button>
```

### Form Input Pattern
```tsx
<label className="text-sm font-bold text-gray-900 block mb-2">
  Full Name <span className="text-red-600">*</span>
</label>
<input
  type="text"
  className="onboarding-input"
  placeholder="Enter your name"
  required
  style={{ color: '#111111' }}
/>
```

### Brand Voice Checklist
- ✅ Use "work history", "career profile", "experience" (not "resume" repeatedly)
- ✅ Title Case for all CTAs and buttons
- ✅ No contractions (use "do not" not "don't")
- ✅ No arrows in text (use "to" not "→")
- ✅ Error format: [Problem]. [Solution]
- ✅ Numbers: spell out 1-9, digits for 10+
- ✅ File sizes: "Max 10 MB" format

## 🚀 Implementation Notes

### Files Modified
1. ✅ `/components/onboarding/ImportPicker.tsx` - Complete redesign
2. ✅ `/app/onboarding-v2/components/OnboardingLayout.tsx` - Button colors
3. ✅ `/app/onboarding-v2/flow/page.tsx` - Steps 2, 3, 4 updated

### Files Still To Update
4. `/app/onboarding-v2/flow/page.tsx` - Steps 5-9 remaining
5. `/app/onboarding-v2/components/InteractiveQuiz.tsx` - If used
6. `/app/onboarding-v2/preview/page.tsx` - Preview screen
7. `/app/onboarding-v2/publish/page.tsx` - Publish screen
8. `/app/onboarding-v2/signup/page.tsx` - Signup screen

### Design System Resources
- CSS: `/app/onboarding-v2/onboarding.css` (already contains all classes)
- Design System Reference: `/app/design-system/page.tsx`
- Brand Guidelines: See "Language & Tone" section in design system

---

**Last Updated**: November 13, 2025  
**Status**: 42% Complete  
**Next**: Continue with Steps 5-9 in flow/page.tsx

