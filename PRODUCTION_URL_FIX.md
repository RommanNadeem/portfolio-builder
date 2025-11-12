# Production URL Configuration Fix

## Problem
Previously, the app was hardcoding `http://localhost:3000` as the fallback when `NEXT_PUBLIC_APP_URL` wasn't set, causing portfolio URLs to display incorrectly in production.

## Solution
Created an intelligent URL detection system that automatically uses the correct URL based on the environment.

## What Changed

### 1. New URL Utility Library (`lib/url-utils.ts`)
Created centralized URL management with smart detection:

```typescript
getBaseUrl()         // Get the base URL for the app
getPortfolioUrl()    // Get portfolio URL for a slug
getDisplayUrl()      // Get URL without protocol for UI display
isProduction()       // Check if in production
isVercel()          // Check if deployed on Vercel
```

**URL Priority:**
1. `NEXT_PUBLIC_APP_URL` (if explicitly set)
2. `NEXT_PUBLIC_VERCEL_URL` (auto-provided by Vercel)
3. `window.location.origin` (client-side detection)
4. `http://localhost:3000` (local development fallback)

### 2. Updated Files
All URL construction now uses the new utilities:

- ✅ `lib/publishing.ts` - Publishing & slug management
- ✅ `app/[slug]/page.tsx` - Public portfolio pages
- ✅ `app/editor/components/SlugSelector.tsx` - Slug selection UI
- ✅ `app/editor/components/SlugCreationView.tsx` - Slug creation UI
- ✅ `app/onboarding-v2/publish/page.tsx` - Publishing flow

## How It Works

### On Production (Vercel)
```
NEXT_PUBLIC_VERCEL_URL=buildspace-me.vercel.app (auto-set by Vercel)
Result: https://buildspace-me.vercel.app
```

### On Custom Domain (Recommended for Production)
```
NEXT_PUBLIC_APP_URL=https://www.buildspace.me (set manually)
Result: https://www.buildspace.me
```

### On Local Development
```
(no env vars needed)
Result: http://localhost:3000
```

### Client-Side (Any Environment)
```
window.location.origin is used
Result: matches current browser URL
```

## Environment Variables

### Required
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_RAILWAY_BACKEND_URL=your_railway_backend_url
```

### Optional
```bash
# Only set if you need to override auto-detection
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Auto-Provided by Vercel
```bash
NEXT_PUBLIC_VERCEL_URL  # Auto-set by Vercel (don't set manually)
NODE_ENV                # Auto-set (development/production)
```

## Testing

### Local Development
```bash
npm run dev
# Visit: http://localhost:3000
# URLs should show: localhost:3000/your-slug
```

### Production (Vercel)
```bash
npm run build && npm start
# Or deploy to Vercel
# URLs should show: your-app.vercel.app/your-slug
```

### Custom Domain (Production)
```bash
# Set in Vercel environment variables:
NEXT_PUBLIC_APP_URL=https://www.buildspace.me

# URLs should show: www.buildspace.me/your-slug
```

## Benefits

1. **Zero Configuration**: Works automatically on Vercel without any setup
2. **Custom Domain Support**: Easy to configure custom domains
3. **Client-Side Accuracy**: Uses browser's actual URL when available
4. **Development Friendly**: Automatically uses localhost in dev
5. **Centralized Logic**: Single source of truth for all URL construction
6. **Type-Safe**: Full TypeScript support

## Migration Notes

- No breaking changes for existing deployments
- Existing `NEXT_PUBLIC_APP_URL` values are still respected
- If you're on Vercel and not using a custom domain, you can remove `NEXT_PUBLIC_APP_URL`
- URLs will automatically work correctly in all environments

## Example Portfolio URLs

### Development
- `http://localhost:3000/john-doe`
- `http://localhost:3000/jane-smith`

### Production (Vercel default)
- `https://buildspace-me.vercel.app/john-doe`
- `https://buildspace-me.vercel.app/jane-smith`

### Production (Custom Domain) - **Currently Active**
- `https://www.buildspace.me/john-doe`
- `https://www.buildspace.me/jane-smith`

## Troubleshooting

### Issue: URLs still showing localhost in production
**Solution**: Make sure `NEXT_PUBLIC_VERCEL_URL` is available (it should be auto-set by Vercel). If using a custom domain, set `NEXT_PUBLIC_APP_URL`.

### Issue: URLs showing vercel.app instead of custom domain
**Solution**: Set `NEXT_PUBLIC_APP_URL=https://www.buildspace.me` in Vercel environment variables (should already be configured).

### Issue: URLs not working in server components
**Solution**: Server components can't access `window.location`. The utility will use `NEXT_PUBLIC_VERCEL_URL` or `NEXT_PUBLIC_APP_URL` instead.

## Related Files
- `lib/url-utils.ts` - URL utility functions
- `lib/publishing.ts` - Publishing logic
- `app/[slug]/page.tsx` - Public portfolio pages
- `app/editor/components/SlugSelector.tsx` - Slug selector component
- `app/editor/components/SlugCreationView.tsx` - Slug creation component
- `app/onboarding-v2/publish/page.tsx` - Publishing page

