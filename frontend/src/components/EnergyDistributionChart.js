// Pie chart for energy distribution by appliance category
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

function EnergyDistributionChart({ data }) {
  // Transform appliance data into categories
  const categorizeAppliances = (applianceData) => {
    const categories = {
      'HVAC': { consumption: 0, color: '#31694e' },
      'Kitchen': { consumption: 0, color: '#658c58' },
      'Entertainment': { consumption: 0, color: '#bbc863' },
      'Lighting': { consumption: 0, color: '#f0e491' },
      'Laundry': { consumption: 0, color: '#a8e6cf' },
      'Other': { consumption: 0, color: '#81c784' }
    };

    Object.entries(applianceData).forEach(([name, consumption]) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('air') || lowerName.includes('heater') || lowerName.includes('hvac')) {
        categories['HVAC'].consumption += consumption;
      } else if (lowerName.includes('refrigerator') || lowerName.includes('microwave') || lowerName.includes('oven') || lowerName.includes('dishwasher')) {
        categories['Kitchen'].consumption += consumption;
      } else if (lowerName.includes('tv') || lowerName.includes('computer') || lowerName.includes('gaming')) {
        categories['Entertainment'].consumption += consumption;
      } else if (lowerName.includes('light') || lowerName.includes('lamp')) {
        categories['Lighting'].consumption += consumption;
      } else if (lowerName.includes('washing') || lowerName.includes('dryer')) {
        categories['Laundry'].consumption += consumption;
      } else {
        categories['Other'].consumption += consumption;
      }
    });

    return Object.entries(categories)
      .map(([name, { consumption, color }]) => ({
        name,
        consumption: parseFloat(consumption.toFixed(2)),
        color,
        percentage: 0 // Will be calculated below
      }))
      .filter(item => item.consumption > 0);
  };

  const chartData = categorizeAppliances(data);
  const totalConsumption = chartData.reduce((sum, item) => sum + item.consumption, 0);
  
  // Calculate percentages
  chartData.forEach(item => {
    item.percentage = ((item.consumption / totalConsumption) * 100).toFixed(1);
  });

  const CustomTooltip = ({ active, payload }) => {
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
            {data.name}
          </p>
          <p style={{ color: '#658c58', margin: '4px 0' }}>
            Consumption: <strong>{data.consumption} kWh</strong>
          </p>
          <p style={{ color: '#6c757d', margin: '4px 0' }}>
            Daily Cost: <strong>${(data.consumption * 0.12).toFixed(2)}</strong>
          </p>
          <p style={{ color: '#bbc863', margin: '4px 0' }}>
            Share: <strong>{data.percentage}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (parseFloat(percentage) < 5) return null; // Don't show labels for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="consumption"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 'bold' }}>
                {value} ({entry.payload.percentage}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EnergyDistributionChart;
