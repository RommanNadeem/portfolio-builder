# Applying Notion Theme to Portfolio Home & Template Selection

## 🎯 Overview

This guide shows how to apply the same clean, Notion-style design system to the portfolio home page and template selection screen for visual consistency.

---

## 📐 Design System Reference

### Typography Scale (Already in globals.css)
```css
h1: text-[40px] leading-tight font-semibold tracking-[0.2px]
h2: text-[18px] font-medium tracking-[0.2px] text-gray-900
h3: text-[15px] leading-7 font-medium text-gray-900
Body: text-[15px] leading-7 text-gray-800
Meta/Labels: text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]
Placeholders: text-[15px] text-gray-400 italic
```

### Spacing & Layout
```css
Container: max-w-[960px] mx-auto px-8
Section spacing: mt-12 first:mt-8
Title to content: gap-3 (12px)
Content items: gap-6 or gap-8 (24-32px)
```

### Colors & Effects
```css
--accent: #7C3AED
--text: #0F172A
--muted: #6B7280
--divider: #F2F4F7
Hover tint: bg-black/[0.02]
Border on hover: border-[rgba(0,0,0,0.12)]
```

---

## 1. Portfolio Home Page

### Current State
- Heavy cards with shadows
- Varied typography sizes
- Inconsistent spacing
- Background gradients

### Proposed Changes

#### A. Main Container
```tsx
// Before:
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// After (Notion-style):
<div className="max-w-[960px] mx-auto px-8 py-12">
```

#### B. Section Headers
```tsx
// Before:
<h2 className="text-2xl sm:text-3xl font-bold">Projects</h2>

// After (Notion-style):
<h2 className="text-[18px] font-medium tracking-[0.2px] text-gray-900 mb-6">
  Projects
</h2>
```

#### C. Project Cards → Project Blocks

**Remove Card Chrome:**
```tsx
// Before:
<div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md">

// After (Notion-style):
<article className="group hover-tint rounded-md -mx-2 px-2 py-4 transition-colors duration-150">
```

**Project Title:**
```tsx
// Before:
<h3 className="text-base sm:text-lg font-bold">

// After:
<h3 className="text-[15px] leading-7 font-medium text-gray-900">
```

**Project Description:**
```tsx
// Before:
<p className="text-sm text-gray-600 line-clamp-3">

// After:
<p className="text-[15px] leading-7 text-gray-600 mt-2">
```

**Tags:**
```tsx
// Before:
<span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">

// After:
<span className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]">
  {tag}
</span>
```

#### D. Thumbnail Images

**Keep thumbnails but simplify:**
```tsx
// Before:
<div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-blue-100">

// After (minimal):
<div className="aspect-video w-full bg-gray-50 rounded-md overflow-hidden mb-3">
  {thumbnail ? (
    <img src={thumbnail} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-[15px] text-gray-400 italic">No image</span>
    </div>
  )}
</div>
```

#### E. Action Buttons

**Remove heavy styling:**
```tsx
// Before:
<button className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:shadow-lg">

// After (subtle):
<button className="text-[12px] text-gray-400 hover:text-gray-900 transition-colors">
  Edit Details →
</button>
```

---

## 2. Template Selection Page

### Current State
- Large template cards with icons
- Heavy borders and shadows
- Colorful backgrounds
- Prominent badges

### Proposed Changes

#### A. Page Header
```tsx
// Before:
<h1 className="text-4xl font-bold text-gray-900 mb-3">
  Choose a Template
</h1>

// After (Notion-style):
<h1 className="text-[40px] leading-tight font-semibold tracking-[0.2px] text-gray-900 mb-6">
  Choose a Template
</h1>
<p className="text-[15px] leading-7 text-gray-600 mb-12">
  Start with a professional template or build from scratch
</p>
```

#### B. Search & Filters

**Search Bar:**
```tsx
// Before:
<input className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg">

// After (minimal):
<input className="
  w-full 
  px-4 py-3
  text-[15px] leading-7
  border-0 border-b border-gray-200
  focus:border-gray-900
  transition-[border-color] duration-150
  focus:ring-0
  placeholder-italic
" placeholder="Search templates…" />
```

