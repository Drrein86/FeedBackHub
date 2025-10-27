# Vercel Deployment - Your Configuration

## ✅ Step 1: Supabase Setup - DONE!
Your Supabase project is ready at: `db.pmtghdpndezxrvfbnayc.supabase.co`

### Get Connection Pooling URL:
1. Go to Supabase Dashboard → Settings → Database
2. Scroll to "Connection String"
3. Click **"Connection Pooling"** tab (NOT "Direct Connection")
4. Select "URI" format
5. Copy the full string (should have `:6543` port)
6. Save it for Vercel environment variables

---

## 🚀 Step 2: Deploy Backend to Vercel

### 2.1 Create Backend Project
1. Go to: https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Click **"Import"** next to `Drrein86/FeedBackHub`
4. Configure:

**Project Settings:**
- **Project Name**: `feedbackhub-backend`
- **Framework Preset**: `Other`
- **Root Directory**: Click "Edit" → Select **`server`** ✅

**Build & Development Settings:**
- **Build Command**: 
  ```
  npm install && npx prisma generate
  ```
- **Output Directory**: Leave empty
- **Install Command**: 
  ```
  npm install
  ```

### 2.2 Environment Variables

Click "Add" for each variable:

#### DATABASE_URL
**Value**: Your Connection Pooling URL from Supabase
```
postgresql://postgres.pmtghdpndezxrvfbnayc:FeedbackHub12!@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```
⚠️ Make sure to use the Connection Pooling URL (port 6543)!

#### JWT_SECRET
**Generate a secure secret** - Run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste as JWT_SECRET value

Example output:
```
a7f3e9d2c8b1f6a4e7d3c9b2f8a5e1d7c3b9f6a2e8d4c1b7f3a9e6d2c8b4f1a5
```

#### NODE_ENV
```
production
```

### 2.3 Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Copy your backend URL: `https://feedbackhub-backend-xxxx.vercel.app`
- **Save this URL for Step 3!**

---

## 🗄️ Step 3: Initialize Database

After backend deployment succeeds, initialize your database:

### 3.1 Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Link to Backend Project
```bash
cd server
vercel link
```
- Select: `Drrein86`
- Select: `feedbackhub-backend`

### 3.4 Pull Environment Variables
```bash
vercel env pull
```

### 3.5 Create Database Tables
```bash
npx prisma db push
```

### 3.6 Seed with Initial Data
```bash
node scripts/setup.js
```

This creates:
✅ Admin user: admin@feedbackhub.com / admin123
✅ Sample stores
✅ Sample reviews

---

## 🎨 Step 4: Deploy Frontend to Vercel

### 4.1 Create Frontend Project
1. Go to: https://vercel.com/dashboard
2. Click **"Add New Project"** again
3. Click **"Import"** next to `Drrein86/FeedBackHub` (same repo)
4. Configure:

**Project Settings:**
- **Project Name**: `feedbackhub`
- **Framework Preset**: `Vite` ✅
- **Root Directory**: Leave as root (default)

**Build & Development Settings:**
- **Build Command**: 
  ```
  npm run build
  ```
- **Output Directory**: 
  ```
  dist
  ```
- **Install Command**: 
  ```
  npm install
  ```

### 4.2 Environment Variables

#### VITE_API_URL
**Value**: Your backend URL from Step 2.3 + `/api`
```
https://feedbackhub-backend-xxxx.vercel.app/api
```
⚠️ Don't forget the `/api` at the end!

### 4.3 Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Copy your frontend URL: `https://feedbackhub-xxxx.vercel.app`
- **Save this URL for Step 5!**

---

## 🔗 Step 5: Update Backend CORS

### 5.1 Add Frontend URL to Backend
1. Go to Vercel → Your **backend** project (`feedbackhub-backend`)
2. Go to **Settings** → **Environment Variables**
3. Click **"Add New"**:
   - **Name**: `FRONTEND_URL`
   - **Value**: Your frontend URL (NO trailing slash!)
   ```
   https://feedbackhub-xxxx.vercel.app
   ```

### 5.2 Redeploy Backend
1. Go to **Deployments** tab
2. Click the 3 dots (•••) next to the latest deployment
3. Select **"Redeploy"**
4. Wait for redeployment to finish

---

## ✅ Step 6: Test Your Application

1. Visit your frontend URL: `https://feedbackhub-xxxx.vercel.app`
2. You should see the feedback form
3. Click **"Admin"** button
4. Login with:
   - Email: `admin@feedbackhub.com`
   - Password: `admin123`
5. **⚠️ IMPORTANT**: Change the admin password immediately!

---

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Backend deployed to Vercel
- [ ] Database initialized (tables + admin user)
- [ ] Frontend deployed to Vercel
- [ ] Backend CORS updated
- [ ] Application tested and working
- [ ] Admin password changed

---

## 🆘 Troubleshooting

### Backend Deployment Fails
- Check that DATABASE_URL is correct (port 6543)
- Verify JWT_SECRET is set
- Check build logs in Vercel

### Database Connection Errors
- Use Connection Pooling URL (port 6543, not 5432)
- Verify password in DATABASE_URL is correct
- Check Supabase project is active

### Frontend Can't Connect to Backend
- Verify VITE_API_URL ends with `/api`
- Check backend URL is correct
- Verify CORS (FRONTEND_URL) is set in backend

### CORS Errors
- Make sure FRONTEND_URL is set in backend
- No trailing slash in FRONTEND_URL
- Redeploy backend after adding FRONTEND_URL

---

## 📞 Need Help?

If you get stuck, send me:
1. Which step you're on
2. The error message (screenshot or text)
3. What you tried

Good luck! 🚀

