import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [selectedBuilding, selectedTimeframe]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Mock admin data - in production, fetch from API
      const mockData = {
        overview: {
          totalBuildings: 12,
          totalUnits: 248,
          totalConsumption: 1847.5, // kWh
          totalCost: 12008.75, // INR
          averageEfficiency: 78.5,
          activeAlerts: 15,
          peakDemand: 425.8,
          carbonFootprint: 1234.5
        },
        buildings: [
          {
            id: 1,
            name: 'Green Valley Apartments',
            type: 'Residential',
            units: 24,
            consumption: 156.8,
            cost: 1019.20,
            efficiency: 85,
            alerts: 2,
            status: 'optimal',
            location: 'Mumbai, Maharashtra'
          },
          {
            id: 2,
            name: 'Tech Park Complex',
            type: 'Commercial',
            units: 45,
            consumption: 324.5,
            cost: 2109.25,
            efficiency: 72,
            alerts: 5,
            status: 'warning',
            location: 'Bangalore, Karnataka'
          },
          {
            id: 3,
            name: 'Sunrise Residency',
            type: 'Residential',
            units: 18,
            consumption: 98.2,
            cost: 638.30,
            efficiency: 88,
            alerts: 0,
            status: 'excellent',
            location: 'Pune, Maharashtra'
          },
          {
            id: 4,
            name: 'Metro Mall',
            type: 'Commercial',
            units: 32,
            consumption: 445.6,
            cost: 2896.40,
            efficiency: 65,
            alerts: 8,
            status: 'critical',
            location: 'Delhi, NCR'
          },
          {
            id: 5,
            name: 'Ocean View Towers',
            type: 'Residential',
            units: 36,
            consumption: 198.4,
            cost: 1289.60,
            efficiency: 82,
            alerts: 1,
            status: 'good',
            location: 'Chennai, Tamil Nadu'
          },
          {
            id: 6,
            name: 'Business Hub',
            type: 'Commercial',
            units: 28,
            consumption: 267.3,
            cost: 1737.45,
            efficiency: 75,
            alerts: 3,
            status: 'warning',
            location: 'Hyderabad, Telangana'
          }
        ],
        alerts: [
          {
            id: 1,
            building: 'Metro Mall',
            type: 'High Consumption',
            severity: 'critical',
            message: 'Consumption 45% above normal for past 3 hours',
            timestamp: '2024-11-02T10:30:00Z',
            cost_impact: '₹2,450'
          },
          {
            id: 2,
            building: 'Tech Park Complex',
            type: 'Equipment Malfunction',
            severity: 'warning',
            message: 'HVAC system showing irregular patterns',
            timestamp: '2024-11-02T09:15:00Z',
            cost_impact: '₹1,200'
          },
          {
            id: 3,
            building: 'Green Valley Apartments',
            type: 'Peak Hour Usage',
            severity: 'info',
            message: 'High usage during peak hours detected',
            timestamp: '2024-11-02T08:45:00Z',
            cost_impact: '₹800'
          }
        ],
        consumption_trends: {
          hourly: [
            { time: '00:00', consumption: 145.2, cost: 943.80 },
            { time: '06:00', consumption: 234.8, cost: 1526.20 },
            { time: '12:00', consumption: 456.7, cost: 2968.55 },
            { time: '18:00', consumption: 523.4, cost: 3402.10 },
            { time: '23:00', consumption: 198.6, cost: 1290.90 }
          ]
        }
      };
      
      setAdminData(mockData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#28a745';
      case 'optimal': return '#28a745';
      case 'good': return '#6f42c1';
      case 'warning': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-title">
          <Link to="/" className="back-btn">← Back to Home</Link>
          <h1>🏢 WattWise Admin Portal</h1>
          <p>Monitor and manage energy consumption across all buildings</p>
        </div>
        
        <div className="admin-controls">
          <select 
            value={selectedBuilding} 
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Buildings</option>
            {adminData?.buildings.map(building => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="admin-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="admin-overview">
        <div className="overview-card">
          <div className="overview-icon">🏢</div>
          <div className="overview-content">
            <h3>Total Buildings</h3>
            <div className="overview-value">{adminData?.overview.totalBuildings}</div>
            <div className="overview-trend">↗ +2 this month</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">🏠</div>
          <div className="overview-content">
            <h3>Total Units</h3>
            <div className="overview-value">{adminData?.overview.totalUnits}</div>
            <div className="overview-trend">→ Stable</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">⚡</div>
          <div className="overview-content">
            <h3>Total Consumption</h3>
            <div className="overview-value">{adminData?.overview.totalConsumption} kWh</div>
            <div className="overview-trend">↘ -5.2% vs yesterday</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">💰</div>
          <div className="overview-content">
            <h3>Total Cost</h3>
            <div className="overview-value">₹{adminData?.overview.totalCost.toLocaleString('en-IN')}</div>
            <div className="overview-trend">↘ -3.8% vs yesterday</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">📊</div>
          <div className="overview-content">
            <h3>Avg Efficiency</h3>
            <div className="overview-value">{adminData?.overview.averageEfficiency}%</div>
            <div className="overview-trend">↗ +2.1% vs last week</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">⚠️</div>
          <div className="overview-content">
            <h3>Active Alerts</h3>
            <div className="overview-value">{adminData?.overview.activeAlerts}</div>
            <div className="overview-trend critical">↗ +3 new alerts</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Buildings List */}
        <div className="admin-section">
          <h2>🏢 Buildings Overview</h2>
          <div className="buildings-grid">
            {adminData?.buildings.map(building => (
              <div key={building.id} className="building-card">
                <div className="building-header">
                  <div className="building-info">
                    <h3>{building.name}</h3>
                    <span className="building-type">{building.type}</span>
                    <span className="building-location">📍 {building.location}</span>
                  </div>
                  <div 
                    className="building-status"
                    style={{ backgroundColor: getStatusColor(building.status) }}
                  >
                    {building.status}
                  </div>
                </div>

                <div className="building-metrics">
                  <div className="building-metric">
                    <span className="metric-label">Units</span>
                    <span className="metric-value">{building.units}</span>
                  </div>
                  <div className="building-metric">
                    <span className="metric-label">Consumption</span>
                    <span className="metric-value">{building.consumption} kWh</span>
                  </div>
                  <div className="building-metric">
                    <span className="metric-label">Cost</span>
                    <span className="metric-value">₹{building.cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="building-metric">
                    <span className="metric-label">Efficiency</span>
                    <span className="metric-value">{building.efficiency}%</span>
                  </div>
                </div>

                <div className="building-footer">
                  <div className="building-alerts">
                    {building.alerts > 0 ? (
                      <span className="alerts-badge">⚠️ {building.alerts} alerts</span>
                    ) : (
                      <span className="no-alerts">✅ No alerts</span>
                    )}
                  </div>
                  <button className="building-details-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="admin-section">
          <h2>⚠️ Recent Alerts</h2>
          <div className="alerts-list">
            {adminData?.alerts.map(alert => (
              <div key={alert.id} className="alert-item">
                <div className="alert-header">
                  <div className="alert-info">
                    <h4>{alert.building}</h4>
                    <span className="alert-type">{alert.type}</span>
                  </div>
                  <div className="alert-meta">
                    <span 
                      className="alert-severity"
                      style={{ color: getSeverityColor(alert.severity) }}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-footer">
                  <span className="cost-impact">Cost Impact: {alert.cost_impact}</span>
                  <div className="alert-actions">
                    <button className="alert-action acknowledge">Acknowledge</button>
                    <button className="alert-action resolve">Resolve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-section">
          <h2>📈 Quick Statistics</h2>
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <span className="stat-label">Peak Demand</span>
                <span className="stat-value">{adminData?.overview.peakDemand} kW</span>
                <span className="stat-time">at 6:30 PM</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🌱</div>
              <div className="stat-content">
                <span className="stat-label">Carbon Footprint</span>
                <span className="stat-value">{adminData?.overview.carbonFootprint} kg CO2</span>
                <span className="stat-time">today</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">💡</div>
              <div className="stat-content">
                <span className="stat-label">Energy Saved</span>
                <span className="stat-value">234.5 kWh</span>
                <span className="stat-time">vs last week</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-label">Cost Saved</span>
                <span className="stat-value">₹1,524</span>
                <span className="stat-time">this month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
