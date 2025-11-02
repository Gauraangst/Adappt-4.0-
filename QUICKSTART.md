# Quick Start Guide

## First Time Setup

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

#### ML Service
```bash
cd ml
pip install -r requirements.txt
```

### 2. Start MongoDB
Make sure MongoDB is running:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

### 3. Start All Services

Open 3 terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 3 - ML Service:**
```bash
cd ml
python app.py
```

### 4. Access the Application

Open your browser and go to: http://localhost:3000

### 5. Create an Account

1. Click "Register here"
2. Enter your name, email, and password
3. Click "Register"

### 6. Add Appliances and Usage Data

#### Option 1: Manual Entry
Use the API to add appliances and usage data.

#### Option 2: CSV Upload
1. Prepare a CSV file with format:
   ```
   applianceName,timestamp,consumption,powerRating
   Refrigerator,2024-01-01T00:00:00Z,2.5,150
   ```
2. Upload via the dashboard

### 7. View Insights

The dashboard will display:
- Total consumption
- Average daily consumption
- Charts and graphs
- Alerts for abnormal usage
- Energy-saving tips

## Testing the ML Prediction Service

You can test the ML service directly:

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "usage_data": [
      {"consumption": 10.5, "timestamp": "2024-01-01"},
      {"consumption": 12.3, "timestamp": "2024-01-02"},
      {"consumption": 11.8, "timestamp": "2024-01-03"},
      {"consumption": 13.2, "timestamp": "2024-01-04"},
      {"consumption": 10.9, "timestamp": "2024-01-05"},
      {"consumption": 14.5, "timestamp": "2024-01-06"},
      {"consumption": 12.1, "timestamp": "2024-01-07"}
    ]
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the MONGODB_URI in backend/.env

### Frontend Not Loading
- Clear browser cache
- Check if backend is running on port 5000

### Port Already in Use
- Change ports in configuration files
- Kill processes using the ports:
  ```bash
  # Find process on port
  lsof -i :5000
  # Kill process
  kill -9 <PID>
  ```

### CORS Errors
- Make sure CORS is enabled in backend
- Check API URL in frontend configuration

## Need Help?

Check the main README.md for detailed documentation.
