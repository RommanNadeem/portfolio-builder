# Production Setup Guide - buildspace.me

This guide explains how to configure the production URL for **buildspace.me**.

## 🌐 Production URL

**Live Site:** [https://www.buildspace.me](https://www.buildspace.me)

## 🔧 Vercel Configuration

### Environment Variable Required

Set this in your Vercel project's environment variables:

```bash
NEXT_PUBLIC_APP_URL=https://www.buildspace.me
```

### Steps to Configure

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the variable:
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://www.buildspace.me`
   - **Environment:** Production (and optionally Preview if you want previews to use the production domain)
5. Click **Save**
6. Redeploy your application

### Custom Domain Setup

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Add domain: `www.buildspace.me`
3. Add domain: `buildspace.me` (redirect to www)
4. Follow Vercel's DNS configuration instructions
5. Wait for DNS propagation (usually 5-10 minutes)

## 📋 Environment Variables Checklist

Make sure all these are set in Vercel:

### Required for Production
- ✅ `NEXT_PUBLIC_APP_URL` = `https://www.buildspace.me`
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
- ✅ `NEXT_PUBLIC_RAILWAY_BACKEND_URL` = Your Railway backend URL

### Auto-Set by Vercel (Don't Configure)
- `NEXT_PUBLIC_VERCEL_URL` - Automatically set by Vercel
- `NODE_ENV` - Automatically set to "production"

## ✅ Verification

After deployment, verify the URLs work correctly:

### Test Portfolio URLs
Visit your editor and create/view a portfolio. URLs should show:
- ✅ `https://www.buildspace.me/your-slug`
- ❌ NOT `http://localhost:3000/your-slug`
- ❌ NOT `https://something.vercel.app/your-slug`

### Test These Features
1. **Slug Creation**
   - Go to editor
   - Create new slug
   - URL preview should show `www.buildspace.me/your-slug`

2. **Portfolio Sharing**
   - Click "Share" or "View Portfolio"
   - Copy link button should copy `https://www.buildspace.me/your-slug`
   - Link should work when opened in new tab

3. **Published Portfolios**
   - Visit `https://www.buildspace.me/any-slug`
   - Should load the portfolio (or 404 if not published)
   - Should NOT redirect to localhost

4. **Meta Tags**
   - View page source of a published portfolio
   - Check Open Graph tags - should have `https://www.buildspace.me/slug`

## 🐛 Troubleshooting

### URLs still showing localhost
**Problem:** Portfolio URLs show `localhost:3000` in production

**Solution:**
1. Verify `NEXT_PUBLIC_APP_URL` is set in Vercel
2. Make sure it's set for "Production" environment
3. Redeploy the application
4. Clear browser cache and test

### URLs showing vercel.app instead of buildspace.me
**Problem:** URLs show `something.vercel.app/slug`

**Solution:**
1. Verify `NEXT_PUBLIC_APP_URL=https://www.buildspace.me` is set
2. Redeploy
3. The app prioritizes `NEXT_PUBLIC_APP_URL` over `NEXT_PUBLIC_VERCEL_URL`

### Custom domain not working
**Problem:** `www.buildspace.me` shows error

**Solution:**
1. Check DNS settings - ensure they point to Vercel
2. Verify domain is configured in Vercel dashboard
3. Wait for DNS propagation (can take up to 48 hours, usually 5-10 minutes)
4. Check domain status in Vercel dashboard

### Environment variable not taking effect
**Problem:** Changed env var but still seeing old behavior

**Solution:**
1. Ensure variable is saved in Vercel dashboard
2. **Important:** Redeploy the application (env var changes require redeploy)
3. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
4. Check in new incognito window to rule out caching

## 🔄 Deployment Workflow

Whenever you push to main branch:

1. Vercel automatically detects the push
2. Starts a new build with production env vars
3. Builds the app with `NEXT_PUBLIC_APP_URL=https://www.buildspace.me`
4. Deploys to production
5. Available at `https://www.buildspace.me`

## 📱 Testing Different Environments

### Local Development
```bash
# No env var needed
npm run dev
# URLs will use: http://localhost:3000
```

### Production Build Locally
```bash
# Create .env.local file:
echo "NEXT_PUBLIC_APP_URL=https://www.buildspace.me" > .env.local

# Build and run
npm run build
npm start

# URLs will use: https://www.buildspace.me
```

### Preview Deployments (Optional)
If you want preview deployments to also use the production domain:
1. Set `NEXT_PUBLIC_APP_URL` for "Preview" environment in Vercel
2. Otherwise, previews will use their Vercel preview URL

## 📞 Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Next.js Environment Variables Guide](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
3. Review `PRODUCTION_URL_FIX.md` for technical details

## 🎉 Success!

Once configured, your portfolios will be accessible at:
- **Main site:** https://www.buildspace.me
- **User portfolios:** https://www.buildspace.me/username
- **Career pages:** https://www.buildspace.me/username/career/id
- **Project pages:** https://www.buildspace.me/username/project/id

All shareable links will automatically use the production domain! 🚀

