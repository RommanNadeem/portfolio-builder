# Onboarding Design System Guide
## Based on Ctrl.xyz Aesthetic

This design system applies the clean, pastel-based Ctrl.xyz theme to your onboarding flow while maintaining all existing functionality.

## 📁 Files

- **Design System**: `/app/onboarding-v2/onboarding.css`
- **Updated Layout**: `/app/onboarding-v2/components/OnboardingLayout.tsx`

## 🎨 Design Principles

### 1. **Color System**
```css
/* Pastel Backgrounds */
--pastel-blue: #DBEAFE    /* For informational elements */
--pastel-pink: #FCE7F3    /* For creative/design elements */
--pastel-yellow: #FEF3C7  /* For warnings/highlights */
--pastel-green: #D1FAE5   /* For success/confirmation */

/* Primary Action Color */
--emerald-600: #10B981    /* All CTAs and primary actions */
```

### 2. **Typography**
- **Titles**: Large, bold (font-weight: 900), tracking-tight
- **Body**: Clear hierarchy with gray-700 for readability
- **Labels**: Font-weight: 600, smaller size, gray-900

### 3. **Components**
- **Buttons**: Pill-shaped (border-radius: 9999px)
- **Cards**: Rounded-3xl with 2px borders
- **Inputs**: Rounded-lg with 2px borders
- **Badges**: Small pills with pastel backgrounds

## 🔧 Usage Examples

### Basic Page Structure

```tsx
import '../onboarding.css';

export default function MyOnboardingPage() {
  return (
    <div className="onboarding-container">
      <h1 className="onboarding-title">
        Tell us about yourself
      </h1>
      <p className="onboarding-subtitle">
        This helps us create a portfolio that reflects your unique story
      </p>
      
      {/* Your content here */}
    </div>
  );
}
```

### Buttons

```tsx
// Primary CTA
<button className="btn-primary">
  Continue
</button>

// Secondary Action
<button className="btn-secondary">
  Skip for now
</button>

// Disabled state (automatic)
<button className="btn-primary" disabled>
  Processing...
</button>
```

### Input Fields

```tsx
// Text Input
<div className="onboarding-section">
  <label className="onboarding-label">
    Full Name
  </label>
  <input
    type="text"
    className="onboarding-input"
    placeholder="Enter your name"
  />
</div>

// Textarea
<div className="onboarding-section">
  <label className="onboarding-label">
    About You
  </label>
  <textarea
    className="onboarding-textarea"
    placeholder="Tell us your story..."
  />
</div>

// Select/Dropdown
<div className="onboarding-section">
  <label className="onboarding-label">
    Role
  </label>
  <select className="onboarding-select">
    <option>Product Manager</option>
    <option>Designer</option>
    <option>Engineer</option>
  </select>
</div>
```

### Cards

```tsx
// White Card
<div className="onboarding-card">
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    Card Title
  </h3>
  <p className="text-gray-700">
    Card content goes here
  </p>
</div>

// Pastel Blue Card
<div className="onboarding-card onboarding-card-pastel-blue">
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    Information
  </h3>
  <p className="text-gray-800">
    This stands out with a blue background
  </p>
</div>

// Available Pastel Variants:
// - onboarding-card-pastel-blue
// - onboarding-card-pastel-pink
// - onboarding-card-pastel-yellow
// - onboarding-card-pastel-green
```

### Chips/Tags (Selection)

```tsx
const [selected, setSelected] = useState<string[]>([]);

<div className="flex flex-wrap gap-md">
  {options.map(option => (
    <button
      key={option.id}
      onClick={() => toggleSelection(option.id)}
      className={`onboarding-chip ${
        selected.includes(option.id) ? 'active' : ''
      }`}
    >
      {option.label}
    </button>
  ))}
</div>
```

### Badges

```tsx
// Status Indicators
<span className="onboarding-badge onboarding-badge-blue">
  In Progress
</span>

<span className="onboarding-badge onboarding-badge-green">
  Completed
</span>

<span className="onboarding-badge onboarding-badge-yellow">
  Action Required
</span>
```

### Upload Area

```tsx
<div 
  className="onboarding-upload-area"
  onClick={handleUploadClick}
>
  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
  <p className="text-lg font-semibold text-gray-900 mb-2">
    Upload your resume
  </p>
  <p className="text-sm text-gray-600">
    PDF, DOC, or DOCX • Max 10MB
  </p>
</div>

// With active state
<div className="onboarding-upload-area active">
  {/* Dragging a file */}
</div>
```

