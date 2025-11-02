// Comprehensive User Profile Page for WattWise
import React, { useState, useEffect } from 'react';

const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Demo User',
    email: 'demo@energy.com',
    phone: '+91 98765 43210',
    address: '123 Green Avenue, Mumbai, Maharashtra 400001',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    electricityRate: '6.5',
    homeType: 'apartment',
    homeSize: '1200',
    occupants: '2',
    heatingType: 'electric',
    coolingType: 'central_ac'
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      alerts: true
    },
    privacy: {
      shareData: false,
      analytics: true,
      marketing: false
    },
    automation: {
      smartScheduling: true,
      peakHourOptimization: true,
      weatherIntegration: true,
      geofencing: false
    }
  });

  const [stats, setStats] = useState({
    memberSince: '2024-01-15',
    totalSavings: 16087.50, // ₹16,087.50 (converted from $247.50 at realistic savings rate)
    co2Reduced: 156.8,
    efficiencyScore: 85,
    devicesManaged: 8,
    monthlyAverage: 45.6,
    bestMonth: 'March 2024',
    achievements: [
      { id: 1, name: 'Energy Saver', description: 'Reduced consumption by 15%', icon: '🌱', earned: true },
      { id: 2, name: 'Smart Scheduler', description: 'Used smart scheduling for 30 days', icon: '⏰', earned: true },
      { id: 3, name: 'Peak Avoider', description: 'Avoided peak hours 90% of the time', icon: '⚡', earned: false },
      { id: 4, name: 'Eco Warrior', description: 'Reduced CO2 by 100kg', icon: '🌍', earned: true },
      { id: 5, name: 'Device Master', description: 'Manage 10+ devices', icon: '🏠', earned: false }
    ]
  });

  const tabs = [
    { key: 'personal', label: 'Personal Info', icon: '👤' },
    { key: 'home', label: 'Home Setup', icon: '🏠' },
    { key: 'preferences', label: 'Preferences', icon: '⚙️' },
    { key: 'billing', label: 'Billing & Usage', icon: '💳' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'security', label: 'Security', icon: '🔒' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
    // Update user context if needed
    if (setUser) {
      setUser(prev => ({ ...prev, ...formData }));
    }
  };

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Personal Information</h3>
        <button 
          className={`edit-btn ${isEditing ? 'save' : 'edit'}`}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? '💾 Save' : '✏️ Edit'}
        </button>
      </div>
      
      <div className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              disabled={!isEditing}
            >
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">Greenwich Mean Time</option>
              <option value="Asia/Dubai">Gulf Standard Time</option>
              <option value="Asia/Singapore">Singapore Time</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderHomeSetup = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Home Configuration</h3>
      </div>
      
      <div className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>Home Type</label>
            <select
              value={formData.homeType}
              onChange={(e) => handleInputChange('homeType', e.target.value)}
              disabled={!isEditing}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>
          <div className="form-group">
            <label>Home Size (sq ft)</label>
            <input
              type="number"
              value={formData.homeSize}
              onChange={(e) => handleInputChange('homeSize', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Number of Occupants</label>
            <input
              type="number"
              value={formData.occupants}
              onChange={(e) => handleInputChange('occupants', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Electricity Rate (₹/kWh)</label>
            <input
              type="number"
              step="0.1"
              value={formData.electricityRate}
              onChange={(e) => handleInputChange('electricityRate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Heating Type</label>
            <select
              value={formData.heatingType}
              onChange={(e) => handleInputChange('heatingType', e.target.value)}
              disabled={!isEditing}
            >
              <option value="electric">Electric</option>
              <option value="gas">Natural Gas</option>
              <option value="oil">Oil</option>
              <option value="heat_pump">Heat Pump</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cooling Type</label>
            <select
              value={formData.coolingType}
              onChange={(e) => handleInputChange('coolingType', e.target.value)}
              disabled={!isEditing}
            >
              <option value="central_ac">Central AC</option>
              <option value="window_ac">Window AC</option>
              <option value="heat_pump">Heat Pump</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Preferences & Settings</h3>
      </div>
      
      <div className="preferences-grid">
        <div className="preference-category">
          <h4>🔔 Notifications</h4>
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                />
                <span>{key.charAt(0).toUpperCase() + key.slice(1)} Notifications</span>
              </label>
            </div>
          ))}
        </div>
        
        <div className="preference-category">
          <h4>🔒 Privacy</h4>
          {Object.entries(preferences.privacy).map(([key, value]) => (
            <div key={key} className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('privacy', key, e.target.checked)}
                />
                <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
              </label>
            </div>
          ))}
        </div>
        
        <div className="preference-category">
          <h4>🤖 Automation</h4>
          {Object.entries(preferences.automation).map(([key, value]) => (
            <div key={key} className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('automation', key, e.target.checked)}
                />
                <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Billing & Usage Statistics</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Savings</span>
            <span className="stat-value">₹{stats.totalSavings.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-info">
            <span className="stat-label">CO2 Reduced</span>
            <span className="stat-value">{stats.co2Reduced} kg</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-label">Efficiency Score</span>
            <span className="stat-value">{stats.efficiencyScore}%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-info">
            <span className="stat-label">Devices Managed</span>
            <span className="stat-value">{stats.devicesManaged}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-label">Monthly Average</span>
            <span className="stat-value">{stats.monthlyAverage} kWh</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <span className="stat-label">Best Month</span>
            <span className="stat-value">{stats.bestMonth}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Achievements & Badges</h3>
      </div>
      
      <div className="achievements-grid">
        {stats.achievements.map(achievement => (
          <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
              <span className={`achievement-status ${achievement.earned ? 'earned' : 'locked'}`}>
                {achievement.earned ? '✅ Earned' : '🔒 Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Security & Privacy</h3>
      </div>
      
      <div className="security-options">
        <div className="security-item">
          <h4>🔑 Change Password</h4>
          <p>Update your account password for better security</p>
          <button className="security-btn">Change Password</button>
        </div>
        
        <div className="security-item">
          <h4>📱 Two-Factor Authentication</h4>
          <p>Add an extra layer of security to your account</p>
          <button className="security-btn">Enable 2FA</button>
        </div>
        
        <div className="security-item">
          <h4>📊 Data Export</h4>
          <p>Download all your energy data and usage history</p>
          <button className="security-btn">Export Data</button>
        </div>
        
        <div className="security-item">
          <h4>🗑️ Delete Account</h4>
          <p>Permanently delete your account and all associated data</p>
          <button className="security-btn danger">Delete Account</button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonalInfo();
      case 'home': return renderHomeSetup();
      case 'preferences': return renderPreferences();
      case 'billing': return renderBilling();
      case 'achievements': return renderAchievements();
      case 'security': return renderSecurity();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{formData.name}</h1>
            <p>{formData.email}</p>
            <span className="member-since">Member since {new Date(stats.memberSince).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="profile-stats-summary">
          <div className="summary-stat">
            <span className="summary-value">₹{stats.totalSavings.toLocaleString('en-IN')}</span>
            <span className="summary-label">Total Saved</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{stats.efficiencyScore}%</span>
            <span className="summary-label">Efficiency</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{stats.co2Reduced}kg</span>
            <span className="summary-label">CO2 Reduced</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="profile-tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
