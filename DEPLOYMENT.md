# Deployment Guide - FeedbackHub

This guide will walk you through deploying FeedbackHub to Vercel with Supabase as the database.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase account (sign up at [supabase.com](https://supabase.com))

## Part 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in the details:
   - **Name**: FeedbackHub (or any name you prefer)
   - **Database Password**: Choose a strong password and save it
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

4. Wait 2-3 minutes for the project to be created

### 1.2 Get Database Connection String

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll down to **Connection String** section
3. Select **Connection Pooling** tab (important!)
4. Copy the URI and replace `[YOUR-PASSWORD]` with your actual database password
5. Example format:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
6. Save this connection string - you'll need it for Vercel

### 1.3 Configure Supabase (Optional but Recommended)

1. Go to **Settings** → **API**
2. Disable "Email Auth" if you're only using JWT authentication
3. Go to **Authentication** → **Policies** and review RLS settings

## Part 2: Push Code to GitHub

### 2.1 Initialize Git Repository

```bash
# Navigate to your project directory
cd FeedBackHub

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"
```

### 2.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "+" → "New repository"
3. Name it: `FeedBackHub` (or any name you prefer)
4. **Do NOT** initialize with README (we already have one)
5. Click "Create repository"

### 2.3 Push to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/FeedBackHub.git

# Set main branch
git branch -M main

# Push code
git push -u origin main
```

## Part 3: Deploy Backend to Vercel

### 3.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Click "Import" next to your GitHub repository
4. Vercel will detect your repository

### 3.2 Configure Backend Deployment

1. **Project Settings**:
   - **Project Name**: `feedbackhub-backend` (or any name)
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" and select `server`

2. **Build & Development Settings**:
   - **Build Command**: `npm install && npx prisma generate`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
   - **Development Command**: Leave default

3. **Environment Variables**: Click "Add" and add these:

   | Name | Value | Description |
   |------|-------|-------------|
   | `DATABASE_URL` | Your Supabase connection string | From Part 1.2 |
   | `JWT_SECRET` | Generate random 32-char string | See below for generator |
   | `NODE_ENV` | `production` | Sets production mode |
   | `FRONTEND_URL` | Leave empty for now | Will update after frontend deployment |

   **Generate JWT_SECRET**: Run this in your terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Click "Deploy"

### 3.3 Wait for Deployment

- Wait 2-3 minutes for the build and deployment to complete
- Copy your backend URL (e.g., `https://feedbackhub-backend.vercel.app`)
- **Save this URL** - you'll need it for frontend deployment

### 3.4 Initialize Database

After successful deployment, initialize your database:

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
cd server
vercel link

# Pull environment variables
vercel env pull

# Run Prisma commands
npx prisma db push
node scripts/setup.js
```

**Option B: Using Local Connection**

```bash
# In server directory
cd server

# Create temporary .env with your Supabase DATABASE_URL
echo 'DATABASE_URL="your-supabase-connection-string"' > .env

# Initialize database
npx prisma db push
node scripts/setup.js

# Remove temporary .env
rm .env
```

This will create:
- Admin user: `admin@feedbackhub.com` / `admin123`
- Sample stores
- Sample reviews

### 3.5 Test Backend

Visit your backend health check endpoint:
```
https://YOUR-BACKEND-URL.vercel.app/api/health
```

You should see: `{"status":"OK","timestamp":"..."}`

## Part 4: Deploy Frontend to Vercel

### 4.1 Import Project Again

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Select the **same** GitHub repository
4. This time we'll deploy the frontend

### 4.2 Configure Frontend Deployment

1. **Project Settings**:
   - **Project Name**: `feedbackhub` (or any name)
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave as root/default)

2. **Build & Development Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`

3. **Environment Variables**: Click "Add" and add:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://YOUR-BACKEND-URL.vercel.app/api` |

   Replace `YOUR-BACKEND-URL` with your actual backend URL from Part 3.3

4. Click "Deploy"

### 4.3 Wait for Deployment

- Wait 2-3 minutes for deployment
- Copy your frontend URL (e.g., `https://feedbackhub.vercel.app`)

## Part 5: Final Configuration

### 5.1 Update Backend CORS Settings

1. Go to your **backend** project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Add or update `FRONTEND_URL`:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://YOUR-FRONTEND-URL.vercel.app` (no trailing slash)
4. Go to **Deployments** and click "Redeploy" on the latest deployment

### 5.2 Test Your Application

1. Visit your frontend URL: `https://YOUR-FRONTEND-URL.vercel.app`
2. You should see the feedback form
3. Click "Admin" to login with:
   - Email: `admin@feedbackhub.com`
   - Password: `admin123`
4. **Important**: Change the admin password immediately!

## Part 6: Post-Deployment

### 6.1 Custom Domains (Optional)

**For Frontend:**
1. Go to your frontend project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

**For Backend:**
1. Go to your backend project in Vercel
2. Click "Settings" → "Domains"
3. Add your API subdomain (e.g., `api.yourdomain.com`)
4. Update `VITE_API_URL` in frontend project to use new domain
5. Update `FRONTEND_URL` in backend project

### 6.2 Security Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong random value
- [ ] Verify DATABASE_URL is using connection pooling (port 6543)
- [ ] Check CORS settings in backend
- [ ] Enable SSL/HTTPS (automatic with Vercel)
- [ ] Review Supabase RLS policies
- [ ] Set up monitoring and error tracking

### 6.3 Monitoring

**Vercel:**
- Check "Analytics" tab for traffic
- Check "Logs" tab for errors
- Set up email notifications for deployment failures

**Supabase:**
- Check "Database" → "Query Performance"
- Monitor connection pool usage
- Set up database backups (Settings → Backups)

## Troubleshooting

### Backend Deployment Fails

**Error: "Prisma Client could not locate the Query Engine"**

Solution: Make sure `npx prisma generate` is in your build command:
```
npm install && npx prisma generate
```

**Error: "DATABASE_URL environment variable not found"**

Solution: Verify environment variables are set in Vercel dashboard

### Database Connection Issues

**Error: "Can't reach database server"**

Solutions:
1. Verify your DATABASE_URL is correct
2. Use connection pooling URL (port 6543) not direct connection (port 5432)
3. Check Supabase project is running (not paused on free tier)
4. Verify password doesn't contain special characters that need URL encoding

### CORS Errors

**Error: "Access to fetch blocked by CORS policy"**

Solutions:
1. Verify `FRONTEND_URL` is set correctly in backend (no trailing slash)
2. Make sure it matches your actual frontend URL exactly
3. Redeploy backend after updating environment variables
4. Check browser console for actual blocked URL

### Frontend Can't Connect to Backend

Solutions:
1. Verify `VITE_API_URL` is set correctly (should end with `/api`)
2. Test backend health endpoint directly in browser
3. Check browser console for actual API URL being called
4. Verify backend is deployed and running

### Database Not Initialized

**Error: "Table does not exist"**

Solution: Run database initialization:
```bash
cd server
vercel env pull
npx prisma db push
node scripts/setup.js
```

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs (Logs Explorer)
3. Open an issue on GitHub
4. Check the troubleshooting section in README.md

## Costs

Both Vercel and Supabase offer generous free tiers:

**Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth per month
- Automatic SSL
- Perfect for side projects and testing

**Supabase Free Tier:**
- 500MB database space
- 1GB file storage
- 2GB bandwidth
- Sufficient for small to medium applications

## Next Steps

After successful deployment:

1. Set up custom domain
2. Configure email notifications
3. Set up analytics (Google Analytics, Plausible, etc.)
4. Create regular database backups
5. Monitor application performance
6. Plan for scaling if needed

---

Congratulations! Your FeedbackHub application is now live! 🎉
