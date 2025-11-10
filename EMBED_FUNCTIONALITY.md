# Embed Block - Complete Functionality

## ✅ Features Implemented

The Embed block now supports both document uploads and URL embeds with automatic type detection.

---

## 🎯 Supported Platforms

### Video Platforms
- **Loom** - Screen recordings and walkthroughs
- **YouTube** - Public videos
- **Vimeo** - Professional videos

### Design Tools
- **Figma** - Design files and prototypes

### Documents
- **PDF** - Via URL or upload
- **Word** - Upload (.doc, .docx)
- **PowerPoint** - Upload (.ppt, .pptx)
- **Google Drive** - Shareable links

### Generic
- Any other embeddable URL

---

## 📝 How to Use

### Method 1: Paste URL (Recommended)

**Step 1:** Copy the share link from any platform:
- Loom: `https://www.loom.com/share/abc123`
- YouTube: `https://www.youtube.com/watch?v=abc123`
- Figma: `https://www.figma.com/file/...`
- Vimeo: `https://vimeo.com/123456789`

**Step 2:** Paste in the "Embed URL" field

**Step 3:** Type automatically detected! ✨
- The system recognizes the platform
- Converts to proper embed format
- Shows live preview

### Method 2: Upload Document

**Step 1:** Click "Upload document" button

**Step 2:** Select file from computer:
- PDF (up to 10MB)
- Word documents (.doc, .docx)
- PowerPoint (.ppt, .pptx)

**Step 3:** File uploaded and embedded! ✨
- Stored as base64 in project data
- Shows preview with filename
- Can be viewed/downloaded

---

## 🔧 Auto-Detection Examples

### URL Auto-Detection

```typescript
Input: https://www.loom.com/share/abc123
→ Detected: Loom Video
→ Embed: <iframe src="https://www.loom.com/embed/abc123">

Input: https://www.youtube.com/watch?v=dQw4w9WgXcQ
→ Detected: YouTube Video
→ Embed: <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ">

Input: https://www.figma.com/file/abc123/My-Design
→ Detected: Figma Design
→ Embed: <iframe src="https://www.figma.com/embed?url=...">

Input: https://vimeo.com/123456789
→ Detected: Vimeo Video
→ Embed: <iframe src="https://player.vimeo.com/video/123456789">

Input: https://example.com/document.pdf
→ Detected: PDF Document
→ Embed: <iframe src="...">
```

---

## 🎨 UI Components

### Empty State
```
┌─────────────────────────────────┐
│  EMBED URL                       │
│  Paste Loom, YouTube, Figma..._ │
│  Supports: Loom, YouTube...     │
│                                  │
│  ───────── or ─────────         │
│                                  │
│  📤 Upload document              │
│  PDF, Word, PowerPoint up to 10MB│
└─────────────────────────────────┘
```

### With Embed
```
┌─────────────────────────────────┐
│  LOOM VIDEO            Remove    │
│                                  │
│  [Live Loom video preview]      │
│                                  │
│  Add caption…                    │
└─────────────────────────────────┘
```

---

## 📐 Technical Details

### Embed Type Detection
```typescript
function detectEmbedType(url: string) {
  if (url.includes('loom.com')) return 'loom';
  if (url.includes('youtube.com')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('figma.com')) return 'figma';
  if (url.endsWith('.pdf')) return 'pdf';
  if (url.includes('drive.google.com')) return 'document';
  return 'other';
}
```

### URL Transformations

**Loom:**
```typescript
Input: https://www.loom.com/share/abc123
Output: https://www.loom.com/embed/abc123
```

**YouTube:**
```typescript
Input: https://www.youtube.com/watch?v=abc123
Output: https://www.youtube.com/embed/abc123

Input: https://youtu.be/abc123
Output: https://www.youtube.com/embed/abc123
```

**Vimeo:**
```typescript
Input: https://vimeo.com/123456789
Output: https://player.vimeo.com/video/123456789
```

**Figma:**
```typescript
Input: https://www.figma.com/file/abc123/Design
Output: https://www.figma.com/embed?embed_host=share&url=[encoded]
```

### Document Upload
```typescript
// Supported formats:
- application/pdf
- application/msword (.doc)
- application/vnd.openxmlformats-officedocument.wordprocessingml.document (.docx)
- application/vnd.ms-powerpoint (.ppt)
- application/vnd.openxmlformats-officedocument.presentationml.presentation (.pptx)

// File size limit: 10MB
// Storage: Base64 encoded in project data
```

---

## 🎯 Use Cases

### 1. Design Case Study
```
Embed Type: Figma
URL: Figma prototype link
Use: Show interactive design mockups
```

### 2. Process Documentation
```
Embed Type: Loom
URL: Walkthrough video
Use: Explain design process visually
```

### 3. Demo Video
```
Embed Type: YouTube
URL: Product demo
Use: Showcase final result
```

### 4. Research Findings
```
Embed Type: PDF
Method: Upload or URL
Use: Share research documents
```

### 5. Presentation
```
Embed Type: PowerPoint
Method: Upload
Use: Embed slide deck
```

---

## 🔒 Security & Validation

### File Upload
- ✅ File type validation (PDF, Word, PPT only)
- ✅ File size limit (10MB)
- ✅ Error handling with user feedback
- ✅ Base64 encoding for storage

### URL Embeds
- ✅ URL validation
- ✅ Auto-detection prevents wrong embed types
- ✅ Proper iframe sandboxing
- ✅ allowFullScreen for videos

---

## 📊 Preview Modes

### Edit Mode
- Shows live embed preview when URL is added
- Upload button visible when empty
- Remove button to clear embed
- Caption field for accessibility

### Preview Mode
- Full embed display
- Caption shown below
- Clean, professional appearance
- No edit controls visible

---

## 💡 Pro Tips

### For Best Results:

**Loom Videos:**
- Use the share link, not the browser URL
- Example: `https://www.loom.com/share/[id]`

**YouTube:**
- Both watch and short URLs work
- Private videos won't embed

**Figma:**
- Set sharing to "Anyone with link can view"
- Use the file link, not the prototype link

**Documents:**
- PDFs work best for embedding
- Word/PPT files show download option
- Keep files under 10MB for performance

---

## 🚀 Features

✅ **Automatic Type Detection** - No manual selection needed
✅ **Dual Input Methods** - URL or upload
✅ **Live Preview** - See embed immediately
✅ **Multiple Formats** - Videos, designs, documents
✅ **Error Handling** - Clear feedback on issues
✅ **Notion-Style UI** - Minimal, clean design
✅ **Accessibility** - Caption support
✅ **Responsive** - Works on all devices

---

## 🎨 Styling

All embed components follow the Notion theme:
- Typography: `text-[15px] leading-7`
- Placeholders: `italic text-gray-400`
- Labels: `text-[12px] uppercase tracking-[0.6px]`
- Upload area: Minimal text, border on hover
- Focus states: Underline animation

---

**Embed functionality is now complete and production-ready!** 🚀

