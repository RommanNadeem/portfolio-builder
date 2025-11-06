# 🚂 Railway Backend Setup Complete!

## What Changed?

Your portfolio builder now uses a **Python FastAPI backend** deployed on Railway instead of Supabase Edge Functions.

### ✅ Completed Changes:
1. ✅ Created new Railway API client (`lib/railway-api.ts`)
2. ✅ Updated all components to use Railway backend
3. ✅ Deleted Supabase Edge Functions directory
4. ✅ Deleted old `supabase-functions.ts` file
5. ✅ Cleaned up edge function documentation
6. ✅ Removed test files and deploy scripts

---

## 🔧 Configuration Required

### 1. Update Your Railway Backend URL

Edit `.env.local` and add your actual Railway URL:

```env
NEXT_PUBLIC_RAILWAY_BACKEND_URL=https://your-actual-railway-url.up.railway.app
```

To get your Railway URL:
1. Go to [Railway Dashboard](https://railway.app)
2. Open your `portfoliobuilder-backend` project
3. Click on "Settings" → "Domains"
4. Copy the generated domain

### 2. Test the Connection

Visit the test page to verify everything works:
```
http://localhost:3000/test-ai
```

Or test manually:
```bash
curl https://your-railway-url.up.railway.app/health
```

---

## 📊 API Endpoints

Your Railway backend provides these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/parse-resume` | POST | Parse PDF/DOCX resume |
| `/api/parse-linkedin` | POST | Parse LinkedIn profile |
| `/api/generate-copy` | POST | Generate taglines/about |
| `/api/enrich-profile` | POST | Fetch logos/metadata |

---

## 🎯 Frontend Changes

### Files Updated:
- ✅ `lib/railway-api.ts` - New backend API client
- ✅ `app/onboarding-v2/start/page.tsx` - Now uses Railway API
- ✅ `app/test-ai/page.tsx` - Updated for Railway backend

### Files Deleted:
- ❌ `lib/supabase-functions.ts`
- ❌ `supabase/functions/` directory
- ❌ Edge function documentation files
- ❌ Test and deploy scripts

---

## 🚀 Deploy Frontend to Vercel

### 1. Update Environment Variables on Vercel

Go to your Vercel project → Settings → Environment Variables:

```env
NEXT_PUBLIC_RAILWAY_BACKEND_URL=https://your-railway-url.up.railway.app
```

### 2. Redeploy

```bash
git add .
git commit -m "Migrate to Railway backend"
git push origin main
```

Vercel will automatically redeploy with the new backend!

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Check your Railway URL in `.env.local`
- Verify Railway backend is running: `curl https://your-url/health`
- Check Railway logs for errors

### CORS Errors
- Make sure Railway environment variable `FRONTEND_URL` is set to your Vercel domain
- Verify CORS is enabled in Railway backend `main.py`

### API Errors
- Check Railway environment variables (especially `OPENAI_API_KEY`)
- View Railway logs: Railway Dashboard → Your Service → Logs

---

## 💰 Cost Comparison

| Service | Supabase Edge Functions | Railway Backend |
|---------|------------------------|-----------------|
| **Cost** | Free tier: 500K invocations/month | ~$5-10/month |
| **Cold Starts** | Yes (~1-2s) | No (always warm) |
| **Latency** | Global (fast) | Centralized (good) |
| **Control** | Limited | Full control |

---

## 📚 Backend Repository

Your Python backend is at:
- **GitHub**: https://github.com/RommanNadeem/portfoliobuilder-backend
- **Railway**: https://railway.app (your deployed app)

To update the backend:
```bash
cd /Users/romman/Documents/portfoliobuilder-backend
# Make changes
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys!
```

---

## ✨ Benefits

1. **More Control**: Full Python ecosystem, better PDF parsing
2. **No Cold Starts**: Railway keeps containers warm
3. **Better Debugging**: Standard Python tooling
4. **More Flexible**: Easy to add new features

---

## 🎉 You're All Set!

Your portfolio builder is now running on:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Python FastAPI)
- **Database**: Supabase (PostgreSQL)

Test it out at: http://localhost:3000 🚀

