import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EnergyInsights = () => {
  const [selectedCategory, setSelectedCategory] = useState('global');
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    // Animate statistics on load
    const stats = {
      wastePercentage: 30,
      averageBill: 91000, // ₹91,000 (converted from $1,400)
      costIncrease: 40,
      potentialSavings: 25
    };

    // Animate each stat
    Object.keys(stats).forEach(key => {
      let current = 0;
      const target = stats[key];
      const increment = target / 50; // 50 steps animation
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 30);
    });
  }, []);

  const globalStats = [
    {
      id: 'waste',
      number: animatedStats.wastePercentage || 0,
      suffix: '%',
      label: 'of energy is wasted in homes',
      description: 'Poor insulation, inefficient appliances, and lack of monitoring contribute to massive energy waste.',
      icon: '⚠️',
      color: '#dc3545',
      trend: 'increasing'
    },
    {
      id: 'bill',
      number: animatedStats.averageBill || 0,
      prefix: '₹',
      label: 'average annual electricity bill',
      description: 'Indian households spend significant amounts on electricity, with costs rising year over year.',
      icon: '💰',
      color: '#ffc107',
      trend: 'increasing'
    },
    {
      id: 'increase',
      number: animatedStats.costIncrease || 0,
      suffix: '%',
      label: 'increase in energy costs over 5 years',
      description: 'Energy prices have risen dramatically, making efficient consumption more critical than ever.',
      icon: '📈',
      color: '#dc3545',
      trend: 'increasing'
    },
    {
      id: 'savings',
      number: animatedStats.potentialSavings || 0,
      suffix: '%',
      label: 'potential savings with smart monitoring',
      description: 'Smart energy management can reduce consumption and costs significantly through better insights.',
      icon: '💡',
      color: '#28a745',
      trend: 'opportunity'
    }
  ];

  const indianStats = [
    {
      id: 'consumption',
      number: 1208,
      suffix: ' kWh',
      label: 'average annual consumption per household',
      description: 'Indian households consume varying amounts based on region, season, and appliance usage.',
      icon: '⚡',
      color: '#17a2b8'
    },
    {
      id: 'peak',
      number: 6.5,
      prefix: '₹',
      suffix: '/kWh',
      label: 'average electricity rate in India',
      description: 'Rates vary by state and consumption slabs, with peak hour charges being higher.',
      icon: '🏠',
      color: '#6f42c1'
    },
    {
      id: 'ac',
      number: 60,
      suffix: '%',
      label: 'of electricity used by air conditioning',
      description: 'AC is the largest consumer of electricity in Indian homes, especially during summer.',
      icon: '❄️',
      color: '#fd7e14'
    },
    {
      id: 'solar',
      number: 15,
      suffix: '%',
      label: 'potential reduction with solar panels',
      description: 'Rooftop solar can significantly reduce electricity bills and carbon footprint.',
      icon: '☀️',
      color: '#ffc107'
    }
  ];

  const categories = [
    { key: 'global', label: 'Global Energy Crisis', icon: '🌍' },
    { key: 'indian', label: 'Indian Market', icon: '🇮🇳' }
  ];

  const currentStats = selectedCategory === 'global' ? globalStats : indianStats;

  return (
    <div className="energy-insights">
      <div className="insights-header">
        <Link to="/" className="back-btn">← Back to Home</Link>
        <h1>📊 Energy Insights & Statistics</h1>
        <p>Understanding the energy landscape and opportunities for savings</p>
      </div>

      {/* Category Selector */}
      <div className="category-selector">
        {categories.map(category => (
          <button
            key={category.key}
            className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.key)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Statistics Grid */}
      <div className="statistics-grid">
        {currentStats.map((stat, index) => (
          <div 
            key={stat.id} 
            className="statistic-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-header">
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              {stat.trend && (
                <div className={`trend-indicator ${stat.trend}`}>
                  {stat.trend === 'increasing' ? '↗️' : stat.trend === 'opportunity' ? '💡' : '→'}
                </div>
              )}
            </div>
            
            <div className="stat-number" style={{ color: stat.color }}>
              {stat.prefix}{stat.number.toLocaleString('en-IN')}{stat.suffix}
            </div>
            
            <div className="stat-label">{stat.label}</div>
            
            <div className="stat-description">{stat.description}</div>
            
            <div className="stat-progress">
              <div 
                className="progress-bar"
                style={{ 
                  width: `${Math.min(stat.number, 100)}%`,
                  backgroundColor: stat.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h2>💡 Key Insights</h2>
        <div className="insights-grid">
          {selectedCategory === 'global' ? (
            <>
              <div className="insight-card">
                <h3>🏠 Home Energy Waste</h3>
                <p>
                  The majority of energy waste in homes comes from inefficient appliances, 
                  poor insulation, and lack of awareness about consumption patterns. 
                  Smart monitoring can identify these issues and provide actionable solutions.
                </p>
              </div>
              <div className="insight-card">
                <h3>💰 Rising Costs</h3>
                <p>
                  Energy costs have increased significantly due to inflation, infrastructure 
                  upgrades, and environmental regulations. Consumers need better tools to 
                  manage and reduce their consumption.
                </p>
              </div>
              <div className="insight-card">
                <h3>🌱 Environmental Impact</h3>
                <p>
                  Reducing energy waste not only saves money but also reduces carbon emissions. 
                  Every kWh saved contributes to environmental sustainability and climate goals.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="insight-card">
                <h3>🇮🇳 Indian Energy Landscape</h3>
                <p>
                  India's energy consumption is growing rapidly with urbanization and rising 
                  living standards. Smart energy management is crucial for sustainable growth 
                  and reducing the burden on the power grid.
                </p>
              </div>
              <div className="insight-card">
                <h3>❄️ Cooling Dominance</h3>
                <p>
                  Air conditioning accounts for the majority of electricity consumption in 
                  Indian homes, especially during summer months. Optimizing AC usage can 
                  lead to substantial savings.
                </p>
              </div>
              <div className="insight-card">
                <h3>☀️ Solar Opportunity</h3>
                <p>
                  India has excellent solar potential with 300+ sunny days per year. 
                  Rooftop solar combined with smart monitoring can dramatically reduce 
                  electricity bills and dependence on the grid.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="insights-cta">
        <div className="cta-content">
          <h2>Ready to Start Saving?</h2>
          <p>Join WattWise and take control of your energy consumption with smart monitoring and insights.</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button cta-primary">
              Get Started
            </Link>
            <Link to="/dashboard" className="cta-button cta-secondary">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyInsights;
