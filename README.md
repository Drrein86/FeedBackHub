# FeedbackHub - Multilingual Feedback System

A modern, multilingual feedback collection system with admin panel, built with React, TypeScript, Node.js, and PostgreSQL.

## Features

- 🌍 **Multilingual Support**: English and Hebrew with RTL support
- 📱 **Responsive Design**: Works on all devices
- 🔐 **Admin Authentication**: Secure admin panel access
- 🏪 **Store Management**: Add, edit, and delete stores
- ⭐ **Rating System**: Optional 1-5 star ratings
- 💬 **Feedback Collection**: Anonymous feedback submission
- 📊 **Admin Dashboard**: Manage stores, reviews, and settings
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- React Router for navigation
- React Query for data fetching

### Backend
- Node.js with Express
- Prisma ORM
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+ (for local development) or Supabase account (for production)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/FeedBackHub.git
cd FeedBackHub

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Database Setup (Local Development)

**Option A: Using PostgreSQL Locally**

1. Install PostgreSQL 14+ on your machine
2. Create a database:
```sql
CREATE DATABASE feedbackhub;
```

3. Copy the example environment file:
```bash
cp server/env.example server/.env
```

4. Update `server/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/feedbackhub"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3001
NODE_ENV=development
```

**Option B: Using Supabase (Recommended)**

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Get your connection string from: Settings → Database → Connection String (URI)
4. Update `server/.env` with your Supabase connection string

### 3. Initialize Database

```bash
# Generate Prisma client
npm run server:db:generate

# Push schema to database
npm run server:db:push

# Seed database with sample data
npm run server:db:setup
```

This will create:
- Admin user: `admin@feedbackhub.com` / `admin123`
- Sample stores
- Sample reviews

### 4. Environment Variables

Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Content:
```env
VITE_API_URL=http://localhost:3001/api
```

### 5. Run the Application

#### Development (Frontend + Backend together)
```bash
npm run dev:full
```

Then open:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

#### Development (Separate terminals)

Terminal 1 - Backend:
```bash
npm run server:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## Production Deployment to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (free)
3. Supabase account (free) or Vercel Postgres

### Step 1: Prepare Repository

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/FeedBackHub.git
git branch -M main
git push -u origin main
```

### Step 2: Setup Database on Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the database to be ready
4. Go to Settings → Database
5. Copy the connection string (Connection Pooling mode)
6. Save this for Vercel environment variables

### Step 3: Deploy to Vercel

#### Deploy Backend

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   JWT_SECRET=generate-a-random-32-character-secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

   To generate JWT_SECRET, run:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Deploy and copy the backend URL (e.g., `https://your-backend.vercel.app`)

7. After deployment, run database setup:
   - Go to your Vercel project → Settings → Functions
   - Or use Vercel CLI:
   ```bash
   npm i -g vercel
   vercel login
   cd server
   vercel env pull
   npx prisma db push
   node scripts/setup.js
   ```

#### Deploy Frontend

1. Go to Vercel Dashboard
2. Click "Add New Project"
3. Import the same GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

6. Deploy

### Step 4: Update CORS Settings

After both are deployed, update your backend's `FRONTEND_URL` environment variable in Vercel with your actual frontend URL.

## Default Admin Credentials

- **Email**: admin@feedbackhub.com
- **Password**: admin123

**⚠️ IMPORTANT**: Change the admin password after first login!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Stores
- `GET /api/stores?language=en` - Get all stores
- `POST /api/stores` - Create store (Admin)
- `PUT /api/stores/:id` - Update store (Admin)
- `DELETE /api/stores/:id` - Delete store (Admin)

### Reviews
- `POST /api/reviews` - Submit feedback
- `GET /api/reviews?language=en&page=1&limit=10` - Get reviews (Admin)
- `PATCH /api/reviews/:id/approve` - Update approval status (Admin)
- `DELETE /api/reviews/:id` - Delete review (Admin)

### Settings
- `GET /api/settings` - Get settings (Admin)
- `PUT /api/settings` - Update settings (Admin)

## Database Schema

The application uses a multilingual database design:

- **Users**: Admin authentication
- **Stores**: Store information with translations
- **StoreTranslations**: Multilingual store names and locations
- **Reviews**: Feedback with language support
- **Settings**: Application configuration

## Development

### Adding New Languages

1. Update the `LanguageContext.tsx` with new translations
2. Add language support to the database schema
3. Update API endpoints to handle the new language

### Customizing the UI

The application uses Tailwind CSS with custom design tokens. Key files:
- `tailwind.config.ts` - Tailwind configuration
- `src/index.css` - Global styles and CSS variables
- `src/components/ui/` - Reusable UI components

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify your `DATABASE_URL` is correct
2. For Supabase, make sure you're using the connection pooling URL (port 6543)
3. Check if your IP is whitelisted in Supabase (Settings → Database → Connection Pooling)

### Build Errors

If build fails:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Make sure all environment variables are set

### CORS Errors

If you get CORS errors:

1. Verify `FRONTEND_URL` is set correctly in backend environment variables
2. Make sure it matches your actual frontend URL (no trailing slash)

## Project Structure

```
FeedBackHub/
├── src/                      # Frontend source
│   ├── components/          # React components
│   ├── contexts/           # Context providers
│   ├── lib/                # Utilities and API client
│   └── pages/              # Page components
├── server/                  # Backend source
│   ├── prisma/             # Database schema
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── scripts/            # Database scripts
├── public/                  # Static assets
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.
