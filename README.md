# 🚀 Portfolio Builder

AI-powered portfolio builder that creates professional portfolios in under 60 seconds. Import from resume or LinkedIn and let AI generate compelling copy.

## ✨ Features

- 📄 **Resume Parser** - Upload PDF/DOCX and extract structured data
- 🔗 **LinkedIn Import** - Parse public LinkedIn profiles
- ✍️ **AI Copy Generation** - Generate taglines and about sections
- 🎨 **Live Preview** - See changes in real-time
- 🏢 **Profile Enrichment** - Auto-fetch company logos and metadata
- ⚡ **Fast** - Complete onboarding in under 60 seconds

## 🏗️ Architecture

```
Frontend (Next.js on Vercel)
    ↓
Railway Backend (Python FastAPI)
    ↓
OpenAI API (GPT-4o / GPT-4o-mini)
```

### **Frontend**
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Deployment: Vercel
- Database: Supabase (PostgreSQL)

### **Backend**
- Framework: Python FastAPI
- AI: OpenAI GPT-4o, GPT-4o-mini
- Deployment: Railway
- Repository: [portfoliobuilder-backend](https://github.com/RommanNadeem/portfoliobuilder-backend)

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- npm or yarn

### **1. Clone and Install**

```bash
git clone https://github.com/yourusername/portfoliobuilder.git
cd portfoliobuilder
npm install
```

### **2. Configure Environment**

Create `.env.local`:

```env
# Railway Backend (Required)
NEXT_PUBLIC_RAILWAY_BACKEND_URL=https://portfoliobuilder-backend-production.up.railway.app

# Supabase (for database)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **3. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### **Test AI Functions**
Visit: http://localhost:3000/test-ai

Click buttons to test:
- ✨ Generate Taglines
- 📝 Generate About Section

### **Test Resume Upload**
Visit: http://localhost:3000/onboarding-v2/start

Upload a PDF/DOCX resume to see AI parsing in action!

## 📚 API Documentation

### **Backend Health Check**
```bash
curl https://portfoliobuilder-backend-production.up.railway.app/health
```

### **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/parse-resume` | POST | Parse PDF/DOCX resume |
| `/api/parse-linkedin` | POST | Parse LinkedIn profile |
| `/api/generate-copy` | POST | Generate AI copy |
| `/api/enrich-profile` | POST | Fetch logos/metadata |

See [BACKEND_READY.md](./BACKEND_READY.md) for detailed API examples.

## 🌐 Deployment

### **Deploy Frontend to Vercel**

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable:
   ```
   NEXT_PUBLIC_RAILWAY_BACKEND_URL=https://portfoliobuilder-backend-production.up.railway.app
   ```
4. Deploy!

### **Backend (Already Deployed)**

Backend is deployed on Railway: [View Project](https://railway.com/project/3c59d851-07e7-4fff-b7a4-3cf6a3c54811)

To update backend:
```bash
cd /path/to/portfoliobuilder-backend
git push origin main
# Railway auto-deploys!
```

## 📁 Project Structure

```
portfoliobuilder/
├── app/
│   ├── onboarding-v2/        # Main onboarding flow
│   │   ├── start/            # Resume/LinkedIn import
│   │   ├── preview/          # Live preview
│   │   └── publish/          # Publish portfolio
│   ├── test-ai/              # AI testing page
│   └── page.tsx              # Landing page
├── lib/
│   ├── railway-api.ts        # Backend API client
│   ├── database.ts           # Supabase helpers
│   └── types.ts              # TypeScript types
├── components/
│   ├── onboarding/           # Onboarding components
│   └── preview/              # Preview components
└── .env.local                # Environment config
```

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_RAILWAY_BACKEND_URL` | Railway backend URL | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |

### **Backend Configuration**

Backend environment variables (set in Railway):
- `OPENAI_API_KEY` - OpenAI API key (required)
- `FRONTEND_URL` - Your Vercel URL (optional)
- `ENV` - Environment (production/development)

## 🐛 Troubleshooting

### **Backend Connection Issues**

Test backend health:
```bash
curl https://portfoliobuilder-backend-production.up.railway.app/health
```

Should return:
```json
{"status":"healthy","openai_configured":true}
```

### **CORS Errors**

Backend has public CORS enabled. If you still see errors:
1. Check Railway deployment logs
2. Verify backend is running
3. Restart dev server: `npm run dev`

### **OpenAI Errors**

- Verify OpenAI API key is set in Railway
- Check OpenAI account has credits
- View Railway logs for detailed errors

## 📖 Documentation

- **Backend Setup**: [BACKEND_READY.md](./BACKEND_READY.md)
- **Migration Guide**: [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)
- **Railway Setup**: [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)

## 🔒 Security

- OpenAI API key is stored securely in Railway
- Frontend only exposes public URL
- Supabase handles authentication
- CORS configured for your domains

## 📊 Tech Stack

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- React

**Backend:**
- Python 3.11
- FastAPI
- OpenAI API
- PyPDF2, python-docx

**Infrastructure:**
- Vercel (Frontend)
- Railway (Backend)
- Supabase (Database)
- GitHub (Version Control)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- Railway for backend hosting
- Vercel for frontend hosting
- Supabase for database

---

**Built with ❤️ for creators and professionals**

Need help? Check [BACKEND_READY.md](./BACKEND_READY.md) or open an issue!