**Filter Pills:**
```tsx
// Before:
<button className="px-3 py-1.5 bg-purple-600 text-white rounded-full">

// After (subtle):
<button className="
  px-3 py-1
  text-[12px] font-medium
  bg-transparent
  text-gray-600
  border-b-2 border-transparent
  hover:border-gray-900
  transition-all
">
  Design
</button>
```

#### C. Template Cards → Template List Items

**Remove Heavy Cards:**
```tsx
// Before:
<button className="
  p-4 rounded-lg border-2 
  bg-white hover:shadow-xl
  ring-2 ring-offset-2 ring-purple-500
">

// After (clean list item):
<button className="
  w-full text-left py-6
  border-b border-gray-100
  hover-tint rounded-md -mx-2 px-2
  transition-colors duration-150
  group
">
```

**Template Layout:**
```tsx
<div className="flex items-start gap-6">
  {/* Icon - Smaller */}
  <div className="text-3xl flex-shrink-0 opacity-80 group-hover:opacity-100">
    {template.icon}
  </div>

  {/* Content */}
  <div className="flex-1">
    {/* Name */}
    <h3 className="text-[18px] font-medium tracking-[0.2px] text-gray-900 mb-2">
      {template.name}
    </h3>
    
    {/* Description */}
    <p className="text-[15px] leading-7 text-gray-600 mb-3">
      {template.description}
    </p>
    
    {/* Meta info inline */}
    <div className="flex items-center gap-4 text-[12px] font-medium text-gray-500">
      <span>{template.difficulty}</span>
      <span>•</span>
      <span>{template.estimatedTime}</span>
      <span>•</span>
      <span>{template.usageCount.toLocaleString()} uses</span>
    </div>

    {/* Tags - subtle */}
    <div className="flex flex-wrap gap-2 mt-3">
      {template.tags.map(tag => (
        <span className="text-[12px] text-gray-500">
          {tag}
        </span>
      ))}
    </div>
  </div>

  {/* Selected indicator */}
  {isSelected && (
    <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
  )}
</div>
```

**Remove Difficulty Badges:**
```tsx
// Before:
<span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
  Beginner
</span>

// After (inline text):
<span className="text-[12px] font-medium text-gray-500">
  Beginner
</span>
```

---

## 3. Implementation Steps

### Step 1: Update Portfolio Home (`app/home/page.tsx`)

```tsx
// 1. Container
<div className="max-w-[960px] mx-auto px-8 py-12">

// 2. Section Headers
<h2 className="text-[18px] font-medium tracking-[0.2px] text-gray-900 mb-8">
  Projects
</h2>

// 3. Project Items (no cards)
{projects.map(project => (
  <article 
    key={project.id}
    className="group hover-tint rounded-md -mx-2 px-2 py-6 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-0"
  >
    {/* Thumbnail - if exists */}
    {project.thumbnail && (
      <div className="aspect-video w-full bg-gray-50 rounded-md overflow-hidden mb-4">
        <img src={project.thumbnail} className="w-full h-full object-cover" />
      </div>
    )}

    {/* Title */}
    <h3 className="text-[15px] leading-7 font-medium text-gray-900">
      {project.title}
    </h3>

    {/* Description */}
    {project.description && (
      <p className="text-[15px] leading-7 text-gray-600 mt-2">
        {project.description}
      </p>
    )}

    {/* Tags - inline */}
    {project.tags?.length > 0 && (
      <div className="flex flex-wrap gap-3 mt-3">
        {project.tags.map(tag => (
          <span className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]">
            {tag}
          </span>
        ))}
      </div>
    )}

    {/* Link - subtle */}
    {project.link && (
      <a 
        href={project.link}
        className="inline-flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-900 mt-3 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        View project
      </a>
    )}
  </article>
))}
```

### Step 2: Update Template Selector (`app/editor/templates/TemplateSelector.tsx`)

