# Resume Upload & Save Implementation

## Overview
Implemented functionality to save resume files uploaded during onboarding, making them available in the editor's resume section.

## Changes Made

### 1. Updated OnboardingData Interface
**File:** `app/onboarding-v2/flow/page.tsx`

Added three new fields to the `OnboardingData` interface:
- `resume: string | null` - Stores the resume URL after upload
- `resumeFileName: string | null` - Stores the original filename
- `resumeFile: File | null` - Stores the File object to upload during signup

### 2. Initialized Resume Fields in State
Updated the initial state to include the new resume fields (all set to `null`).

### 3. Store Resume File During Upload
Modified the `handleResumeUpload` function to:
- Store the File object in state when a user uploads their resume
- Store the filename for later use
- This happens in both the mock data fallback and the real data path

### 4. Upload Resume During Signup
Modified the `handleSignup` function to:
- Upload the resume file to Supabase Storage after user account creation
- Use the proper `userId` for file organization
- Store the resulting public URL
- Handle errors gracefully (don't fail signup if resume upload fails)

### 5. Include Resume in Portfolio Save
Updated the `portfolioToSave` object to include:
- `resume: resumeUrl` - The uploaded file's public URL
- `resumeFileName: data.resumeFileName` - The original filename

## How It Works

### User Flow
1. **Upload Resume** - User uploads resume in step 2 of onboarding
2. **File Stored** - File object stored in component state
3. **Parse Resume** - Backend extracts career data from resume
4. **Complete Onboarding** - User completes all steps
5. **Signup** - User creates account with email/password
6. **Upload to Storage** - Resume file uploaded to Supabase Storage
7. **Save to Database** - Resume URL and filename saved to `profiles` table
8. **Available in Editor** - Resume appears in editor's left navigation

### Storage Structure
- **Bucket:** `resumes`
- **Path:** `{userId}/{timestamp}-{random}.{extension}`
- **Validation:** Max 10MB, PDF/DOC/DOCX/TXT formats
- **Access:** Public (users can view/download)

### Database Fields
The resume data is saved to the `profiles` table:
- `resume_url` - Public URL to the uploaded resume
- `resume_file_name` - Original filename (e.g., "resume.pdf")

## Editor Integration

The resume section in the editor (`app/editor/sections/resume-v2/ResumeSection.tsx`) already supports displaying resumes:

```typescript
const resumeUrl = data.resume || data.profile?.resume_url;
const resumeFileName = data.resumeFileName || 'resume.pdf';
```

### Features Available
- **View** - View resume in modal
- **Download** - Download resume file
- **Replace** - Upload a new resume
- **Delete** - Remove resume
- **Embedded Preview** - See resume preview in editor

## Testing Checklist

- [ ] Upload PDF resume during onboarding
- [ ] Upload DOCX resume during onboarding
- [ ] Complete onboarding without resume
- [ ] Check resume appears in editor
- [ ] View resume in editor
- [ ] Download resume from editor
- [ ] Replace resume in editor
- [ ] Check resume on published portfolio
- [ ] Verify resume URL is public
- [ ] Check file size validation (max 10MB)

## Error Handling

1. **Upload Fails During Signup**
   - Error logged to console
   - Signup continues (doesn't block user)
   - Resume field left as `null`

2. **Invalid File Type**
   - Handled by storage layer validation
   - User sees error message
   - Can retry with correct file type

3. **File Too Large**
   - Handled by storage layer validation
   - Max 10MB enforced
   - User sees clear error message

## Debugging

### Console Logs Added
- `[Onboarding] Storing resume file: {filename}`
- `[Signup Debug] Uploading resume file: {filename}`
- `[Signup Debug] Resume uploaded successfully: {url}`
- `[Signup Debug] Resume URL being saved: {url}`
- `[Signup Debug] Resume filename being saved: {filename}`

### Database Logs
The database layer already has debug logging:
- `[Database Debug] Resume URL being saved: {url}`
- `[Database Debug] Resume in portfolioData: {value}`

## Benefits

✅ **Seamless Experience** - Users don't need to re-upload their resume  
✅ **Automatic Parsing** - Resume data extracted and used to populate portfolio  
✅ **Resume Preserved** - Original resume file available for download/viewing  
✅ **Editor Ready** - Resume immediately available in editor without extra steps  
✅ **Portfolio Complete** - Users can show both extracted case studies AND original resume  

## Future Enhancements

- [ ] Add resume preview during onboarding
- [ ] Allow resume replacement during onboarding
- [ ] Parse resume again if user replaces it in editor
- [ ] Extract more metadata from resume (dates, skills, etc.)
- [ ] Support more file formats (LinkedIn PDF exports, etc.)

