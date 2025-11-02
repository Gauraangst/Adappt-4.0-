// Mock usage routes for demo mode (no MongoDB)
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { mockData, getUsageWithAppliance } = require('../mockData');

const router = express.Router();

// GET /api/usage - Get all usage data for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Return mock usage data with appliance info
    const usageData = mockData.usage
      .map(getUsageWithAppliance)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      count: usageData.length,
      data: usageData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// POST /api/usage - Add new usage data
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { applianceId, timestamp, consumption } = req.body;

    const newUsage = {
      _id: `u-${mockData.usage.length + 1}`,
      applianceId,
      timestamp: timestamp || new Date(),
      consumption
    };

    mockData.usage.push(newUsage);

    res.status(201).json({
      success: true,
      message: 'Usage data added successfully (DEMO)',
      data: getUsageWithAppliance(newUsage)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// POST /api/usage/appliance - Create a new appliance
router.post('/appliance', authMiddleware, async (req, res) => {
  try {
    const { name, powerRating } = req.body;

    const newAppliance = {
      _id: `app-${mockData.appliances.length + 1}`,
      name,
      userId: 'demo-user-123',
      powerRating,
      createdAt: new Date()
    };

    mockData.appliances.push(newAppliance);

    res.status(201).json({
      success: true,
      message: 'Appliance created successfully (DEMO)',
      data: newAppliance
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET /api/usage/appliances - Get all appliances for user
router.get('/appliances', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      count: mockData.appliances.length,
      data: mockData.appliances
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// POST /api/usage/upload - Mock CSV upload
router.post('/upload', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    message: 'CSV upload not available in demo mode',
    imported: 0,
    errors: 0
  });
});

module.exports = router;
