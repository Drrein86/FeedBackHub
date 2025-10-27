# Quick Start Guide - FeedbackHub

Get FeedbackHub running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A code editor (VS Code recommended)

## Option 1: Quick Start with SQLite (Development Only)

**⚠️ Note**: SQLite is for local development only. For production, use PostgreSQL (see DEPLOYMENT.md)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/FeedBackHub.git
cd FeedBackHub

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 2. Setup for SQLite (Local Dev)

```bash
# Change database to SQLite
cd server

# Edit prisma/schema.prisma and change:
# FROM: provider = "postgresql"
# TO:   provider = "sqlite"
# AND:  url = "file:./dev.db"
```

### 3. Setup Environment

```bash
# Create .env files
cp env.example .env
cp server/env.example server/.env

# Edit server/.env and set:
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="any-secret-key-for-development"
# PORT=3001
# NODE_ENV=development
```

### 4. Initialize Database

```bash
# From project root
npm run server:db:generate
npm run server:db:push
npm run server:db:setup
```

### 5. Run the App

```bash
npm run dev:full
```

Visit:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3001
- **Admin Login**: admin@feedbackhub.com / admin123

## Option 2: Production Setup with PostgreSQL

For production deployment with Vercel + Supabase, follow the complete guide in **DEPLOYMENT.md**.

### Quick Steps:

1. **Database**: Create free PostgreSQL database on [Supabase](https://supabase.com)
2. **GitHub**: Push code to GitHub repository
3. **Deploy Backend**: Deploy to Vercel (select `server` folder)
4. **Deploy Frontend**: Deploy to Vercel (root folder)
5. **Configure**: Set environment variables in Vercel

See **DEPLOYMENT.md** for detailed instructions.

## Common Commands

```bash
# Start both frontend and backend
npm run dev:full

# Start frontend only
npm run dev

# Start backend only
npm run server:dev

# Build for production
npm run build

# Generate Prisma client
npm run server:db:generate

# Push database schema
npm run server:db:push

# Seed database
npm run server:db:setup
```

## Project Structure

```
FeedBackHub/
├── src/              # Frontend React app
├── server/           # Backend Express API
│   ├── prisma/      # Database schema
│   ├── routes/      # API endpoints
│   └── scripts/     # Database scripts
├── public/          # Static files
└── README.md        # Full documentation
```

## Need Help?

- 📖 **Full Documentation**: See README.md
- 🚀 **Deployment Guide**: See DEPLOYMENT.md
- 🤝 **Contributing**: See CONTRIBUTING.md
- 🐛 **Issues**: Open an issue on GitHub

## Next Steps

1. ✅ Change admin password (default: admin@feedbackhub.com / admin123)
2. ✅ Add your stores in the admin panel
3. ✅ Customize branding and colors
4. ✅ Deploy to production (see DEPLOYMENT.md)

Happy coding! 🎉

