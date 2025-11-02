// Main server file for Energy Monitoring API
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check if MongoDB should be used or demo mode
const USE_DEMO_MODE = !process.env.MONGODB_URI || process.env.DEMO_MODE === 'true';

if (!USE_DEMO_MODE) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Switching to DEMO MODE');
  });
} else {
  console.log('⚠️  Running in DEMO MODE (no MongoDB required)');
  console.log('📝 Demo credentials: email: demo@energy.com, password: demo123');
}

// Import routes based on mode
let userRoutes, usageRoutes, insightsRoutes;

if (USE_DEMO_MODE || !mongoose.connection.readyState) {
  userRoutes = require('./routes/userRoutes.mock');
  usageRoutes = require('./routes/usageRoutes.mock');
  insightsRoutes = require('./routes/insightsRoutes.mock');
} else {
  userRoutes = require('./routes/userRoutes');
  usageRoutes = require('./routes/usageRoutes');
  insightsRoutes = require('./routes/insightsRoutes');
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/insights', insightsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Energy Monitoring API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      users: '/api/users',
      usage: '/api/usage',
      insights: '/api/insights'
    },
    docs: 'Visit /health to check API status'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Energy Monitoring API is running',
    timestamp: new Date().toISOString(),
    mode: USE_DEMO_MODE ? 'DEMO' : 'PRODUCTION'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
