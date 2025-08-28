# 🚀 Deployment Guide - CreatorCoin AI

## 📋 Pre-Deployment Checklist

✅ Code cleaned and committed to Git  
✅ .env.example created with safe defaults  
✅ .gitignore properly configured  
⏳ Push to GitHub (see instructions below)  
⏳ Set up deployment platform  

---

## 🔐 GitHub Push Instructions

### 1. Verify GitHub Repository
Ensure your GitHub repository is accessible:
- Repository: `https://github.com/[your-username]/creatorcoin-ai`
- Visibility: Public (for deployment platforms)

### 2. Authenticate with GitHub
```bash
# If using HTTPS (recommended):
git remote add origin https://github.com/[your-username]/creatorcoin-ai.git

# If using SSH (requires SSH key setup):
git remote add origin git@github.com:[your-username]/creatorcoin-ai.git
```

### 3. Push to GitHub
```bash
cd /Users/ch0002techvc/Documents/tiktok-techjam-2025/creatorcoin-ai
git branch -M main
git push -u origin main
```

---

## 🌐 Deployment Platform Options

Based on our Vite frontend, here are the recommended platforms:

### 🏆 Recommended: Vercel (Best for React/Vite)

**Why Vercel:**
- ✅ Optimized for React/Vite applications
- ✅ Automatic deployments from GitHub
- ✅ Preview environments for PRs
- ✅ Serverless functions support
- ✅ Excellent developer experience

**Setup Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import `creatorcoin-ai` repository
4. Configure build settings:
   ```
   Framework Preset: Vite
   Build Command: cd frontend && npm run build
   Output Directory: frontend/dist
   Install Command: cd frontend && npm install
   ```
5. Add environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_AI_SERVICE_URL=https://your-ai-service-url.com
   ```

### 🚀 Alternative: Netlify (Great for Static Sites)

**Why Netlify:**
- ✅ User-friendly interface
- ✅ Continuous deployment
- ✅ Built-in CI/CD
- ✅ Form handling and serverless functions

**Setup Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. New site from Git → Select repository
4. Configure build settings:
   ```
   Build command: cd frontend && npm run build
   Publish directory: frontend/dist
   ```

### ⚡ Alternative: Cloudflare Pages (Best Performance)

**Why Cloudflare Pages:**
- ✅ Global CDN with excellent performance
- ✅ Unlimited bandwidth on free tier
- ✅ Edge computing with Workers
- ✅ Advanced caching and optimization

**Setup Steps:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub account
3. Select repository and configure:
   ```
   Framework preset: Vite
   Build command: cd frontend && npm run build
   Build output directory: frontend/dist
   ```

---

## 🛠️ Backend Deployment

### For Backend API (Node.js):
- **Railway** (recommended for hackathons)
- **Render** (free tier available)
- **Heroku** (paid plans)
- **Digital Ocean App Platform**

### For AI Service (Python):
- **Railway** (supports Python)
- **Render** (Python runtime)
- **Google Cloud Run**
- **AWS Lambda** (serverless)

---

## 🔧 Frontend Configuration for Deployment

### Update vite.config.ts for production:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Important for deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          lynx: ['./src/lynx/core.ts', './src/lynx/components.tsx']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  }
})
```

### Add deployment scripts to frontend/package.json:

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod --dir=dist"
  }
}
```

---

## 🌍 Environment Variables for Production

### Frontend (.env.production):
```bash
VITE_API_URL=https://your-production-api.com
VITE_AI_SERVICE_URL=https://your-ai-service.com
VITE_APP_TITLE=CreatorCoin AI - TikTok TechJam 2025
```

### Backend (Production):
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@production-db/creatorcoin
REDIS_URL=redis://production-redis:6379
OPENAI_API_KEY=your-production-openai-key
JWT_SECRET=super-secure-production-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 📱 Demo Links (After Deployment)

Once deployed, update your README.md with:

```markdown
## 🚀 Live Demo

- **Frontend Demo**: https://creatorcoin-ai.vercel.app
- **API Documentation**: https://creatorcoin-api.railway.app/api/docs
- **GitHub Repository**: https://github.com/[username]/creatorcoin-ai

### Quick Test:
1. Visit the frontend demo
2. Click "🚀 Launch Lynx Demo"
3. Explore the cross-platform UI features
4. Test the AI-powered content analysis
```

---

## 🎯 TikTok TechJam 2025 Submission

For the hackathon submission, include:

1. **GitHub Repository URL**: Clean, well-documented code
2. **Live Demo URL**: Working application
3. **Demo Video**: 2-3 minute walkthrough
4. **Documentation**: This deployment guide + README.md

---

## 🔍 Troubleshooting

### Common Issues:

1. **Build fails**: Check Node.js version (use 18+)
2. **API connection issues**: Verify CORS settings
3. **Environment variables**: Use VITE_ prefix for frontend vars
4. **Authentication issues**: Set up GitHub personal access token

### Build Test Commands:
```bash
# Test frontend build locally
cd frontend && npm run build && npm run preview

# Test backend locally
cd backend && npm start

# Test AI service locally  
cd ai-service && python app.py
```

---

**🚀 Ready for TikTok TechJam 2025 deployment!**
