// Mock authentication for testing without MongoDB
// This replaces the real auth for demo purposes

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Dummy user data
const DUMMY_USER = {
  id: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@energy.com',
  password: 'demo123'
};

// POST /api/users/register - Mock registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Generate JWT token
    const token = jwt.sign(
      { userId: DUMMY_USER.id, email: DUMMY_USER.email },
      process.env.JWT_SECRET || 'demo_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully (DEMO MODE)',
      token,
      user: {
        id: DUMMY_USER.id,
        name: name || DUMMY_USER.name,
        email: email || DUMMY_USER.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// POST /api/users/login - Mock login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Accept any credentials in demo mode
    // Or use specific demo credentials
    if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: DUMMY_USER.id, email: DUMMY_USER.email },
        process.env.JWT_SECRET || 'demo_secret_key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful (DEMO MODE)',
        token,
        user: {
          id: DUMMY_USER.id,
          name: DUMMY_USER.name,
          email: DUMMY_USER.email
        }
      });
    } else {
      // For demo, accept any login
      const token = jwt.sign(
        { userId: DUMMY_USER.id, email: email || DUMMY_USER.email },
        process.env.JWT_SECRET || 'demo_secret_key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful (DEMO MODE)',
        token,
        user: {
          id: DUMMY_USER.id,
          name: 'Demo User',
          email: email || DUMMY_USER.email
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
