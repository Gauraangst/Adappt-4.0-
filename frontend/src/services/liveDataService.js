// Live Data Service for Real-time Dashboard Updates
class LiveDataService {
  constructor() {
    this.subscribers = [];
    this.isRunning = false;
    this.intervalId = null;
    this.currentData = this.generateInitialData();
    this.updateCounter = 0;
  }

  generateInitialData() {
    const now = new Date();
    return {
      // Real-time stats
      totalConsumption: 156.8,
      averageDailyConsumption: 22.4,
      activeAppliances: 6,
      efficiencyScore: 85,
      currentPower: 3.2,
      todayCost: 18.75,
      
      // Appliance data with realistic consumption
      appliances: {
        'Air Conditioner': { consumption: 2.1, isOn: true, efficiency: 78, temperature: 22 },
        'Refrigerator': { consumption: 0.8, isOn: true, efficiency: 92, temperature: 4 },
        'TV': { consumption: 0.2, isOn: true, efficiency: 88, brightness: 75 },
        'LED Lights': { consumption: 0.1, isOn: true, efficiency: 95, dimLevel: 80 },
        'Microwave': { consumption: 0.0, isOn: false, efficiency: 85, lastUsed: '2 hours ago' },
        'Dishwasher': { consumption: 0.0, isOn: false, efficiency: 82, cycle: 'Eco' },
        'Computer': { consumption: 0.3, isOn: true, efficiency: 90, cpuUsage: 45 },
        'Washing Machine': { consumption: 0.0, isOn: false, efficiency: 88, cycle: 'Quick' }
      },

      // Daily consumption for last 7 days
      dailyConsumption: this.generateDailyData(7),
      
      // Hourly data for last 24 hours
      hourlyData: this.generateHourlyData(24),
      
      // Alerts
      alerts: [
        { type: 'Info', message: 'Peak hours starting in 30 minutes', severity: 'info' },
        { type: 'Tip', message: 'Consider running dishwasher during off-peak hours', severity: 'success' }
      ],

      // Cost predictions
      costPredictions: {
        daily: 18.75,
        weekly: 131.25,
        monthly: 562.50,
        yearly: 6750.00,
        potentialSavings: {
          daily: 2.81,
          weekly: 19.69,
          monthly: 84.38,
          yearly: 1012.50
        }
      },

      // Trends
      trends: {
        consumption: Math.random() > 0.5 ? 'up' : 'down',
        cost: Math.random() > 0.5 ? 'up' : 'down',
        efficiency: Math.random() > 0.5 ? 'up' : 'down'
      },

      lastUpdated: now.toLocaleTimeString()
    };
  }

  generateDailyData(days) {
    const data = {};
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate realistic daily consumption (15-35 kWh)
      const baseConsumption = 20 + Math.random() * 15;
      const variation = (Math.random() - 0.5) * 5;
      
      data[dateStr] = Math.max(10, baseConsumption + variation);
    }
    
