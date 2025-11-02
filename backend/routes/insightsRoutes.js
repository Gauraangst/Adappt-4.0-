// Insights routes for calculating consumption analytics
const express = require('express');
const authMiddleware = require('../middleware/auth');
const Usage = require('../models/Usage');
const Appliance = require('../models/Appliance');

const router = express.Router();

// GET /api/insights - Calculate total consumption per appliance and per day
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all appliances belonging to the user
    const appliances = await Appliance.find({ userId: req.user.userId });
    const applianceIds = appliances.map(a => a._id);

    // Get all usage data
    const usageData = await Usage.find({ 
      applianceId: { $in: applianceIds } 
    }).populate('applianceId', 'name powerRating');

    // Calculate total consumption per appliance
    const consumptionPerAppliance = {};
    const consumptionPerDay = {};

    usageData.forEach(usage => {
      const applianceName = usage.applianceId.name;
      const day = new Date(usage.timestamp).toISOString().split('T')[0];

      // Per appliance
      if (!consumptionPerAppliance[applianceName]) {
        consumptionPerAppliance[applianceName] = 0;
      }
      consumptionPerAppliance[applianceName] += usage.consumption;

      // Per day
      if (!consumptionPerDay[day]) {
        consumptionPerDay[day] = 0;
      }
      consumptionPerDay[day] += usage.consumption;
    });

    // Calculate statistics
    const totalConsumption = usageData.reduce((sum, u) => sum + u.consumption, 0);
    const averageDailyConsumption = Object.values(consumptionPerDay).reduce((a, b) => a + b, 0) / 
                                     Object.keys(consumptionPerDay).length || 0;

    // Detect anomalies (consumption > 150% of average)
    const alerts = [];
    const threshold = averageDailyConsumption * 1.5;
    
    Object.entries(consumptionPerDay).forEach(([day, consumption]) => {
      if (consumption > threshold && averageDailyConsumption > 0) {
        alerts.push({
          type: 'high_consumption',
          date: day,
          consumption,
          message: `Consumption on ${day} was ${((consumption / averageDailyConsumption - 1) * 100).toFixed(1)}% above average`
        });
      }
    });

    // Generate actionable tips
    const tips = [
      'Turn off standby devices to save up to 10% on energy bills',
      'Use energy-efficient LED bulbs',
      'Unplug chargers when not in use',
      'Run dishwashers and washing machines with full loads',
      'Consider using a programmable thermostat'
    ];

    res.json({
      success: true,
      totalConsumption,
      averageDailyConsumption,
      consumptionPerAppliance,
      consumptionPerDay,
      alerts,
      tips
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET /api/insights/weekly - Get weekly consumption data
router.get('/weekly', authMiddleware, async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user.userId });
    const applianceIds = appliances.map(a => a._id);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const usageData = await Usage.find({
      applianceId: { $in: applianceIds },
      timestamp: { $gte: weekAgo }
    }).populate('applianceId', 'name');

    const weeklyConsumption = usageData.reduce((sum, u) => sum + u.consumption, 0);

    res.json({
      success: true,
      period: 'weekly',
      consumption: weeklyConsumption,
      data: usageData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET /api/insights/monthly - Get monthly consumption data
router.get('/monthly', authMiddleware, async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user.userId });
    const applianceIds = appliances.map(a => a._id);

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const usageData = await Usage.find({
      applianceId: { $in: applianceIds },
      timestamp: { $gte: monthAgo }
    }).populate('applianceId', 'name');

    const monthlyConsumption = usageData.reduce((sum, u) => sum + u.consumption, 0);

    res.json({
      success: true,
      period: 'monthly',
      consumption: monthlyConsumption,
      data: usageData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