```tsx
<div className="max-w-[960px] mx-auto px-8 py-12">
  {/* Header */}
  <div className="mb-12">
    <h1 className="text-[40px] leading-tight font-semibold tracking-[0.2px] text-gray-900 mb-3">
      Choose a Template
    </h1>
    <p className="text-[15px] leading-7 text-gray-600">
      Start with a professional template or build from scratch
    </p>
  </div>

  {/* Search - minimal */}
  <div className="mb-8">
    <input
      type="text"
      placeholder="Search templates…"
      className="
        w-full px-0 py-3
        text-[15px] leading-7
        border-0 border-b border-gray-200
        focus:border-gray-900
        transition-[border-color] duration-150
        focus:ring-0
        placeholder-italic
      "
    />
  </div>

  {/* Filters - tabs style */}
  <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
    {categories.map(category => (
      <button
        className={`
          pb-3 text-[12px] font-medium uppercase tracking-[0.6px]
          border-b-2 -mb-px transition-all
          ${selected === category 
            ? 'border-gray-900 text-gray-900' 
            : 'border-transparent text-gray-500 hover:text-gray-900'
          }
        `}
      >
        {category}
      </button>
    ))}
  </div>

  {/* Template List - no cards */}
  <div className="space-y-0">
    {templates.map((template, index) => (
      <button
        key={template.id}
        className="
          w-full text-left py-8
          border-b border-gray-100 last:border-0
          hover-tint rounded-md -mx-2 px-2
          transition-colors duration-150
          group
        "
      >
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className="text-4xl opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {template.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Name */}
            <h3 className="text-[18px] font-medium tracking-[0.2px] text-gray-900 mb-2">
              {template.name}
            </h3>
            
            {/* Description */}
            <p className="text-[15px] leading-7 text-gray-600 mb-4">
              {template.description}
            </p>
            
            {/* Meta row */}
            <div className="flex items-center gap-4 text-[12px] font-medium text-gray-500">
              <span className="uppercase tracking-[0.6px]">{template.difficulty}</span>
              <span className="text-gray-300">•</span>
              <span>{template.estimatedTime}</span>
              <span className="text-gray-300">•</span>
              <span>{template.usageCount.toLocaleString()} uses</span>
            </div>

            {/* Tags - minimal */}
            <div className="flex flex-wrap gap-3 mt-3">
              {template.tags.map(tag => (
                <span className="text-[12px] text-gray-500">
                  {tag}
                </span>
              ))}
            </div>

            {/* Sections preview */}
            <div className="flex flex-wrap gap-2 mt-4 text-[12px] text-gray-400">
              {template.sections.slice(0, 4).map(section => (
                <span>{section.label}</span>
              ))}
              {template.sections.length > 4 && (
                <span>+{template.sections.length - 4} more</span>
              )}
            </div>
          </div>

          {/* Selected check */}
          {isSelected && (
            <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
          )}
        </div>
      </button>
    ))}
  </div>
</div>
```

---

## 2. Detailed Implementation Guide

### Portfolio Home - Section by Section

#### Personal/Hero Section
```tsx
<section className="mt-12 first:mt-8">
  {/* Profile Image - if exists */}
  {profileImage && (
    <img 
      src={profileImage} 
      className="w-20 h-20 rounded-full mb-6" 
    />
  )}

  {/* Name/Heading - h1 */}
  <h1 className="text-[40px] leading-tight font-semibold tracking-[0.2px] text-gray-900 mb-3">
    {heading || fullName}
  </h1>

  {/* Profession - body */}
  <p className="text-[15px] leading-7 text-gray-600 mb-6">
    {profession}
  </p>

  {/* Tagline */}
  {tagline && (
    <p className="text-[15px] leading-7 text-gray-800 mb-8 max-w-2xl">
      {tagline}
    </p>
  )}

  {/* Social Links - inline, minimal */}
  <div className="flex flex-wrap gap-4 text-[12px] text-gray-500">
    {socialLinks.map(link => (
      <a 
        href={link.url}
        className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
      >
        <Icon className="w-4 h-4" />
        {link.platform}
      </a>
    ))}
  </div>

  <div className="section-divider" />
</section>
```

#### Projects Section
```tsx
<section className="mt-12">
  <h2 className="text-[18px] font-medium tracking-[0.2px] text-gray-900 mb-8">
    Projects
  </h2>

  <div className="space-y-0">
    {projects.map(project => (
      <article className="
        py-6 border-b border-gray-100 last:border-0
        hover-tint rounded-md -mx-2 px-2
        transition-colors duration-150
        cursor-pointer
        group
      ">
        {/* Project content as specified above */}
      </article>
    ))}
  </div>

  <div className="section-divider" />
</section>
```

