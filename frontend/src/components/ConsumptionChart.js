// Enhanced chart component for daily consumption using Recharts
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

function ConsumptionChart({ data, title = "Daily Energy Consumption" }) {
  // Transform data object to array for Recharts
  const chartData = Object.entries(data).map(([date, consumption]) => ({
    date,
    consumption: parseFloat(consumption.toFixed(2))
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '12px',
          border: '1px solid #bbc863',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#31694e', fontWeight: 'bold' }}>
            {new Date(label).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <p style={{ color: '#658c58' }}>
            Consumption: <strong>{payload[0].value} kWh</strong>
          </p>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Cost: <strong>${(payload[0].value * 0.12).toFixed(2)}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#bbc863" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#658c58" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          stroke="#6c757d"
          fontSize={12}
        />
        <YAxis 
          label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6c757d' } }}
          stroke="#6c757d"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
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
  );
}

export default ConsumptionChart;
