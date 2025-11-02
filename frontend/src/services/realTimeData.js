// Real-time data simulation service for WattWise
export class RealTimeDataService {
  constructor() {
    this.subscribers = [];
    this.isRunning = false;
    this.currentData = this.generateInitialData();
  }

  generateInitialData() {
    return {
      currentConsumption: 3.2,
      totalToday: 45.6,
      costToday: 5.47,
      peakHour: '19:00',
      efficiency: 85,
      alerts: [],
      appliances: {
        'Air Conditioner': { consumption: 2.1, status: 'active', efficiency: 78 },
        'Refrigerator': { consumption: 0.8, status: 'active', efficiency: 92 },
        'TV': { consumption: 0.2, status: 'active', efficiency: 88 },
        'LED Lights': { consumption: 0.1, status: 'active', efficiency: 95 }
      }
    };
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    // Send initial data
    callback(this.currentData);
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.updateData();
      this.notifySubscribers();
    }, 5000); // Update every 5 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  updateData() {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate realistic consumption patterns
    let baseConsumption = 2.0;
    
    // Peak hours simulation
    if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)) {
      baseConsumption += Math.random() * 2 + 1;
    } else if (hour >= 23 || hour <= 5) {
      baseConsumption = Math.random() * 1 + 0.5;
    } else {
      baseConsumption += Math.random() * 1.5;
    }

    // Add some randomness
    const variation = (Math.random() - 0.5) * 0.4;
    this.currentData.currentConsumption = Math.max(0.1, baseConsumption + variation);
    
    // Update daily totals
    this.currentData.totalToday += this.currentData.currentConsumption / 12; // Assuming 5-second intervals
    this.currentData.costToday = this.currentData.totalToday * 0.12;
    
    // Update appliance data
    Object.keys(this.currentData.appliances).forEach(appliance => {
      const current = this.currentData.appliances[appliance];
      const variation = (Math.random() - 0.5) * 0.2;
      current.consumption = Math.max(0.05, current.consumption + variation);
      
      // Simulate efficiency changes
      current.efficiency += (Math.random() - 0.5) * 2;
      current.efficiency = Math.max(60, Math.min(100, current.efficiency));
    });

    // Generate alerts based on consumption patterns
    this.generateAlerts();
  }

  generateAlerts() {
    const alerts = [];
    
    if (this.currentData.currentConsumption > 5.0) {
      alerts.push({
        type: 'High Consumption',
        message: 'Current consumption is unusually high. Check your appliances.',
        severity: 'warning',
        timestamp: new Date()
      });
    }

    if (this.currentData.appliances['Air Conditioner'].efficiency < 70) {
      alerts.push({
        type: 'Efficiency Alert',
        message: 'Air Conditioner efficiency is below optimal. Consider maintenance.',
        severity: 'info',
        timestamp: new Date()
      });
    }

    if (this.currentData.costToday > 8.0) {
      alerts.push({
        type: 'Cost Alert',
        message: 'Daily cost is approaching your budget limit.',
        severity: 'warning',
        timestamp: new Date()
      });
    }

    this.currentData.alerts = alerts;
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

  // Method to get historical data for charts
  generateHistoricalData(days = 7) {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const baseConsumption = 20 + Math.random() * 10;
      
      data.push({
        date: date.toISOString().split('T')[0],
        consumption: parseFloat(baseConsumption.toFixed(2)),
        cost: parseFloat((baseConsumption * 0.12).toFixed(2))
      });
    }
    
    return data;
  }

  // Method to get appliance breakdown
  getApplianceBreakdown() {
    return Object.entries(this.currentData.appliances).map(([name, data]) => ({
      name,
      consumption: parseFloat(data.consumption.toFixed(2)),
      efficiency: Math.round(data.efficiency),
      status: data.status,
      cost: parseFloat((data.consumption * 0.12).toFixed(2))
    }));
  }
}

// Singleton instance
export const realTimeDataService = new RealTimeDataService();
