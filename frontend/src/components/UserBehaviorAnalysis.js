import React, { useState, useEffect } from 'react';

const UserBehaviorAnalysis = () => {
  const [behaviorData, setBehaviorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  useEffect(() => {
    fetchBehaviorAnalysis();
  }, [selectedPeriod]);

  const fetchBehaviorAnalysis = async () => {
    try {
      // Mock data for demonstration - in production, fetch from ML service
      const mockBehaviorData = {
        user_type: 'eco_conscious',
        behavior_score: 87.5,
        consistency_rating: 82.3,
        avg_daily_consumption: 14.2,
        savings_this_month: 1680,
        annual_savings_potential: 20160,
        rank_percentile: 85,
        badges: [
          { name: 'Eco Warrior', icon: '🌱', description: 'Consistently low energy consumption' },
          { name: 'Smart Saver', icon: '💡', description: 'Great energy efficiency' },
          { name: 'Consistent User', icon: '📊', description: 'Stable consumption patterns' }
        ],
        consumption_patterns: {
          morning: { avg: 3.2, trend: 'stable', efficiency: 'good' },
          afternoon: { avg: 2.8, trend: 'decreasing', efficiency: 'excellent' },
          evening: { avg: 6.1, trend: 'stable', efficiency: 'good' },
          night: { avg: 2.1, trend: 'decreasing', efficiency: 'excellent' }
        },
        weekly_comparison: {
          this_week: 98.4,
          last_week: 102.1,
          change: -3.6,
          trend: 'improving'
        },
        device_efficiency: [
          { device: 'Smart AC', efficiency: 91, usage_hours: 8, cost: '₹45' },
          { device: 'Refrigerator', efficiency: 96, usage_hours: 24, cost: '₹32' },
          { device: 'LED Lights', efficiency: 88, usage_hours: 6, cost: '₹12' },
          { device: 'Water Heater', efficiency: 78, usage_hours: 2, cost: '₹18' }
        ],
        recommendations: [
          'Your consumption is 15% below average - excellent work!',
          'Consider upgrading water heater for better efficiency',
          'Peak hour usage is well-managed',
          'Maintain current patterns for optimal savings'
        ]
      };
      
      setBehaviorData(mockBehaviorData);
    } catch (error) {
      console.error('Error fetching behavior analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeInfo = (userType) => {
    const types = {
      eco_conscious: {
        title: 'Eco Conscious',
        icon: '🌱',
        color: '#28a745',
        description: 'You consistently maintain low energy consumption and make environmentally conscious choices.'
      },
      moderate: {
        title: 'Moderate User',
        icon: '⚖️',
        color: '#ffc107',
        description: 'You have balanced energy usage with room for optimization.'
      },
      high_consumer: {
        title: 'High Consumer',
        icon: '⚡',
        color: '#dc3545',
        description: 'Your energy usage is above average. Consider implementing energy-saving measures.'
      }
    };
    return types[userType] || types.moderate;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'stable': return '➡️';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <div className="user-behavior-analysis">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing your behavior patterns...</p>
        </div>
      </div>
    );
  }

  if (!behaviorData) {
    return (
      <div className="user-behavior-analysis">
        <div className="error-state">
          <p>Unable to load behavior analysis. Please try again later.</p>
        </div>
      </div>
    );
  }

  const userTypeInfo = getUserTypeInfo(behaviorData.user_type);

  return (
    <div className="user-behavior-analysis">
      <div className="behavior-header">
        <h3>👤 User Behavior Analysis</h3>
        <div className="period-selector">
          <button 
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* User Type Card */}
      <div className="user-type-card" style={{ borderColor: userTypeInfo.color }}>
        <div className="user-type-header">
          <span className="user-type-icon">{userTypeInfo.icon}</span>
          <div className="user-type-info">
            <h4 style={{ color: userTypeInfo.color }}>{userTypeInfo.title}</h4>
            <p>{userTypeInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Behavior Metrics */}
      <div className="behavior-metrics">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">🎯</span>
            <h4>Behavior Score</h4>
          </div>
          <div className="metric-value">
            <span 
              className="score-value"
              style={{ color: getScoreColor(behaviorData.behavior_score) }}
            >
              {behaviorData.behavior_score}
            </span>
            <span className="score-max">/100</span>
          </div>
          <div className="score-bar">
            <div 
              className="score-fill"
              style={{ 
                width: `${behaviorData.behavior_score}%`,
                backgroundColor: getScoreColor(behaviorData.behavior_score)
              }}
            ></div>
          </div>
          <p className="metric-description">
            Top {behaviorData.rank_percentile}% of users
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📊</span>
            <h4>Consistency</h4>
          </div>
          <div className="metric-value">
            <span className="consistency-value">{behaviorData.consistency_rating}%</span>
          </div>
          <p className="metric-description">
            Stable usage patterns
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">💰</span>
            <h4>Monthly Savings</h4>
          </div>
          <div className="metric-value">
            <span className="savings-value">₹{behaviorData.savings_this_month}</span>
          </div>
          <p className="metric-description">
            vs. average household
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">⚡</span>
            <h4>Daily Average</h4>
          </div>
          <div className="metric-value">
            <span className="consumption-value">{behaviorData.avg_daily_consumption} kWh</span>
          </div>
          <p className="metric-description">
            15% below average
          </p>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="achievement-badges">
        <h4>🏅 Your Achievements</h4>
        <div className="badges-grid">
          {behaviorData.badges.map((badge, index) => (
            <div key={index} className="badge-card">
              <span className="badge-icon">{badge.icon}</span>
              <h5 className="badge-name">{badge.name}</h5>
              <p className="badge-description">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consumption Patterns */}
      <div className="consumption-patterns">
        <h4>📈 Daily Consumption Patterns</h4>
        <div className="patterns-grid">
          {Object.entries(behaviorData.consumption_patterns).map(([period, data]) => (
            <div key={period} className="pattern-card">
              <div className="pattern-header">
                <h5>{period.charAt(0).toUpperCase() + period.slice(1)}</h5>
                <span className="trend-icon">{getTrendIcon(data.trend)}</span>
              </div>
              <div className="pattern-value">{data.avg} kWh</div>
              <div className={`efficiency-badge ${data.efficiency}`}>
                {data.efficiency}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Efficiency */}
      <div className="device-efficiency">
        <h4>🔌 Device Efficiency Analysis</h4>
        <div className="efficiency-list">
          {behaviorData.device_efficiency.map((device, index) => (
            <div key={index} className="efficiency-item">
              <div className="device-info">
                <h5>{device.device}</h5>
                <span className="usage-hours">{device.usage_hours}h/day</span>
              </div>
              <div className="efficiency-metrics">
                <div className="efficiency-score">
                  <span className="score">{device.efficiency}%</span>
                  <div className="efficiency-bar">
                    <div 
                      className="efficiency-fill"
                      style={{ width: `${device.efficiency}%` }}
                    ></div>
                  </div>
                </div>
                <div className="device-cost">{device.cost}/day</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="weekly-comparison">
        <h4>📊 Weekly Comparison</h4>
        <div className="comparison-card">
          <div className="comparison-item">
            <span className="comparison-label">This Week</span>
            <span className="comparison-value">{behaviorData.weekly_comparison.this_week} kWh</span>
          </div>
          <div className="comparison-item">
            <span className="comparison-label">Last Week</span>
            <span className="comparison-value">{behaviorData.weekly_comparison.last_week} kWh</span>
          </div>
          <div className="comparison-change">
            <span className={`change-value ${behaviorData.weekly_comparison.change < 0 ? 'positive' : 'negative'}`}>
              {behaviorData.weekly_comparison.change > 0 ? '+' : ''}{behaviorData.weekly_comparison.change}%
            </span>
            <span className="change-trend">{behaviorData.weekly_comparison.trend}</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="behavior-recommendations">
        <h4>💡 Personalized Recommendations</h4>
        <div className="recommendations-list">
          {behaviorData.recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-item">
              <span className="recommendation-icon">✨</span>
              <p>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorAnalysis;
