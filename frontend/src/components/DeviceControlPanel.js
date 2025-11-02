// Smart Device Control Panel for WattWise
import React, { useState, useEffect } from 'react';

const DeviceControlPanel = ({ appliances, onApplianceUpdate, onAddAppliance, onRemoveAppliance }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppliance, setNewAppliance] = useState({
    name: '',
    powerRating: '',
    category: 'Other',
    room: '',
    brand: '',
    model: ''
  });

  const categories = ['HVAC', 'Kitchen', 'Entertainment', 'Lighting', 'Laundry', 'Other'];
  const rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Garage', 'Other'];

  const [deviceStates, setDeviceStates] = useState({});

  // Pre-defined smart devices with lock status (reduced to 5 essential devices)
  const defaultDevices = [
    { _id: 'smart-ac-1', name: 'Smart AC Living Room', powerRating: 2500, category: 'HVAC', room: 'Living Room', brand: 'LG', model: 'ThinQ AC', isLocked: true },
    { _id: 'smart-fridge-1', name: 'Smart Refrigerator', powerRating: 800, category: 'Kitchen', room: 'Kitchen', brand: 'Samsung', model: 'Family Hub', isLocked: true },
    { _id: 'smart-tv-1', name: 'Smart TV 65"', powerRating: 200, category: 'Entertainment', room: 'Living Room', brand: 'Sony', model: 'Bravia XR', isLocked: false },
    { _id: 'smart-lights-1', name: 'Smart LED Lights', powerRating: 60, category: 'Lighting', room: 'Living Room', brand: 'Philips', model: 'Hue White', isLocked: false },
    { _id: 'smart-washer-1', name: 'Smart Washing Machine', powerRating: 1800, category: 'Laundry', room: 'Garage', brand: 'Whirlpool', model: 'Smart Front Load', isLocked: true }
  ];

  useEffect(() => {
    // Initialize device states for both default devices and user appliances
    const initialStates = {};
    
    // Add default smart devices
    defaultDevices.forEach(device => {
      initialStates[device._id] = {
        isOn: Math.random() > 0.4, // Random initial state
        consumption: device.isOn ? (Math.random() * (device.powerRating / 1000) + 0.1).toFixed(2) : 0,
        efficiency: Math.floor(Math.random() * 15 + 85),
        temperature: device.name.toLowerCase().includes('ac') || device.name.toLowerCase().includes('thermostat') ? Math.floor(Math.random() * 8 + 20) : null,
        schedule: null,
        isLocked: device.isLocked
      };
    });
    
    // Add user appliances
    appliances.forEach(appliance => {
      if (!initialStates[appliance._id]) {
        initialStates[appliance._id] = {
          isOn: Math.random() > 0.3,
          consumption: (Math.random() * 2 + 0.5).toFixed(2),
          efficiency: Math.floor(Math.random() * 20 + 80),
          temperature: appliance.name.toLowerCase().includes('air') ? Math.floor(Math.random() * 10 + 20) : null,
          schedule: null,
          isLocked: false
        };
      }
    });
    
    setDeviceStates(initialStates);
  }, [appliances]);

  const handleToggleDevice = (applianceId) => {
    setDeviceStates(prev => ({
      ...prev,
      [applianceId]: {
        ...prev[applianceId],
        isOn: !prev[applianceId]?.isOn,
        consumption: prev[applianceId]?.isOn ? 0 : (Math.random() * 2 + 0.5).toFixed(2)
      }
    }));
  };

  const handleAddAppliance = (e) => {
    e.preventDefault();
    if (newAppliance.name && newAppliance.powerRating) {
      const appliance = {
        _id: `app-${Date.now()}`,
        name: newAppliance.name,
        powerRating: parseInt(newAppliance.powerRating),
        category: newAppliance.category,
        room: newAppliance.room,
        brand: newAppliance.brand,
        model: newAppliance.model,
        userId: 'demo-user-123',
        createdAt: new Date()
      };
      
      onAddAppliance(appliance);
      setNewAppliance({ name: '', powerRating: '', category: 'Other', room: '', brand: '', model: '' });
      setShowAddForm(false);
    }
  };

  const handleToggleLock = (deviceId) => {
    setDeviceStates(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        isLocked: !prev[deviceId]?.isLocked
      }
    }));
  };

  const handleRemoveDevice = (deviceId) => {
    const deviceState = deviceStates[deviceId];
    if (deviceState?.isLocked) {
      alert('🔒 This device is locked and cannot be removed. Unlock it first to remove.');
      return;
    }
    onRemoveAppliance(deviceId);
  };

  const getDeviceIcon = (applianceName) => {
    const name = applianceName.toLowerCase();
    if (name.includes('ac') || name.includes('hvac') || name.includes('thermostat')) return '❄️';
    if (name.includes('refrigerator') || name.includes('fridge')) return '🧊';
    if (name.includes('tv')) return '📺';
    if (name.includes('light')) return '💡';
    if (name.includes('washing') || name.includes('washer')) return '🧺';
    if (name.includes('microwave')) return '🔥';
    if (name.includes('dishwasher')) return '🍽️';
    if (name.includes('computer')) return '💻';
    if (name.includes('vacuum')) return '🤖';
    if (name.includes('water') && name.includes('heater')) return '🚿';
    return '🔌';
  };

  // Combine default devices and user appliances
  const allDevices = [...defaultDevices, ...appliances.filter(app => !defaultDevices.find(def => def._id === app._id))];

  const getStatusColor = (isOn, efficiency) => {
    if (!isOn) return '#6c757d';
    if (efficiency >= 90) return '#28a745';
    if (efficiency >= 75) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="device-control-panel">
      <div className="panel-header">
        <h2>🏠 Smart Device Control</h2>
        <button 
          className="add-device-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Device
        </button>
      </div>

      {showAddForm && (
        <div className="add-device-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Appliance</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddAppliance} className="add-device-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Device Name *</label>
                  <input
                    type="text"
                    value={newAppliance.name}
                    onChange={(e) => setNewAppliance({...newAppliance, name: e.target.value})}
                    placeholder="e.g., Living Room AC"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Power Rating (W) *</label>
                  <input
                    type="number"
                    value={newAppliance.powerRating}
                    onChange={(e) => setNewAppliance({...newAppliance, powerRating: e.target.value})}
                    placeholder="e.g., 1500"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newAppliance.category}
                    onChange={(e) => setNewAppliance({...newAppliance, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Room</label>
                  <select
                    value={newAppliance.room}
                    onChange={(e) => setNewAppliance({...newAppliance, room: e.target.value})}
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={newAppliance.brand}
                    onChange={(e) => setNewAppliance({...newAppliance, brand: e.target.value})}
                    placeholder="e.g., Samsung"
                  />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    value={newAppliance.model}
                    onChange={(e) => setNewAppliance({...newAppliance, model: e.target.value})}
                    placeholder="e.g., AR12TXHZAWKNEU"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="devices-grid">
        {allDevices.map(device => {
          const deviceState = deviceStates[device._id] || {};
          const isOn = deviceState.isOn;
          const consumption = deviceState.consumption || 0;
          const efficiency = deviceState.efficiency || 85;
          const isLocked = deviceState.isLocked;

          return (
            <div key={device._id} className={`device-card ${isOn ? 'active' : 'inactive'} ${isLocked ? 'locked' : ''}`}>
              <div className="device-header">
                <div className="device-info">
                  <span className="device-icon">{getDeviceIcon(device.name)}</span>
                  <div className="device-text">
                    <h4>{device.name}</h4>
                    <div>
                      <span className="device-power">{device.powerRating}W</span>
                      <span className="device-brand">{device.brand} {device.model}</span>
                    </div>
                  </div>
                </div>
                <div className="device-controls">
                  <button
                    className={`power-btn ${isOn ? 'on' : 'off'}`}
                    onClick={() => handleToggleDevice(device._id)}
                    title={isOn ? 'Turn Off' : 'Turn On'}
                  >
                    {isOn ? '🟢' : '⚫'}
                  </button>
                  <button
                    className={`lock-btn ${isLocked ? 'locked' : 'unlocked'}`}
                    onClick={() => handleToggleLock(device._id)}
                    title={isLocked ? 'Unlock Device' : 'Lock Device'}
                  >
                    {isLocked ? '🔒' : '🔓'}
                  </button>
                  <button
                    className={`remove-btn ${isLocked ? 'disabled' : ''}`}
                    onClick={() => handleRemoveDevice(device._id)}
                    title={isLocked ? 'Device is locked' : 'Remove Device'}
                    disabled={isLocked}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Compact Status Display */}
              <div className="device-status-compact">
                <span className={`status-indicator ${isOn ? 'on' : 'off'}`}>
                  {isOn ? '🟢 ON' : '⚫ OFF'}
                </span>
                <span className="consumption-compact">
                  {consumption} kWh
                </span>
                <span className="efficiency-compact" style={{ color: getStatusColor(isOn, efficiency) }}>
                  {efficiency}%
                </span>
                {deviceState.temperature && (
                  <span className="temperature-compact">
                    {deviceState.temperature}°C
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceControlPanel;
