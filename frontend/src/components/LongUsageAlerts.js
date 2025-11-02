import React, { useState, useEffect } from 'react';

const LongUsageAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, warning, info

  useEffect(() => {
    fetchLongUsageAlerts();
  }, []);

  const fetchLongUsageAlerts = async () => {
    try {
      // Mock data for demonstration - in production, fetch from ML service
      const mockAlerts = [
        {
          id: 1,
          type: 'overnight_usage',
          severity: 'critical',
          title: 'High Overnight Consumption',
          message: 'AC running at full capacity during night hours (2 AM - 5 AM). Consider using timer or sleep mode.',
          date: '2024-11-02',
          consumption: '12.5 kWh',
          potential_waste: '₹81',
          device: 'Smart AC Living Room',
          icon: '🌙',
          duration: '7 hours',
          recommendation: 'Set AC timer or use sleep mode to reduce overnight consumption'
        },
        {
          id: 2,
          type: 'continuous_high_usage',
          severity: 'warning',
          title: 'Continuous High Energy Usage',
          message: 'Water heater consuming high energy for 5 consecutive days. Check for leaks or thermostat issues.',
          date: '2024-11-01',
          consumption: '18.2 kWh',
          potential_waste: '₹118',
          device: 'Water Heater',
          icon: '🚿',
          duration: '5 days',
          recommendation: 'Inspect water heater for leaks and check thermostat settings'
        },
        {
          id: 3,
          type: 'unnecessary_standby',
          severity: 'warning',
          title: 'Standby Power Consumption',
          message: 'Multiple devices consuming standby power. TV, sound system, and gaming console left on standby.',
          date: '2024-11-02',
          consumption: '3.8 kWh',
          potential_waste: '₹25',
          device: 'Entertainment System',
          icon: '📺',
          duration: '24 hours',
          recommendation: 'Use smart power strips or manually turn off devices when not in use'
        },
        {
          id: 4,
          type: 'peak_hour_usage',
          severity: 'info',
          title: 'Peak Hour High Usage',
          message: 'High consumption during peak hours (6-10 PM). Consider shifting some usage to off-peak hours.',
          date: '2024-11-02',
          consumption: '8.5 kWh',
          potential_waste: '₹17',
          device: 'Multiple Appliances',
          icon: '⚡',
          duration: '4 hours',
          recommendation: 'Shift washing machine, dishwasher usage to off-peak hours'
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching long usage alerts:', error);
    } finally {
      setLoading(false);
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

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return '#f8d7da';
      case 'warning': return '#fff3cd';
      case 'info': return '#d1ecf1';
      default: return '#f8f9fa';
    }
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const takeAction = (alert) => {
    // In a real app, this would trigger device controls or scheduling
    console.log('Taking action for alert:', alert.title);
    // For demo, just dismiss the alert
    dismissAlert(alert.id);
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  if (loading) {
    return (
      <div className="long-usage-alerts">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing usage patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="long-usage-alerts">
      <div className="alerts-header">
        <h3>⚠️ Long Usage Alerts</h3>
        <p className="alerts-subtitle">
          Identify and reduce unnecessary energy consumption
        </p>
      </div>

      <div className="alerts-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({alerts.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
          onClick={() => setFilter('critical')}
        >
          Critical ({alerts.filter(a => a.severity === 'critical').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          Warning ({alerts.filter(a => a.severity === 'warning').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
          onClick={() => setFilter('info')}
        >
          Info ({alerts.filter(a => a.severity === 'info').length})
        </button>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="no-alerts">
          <div className="no-alerts-icon">🎉</div>
          <h4>No Unnecessary Usage Detected!</h4>
          <p>Your energy consumption patterns look efficient. Keep up the great work!</p>
        </div>
      ) : (
        <div className="alerts-list">
          {filteredAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`alert-card ${alert.severity}-severity`}
              style={{ borderLeftColor: getSeverityColor(alert.severity) }}
            >
              <div className="alert-header">
                <div className="alert-icon">{alert.icon}</div>
                <div className="alert-info">
                  <h4 className="alert-title">{alert.title}</h4>
                  <div className="alert-meta">
                    <span 
                      className="severity-badge"
                      style={{ 
                        color: getSeverityColor(alert.severity),
                        backgroundColor: getSeverityBg(alert.severity)
                      }}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="alert-date">{alert.date}</span>
                    <span className="alert-duration">{alert.duration}</span>
                  </div>
                </div>
                <button 
                  className="dismiss-btn"
                  onClick={() => dismissAlert(alert.id)}
                  title="Dismiss Alert"
                >
                  ✕
                </button>
              </div>

              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                
                <div className="alert-details">
                  <div className="detail-item">
                    <span className="detail-label">Device:</span>
                    <span className="detail-value">{alert.device}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Consumption:</span>
                    <span className="detail-value">{alert.consumption}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Potential Waste:</span>
                    <span className="detail-value waste-amount">{alert.potential_waste}</span>
                  </div>
                </div>

                <div className="recommendation">
                  <h5>💡 Recommendation:</h5>
                  <p>{alert.recommendation}</p>
                </div>
              </div>

              <div className="alert-actions">
                <button 
                  className="action-btn primary-action"
                  onClick={() => takeAction(alert)}
                >
                  🔧 Take Action
                </button>
                <button 
                  className="action-btn secondary-action"
                  onClick={() => dismissAlert(alert.id)}
                >
                  ✅ Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="alerts-summary">
        <div className="summary-card">
          <h4>📊 Weekly Summary</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">₹241</span>
              <span className="stat-label">Potential Savings</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">42.8 kWh</span>
              <span className="stat-label">Unnecessary Usage</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">18%</span>
              <span className="stat-label">Efficiency Improvement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongUsageAlerts;
