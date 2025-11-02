// Usage model for tracking appliance energy consumption
const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  applianceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appliance',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  consumption: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
usageSchema.index({ applianceId: 1, timestamp: -1 });

module.exports = mongoose.model('Usage', usageSchema);
