// Variable Time Period Chart Component for WattWise
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const VariableTimeChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('hourly');
  const [chartData, setChartData] = useState([]);

  const periods = [
    { key: 'hourly', label: '24 Hours', icon: '⏰' },
    { key: 'daily', label: '7 Days', icon: '📅' },
    { key: 'weekly', label: '4 Weeks', icon: '📊' },
    { key: 'monthly', label: '12 Months', icon: '📈' }
  ];

  useEffect(() => {
    generateChartData(selectedPeriod);
  }, [selectedPeriod]);

  const generateChartData = (period) => {
    const data = [];
    const now = new Date();

    switch (period) {
      case 'hourly':
        // Last 24 hours
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
          const hourValue = hour.getHours();
          
          let baseConsumption = 2.5;
          if (hourValue >= 6 && hourValue <= 9) baseConsumption += Math.random() * 3 + 2;
          else if (hourValue >= 18 && hourValue <= 22) baseConsumption += Math.random() * 4 + 3;
          else if (hourValue >= 23 || hourValue <= 5) baseConsumption = Math.random() * 1.5 + 1;
          else baseConsumption += Math.random() * 2 + 1;
          
          data.push({
            time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            consumption: parseFloat(baseConsumption.toFixed(2)),
            cost: parseFloat((baseConsumption * 6.5).toFixed(2)),
            isPeak: (hourValue >= 6 && hourValue <= 9) || (hourValue >= 18 && hourValue <= 22)
          });
        }
        break;

      case 'daily':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const day = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
          const baseConsumption = 25 + Math.random() * 15;
          
          data.push({
            time: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            consumption: parseFloat(baseConsumption.toFixed(2)),
            cost: parseFloat((baseConsumption * 6.5).toFixed(2)),
            isPeak: false
          });
        }
        break;

      case 'weekly':
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const week = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
          const baseConsumption = 180 + Math.random() * 50;
          
          data.push({
            time: `Week ${4 - i}`,
            consumption: parseFloat(baseConsumption.toFixed(2)),
            cost: parseFloat((baseConsumption * 6.5).toFixed(2)),
            isPeak: false
          });
        }
        break;

      case 'monthly':
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const baseConsumption = 750 + Math.random() * 200;
          
          data.push({
            time: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            consumption: parseFloat(baseConsumption.toFixed(2)),
            cost: parseFloat((baseConsumption * 6.5).toFixed(2)),
            isPeak: false
          });
        }
        break;

      default:
        break;
    }

    setChartData(data);
  };

  const getAverageConsumption = () => {
    if (chartData.length === 0) return 0;
    return chartData.reduce((sum, item) => sum + item.consumption, 0) / chartData.length;
  };

  const getUnit = () => {
    switch (selectedPeriod) {
      case 'hourly': return 'kWh/hour';
      case 'daily': return 'kWh/day';
      case 'weekly': return 'kWh/week';
      case 'monthly': return 'kWh/month';
      default: return 'kWh';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '15px',
          border: '1px solid #bbc863',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          minWidth: '200px'
        }}>
          <p style={{ color: '#31694e', fontWeight: 'bold', marginBottom: '8px' }}>
            {label}
          </p>
          <p style={{ color: '#658c58', margin: '4px 0' }}>
            Consumption: <strong>{data.consumption} kWh</strong>
          </p>
          <p style={{ color: '#6c757d', margin: '4px 0' }}>
            Cost: <strong>₹{data.cost}</strong>
          </p>
          {selectedPeriod === 'hourly' && (
            <p style={{ 
              color: data.isPeak ? '#dc3545' : '#28a745', 
              margin: '4px 0',
              fontWeight: 'bold'
            }}>
              {data.isPeak ? '🔴 Peak Hours' : '🟢 Off-Peak'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const avgConsumption = getAverageConsumption();

  return (
    <div className="variable-time-chart">
      <div className="chart-header">
        <h2>⚡ Energy Consumption Analysis</h2>
        <div className="period-selector">
          {periods.map(period => (
            <button
              key={period.key}
              className={`period-btn ${selectedPeriod === period.key ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period.key)}
            >
              <span className="period-icon">{period.icon}</span>
              <span className="period-label">{period.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="chart-stats">
        <div className="chart-stat">
          <span className="stat-label">Average {getUnit()}</span>
          <span className="stat-value">{avgConsumption.toFixed(2)}</span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Total Cost</span>
          <span className="stat-value">₹{(chartData.reduce((sum, item) => sum + item.cost, 0)).toFixed(2)}</span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Data Points</span>
          <span className="stat-value">{chartData.length}</span>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bbc863" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#658c58" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              stroke="#6c757d"
              fontSize={11}
              interval={selectedPeriod === 'hourly' ? 2 : 0}
            />
            <YAxis 
              label={{ 
                value: `Consumption (${getUnit()})`, 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: '#6c757d' } 
              }}
              stroke="#6c757d"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={avgConsumption} 
              stroke="#f0e491" 
              strokeDasharray="5 5" 
              label={{ value: "Avg", position: "topRight", fill: "#31694e" }}
            />
            <Area 
              type="monotone" 
              dataKey="consumption" 
              stroke="#31694e" 
              strokeWidth={3}
              fill="url(#consumptionGradient)"
              activeDot={{ r: 6, fill: '#31694e', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {selectedPeriod === 'hourly' && (
        <div className="peak-hours-info">
          <div className="info-card">
            <h4>🔴 Peak Hours (6-9 AM, 6-10 PM)</h4>
            <p>Higher electricity rates apply during these hours. Consider scheduling high-consumption appliances during off-peak times.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableTimeChart;
