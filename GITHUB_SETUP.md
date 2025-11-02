# GitHub Setup Guide

## Quick Start

### 1. Initialize Git Repository
```bash
cd /Users/gauraangthakkar/Desktop/Adappt
git init
```

### 2. Stage All Files
```bash
git add .
```

### 3. Create Initial Commit
```bash
git commit -m "Initial commit: WattWise Energy Monitoring App

- Full-stack React + Node.js + Python Flask application
- Real-time energy monitoring dashboard
- ML-powered consumption predictions
- Demo mode support (no MongoDB required)
- Production-ready with environment variable configuration"
```

### 4. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `adappt` (or your preferred name)
3. Description: "Energy monitoring app with real-time analytics and ML predictions"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have them)
6. Click "Create repository"

### 5. Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/adappt.git
git branch -M main
git push -u origin main
```

## Repository Structure

```
Adappt/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── ml/              # Python Flask ML service
├── scripts/         # Deployment scripts
├── .env.example     # Environment templates (3 files)
├── .gitignore       # Git exclusions
├── README.md        # Main documentation
├── DEPLOYMENT.md    # Deployment guide
└── QUICKSTART.md    # Quick start guide
```

## What's Excluded (.gitignore)

- ✅ `node_modules/` - Dependencies
- ✅ `.env` files - Environment variables (sensitive)
- ✅ `venv/` - Python virtual environment
- ✅ `*.csv` - Large data files
- ✅ `build/` - Build artifacts
- ✅ `.DS_Store` - OS files

## Environment Variables

**IMPORTANT**: Never commit `.env` files! They contain sensitive data.

The repository includes `.env.example` files that show required variables:
- `backend/.env.example`
- `frontend/.env.example`
- `ml/.env.example`

## Next Steps After Push

1. Add environment variables to your deployment platform
2. Set up CI/CD (optional)
3. Configure production URLs
4. Deploy services to hosting platforms

See `DEPLOYMENT.md` for detailed deployment instructions.

