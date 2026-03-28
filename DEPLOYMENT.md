# Deployment Guide: Vercel + Render

This guide covers deploying the Women Safety Guardian application to **Vercel** (frontend) and **Render** (backend).

---

## Quick Summary

| Service | Platform | URL Pattern |
|---------|----------|-------------|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend | Render | `https://your-backend.onrender.com` |

---

## Prerequisites

- GitHub account
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- Project pushed to GitHub

---

## Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/zelda2-main.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Log in to **Render Dashboard**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repo `zelda2-main`

### 2.2 Configure Settings

| Setting | Value |
|---------|-------|
| Name | `women-safety-backend` |
| Root Directory | `server` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `node index.js` |

### 2.3 Environment Variables

Add these in Render dashboard:

```
PORT=5000
JWT_SECRET=<generate-random-string>
NODE_ENV=production
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy

Click **"Create Web Service"** and wait for deployment.

**Your backend URL**: `https://women-safety-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Update Configuration Files

The following files have been pre-configured:

- `client/vercel.json` - Vercel rewrite rules
- `client/.env.production` - Production environment variables

### 3.2 Update Your URLs

**IMPORTANT**: After deploying backend, update these files with your actual URLs:

**File: `client/.env.production`**
```
VITE_API_URL=https://women-safety-backend.onrender.com/api
VITE_MEDIA_URL=https://women-safety-backend.onrender.com
```

**File: `client/vercel.json`**
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://women-safety-backend.onrender.com/api/:path*" },
    { "source": "/uploads/:path*", "destination": "https://women-safety-backend.onrender.com/uploads/:path*" }
  ]
}
```

**File: `server/index.js`** (Update CORS)
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://your-frontend.vercel.app'  // Replace with your Vercel URL
    ];
    // ...
  }
};
```

### 3.3 Deploy to Vercel

1. Log in to **Vercel Dashboard**
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository

4. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | `Vite` |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

5. Add Environment Variables:

```
VITE_API_URL=https://women-safety-backend.onrender.com/api
VITE_MEDIA_URL=https://women-safety-backend.onrender.com
```

6. Click **"Deploy"**

---

## Step 4: Verify Deployment

### Test Your URLs

| Service | Test Endpoint |
|---------|---------------|
| Backend Health | `https://your-backend.onrender.com/api/health` |
| Frontend | `https://your-frontend.vercel.app` |

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Police | police@guardian.com | police123 |
| User | user@guardian.com | user123 |

---

## Important Notes

### ⚠️ File Upload Limitation

- Render's free tier has **ephemeral filesystem**
- Uploaded files are deleted when the service sleeps/restarts
- For production, integrate **AWS S3** or **Cloudinary**

### Updating URLs After Deploy

If you need to update your backend/frontend URLs:

1. **Frontend**: Update Vercel environment variables
2. **Backend**: Update CORS in `server/index.js` and redeploy

---

## Project Structure for Deployment

```
zelda2-main/
├── client/                 # Vercel deployment
│   ├── src/
│   ├── vercel.json        # Vercel config
│   ├── .env.production    # Production env
│   └── package.json
├── server/                 # Render deployment
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   ├── index.js
│   └── package.json
└── README.md
```

---

## Troubleshooting

### CORS Errors
- Update `server/index.js` with your Vercel domain in allowedOrigins
- Redeploy backend on Render

### 404 on API Calls
- Verify `VITE_API_URL` is correct in Vercel
- Check backend is running on Render

### Files Not Loading
- Verify `VITE_MEDIA_URL` is correct
- Check Render service is active (not sleeping)

---

## Support

For issues, check:
1. Render logs (Dashboard → your service → Logs)
2. Vercel logs (Dashboard → your project → Logs)
3. Browser console for errors
