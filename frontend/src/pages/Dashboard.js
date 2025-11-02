// WattWise Dashboard - Energy monitoring with cost predictions
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getInsights, uploadCSV, getAppliances } from '../services/api';
import { liveDataService } from '../services/liveDataService';
import ConsumptionChart from '../components/ConsumptionChart';
import ApplianceChart from '../components/ApplianceChart';
import HourlyChart from '../components/HourlyChart';
import EnergyDistributionChart from '../components/EnergyDistributionChart';
import DeviceControlPanel from '../components/DeviceControlPanel';
import VariableTimeChart from '../components/VariableTimeChart';
import CSVUpload from '../components/CSVUpload';

function Dashboard({ token, setToken }) {
  const [insights, setInsights] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [costPredictions, setCostPredictions] = useState(null);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@energy.com' });
  const [liveData, setLiveData] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(true);

  const calculateCostPredictions = useCallback((data) => {
    const ratePerKWh = 6.5; // ₹6.5 per kWh (average Indian residential rate)
    const totalConsumption = data.totalConsumption || 0;
    const avgDaily = data.averageDailyConsumption || 0;
    
    const predictions = {
      daily: (avgDaily * ratePerKWh).toFixed(2),
      weekly: (avgDaily * 7 * ratePerKWh).toFixed(2),
      monthly: (avgDaily * 30 * ratePerKWh).toFixed(2),
      yearly: (avgDaily * 365 * ratePerKWh).toFixed(2),
      potentialSavings: {
        daily: (avgDaily * 0.15 * ratePerKWh).toFixed(2), // 15% savings potential
        monthly: (avgDaily * 30 * 0.15 * ratePerKWh).toFixed(2),
        yearly: (avgDaily * 365 * 0.15 * ratePerKWh).toFixed(2)
      }
    };
    
    setCostPredictions(predictions);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [insightsData, appliancesData] = await Promise.all([
        getInsights(),
        getAppliances()
      ]);
      setInsights(insightsData);
      setAppliances(appliancesData.data || []);
      
      // Calculate cost predictions
      if (insightsData) {
        calculateCostPredictions(insightsData);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [calculateCostPredictions]);

  useEffect(() => {
    fetchData();
    
    // Start live data service
    const unsubscribe = liveDataService.subscribe((data) => {
      setLiveData(data);
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Live data updated:', data.lastUpdated);
      }
    });
    
    liveDataService.start();
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
      liveDataService.stop();
    };
  }, [fetchData]);

  const handleLogout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const handleUploadSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleAddAppliance = useCallback((newAppliance) => {
    setAppliances(prev => [...prev, newAppliance]);
    // In a real app, this would make an API call
    // Appliance added (would make API call in production)
  }, []);

  const handleRemoveAppliance = useCallback((applianceId) => {
    setAppliances(prev => prev.filter(app => app._id !== applianceId));
    // In a real app, this would make an API call
    // Appliance removed (would make API call in production)
  }, []);

  const handleApplianceUpdate = useCallback((applianceId, updates) => {
    setAppliances(prev => prev.map(app => 
      app._id === applianceId ? { ...app, ...updates } : app
    ));
    // In a real app, this would make an API call
    // Appliance updated (would make API call in production)
  }, []);

  const handleForceUpdate = useCallback(() => {
    liveDataService.forceUpdate();
  }, []);

  // Use live data when available, fallback to static data
  // Must be called before early returns to follow Rules of Hooks
  const displayData = useMemo(() => liveData || {
    totalConsumption: insights?.totalConsumption || 0,
    averageDailyConsumption: insights?.averageDailyConsumption || 0,
    activeAppliances: appliances.length,
    efficiencyScore: 85,
    appliances: insights?.consumptionPerAppliance || {},
    dailyConsumption: insights?.consumptionPerDay || {},
    costPredictions: costPredictions || {},
    alerts: insights?.alerts || []
  }, [liveData, insights, appliances, costPredictions]);

  // Memoize header to prevent re-renders
  // Must be called before early returns to follow Rules of Hooks
  const headerContent = useMemo(() => (
    <div className="dashboard-header">
      <h1>WattWise</h1>
      <div className="user-info">
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="welcome-text">Welcome, {user.name}</span>
        {liveData && (
          <span className="live-indicator" aria-label="Live data indicator">
            🔴 LIVE
          </span>
        )}
        <button 
          onClick={handleForceUpdate} 
          className="force-update-btn"
          title="Force update for demo"
          type="button"
        >
          🔄 Update
        </button>
        <Link to="/profile" className="profile-link">
          👤 Profile
        </Link>
        <button onClick={handleLogout} className="logout-btn" type="button">
          Logout
        </button>
      </div>
    </div>
  ), [user.name, liveData, handleForceUpdate, handleLogout]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="loading">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      {headerContent}

      {/* Key Metrics - Only 4 most important cards */}
      <div className="key-metrics-grid">
        <div className="metric-card primary clickable" onClick={() => alert('⚡ Current Power Details\n\nReal-time power consumption monitoring\nPeak: 4.2 kW\nAverage: 2.8 kW\nEfficiency: 92%')}>
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Current Power</h3>
            <div className="metric-value">{liveData?.currentPower?.toFixed(1) || displayData.totalConsumption?.toFixed(1) || 0} <span className="metric-unit">kW</span></div>
            <div className="metric-trend live">🔴 Live</div>
          </div>
          <div className="click-indicator">👆</div>
        </div>
        
        <div className="metric-card clickable" onClick={() => alert('📊 Daily Average Details\n\nAverage daily consumption trends\nThis week: ' + (displayData.averageDailyConsumption?.toFixed(1) || 0) + ' kWh\nLast week: 24.2 kWh\nImprovement: ' + (displayData.trends?.consumption === 'up' ? '-2.1%' : '+1.8%'))}>
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Daily Average</h3>
            <div className="metric-value">{displayData.averageDailyConsumption?.toFixed(1) || 0} <span className="metric-unit">kWh</span></div>
            <div className={`metric-trend ${displayData.trends?.consumption === 'up' ? 'down' : 'up'}`}>
              {displayData.trends?.consumption === 'up' ? '↘ -2.1%' : '↗ +1.8%'}
            </div>
          </div>
          <div className="click-indicator">👆</div>
        </div>
        
        <div className="metric-card clickable" onClick={() => alert('🏠 Active Devices Details\n\nCurrently monitoring ' + (displayData.activeAppliances || 0) + ' devices\n\nOnline: ' + (displayData.activeAppliances || 0) + ' devices\nOffline: 0 devices\nTotal registered: 8 devices')}>
          <div className="metric-icon">🏠</div>
          <div className="metric-content">
            <h3>Active Devices</h3>
            <div className="metric-value">{displayData.activeAppliances || 0} <span className="metric-unit">online</span></div>
            <div className="metric-trend up">↗ Monitoring</div>
          </div>
          <div className="click-indicator">👆</div>
        </div>
        
        <div className="metric-card clickable" onClick={() => alert('💰 Today\'s Cost Details\n\nCurrent cost: ₹' + (liveData?.costPredictions?.daily?.toFixed(2) || (displayData.costPredictions?.daily || 121.88).toFixed(2)) + '\n\nRate: ₹6.5/kWh\nPeak hours cost: ₹8.5/kWh\nProjected monthly: ₹' + ((liveData?.costPredictions?.monthly || 3656.25) || (parseFloat(displayData.costPredictions?.daily || 121.88) * 30)).toFixed(2))}>
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Today's Cost</h3>
            <div className="metric-value">₹{liveData?.costPredictions?.daily?.toFixed(2) || (displayData.costPredictions?.daily || 121.88).toFixed(2)} <span className="metric-unit">INR</span></div>
            <div className={`metric-trend ${displayData.trends?.cost || 'up'}`}>
              {displayData.trends?.cost === 'up' ? '↗' : '↘'} Live
            </div>
          </div>
          <div className="click-indicator">👆</div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-main">
        {/* Left Column - Charts */}
        <div className="dashboard-left">
          {/* Variable Time Chart */}
          <div className="chart-section">
            <VariableTimeChart />
          </div>
          
          {/* Device Control Panel */}
          <div className="chart-section">
            <DeviceControlPanel 
              appliances={appliances}
              onAddAppliance={handleAddAppliance}
              onRemoveAppliance={handleRemoveAppliance}
              onApplianceUpdate={handleApplianceUpdate}
            />
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="dashboard-right">
          {/* Appliance Consumption */}
          {(displayData.appliances && Object.keys(displayData.appliances).length > 0) && (
            <div className="chart-section">
              <h3>🏠 Top Consumers {liveData && <span className="live-badge">🔴 LIVE</span>}</h3>
              <div className="chart-container">
                <ApplianceChart data={liveData ? 
                  Object.fromEntries(Object.entries(displayData.appliances).map(([name, data]) => [name, data.consumption])) : 
                  displayData.appliances
                } />
              </div>
            </div>
          )}

          {/* Energy Distribution Pie Chart */}
          {(displayData.appliances && Object.keys(displayData.appliances).length > 0) && (
            <div className="chart-section">
              <h3>🥧 Energy Distribution {liveData && <span className="live-badge">🔴 LIVE</span>}</h3>
              <div className="chart-container">
                <EnergyDistributionChart data={liveData ? 
                  Object.fromEntries(Object.entries(displayData.appliances).map(([name, data]) => [name, data.consumption])) : 
                  displayData.appliances
                } />
              </div>
            </div>
          )}

          {/* Smart Alerts */}
          {(displayData.alerts && displayData.alerts.length > 0) && (
            <div className="chart-section">
              <h3>⚠️ Smart Alerts {liveData && <span className="live-badge">🔴 LIVE</span>}</h3>
              <div className="alerts-container">
                {displayData.alerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className={`alert-item ${alert.severity || 'info'}`}>
                    <strong>{alert.type}:</strong> {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
