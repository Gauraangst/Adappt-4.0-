// Mock insights routes for demo mode (no MongoDB)
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { mockData, getApplianceById } = require('../mockData');

const router = express.Router();

// GET /api/insights - Calculate total consumption per appliance and per day
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usageData = mockData.usage;

    // Calculate total consumption per appliance
    const consumptionPerAppliance = {};
    const consumptionPerDay = {};

    usageData.forEach(usage => {
      const appliance = getApplianceById(usage.applianceId);
      const applianceName = appliance.name;
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

    // Detect anomalies
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
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const usageData = mockData.usage.filter(u => new Date(u.timestamp) >= weekAgo);
    const weeklyConsumption = usageData.reduce((sum, u) => sum + u.consumption, 0);

    res.json({
      success: true,
      period: 'weekly',
      consumption: weeklyConsumption,
      data: usageData.map(u => ({
        ...u,
        applianceId: getApplianceById(u.applianceId)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET /api/insights/monthly - Get monthly consumption data
router.get('/monthly', authMiddleware, async (req, res) => {
  try {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const usageData = mockData.usage.filter(u => new Date(u.timestamp) >= monthAgo);
    const monthlyConsumption = usageData.reduce((sum, u) => sum + u.consumption, 0);

    res.json({
      success: true,
      period: 'monthly',
      consumption: monthlyConsumption,
      data: usageData.map(u => ({
        ...u,
        applianceId: getApplianceById(u.applianceId)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET /api/insights/efficiency - Calculate appliance efficiency metrics
router.get('/efficiency', authMiddleware, async (req, res) => {
  try {
    const appliances = mockData.appliances;
    const usageData = mockData.usage;
    
    // Get usage data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsage = usageData.filter(u => new Date(u.timestamp) >= thirtyDaysAgo);
    
    // Generate efficiency data similar to the real route
    const appliancesWithEfficiency = appliances.map(app => {
      const appUsage = recentUsage.filter(u => u.applianceId === app._id);
      const avgConsumption = appUsage.length > 0 
        ? appUsage.reduce((sum, u) => sum + u.consumption, 0) / appUsage.length 
        : app.powerRating * 0.8;
      
      // Calculate efficiency score
      const efficiency = app.powerRating > 0
        ? Math.min(100, (avgConsumption / app.powerRating) * 100)
        : 0;
      
      // Simulate days with low efficiency for some appliances
      const daysLowEfficiency = efficiency < 70 ? Math.floor(Math.random() * 25) : 0;
      
      return {
        name: app.name,
        powerRating: app.powerRating,
        avgConsumption: parseFloat(avgConsumption.toFixed(1)),
        efficiency: parseFloat(efficiency.toFixed(1)),
        daysLowEfficiency
      };
    });
    
    // Generate historical data
    const historicalData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayData = { date: date.toISOString().split('T')[0] };
      
      appliancesWithEfficiency.slice(0, 4).forEach(app => {
        dayData[app.name] = app.efficiency + (Math.random() * 6 - 3); // Add some variation
      });
      
      historicalData.push(dayData);
    }
    
    const overallEfficiency = appliancesWithEfficiency.length > 0
      ? appliancesWithEfficiency.reduce((sum, app) => sum + app.efficiency, 0) / appliancesWithEfficiency.length
      : 0;
    
    res.json({
      success: true,
      appliances: appliancesWithEfficiency,
      historicalData,
      overallEfficiency: parseFloat(overallEfficiency.toFixed(1))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET /api/insights/savings - Calculate savings estimation
router.get('/savings', authMiddleware, async (req, res) => {
  try {
    const { range = 'monthly' } = req.query;
    const ratePerKWh = 6.5;
    const baselineSavingsRate = 0.18;
    
    const usageData = mockData.usage;
    let startDate = new Date();
    let comparisonData = [];
    
    if (range === 'weekly') {
      startDate.setDate(startDate.getDate() - 56);
    } else if (range === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 8);
    } else if (range === 'yearly') {
      startDate.setFullYear(startDate.getFullYear() - 3);
    }
    
    const filteredUsage = usageData.filter(u => new Date(u.timestamp) >= startDate);
    
    // Group consumption by period
    const consumptionByPeriod = {};
    
    filteredUsage.forEach(usage => {
      let period;
      const date = new Date(usage.timestamp);
      
      if (range === 'weekly') {
        const weekNum = Math.floor((date - startDate) / (7 * 24 * 60 * 60 * 1000));
        period = `Week ${weekNum + 1}`;
      } else if (range === 'monthly') {
        period = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        period = date.getFullYear().toString();
      }
      
      if (!consumptionByPeriod[period]) {
        consumptionByPeriod[period] = { consumption: 0 };
      }
      
      consumptionByPeriod[period].consumption += usage.consumption;
    });
    
    // If no data, generate sample data for demo
    if (Object.keys(consumptionByPeriod).length === 0) {
      const periods = range === 'weekly' ? 8 : range === 'monthly' ? 8 : 3;
      const baseConsumptionPerPeriod = range === 'weekly' ? 175 : range === 'monthly' ? 750 : 9000;
      
      for (let i = 0; i < periods; i++) {
        let period;
        if (range === 'weekly') {
          period = `Week ${i + 1}`;
        } else if (range === 'monthly') {
          const date = new Date();
          date.setMonth(date.getMonth() - (periods - 1 - i));
          period = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
          const year = new Date().getFullYear() - (periods - 1 - i);
          period = year.toString();
        }
        
        const baseConsumption = baseConsumptionPerPeriod + (Math.random() * 50 - 25);
        const baseCost = baseConsumption * ratePerKWh;
        const optimizedConsumption = baseConsumption * (1 - baselineSavingsRate);
        const optimizedCost = optimizedConsumption * ratePerKWh;
        const savings = baseCost - optimizedCost;
        
        comparisonData.push({
          period,
          baseCost: parseFloat(baseCost.toFixed(2)),
          optimizedCost: parseFloat(optimizedCost.toFixed(2)),
          savings: parseFloat(savings.toFixed(2)),
          baseConsumption: parseFloat(baseConsumption.toFixed(1)),
          optimizedConsumption: parseFloat(optimizedConsumption.toFixed(1)),
          savingsRate: parseFloat((baselineSavingsRate * 100).toFixed(1))
        });
      }
    } else {
      // Calculate savings for each period
      Object.keys(consumptionByPeriod).sort().forEach(period => {
        const baseConsumption = consumptionByPeriod[period].consumption;
        const baseCost = baseConsumption * ratePerKWh;
        const optimizedConsumption = baseConsumption * (1 - baselineSavingsRate);
        const optimizedCost = optimizedConsumption * ratePerKWh;
        const savings = baseCost - optimizedCost;
        
        comparisonData.push({
          period,
          baseCost: parseFloat(baseCost.toFixed(2)),
          optimizedCost: parseFloat(optimizedCost.toFixed(2)),
          savings: parseFloat(savings.toFixed(2)),
          baseConsumption: parseFloat(baseConsumption.toFixed(1)),
          optimizedConsumption: parseFloat(optimizedConsumption.toFixed(1)),
          savingsRate: parseFloat((baselineSavingsRate * 100).toFixed(1))
        });
      });
    }
    
    // Calculate totals
    const totalBaseCost = comparisonData.reduce((sum, d) => sum + d.baseCost, 0);
    const totalOptimizedCost = comparisonData.reduce((sum, d) => sum + d.optimizedCost, 0);
    const totalSavings = totalBaseCost - totalOptimizedCost;
    const avgSavingsRate = comparisonData.length > 0 && totalBaseCost > 0
      ? (totalSavings / totalBaseCost) * 100 
      : baselineSavingsRate * 100;
    
    // Calculate house analytics
    const totalConsumption = comparisonData.reduce((sum, d) => sum + d.baseConsumption, 0);
    const totalOptimizedConsumption = comparisonData.reduce((sum, d) => sum + d.optimizedConsumption, 0);
    
    // Ensure we have valid totals for calculations
    const safeTotalSavings = totalSavings > 0 ? totalSavings : 10000;
    const safeTotalBaseCost = totalBaseCost > 0 ? totalBaseCost : 50000;
    
    const savingsByCategory = [
      { name: 'Peak Hour Optimization', value: parseFloat((safeTotalSavings * 0.35).toFixed(2)), percentage: 35 },
      { name: 'Device Scheduling', value: parseFloat((safeTotalSavings * 0.25).toFixed(2)), percentage: 25 },
      { name: 'Standby Reduction', value: parseFloat((safeTotalSavings * 0.20).toFixed(2)), percentage: 20 },
      { name: 'Maintenance Alerts', value: parseFloat((safeTotalSavings * 0.15).toFixed(2)), percentage: 15 },
      { name: 'Behavior Insights', value: parseFloat((safeTotalSavings * 0.05).toFixed(2)), percentage: 5 }
    ];
    
    // Appliance-wise breakdown - ensure we always have data
    const allAppliances = mockData.appliances || [];
    const appliancePercentages = [0.35, 0.20, 0.18, 0.15, 0.12]; // AC, Refrigerator, Water Heater, Washing Machine, Others
    const applianceSavingsBreakdown = allAppliances.length > 0 
      ? allAppliances.slice(0, 5).map((app, index) => {
          const percentage = appliancePercentages[index] || 0.1;
          const baseCost = safeTotalBaseCost * percentage;
          const optimizedCost = baseCost * (1 - baselineSavingsRate);
          const savings = baseCost - optimizedCost;
          
          return {
            name: app.name,
            baseCost: parseFloat(baseCost.toFixed(2)),
            optimizedCost: parseFloat(optimizedCost.toFixed(2)),
            savings: parseFloat(savings.toFixed(2)),
            percentage: parseFloat((percentage * 100).toFixed(1))
          };
        })
      : [
          { name: 'AC', baseCost: parseFloat((safeTotalBaseCost * 0.35).toFixed(2)), optimizedCost: parseFloat((safeTotalBaseCost * 0.35 * (1 - baselineSavingsRate)).toFixed(2)), savings: parseFloat((safeTotalBaseCost * 0.35 * baselineSavingsRate).toFixed(2)), percentage: 35.0 },
          { name: 'Refrigerator', baseCost: parseFloat((safeTotalBaseCost * 0.20).toFixed(2)), optimizedCost: parseFloat((safeTotalBaseCost * 0.20 * (1 - baselineSavingsRate)).toFixed(2)), savings: parseFloat((safeTotalBaseCost * 0.20 * baselineSavingsRate).toFixed(2)), percentage: 20.0 },
          { name: 'Water Heater', baseCost: parseFloat((safeTotalBaseCost * 0.18).toFixed(2)), optimizedCost: parseFloat((safeTotalBaseCost * 0.18 * (1 - baselineSavingsRate)).toFixed(2)), savings: parseFloat((safeTotalBaseCost * 0.18 * baselineSavingsRate).toFixed(2)), percentage: 18.0 },
          { name: 'Washing Machine', baseCost: parseFloat((safeTotalBaseCost * 0.15).toFixed(2)), optimizedCost: parseFloat((safeTotalBaseCost * 0.15 * (1 - baselineSavingsRate)).toFixed(2)), savings: parseFloat((safeTotalBaseCost * 0.15 * baselineSavingsRate).toFixed(2)), percentage: 15.0 },
          { name: 'Others', baseCost: parseFloat((safeTotalBaseCost * 0.12).toFixed(2)), optimizedCost: parseFloat((safeTotalBaseCost * 0.12 * (1 - baselineSavingsRate)).toFixed(2)), savings: parseFloat((safeTotalBaseCost * 0.12 * baselineSavingsRate).toFixed(2)), percentage: 12.0 }
        ];
    
    res.json({
      success: true,
      comparisonData,
      totals: {
        baseCost: parseFloat(totalBaseCost.toFixed(2)),
        optimizedCost: parseFloat(totalOptimizedCost.toFixed(2)),
        savings: parseFloat(totalSavings.toFixed(2)),
        savingsRate: parseFloat(avgSavingsRate.toFixed(1))
      },
      houseAnalytics: {
        totalConsumption: parseFloat(totalConsumption.toFixed(1)),
        optimizedConsumption: parseFloat(totalOptimizedConsumption.toFixed(1)),
        savingsByCategory,
        appliances: applianceSavingsBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
