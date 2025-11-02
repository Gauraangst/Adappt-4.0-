# Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Variables Setup

1. **Backend** (`backend/.env`):
   ```env
   PORT=5001
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=generate_a_secure_random_string
   DEMO_MODE=false
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Frontend** (`frontend/.env`):
   ```env
   REACT_APP_API_URL=https://your-backend-api.com/api
   REACT_APP_ML_SERVICE_URL=https://your-ml-service.com
   REACT_APP_ENV=production
   ```

3. **ML Service** (`ml/.env`):
   ```env
   PORT=5002
   HOST=0.0.0.0
   DEBUG=false
   ELECTRICITY_RATE_PER_KWH=6.5
   USD_TO_INR_RATE=83.25
   ```

### ✅ Security Checks

- [ ] Change default JWT_SECRET to a secure random string
- [ ] Set DEMO_MODE=false for production
- [ ] Update CORS_ORIGIN to your production frontend URL
- [ ] Remove console.log statements from production code
- [ ] Enable HTTPS for all services

### ✅ Build Commands

**Frontend:**
```bash
cd frontend
npm install
npm run build
```

**Backend:**
```bash
cd backend
npm install
npm start
```

**ML Service:**
```bash
cd ml
pip install -r requirements.txt
python app.py
```

## Deployment Platforms

### Vercel/Netlify (Frontend)
- Build command: `npm run build`
- Output directory: `build`
- Environment variables: Set in platform dashboard

### Heroku/Railway (Backend & ML)
- Add Procfile for each service
- Set environment variables in platform dashboard
- Use MongoDB Atlas for database

### Docker (All Services)
Create Dockerfiles for each service and use docker-compose for orchestration.

## Post-Deployment

1. Test health endpoints:
   - Backend: `https://your-api.com/health`
   - ML Service: `https://your-ml-service.com/health`

2. Verify API connections
3. Test authentication flow
4. Monitor logs for errors

