# DEMO MODE - Quick Start Guide

## 🎉 Running Without MongoDB

The app can now run in **DEMO MODE** without MongoDB!

### Demo Credentials
```
Email: demo@energy.com
Password: demo123

OR use ANY email/password combination in demo mode!
```

### Quick Start

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   DEMO_MODE=true npm start
   ```
   You should see: `⚠️  Running in DEMO MODE (no MongoDB required)`

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

3. **Start ML Service** (Terminal 3) - Optional:
   ```bash
   cd ml
   python3 app.py
   ```

4. **Open Browser**: http://localhost:3000

5. **Login with**:
   - Email: `demo@energy.com`
   - Password: `demo123`

### Demo Features

✅ **Pre-loaded data**:
- 4 appliances (Refrigerator, Air Conditioner, Washing Machine, TV)
- 7 days of usage data
- All charts and analytics work

✅ **Working features**:
- Login/Register (accepts any credentials)
- Dashboard with charts
- Statistics and insights
- Alerts and tips
- Add new appliances
- Add usage data

❌ **Not available in demo**:
- CSV upload
- Data persistence (resets on restart)
- MongoDB features

### Switch to Full Mode

To use MongoDB instead:
1. Start MongoDB: `mongod`
2. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/energyDB
   DEMO_MODE=false
   ```
3. Restart backend

Enjoy exploring the app! 🚀
