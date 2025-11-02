/* 
Build a full-stack energy monitoring app with the following features:

1️⃣ Backend (Node.js + Express + MongoDB):
- Connect to MongoDB database "energyDB"
- Create Mongoose models:
    • User { name, email, passwordHash }
    • Appliance { name, userId, powerRating }
    • Usage { applianceId, timestamp, consumption }
- REST API endpoints:
    • POST /api/users/register -> register a new user
    • POST /api/users/login -> login and return JWT
    • GET /api/usage -> get all usage data for the logged-in user
    • POST /api/usage -> add new usage data
    • GET /api/insights -> calculate total consumption per appliance and per day
- JWT authentication middleware
- Proper error handling

2️⃣ Frontend (React):
- Display dashboard with charts (Chart.js or Recharts)
- Show total, daily, weekly, monthly consumption per appliance
- Display alerts for abnormal consumption
- Show actionable tips (e.g., "Turn off standby devices")
- CSV upload component to upload appliance usage data
- Fetch data from backend API endpoints

3️⃣ Optional ML / Prediction (Python Flask):
- Input: past 7 days of appliance usage (JSON)
- Output: predicted next day consumption and anomaly alerts
- Simple model: moving average or linear regression
- POST /predict endpoint returning JSON { predicted_usage, alert }
- Include CORS headers for frontend calls

4️⃣ Structure:
- Separate folders: frontend/, backend/, ml/
- Use functional components and React hooks
- Comment the code properly so Copilot can generate detailed implementations

Start by generating all required files, folders, and basic logic for each component. 
*/
