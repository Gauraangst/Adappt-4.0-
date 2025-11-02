import React, { useState, useEffect } from 'react';

const MaintenanceSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceSuggestions();
  }, []);

  const fetchMaintenanceSuggestions = async () => {
    try {
      // Mock data for demonstration - in production, fetch from ML service
      const mockSuggestions = [
        {
          id: 1,
          type: 'high_consumption',
          priority: 'high',
          title: 'AC Filter Maintenance Due',
          message: 'High energy consumption detected. Clean or replace AC filters to improve efficiency.',
          due_date: '2024-11-15',
          estimated_savings: '₹500-800/month',
          icon: '❄️',
          urgency: 'urgent'
        },
        {
          id: 2,
          type: 'appliance_check',
          priority: 'medium',
          title: 'Refrigerator Coil Cleaning',
          message: 'Clean refrigerator coils for optimal performance and energy savings.',
          due_date: '2024-11-20',
          estimated_savings: '₹200-400/month',
          icon: '🧊',
          urgency: 'moderate'
        },
        {
          id: 3,
          type: 'seasonal',
          priority: 'low',
          title: 'Water Heater Inspection',
          message: 'Annual water heater maintenance recommended for winter season.',
          due_date: '2024-12-01',
          estimated_savings: '₹300-500/month',
          icon: '🚿',
          urgency: 'low'
        },
        {
          id: 4,
          type: 'lighting',
          priority: 'medium',
          title: 'LED Bulb Replacement',
          message: 'Replace old incandescent bulbs with LED for 80% energy savings.',
          due_date: '2024-11-25',
          estimated_savings: '₹150-250/month',
          icon: '💡',
          urgency: 'moderate'
        }
      ];
      
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error fetching maintenance suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      urgent: { text: 'URGENT', color: '#dc3545', bg: '#f8d7da' },
      moderate: { text: 'MODERATE', color: '#856404', bg: '#fff3cd' },
      low: { text: 'LOW', color: '#155724', bg: '#d4edda' }
    };
    return badges[urgency] || badges.low;
  };

  const markAsCompleted = (id) => {
    setSuggestions(prev => prev.filter(suggestion => suggestion.id !== id));
  };

  const snoozeReminder = (id) => {
    setSuggestions(prev => prev.map(suggestion => 
      suggestion.id === id 
        ? { ...suggestion, snoozed: true, due_date: getSnoozeDate() }
        : suggestion
    ));
  };

  const getSnoozeDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Snooze for 1 week
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="maintenance-suggestions">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading maintenance suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="maintenance-suggestions">
      <div className="suggestions-header">
        <h3>🔧 Maintenance Suggestions</h3>
        <p className="suggestions-subtitle">
          Keep your appliances running efficiently with these recommendations
        </p>
      </div>

      {suggestions.length === 0 ? (
        <div className="no-suggestions">
          <div className="no-suggestions-icon">✅</div>
          <h4>All Caught Up!</h4>
          <p>No maintenance tasks needed right now. Great job keeping your appliances in top shape!</p>
        </div>
      ) : (
        <div className="suggestions-list">
          {suggestions.map(suggestion => {
            const urgencyBadge = getUrgencyBadge(suggestion.urgency);
            
            return (
              <div key={suggestion.id} className={`suggestion-card ${suggestion.priority}-priority`}>
                <div className="suggestion-header">
                  <div className="suggestion-icon">{suggestion.icon}</div>
                  <div className="suggestion-info">
                    <h4 className="suggestion-title">{suggestion.title}</h4>
                    <div className="suggestion-badges">
                      <span 
                        className="urgency-badge"
                        style={{ 
                          color: urgencyBadge.color, 
                          backgroundColor: urgencyBadge.bg 
                        }}
                      >
                        {urgencyBadge.text}
                      </span>
                      <span className="due-date">Due: {suggestion.due_date}</span>
                    </div>
                  </div>
                  <div 
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(suggestion.priority) }}
                  ></div>
                </div>

                <div className="suggestion-content">
                  <p className="suggestion-message">{suggestion.message}</p>
                  <div className="savings-info">
                    <span className="savings-label">Potential Savings:</span>
                    <span className="savings-amount">{suggestion.estimated_savings}</span>
                  </div>
                </div>

                <div className="suggestion-actions">
                  <button 
                    className="action-btn complete-btn"
                    onClick={() => markAsCompleted(suggestion.id)}
                  >
                    ✅ Mark Complete
                  </button>
                  <button 
                    className="action-btn snooze-btn"
                    onClick={() => snoozeReminder(suggestion.id)}
                  >
                    ⏰ Snooze 1 Week
                  </button>
                  <button className="action-btn info-btn">
                    ℹ️ More Info
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="suggestions-footer">
        <div className="maintenance-tips">
          <h4>💡 Quick Tips</h4>
          <ul>
            <li>Regular maintenance can reduce energy consumption by 15-20%</li>
            <li>Clean filters monthly during heavy usage seasons</li>
            <li>Schedule professional inspections annually</li>
            <li>Keep appliance manuals handy for maintenance schedules</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSuggestions;
