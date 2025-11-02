// Hourly consumption chart with real-time simulation
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

function HourlyChart({ data }) {
  // Generate realistic hourly data for the last 24 hours
  const generateHourlyData = () => {
    const hours = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const hourValue = hour.getHours();
      
      // Simulate realistic consumption patterns
      let baseConsumption = 2.5; // Base load
      
      // Morning peak (6-9 AM)
      if (hourValue >= 6 && hourValue <= 9) {
        baseConsumption += Math.random() * 3 + 2;
      }
      // Evening peak (6-10 PM)
      else if (hourValue >= 18 && hourValue <= 22) {
        baseConsumption += Math.random() * 4 + 3;
      }
      // Night time (11 PM - 5 AM)
      else if (hourValue >= 23 || hourValue <= 5) {
        baseConsumption = Math.random() * 1.5 + 1;
      }
      // Day time
      else {
        baseConsumption += Math.random() * 2 + 1;
      }
      
      hours.push({
        time: hour.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        consumption: parseFloat(baseConsumption.toFixed(2)),
        cost: parseFloat((baseConsumption * 6.5).toFixed(2)),
        isPeak: (hourValue >= 6 && hourValue <= 9) || (hourValue >= 18 && hourValue <= 22)
      });
    }
    
    return hours;
  };

  const chartData = generateHourlyData();
  const avgConsumption = chartData.reduce((sum, item) => sum + item.consumption, 0) / chartData.length;

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
            Hourly Cost: <strong>₹{data.cost}</strong>
          </p>
          <p style={{ 
            color: data.isPeak ? '#dc3545' : '#28a745', 
            margin: '4px 0',
            fontWeight: 'bold'
          }}>
            {data.isPeak ? '🔴 Peak Hours' : '🟢 Off-Peak'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#bbc863" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#658c58" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="time" 
          stroke="#6c757d"
          fontSize={11}
          interval={2}
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
        <ReferenceLine 
          y={avgConsumption} 
          stroke="#f0e491" 
          strokeDasharray="5 5" 
          label={{ value: "Avg", position: "topRight", fill: "#31694e" }}
        />
        <Line 
          type="monotone" 
          dataKey="consumption" 
          stroke="#31694e" 
          strokeWidth={2}
          dot={{ fill: '#31694e', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 6, fill: '#31694e', stroke: '#ffffff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HourlyChart;
