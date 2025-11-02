// Enhanced bar chart component for appliance consumption using Recharts
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

function ApplianceChart({ data }) {
  // Transform data object to array for Recharts
  const chartData = Object.entries(data).map(([name, consumption]) => ({
    name,
    consumption: parseFloat(consumption.toFixed(2))
  })).sort((a, b) => b.consumption - a.consumption);

  // WattWise color palette for different appliances
  const colors = ['#31694e', '#658c58', '#bbc863', '#f0e491', '#a8e6cf', '#81c784', '#66bb6a', '#4caf50'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const consumption = payload[0].value;
      const cost = (consumption * 0.12).toFixed(2);
      const percentage = ((consumption / chartData.reduce((sum, item) => sum + item.consumption, 0)) * 100).toFixed(1);
      
      return (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '15px',
          border: '1px solid #bbc863',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#31694e', fontWeight: 'bold', marginBottom: '8px' }}>
            {label}
          </p>
          <p style={{ color: '#658c58', margin: '4px 0' }}>
            Consumption: <strong>{consumption} kWh</strong>
          </p>
          <p style={{ color: '#6c757d', margin: '4px 0' }}>
            Daily Cost: <strong>${cost}</strong>
          </p>
          <p style={{ color: '#bbc863', margin: '4px 0' }}>
            Share: <strong>{percentage}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#bbc863" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#31694e" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="name" 
          stroke="#6c757d"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          label={{ 
            value: 'Consumption (kWh)', 
            angle: -90, 
            position: 'insideLeft', 
            style: { textAnchor: 'middle', fill: '#6c757d' } 
          }}
          stroke="#6c757d"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="consumption" 
          radius={[4, 4, 0, 0]}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ApplianceChart;
