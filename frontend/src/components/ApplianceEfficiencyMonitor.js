// Appliance Efficiency Monitor - Tracks appliance efficiency and alerts for repair/replacement
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { getApplianceEfficiency } from '../services/api';

function ApplianceEfficiencyMonitor() {
  const [efficiencyData, setEfficiencyData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppliance, setSelectedAppliance] = useState(null);

  useEffect(() => {
    fetchEfficiencyData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchEfficiencyData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchEfficiencyData = async () => {
    try {
      setLoading(true);
      const data = await getApplianceEfficiency();
      setEfficiencyData(data);
      
      // Process alerts for low efficiency appliances
      const lowEfficiencyAlerts = [];
      if (data.appliances) {
        data.appliances.forEach(app => {
          if (app.efficiency < 70 && app.daysLowEfficiency >= 7) {
            const suggestion = app.efficiency < 50 ? 'replacement' : 'repair';
            lowEfficiencyAlerts.push({
              ...app,
              suggestion,
              estimatedSavings: calculateSavings(app, suggestion)
            });
          }
        });
      }
      setAlerts(lowEfficiencyAlerts);
    } catch (error) {
      console.error('Error fetching efficiency data:', error);
      // Fallback to mock data for demo
      setEfficiencyData(generateMockData());
      setAlerts(generateMockAlerts());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const appliances = [
      { name: 'AC Living Room', powerRating: 1500, avgConsumption: 1400, efficiency: 93.3, daysLowEfficiency: 0 },
      { name: 'Refrigerator', powerRating: 200, avgConsumption: 185, efficiency: 92.5, daysLowEfficiency: 0 },
      { name: 'Water Heater', powerRating: 3000, avgConsumption: 2800, efficiency: 93.3, daysLowEfficiency: 0 },
      { name: 'Old AC Bedroom', powerRating: 1200, avgConsumption: 1100, efficiency: 66.7, daysLowEfficiency: 12 },
      { name: 'Washing Machine', powerRating: 500, avgConsumption: 450, efficiency: 90, daysLowEfficiency: 0 },
      { name: 'Old Refrigerator', powerRating: 250, avgConsumption: 220, efficiency: 60, daysLowEfficiency: 21 }
    ];

    // Generate historical efficiency data for last 30 days
    const historicalData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayData = {
        date: date.toISOString().split('T')[0],
        'AC Living Room': 93 + Math.random() * 4,
        'Refrigerator': 92 + Math.random() * 3,
        'Water Heater': 93 + Math.random() * 4,
        'Old AC Bedroom': 65 + Math.random() * 5,
        'Washing Machine': 90 + Math.random() * 3,
        'Old Refrigerator': 58 + Math.random() * 4
      };
      historicalData.push(dayData);
    }

    return {
      appliances,
      historicalData,
      overallEfficiency: 82.5
    };
  };

  const generateMockAlerts = () => {
    return [
      {
        name: 'Old AC Bedroom',
        powerRating: 1200,
        avgConsumption: 1100,
        efficiency: 66.7,
        daysLowEfficiency: 12,
        suggestion: 'repair',
        estimatedSavings: { repair: 4500, replacement: 18000 }
      },
      {
        name: 'Old Refrigerator',
        powerRating: 250,
        avgConsumption: 220,
        efficiency: 60,
        daysLowEfficiency: 21,
        suggestion: 'replacement',
        estimatedSavings: { repair: 1200, replacement: 8500 }
      }
    ];
  };

  const calculateSavings = (appliance, suggestion) => {
    const ratePerKWh = 6.5; // ₹6.5 per kWh
    const currentWaste = (appliance.powerRating - appliance.avgConsumption) * (appliance.powerRating / 1000) * 24 * 30;
    const monthlyWasteCost = currentWaste * ratePerKWh;
    
    if (suggestion === 'repair') {
      // Repair can improve efficiency by 20-30%
      const improvedEfficiency = Math.min(95, appliance.efficiency + 25);
      const improvedWaste = (appliance.powerRating - (appliance.avgConsumption * improvedEfficiency / appliance.efficiency)) * (appliance.powerRating / 1000) * 24 * 30;
      const improvedCost = improvedWaste * ratePerKWh;
      return {
        repair: monthlyWasteCost - improvedCost,
        replacement: monthlyWasteCost * 0.6 // New appliance would waste 60% less
      };
    } else {
      // Replacement with energy-efficient model
      return {
        repair: monthlyWasteCost * 0.3, // Repair might only save 30%
        replacement: monthlyWasteCost * 0.7 // New model saves 70%
      };
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return '#28a745';
    if (efficiency >= 75) return '#ffc107';
    if (efficiency >= 60) return '#fd7e14';
    return '#dc3545';
  };

  const getEfficiencyStatus = (efficiency) => {
    if (efficiency >= 90) return 'Excellent';
    if (efficiency >= 75) return 'Good';
    if (efficiency >= 60) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="efficiency-monitor">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing appliance efficiency...</p>
        </div>
      </div>
    );
  }

  const chartData = efficiencyData?.historicalData || [];
  const appliances = efficiencyData?.appliances || [];

  return (
    <div className="efficiency-monitor">
      <div className="efficiency-header">
        <h3>⚡ Appliance Efficiency Monitor</h3>
        <p className="efficiency-subtitle">
          Track appliance performance and get alerts for repair or replacement
        </p>
      </div>

      {/* Overall Efficiency Score */}
      <div className="overall-efficiency-card">
        <div className="efficiency-score">
          <div className="score-circle">
            <span className="score-value">{efficiencyData?.overallEfficiency?.toFixed(1) || 82.5}%</span>
            <span className="score-label">Overall Efficiency</span>
          </div>
        </div>
        <div className="efficiency-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Excellent (90%+)</span>
            <span className="breakdown-value">{appliances.filter(a => a.efficiency >= 90).length}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Good (75-89%)</span>
            <span className="breakdown-value">{appliances.filter(a => a.efficiency >= 75 && a.efficiency < 90).length}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Fair (60-74%)</span>
            <span className="breakdown-value">{appliances.filter(a => a.efficiency >= 60 && a.efficiency < 75).length}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Poor (&lt;60%)</span>
            <span className="breakdown-value">{appliances.filter(a => a.efficiency < 60).length}</span>
          </div>
        </div>
      </div>

      {/* Efficiency Trends Chart */}
      <div className="chart-section">
        <h4>Efficiency Trends (Last 30 Days)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              stroke="#6c757d"
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
              stroke="#6c757d"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value) => `${value.toFixed(1)}%`}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            {appliances.slice(0, 4).map((app, index) => (
              <Line 
                key={app.name}
                type="monotone" 
                dataKey={app.name} 
                stroke={['#31694e', '#658c58', '#bbc863', '#f0e491'][index]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Appliance Efficiency List */}
      <div className="appliances-list-section">
        <h4>Appliance Efficiency Status</h4>
        <div className="appliances-grid">
          {appliances.map((appliance) => (
            <div 
              key={appliance.name} 
              className={`appliance-efficiency-card ${selectedAppliance === appliance.name ? 'selected' : ''}`}
              onClick={() => setSelectedAppliance(selectedAppliance === appliance.name ? null : appliance.name)}
            >
              <div className="appliance-header">
                <h5>{appliance.name}</h5>
                <span 
                  className="efficiency-badge"
                  style={{ backgroundColor: getEfficiencyColor(appliance.efficiency) }}
                >
                  {appliance.efficiency.toFixed(1)}%
                </span>
              </div>
              <div className="appliance-details">
                <div className="detail-row">
                  <span>Power Rating:</span>
                  <span>{appliance.powerRating}W</span>
                </div>
                <div className="detail-row">
                  <span>Avg Consumption:</span>
                  <span>{appliance.avgConsumption.toFixed(1)}W</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span className="status-text">{getEfficiencyStatus(appliance.efficiency)}</span>
                </div>
                {appliance.daysLowEfficiency > 0 && (
                  <div className="warning-row">
                    <span>⚠️ Low efficiency for {appliance.daysLowEfficiency} days</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repair/Replacement Alerts */}
      {alerts.length > 0 && (
        <div className="efficiency-alerts-section">
          <h4>⚠️ Action Required - Low Efficiency Alerts</h4>
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div key={index} className="efficiency-alert-card">
                <div className="alert-header">
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-info">
                    <h5>{alert.name}</h5>
                    <p>
                      Efficiency has been low ({alert.efficiency.toFixed(1)}%) for {alert.daysLowEfficiency} days.
                      {alert.suggestion === 'replacement' 
                        ? ' Consider replacing with an energy-efficient model.'
                        : ' Consider scheduling a repair or maintenance.'}
                    </p>
                  </div>
                </div>
                
                <div className="recommendation-comparison">
                  <div className={`recommendation-option ${alert.suggestion === 'repair' ? 'recommended' : ''}`}>
                    <h6>🔧 Repair/Maintenance</h6>
                    <div className="cost-info">
                      <span className="cost-label">Est. Cost:</span>
                      <span className="cost-value">₹{alert.estimatedSavings.repair < 2000 ? '500-2000' : '2000-5000'}</span>
                    </div>
                    <div className="savings-info">
                      <span className="savings-label">Monthly Savings:</span>
                      <span className="savings-value">₹{alert.estimatedSavings.repair.toFixed(0)}</span>
                    </div>
                    <div className="roi-info">
                      <span>ROI: ~{Math.ceil(alert.estimatedSavings.repair < 2000 ? 1 : 2)} months</span>
                    </div>
                  </div>
                  
                  <div className={`recommendation-option ${alert.suggestion === 'replacement' ? 'recommended' : ''}`}>
                    <h6>🔄 Replace with Energy-Efficient Model</h6>
                    <div className="cost-info">
                      <span className="cost-label">Est. Cost:</span>
                      <span className="cost-value">₹{alert.name.includes('AC') ? '25000-40000' : '15000-25000'}</span>
                    </div>
                    <div className="savings-info">
                      <span className="savings-label">Monthly Savings:</span>
                      <span className="savings-value">₹{alert.estimatedSavings.replacement.toFixed(0)}</span>
                    </div>
                    <div className="roi-info">
                      <span>ROI: ~{Math.ceil(alert.estimatedSavings.replacement > 0 ? (alert.name.includes('AC') ? 35000 : 20000) / alert.estimatedSavings.replacement : 24)} months</span>
                    </div>
                  </div>
                </div>

                <div className="alert-actions">
                  <button className="action-btn primary">📞 Find Service Provider</button>
                  <button className="action-btn secondary">💡 Learn More</button>
                  <button className="action-btn">✅ Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="no-alerts">
          <div className="no-alerts-icon">✅</div>
          <h4>All Appliances Operating Efficiently!</h4>
          <p>Your appliances are running at optimal efficiency. Keep up the good maintenance!</p>
        </div>
      )}
    </div>
  );
}

export default ApplianceEfficiencyMonitor;

