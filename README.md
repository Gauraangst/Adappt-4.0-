# Energy Monitoring App

A full-stack energy monitoring application with real-time consumption tracking, analytics, and ML-powered predictions.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- User authentication with JWT
- RESTful API for energy consumption data
- MongoDB database with Mongoose ODM
- CSV upload for bulk data import
- Real-time insights and analytics

### Frontend (React)
- Modern, responsive dashboard
- Interactive charts with Recharts
- Consumption tracking by appliance and time period
- Anomaly detection alerts
- Energy-saving tips
- CSV file upload

### ML Service (Python Flask)
- Consumption prediction using moving average and linear regression
- Pattern analysis and trend detection
- Anomaly alerts
- Statistical insights

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Python 3.8+
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Adappt
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/energyDB
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Setup ML Service
```bash
cd ../ml
pip install -r requirements.txt
```

## 🚀 Running the Application

### Start MongoDB
```bash
mongod
```

### Start Backend (Terminal 1)
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

### Start ML Service (Terminal 3)
```bash
cd ml
python app.py
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Service: http://localhost:5001

## 📚 API Endpoints

### User Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Usage Data
- `GET /api/usage` - Get all usage data
- `POST /api/usage` - Add new usage data
- `POST /api/usage/upload` - Upload CSV file
- `POST /api/usage/appliance` - Create new appliance
- `GET /api/usage/appliances` - Get all appliances

### Insights
- `GET /api/insights` - Get consumption insights
- `GET /api/insights/weekly` - Get weekly data
- `GET /api/insights/monthly` - Get monthly data

### ML Predictions
- `POST /predict` - Predict next day consumption
- `POST /analyze` - Analyze consumption patterns

## 📊 CSV Upload Format

CSV files should have the following columns:
```
applianceName,timestamp,consumption,powerRating
Refrigerator,2024-01-01T00:00:00Z,2.5,150
Air Conditioner,2024-01-01T01:00:00Z,3.8,2000
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation on all endpoints
- CORS enabled for cross-origin requests

## 🎨 Technologies Used

### Backend
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- CSV-parser

### Frontend
- React 18
- React Router v6
- Recharts for data visualization
- Axios for API calls

### ML Service
- Flask
- NumPy & Pandas
- Scikit-learn
- Flask-CORS

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
