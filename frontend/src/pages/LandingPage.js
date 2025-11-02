import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [animatedValues, setAnimatedValues] = useState({
    wastedEnergy: 0,
    avgBill: 0,
    costIncrease: 0,
    savings: 0
  });

  const problemStats = [
    { key: 'wastedEnergy', value: 30, label: 'of energy is wasted in homes', suffix: '%', color: '#dc3545' },
    { key: 'avgBill', value: 1400, label: 'average annual electricity bill', prefix: '$', color: '#ffc107' },
    { key: 'costIncrease', value: 40, label: 'increase in energy costs over 5 years', suffix: '%', color: '#dc3545' },
    { key: 'savings', value: 25, label: 'potential savings with smart monitoring', suffix: '%', color: '#28a745' }
  ];

  useEffect(() => {
    // Animate counter values
    const animateCounters = () => {
      problemStats.forEach((stat, index) => {
        setTimeout(() => {
          let current = 0;
          const increment = stat.value / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
              current = stat.value;
              clearInterval(timer);
            }
            setAnimatedValues(prev => ({
              ...prev,
              [stat.key]: Math.floor(current)
            }));
          }, 30);
        }, index * 200);
      });
    };

    animateCounters();

    // Cycle through stats
    const statCycle = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % problemStats.length);
    }, 3000);

    return () => clearInterval(statCycle);
  }, []);

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-icon energy">⚡</div>
            <div className="floating-icon money">💰</div>
            <div className="floating-icon chart">📊</div>
            <div className="floating-icon eco">🌱</div>
            <div className="floating-icon home">🏠</div>
            <div className="floating-icon bulb">💡</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">🚀 Smart Energy Management</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-main">WattWise</span>
            <span className="title-tagline">Intelligent Energy Control</span>
          </h1>
          
          <p className="hero-subtitle">
            Transform your energy consumption with <strong>AI-powered monitoring</strong>, 
            <strong>predictive analytics</strong>, and <strong>personalized insights</strong>. 
            Take control of your electricity costs and reduce your carbon footprint.
          </p>

          {/* Interactive Problem Stats */}
          <div className="hero-stats">
            <div className="stats-container">
              {problemStats.map((stat, index) => (
                <div 
                  key={stat.key}
                  className={`hero-stat ${index === currentStat ? 'active' : ''}`}
                  style={{ '--stat-color': stat.color }}
                >
                  <div className="stat-number">
                    {stat.prefix}{animatedValues[stat.key]}{stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="stats-indicator">
              {problemStats.map((_, index) => (
                <div 
                  key={index}
                  className={`indicator-dot ${index === currentStat ? 'active' : ''}`}
                  onClick={() => setCurrentStat(index)}
                />
              ))}
            </div>
          </div>

          {/* Interactive Demo Preview */}
          <div className="hero-demo">
            <div className="demo-card">
              <div className="demo-header">
                <div className="demo-title">Live Dashboard Preview</div>
                <div className="demo-status">🔴 LIVE</div>
              </div>
              <div className="demo-content">
                <div className="demo-metric">
                  <span className="metric-label">Current Usage</span>
                  <span className="metric-value">2.4 kW</span>
                </div>
                <div className="demo-metric">
                  <span className="metric-label">Today's Cost</span>
                  <span className="metric-value">$18.50</span>
                </div>
                <div className="demo-metric">
                  <span className="metric-label">Efficiency</span>
                  <span className="metric-value">87%</span>
                </div>
              </div>
              <div className="demo-chart">
                <div className="chart-bars">
                  <div className="bar" style={{height: '60%'}}></div>
                  <div className="bar" style={{height: '80%'}}></div>
                  <div className="bar" style={{height: '45%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
                  <div className="bar" style={{height: '70%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-cta">
            <Link to="/login" className="cta-button cta-primary">
              <span className="cta-text">Start Saving Now</span>
              <span className="cta-icon">🚀</span>
            </Link>
            <Link to="/register" className="cta-button cta-secondary">
              <span className="cta-text">See Demo</span>
              <span className="cta-icon">👁️</span>
            </Link>
          </div>

          <div className="hero-trust">
            <div className="trust-text">Trusted by 10,000+ households</div>
            <div className="trust-badges">
              <span className="trust-badge">⭐ 4.9/5 Rating</span>
              <span className="trust-badge">🔒 Secure</span>
              <span className="trust-badge">🌍 Eco-Certified</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose WattWise?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Monitoring</h3>
              <p>Track your energy consumption in real-time with detailed appliance-level insights.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Cost Prediction</h3>
              <p>AI-powered predictions help you forecast your electricity bills and plan your budget.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Analytics</h3>
              <p>Beautiful charts and graphs reveal patterns in your energy usage behavior.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Reduce your carbon footprint with personalized energy-saving recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Smart Alerts</h3>
              <p>Get notified about unusual consumption patterns and potential energy waste.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Intuitive dashboard makes energy management simple and accessible for everyone.</p>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get WattWise?</h2>
            <p>Join thousands of users who are already saving money and energy</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button cta-primary">
                Start Your Journey
              </Link>
              <Link to="/login" className="cta-button cta-secondary">
                Sign In
              </Link>
              <Link to="/insights" className="cta-button cta-insights">
                📊 Energy Insights
              </Link>
              <Link to="/admin" className="cta-button cta-admin">
                🏢 Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