#### Career Section
```tsx
<section className="mt-12">
  <h2 className="text-[18px] font-medium tracking-[0.2px] text-gray-900 mb-8">
    Career
  </h2>

  <div className="space-y-8">
    {career.map(job => (
      <div className="flex gap-6 group">
        {/* Timeline - left rail like drag handle */}
        <div className="w-24 flex-shrink-0 text-right">
          <span className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]">
            {job.year}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-[15px] leading-7 font-medium text-gray-900">
            {job.title}
          </h3>
          <p className="text-[15px] leading-7 text-gray-600 mt-1">
            {job.company}
          </p>
          {job.description && (
            <p className="text-[15px] leading-7 text-gray-600 mt-2">
              {job.description}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>

  <div className="section-divider" />
</section>
```

---

## 3. Color & Background Strategy

### Keep Some Visual Elements

**What to Keep:**
- ✅ Callout blocks (light backgrounds for emphasis)
- ✅ Template icons (adds personality)
- ✅ Metric values in purple (brand color)
- ✅ Active states (subtle highlights)

**What to Remove:**
- ❌ Card backgrounds on everything
- ❌ Heavy drop shadows
- ❌ Gradient backgrounds
- ❌ Colorful borders everywhere
- ❌ Rounded-xl corners (use rounded-md sparingly)

### Minimal Color Usage

```tsx
// Primary action (when absolutely needed)
className="text-purple-600 hover:text-purple-700"

// Danger action
className="text-red-500 hover:text-red-600"

// Success state
className="text-green-600"

// Default state
className="text-gray-600 hover:text-gray-900"
```

---

## 4. Interactive States

### Hover States
```tsx
// Section hover
className="hover-tint transition-colors duration-150"

// Link hover
className="text-gray-600 hover:text-gray-900 transition-colors"

// Button hover
className="text-gray-400 hover:text-gray-900 transition-colors"
```

### Focus States
```tsx
// Text inputs
className="focus-underline focus:ring-0"

// Buttons
className="focus:outline-none focus:ring-2 ring-gray-300 ring-offset-1"
```

### Active/Selected States
```tsx
// Selected template
className="border-l-2 border-purple-600 bg-purple-50/30"

// Active filter
className="border-b-2 border-gray-900 text-gray-900"
```

---

## 5. Responsive Considerations

### Mobile Adjustments
```tsx
// Container
<div className="max-w-[960px] mx-auto px-4 sm:px-8">

// Typography (slightly smaller on mobile)
<h1 className="text-[32px] sm:text-[40px] leading-tight">

// Grid (stack on mobile)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

// Hidden on mobile
<div className="hidden sm:block">
```

---

## 6. Migration Checklist

### Portfolio Home Page:
- [ ] Update container width to `max-w-[960px]`
- [ ] Change section headers to `text-[18px]` h2
- [ ] Remove project card backgrounds/borders
- [ ] Apply hover-tint to project items
- [ ] Update typography to 15px/28px body
- [ ] Change tags to minimal meta style
- [ ] Add section dividers
- [ ] Remove shadows throughout

### Template Selection:
- [ ] Update page title to h1 spec
- [ ] Convert search to minimal underline style
- [ ] Change filters to tab-style buttons
- [ ] Remove template card backgrounds
- [ ] Convert to list layout with borders
- [ ] Update template meta to inline style
- [ ] Remove difficulty badges (show as text)
- [ ] Add hover-tint to templates

### Global:
- [ ] Add utility classes to `globals.css` ✅
- [ ] Test all hover states
- [ ] Test all focus states
- [ ] Verify keyboard navigation
- [ ] Check mobile responsive
- [ ] Test in both edit and preview modes

---

## 7. Before & After Examples

### Portfolio Home - Project Card

**Before:**
```tsx
<div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md p-5">
  <h3 className="text-lg font-bold text-gray-900 mb-2">
    E-Commerce Redesign
  </h3>
  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
    A complete UX overhaul that increased conversions
  </p>
  <div className="flex gap-2">
    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
      UX
    </span>
    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
      Design
    </span>
  </div>
</div>
```

**After:**
```tsx
<article className="py-6 border-b border-gray-100 hover-tint rounded-md -mx-2 px-2 cursor-pointer group">
  <h3 className="text-[15px] leading-7 font-medium text-gray-900">
    E-Commerce Redesign
  </h3>
  <p className="text-[15px] leading-7 text-gray-600 mt-2">
    A complete UX overhaul that increased conversions
  </p>
  <div className="flex gap-3 mt-3">
    <span className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]">UX</span>
    <span className="text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]">Design</span>
  </div>
</article>
```