    return data;
  }

  generateHourlyData(hours) {
    const data = [];
    const now = new Date();
    
    for (let i = hours - 1; i >= 0; i--) {
      const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const hourValue = hour.getHours();
      
      let baseConsumption = 2.0;
      
      // Morning peak (6-9 AM)
      if (hourValue >= 6 && hourValue <= 9) {
        baseConsumption += Math.random() * 2 + 1.5;
      }
      // Evening peak (6-10 PM)
      else if (hourValue >= 18 && hourValue <= 22) {
        baseConsumption += Math.random() * 3 + 2;
      }
      // Night time (11 PM - 5 AM)
      else if (hourValue >= 23 || hourValue <= 5) {
        baseConsumption = Math.random() * 1 + 0.8;
      }
      // Day time
      else {
        baseConsumption += Math.random() * 1.5 + 0.5;
      }
      
      data.push({
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        consumption: parseFloat(baseConsumption.toFixed(2)),
        cost: parseFloat((baseConsumption * 0.12).toFixed(2))
      });
    }
    
    // Generate alerts including new features
    const generateAlerts = () => {
      const alerts = [];
      const currentHour = new Date().getHours();
      
      // High consumption alert
      if (data.totalConsumption > 25) {
        alerts.push({
          id: 'high-consumption',
          type: 'warning',
          title: 'High Energy Usage',
          message: `Current consumption (${data.totalConsumption.toFixed(1)} kWh) is above average`,
          timestamp: new Date().toISOString(),
          severity: 'medium',
          cost_inr: `₹${(data.totalConsumption * 6).toFixed(0)}`
        });
      }
      
      // Long usage alert (unnecessary consumption)
      if (currentHour >= 23 || currentHour <= 5) {
        if (data.totalConsumption > 8) {
          alerts.push({
            id: 'overnight-usage',
            type: 'warning',
            title: 'High Overnight Consumption',
            message: 'Devices may be running unnecessarily during night hours',
            timestamp: new Date().toISOString(),
            severity: 'high',
            potential_waste: `₹${(data.totalConsumption * 6 * 0.3).toFixed(0)}`
          });
        }
      }
      
      // Peak hours alert
      if (currentHour >= 18 && currentHour <= 22 && data.totalConsumption > 20) {
        alerts.push({
          id: 'peak-hours',
          type: 'info',
          title: 'Peak Hours Usage',
          message: 'Consider reducing usage during peak hours (6-10 PM)',
          timestamp: new Date().toISOString(),
          severity: 'low',
          cost_inr: `₹${(data.totalConsumption * 8).toFixed(0)}`  // Higher peak rate
        });
      }
      
      // Efficiency alert
      if (data.efficiency < 75) {
        alerts.push({
          id: 'low-efficiency',
          type: 'warning',
          title: 'Low System Efficiency',
          message: 'Some appliances may need maintenance',
          timestamp: new Date().toISOString(),
          severity: 'high'
        });
      }
      
      // Maintenance reminder
      if (Math.random() < 0.3) { // 30% chance to show maintenance reminder
        alerts.push({
          id: 'maintenance-reminder',
          type: 'info',
          title: 'Maintenance Due',
          message: 'AC filter cleaning recommended for better efficiency',
          timestamp: new Date().toISOString(),
          severity: 'low',
          estimated_savings: '₹500-800/month'
        });
      }
      
      return alerts;
    };

    return { data, alerts: generateAlerts() };
  }

  updateLiveData() {
    this.updateCounter++;
    const now = new Date();
    const hour = now.getHours();
    
    // Update total consumption (gradual increase)
    this.currentData.totalConsumption += (Math.random() - 0.4) * 0.5;
    this.currentData.totalConsumption = Math.max(100, this.currentData.totalConsumption);
    
    // Update average daily consumption
    const variation = (Math.random() - 0.5) * 0.2;
    this.currentData.averageDailyConsumption += variation;
    this.currentData.averageDailyConsumption = Math.max(15, Math.min(30, this.currentData.averageDailyConsumption));
    
    // Update efficiency score (fluctuates between 75-95)
    this.currentData.efficiencyScore += (Math.random() - 0.5) * 3;
    this.currentData.efficiencyScore = Math.max(75, Math.min(95, this.currentData.efficiencyScore));
    
    // Update current power consumption based on time of day
    let basePower = 2.0;
    if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)) {
      basePower = 3.5 + Math.random() * 2;
    } else if (hour >= 23 || hour <= 5) {
      basePower = 1.0 + Math.random() * 0.8;
    } else {
      basePower = 2.0 + Math.random() * 1.5;
    }
    
    this.currentData.currentPower = parseFloat(basePower.toFixed(2));
    
    // Update today's cost
    this.currentData.todayCost += (this.currentData.currentPower * 0.12) / 60; // Per minute cost
    
    // Update appliances with realistic behavior
    Object.keys(this.currentData.appliances).forEach(applianceName => {
      const appliance = this.currentData.appliances[applianceName];
      
      // Randomly toggle some appliances
      if (Math.random() < 0.05) { // 5% chance per minute
        if (['Microwave', 'Dishwasher', 'Washing Machine'].includes(applianceName)) {
          appliance.isOn = !appliance.isOn;
          appliance.consumption = appliance.isOn ? Math.random() * 2 + 0.5 : 0;
        }
      }
      
      // Update consumption for active appliances
      if (appliance.isOn && appliance.consumption > 0) {
        const variation = (Math.random() - 0.5) * 0.2;
        appliance.consumption = Math.max(0.1, appliance.consumption + variation);
        
        // Update efficiency (slight fluctuations)
        appliance.efficiency += (Math.random() - 0.5) * 2;
        appliance.efficiency = Math.max(70, Math.min(98, appliance.efficiency));
      }
      
      // Special updates for specific appliances
      if (applianceName === 'Air Conditioner' && appliance.isOn) {
        appliance.temperature += (Math.random() - 0.5) * 0.5;
        appliance.temperature = Math.max(18, Math.min(26, appliance.temperature));
      }
      
      if (applianceName === 'Computer' && appliance.isOn) {
        appliance.cpuUsage += (Math.random() - 0.5) * 10;
        appliance.cpuUsage = Math.max(20, Math.min(90, appliance.cpuUsage));
      }
    });
    
    // Count active appliances
    this.currentData.activeAppliances = Object.values(this.currentData.appliances)
      .filter(app => app.isOn).length;
    
    // Update hourly data (add new point every hour, simulate real-time)
    if (this.updateCounter % 60 === 0) { // Every 60 minutes (simulated as 60 updates)
      const newHourData = {
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        consumption: this.currentData.currentPower,
        cost: parseFloat((this.currentData.currentPower * 0.12).toFixed(2))
      };
      
      this.currentData.hourlyData.push(newHourData);
      if (this.currentData.hourlyData.length > 24) {
        this.currentData.hourlyData.shift(); // Keep only last 24 hours
      }
    }
    
    // Update cost predictions using realistic Indian electricity rates
    const costPerKwhInr = 6.5; // Average Indian residential rate: ₹6.5 per kWh
    const peakRateInr = 8.5; // Peak hours rate: ₹8.5 per kWh
    const currentHour = new Date().getHours();
    const isPeakHour = currentHour >= 18 && currentHour <= 22;
    const currentRate = isPeakHour ? peakRateInr : costPerKwhInr;
    
    this.currentData.costPredictions = {
      daily: parseFloat((this.currentData.averageDailyConsumption * costPerKwhInr).toFixed(2)),
      weekly: parseFloat((this.currentData.averageDailyConsumption * costPerKwhInr * 7).toFixed(2)),
      monthly: parseFloat((this.currentData.averageDailyConsumption * costPerKwhInr * 30).toFixed(2)),
      yearly: parseFloat((this.currentData.averageDailyConsumption * costPerKwhInr * 365).toFixed(2)),
      current_rate: currentRate,
      peak_rate: peakRateInr,
      normal_rate: costPerKwhInr,
      potentialSavings: {}
    };

    // Update potential savings (15% of current costs)
    this.currentData.costPredictions.potentialSavings = {
      daily: parseFloat((this.currentData.costPredictions.daily * 0.15).toFixed(2)),
      weekly: parseFloat((this.currentData.costPredictions.weekly * 0.15).toFixed(2)),
      monthly: parseFloat((this.currentData.costPredictions.monthly * 0.15).toFixed(2)),
      yearly: parseFloat((this.currentData.costPredictions.yearly * 0.15).toFixed(2))
    };
    
    // Update trends
    this.currentData.trends = {
      consumption: Math.random() > 0.6 ? 'up' : 'down',
      cost: Math.random() > 0.6 ? 'up' : 'down',
      efficiency: Math.random() > 0.4 ? 'up' : 'down'
    };
    
    // Generate new alerts occasionally
    if (Math.random() < 0.1) { // 10% chance per update
      const alertMessages = [
        'Peak hours detected - consider reducing usage',
        'Excellent energy efficiency this hour!',
        'AC running efficiently at optimal temperature',
        'Consider scheduling dishwasher for off-peak hours',
        'Energy usage 15% below average - great job!',
        'High consumption detected in kitchen appliances'
      ];
      
      const newAlert = {
        type: Math.random() > 0.7 ? 'Warning' : 'Info',
        message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
        severity: Math.random() > 0.7 ? 'warning' : 'info'
      };
      
      this.currentData.alerts.unshift(newAlert);
      if (this.currentData.alerts.length > 3) {
        this.currentData.alerts.pop();
      }
    }
    
    this.currentData.lastUpdated = now.toLocaleTimeString();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    // Send initial data immediately
    callback({ ...this.currentData });
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔴 Live data service started - updating every minute');
    
    this.intervalId = setInterval(() => {
      this.updateLiveData();
      this.notifySubscribers();
    }, 60000); // Update every 60 seconds (1 minute)
    
    // Also update immediately for demo purposes
    this.updateLiveData();
    this.notifySubscribers();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Live data service stopped');
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback({ ...this.currentData });
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // Method to force an update (for testing)
  forceUpdate() {
    this.updateLiveData();
    this.notifySubscribers();
  }
}

// Export singleton instance
export const liveDataService = new LiveDataService();
