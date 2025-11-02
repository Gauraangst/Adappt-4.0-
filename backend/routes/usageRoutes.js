// Usage routes for managing energy consumption data
const express = require('express');
const authMiddleware = require('../middleware/auth');
const Usage = require('../models/Usage');
const Appliance = require('../models/Appliance');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const router = express.Router();

// Configure multer for CSV upload
const upload = multer({ dest: 'uploads/' });

// GET /api/usage - Get all usage data for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all appliances belonging to the user
    const appliances = await Appliance.find({ userId: req.user.userId });
    const applianceIds = appliances.map(a => a._id);

    // Get usage data for these appliances
    const usageData = await Usage.find({ 
      applianceId: { $in: applianceIds } 
    })
    .populate('applianceId', 'name powerRating')
    .sort({ timestamp: -1 });

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

    // Validate required fields
    if (!applianceId || !consumption) {
      return res.status(400).json({ error: 'Please provide applianceId and consumption' });
    }

    // Verify appliance belongs to user
    const appliance = await Appliance.findOne({ 
      _id: applianceId, 
      userId: req.user.userId 
    });

    if (!appliance) {
      return res.status(404).json({ error: 'Appliance not found or unauthorized' });
    }

    // Create usage record
    const usage = new Usage({
      applianceId,
      timestamp: timestamp || new Date(),
      consumption
    });

    await usage.save();

    res.status(201).json({
      success: true,
      message: 'Usage data added successfully',
      data: usage
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// POST /api/usage/upload - Upload CSV with usage data
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a CSV file' });
    }

    const results = [];
    const errors = [];

    // Parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Process each row
        for (const row of results) {
          try {
            // Assuming CSV has columns: applianceName, timestamp, consumption
            let appliance = await Appliance.findOne({ 
              name: row.applianceName, 
              userId: req.user.userId 
            });

            // Create appliance if it doesn't exist
            if (!appliance) {
              appliance = new Appliance({
                name: row.applianceName,
                userId: req.user.userId,
                powerRating: row.powerRating || 100
              });
              await appliance.save();
            }

            // Create usage record
            const usage = new Usage({
              applianceId: appliance._id,
              timestamp: new Date(row.timestamp),
              consumption: parseFloat(row.consumption)
            });

            await usage.save();
          } catch (error) {
            errors.push({ row, error: error.message });
          }
        }

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
          success: true,
          message: 'CSV processed',
          imported: results.length - errors.length,
          errors: errors.length,
          errorDetails: errors
        });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// POST /api/usage/appliance - Create a new appliance
router.post('/appliance', authMiddleware, async (req, res) => {
  try {
    const { name, powerRating } = req.body;

    if (!name || !powerRating) {
      return res.status(400).json({ error: 'Please provide name and powerRating' });
    }

    const appliance = new Appliance({
      name,
      userId: req.user.userId,
      powerRating
    });

    await appliance.save();

    res.status(201).json({
      success: true,
      message: 'Appliance created successfully',
      data: appliance
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET /api/usage/appliances - Get all appliances for user
router.get('/appliances', authMiddleware, async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user.userId });
    res.json({
      success: true,
      count: appliances.length,
      data: appliances
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