### Template Selection - Template Card

**Before:**
```tsx
<button className="w-full p-4 rounded-lg border-2 bg-white hover:shadow-xl ring-2 ring-purple-500">
  <div className="flex items-start gap-3">
    <div className="text-2xl">{template.icon}</div>
    <div className="flex-1">
      <h3 className="font-semibold text-sm text-gray-900 mb-1">
        {template.name}
      </h3>
      <p className="text-xs text-gray-600">
        {template.description}
      </p>
      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
        Beginner
      </span>
    </div>
  </div>
</button>
```

**After:**
```tsx
<button className="w-full text-left py-8 border-b border-gray-100 hover-tint rounded-md -mx-2 px-2 group">
  <div className="flex items-start gap-6">
    <div className="text-4xl opacity-80 group-hover:opacity-100">{template.icon}</div>
    <div className="flex-1">
      <h3 className="text-[18px] font-medium tracking-[0.2px] text-gray-900 mb-2">
        {template.name}
      </h3>
      <p className="text-[15px] leading-7 text-gray-600 mb-3">
        {template.description}
      </p>
      <div className="flex gap-4 text-[12px] font-medium text-gray-500">
        <span>Beginner</span>
        <span>•</span>
        <span>30 min</span>
      </div>
    </div>
    {isSelected && <Check className="w-5 h-5 text-purple-600" />}
  </div>
</button>
```

---

## 8. Quick Reference - CSS Classes

### Containers
```css
max-w-[960px] mx-auto px-8 py-12
```

### Typography
```css
/* H1 */ text-[40px] leading-tight font-semibold tracking-[0.2px]
/* H2 */ text-[18px] font-medium tracking-[0.2px]
/* H3 */ text-[15px] leading-7 font-medium
/* Body */ text-[15px] leading-7 text-gray-800
/* Meta */ text-[12px] font-medium text-gray-500 uppercase tracking-[0.6px]
/* Placeholder */ placeholder-italic
```

### Spacing
```css
mt-12 first:mt-8    /* Sections */
mb-6 or mb-8        /* Section headers */
gap-3               /* Title to field */
gap-6 or gap-8      /* Content items */
py-6 or py-8        /* List item padding */
```

### Interactive
```css
hover-tint                  /* Section hover */
focus-underline             /* Input focus */
transition-colors duration-150
border-b border-gray-100    /* Dividers */
```

### No Longer Use
```css
❌ rounded-xl, rounded-2xl
❌ shadow-sm, shadow-md, shadow-lg
❌ bg-white (on sections)
❌ border-2
❌ ring-4 ring-offset-2
❌ bg-gradient-to-*
❌ from-purple-* to-blue-*
```

---

## 9. Benefits of Applying Theme Globally

### Visual Consistency
- Same typography across entire app
- Unified spacing rhythm
- Predictable interactions
- Professional appearance

### User Experience
- Reduced visual noise
- Easier to scan
- Faster content parsing
- Less cognitive load

### Development
- Reusable utility classes
- Consistent patterns
- Easier to maintain
- Clear design system

### Performance
- Fewer CSS classes per element
- Simpler DOM structure
- Faster rendering
- Smaller bundle size

---

## 10. Implementation Priority

### Phase 1: Quick Wins (1-2 hours)
1. Update container widths
2. Apply typography scale
3. Remove card backgrounds
4. Add hover-tint classes

### Phase 2: Refinement (2-3 hours)
5. Update all input styles
6. Implement focus underlines
7. Refine spacing
8. Add section dividers

### Phase 3: Polish (1-2 hours)
9. Test all interactions
10. Mobile responsive tweaks
11. Accessibility check
12. Cross-browser testing

**Total Estimated Time: 4-7 hours**

---

## 🎯 Result

After applying this theme globally, your entire portfolio builder will have:

✅ **Consistent Notion-quality design** throughout
✅ **Professional, minimal aesthetic**
✅ **Better readability and scannability**
✅ **Unified design system**
✅ **Faster user comprehension**
✅ **Easier maintenance**

**The entire app will feel like one cohesive, modern product!** 🚀