## 📝 Complete Page Example

```tsx
'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import '../onboarding.css';

export default function PersonalInfoPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  return (
    <div className="onboarding-container">
      {/* Header */}
      <div className="text-center mb-2xl">
        <h1 className="onboarding-title">
          Let's start with the basics
        </h1>
        <p className="onboarding-subtitle">
          This information will appear on your portfolio
        </p>
      </div>

      {/* Form Sections */}
      <div className="onboarding-section">
        <label className="onboarding-label">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="onboarding-input"
          placeholder="John Doe"
        />
      </div>

      <div className="onboarding-section">
        <label className="onboarding-label">
          Current Role
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="onboarding-input"
          placeholder="Product Manager"
        />
        <p className="onboarding-description mt-sm">
          This appears as your headline
        </p>
      </div>

      {/* Info Card */}
      <div className="onboarding-card onboarding-card-pastel-blue mt-xl">
        <div className="flex items-start gap-3">
          <Upload className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              Pro tip
            </p>
            <p className="text-sm text-gray-700">
              Upload your resume to auto-fill this information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Quick Reference

### Spacing Classes
```css
mb-sm    /* margin-bottom: 0.75rem */
mb-md    /* margin-bottom: 1rem */
mb-lg    /* margin-bottom: 1.5rem */
mb-xl    /* margin-bottom: 2rem */
mb-2xl   /* margin-bottom: 3rem */

/* Same for mt-*, gap-* */
```

### Utility Classes
```css
.text-center      /* text-align: center */
.flex             /* display: flex */
.flex-col         /* flex-direction: column */
.items-center     /* align-items: center */
.justify-between  /* justify-content: space-between */
```

### Animation Classes
```css
.animate-fadeIn       /* Fade in from bottom */
.animate-slideInRight /* Slide in from right */
```

## 🔄 Migration Guide

### Before (Old Style)
```tsx
<button className="px-6 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800">
  Continue
</button>
```

### After (Design System)
```tsx
<button className="btn-primary">
  Continue
</button>
```

---

### Before (Old Input)
```tsx
<input 
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
```

### After (Design System)
```tsx
<input 
  type="text"
  className="onboarding-input"
/>
```

## 🎨 Theming Variables

All colors and spacing use CSS variables, making it easy to adjust the entire theme:

```css
:root {
  /* Change primary color system-wide */
  --emerald-600: #10B981;  /* Change this to rebrand */
  --emerald-700: #059669;
  
  /* Adjust spacing scale */
  --spacing-md: 1rem;      /* Base unit */
  --spacing-lg: 1.5rem;    /* 1.5x base */
  
  /* Modify borders */
  --radius-full: 9999px;   /* Pill shape */
  --radius-2xl: 1.75rem;   /* Card corners */
}
```

## 📱 Responsive Behavior

The design system is mobile-responsive:

```css
/* Desktop: Full size buttons */
.btn-primary { 
  width: auto; 
}

/* Mobile: Full width buttons */
@media (max-width: 768px) {
  .btn-primary { 
    width: 100%; 
  }
}
```

## ✅ Checklist for Updating Pages

- [ ] Import `../onboarding.css` at top of file
- [ ] Replace titles with `onboarding-title` class
- [ ] Replace subtitles with `onboarding-subtitle` class
- [ ] Update buttons to use `btn-primary` or `btn-secondary`
- [ ] Update inputs to use `onboarding-input` class
- [ ] Wrap content in `onboarding-container`
- [ ] Use `onboarding-section` for spacing between form groups
- [ ] Replace custom cards with `onboarding-card` + pastel variants
- [ ] Add badges with `onboarding-badge` classes
- [ ] Test all interactive states (hover, focus, disabled)

## 🚀 Benefits

1. **Consistency**: Same look across all onboarding pages
2. **Maintainability**: Change colors/spacing in one place
3. **Performance**: Reusable CSS classes instead of inline styles
4. **Accessibility**: Built-in focus states and WCAG AA contrast
5. **Developer Experience**: Clear, semantic class names

## 📞 Need Help?

The design system maintains all existing functionality - it's purely visual updates. If something breaks:

1. Check that `onboarding.css` is imported
2. Verify class names match the guide above
3. Ensure no conflicting Tailwind classes
4. Check browser dev tools for CSS specificity issues

---

**Remember**: This is CSS-only. No functionality changes, just visual improvements! ✨

