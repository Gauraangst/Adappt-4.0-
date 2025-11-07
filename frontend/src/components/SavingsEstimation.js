// Savings Estimation - Shows cost comparison with and without WattWise app
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getSavingsEstimation } from '../services/api';

function SavingsEstimation() {
  const [savingsData, setSavingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly'); // daily, weekly, monthly, yearly

  useEffect(() => {
    fetchSavingsData();
  }, [timeRange]);

  const fetchSavingsData = async () => {
    try {
      setLoading(true);
      // Always use dummy data for demo purposes
      const dummyData = generateMockData(timeRange);
      setSavingsData(dummyData);
      
      // Optionally try to fetch real data in background (but don't wait for it)
      try {
        const response = await getSavingsEstimation(timeRange);
        // Only update if we got valid data
        if (response && response.comparisonData && response.comparisonData.length > 0) {
          const data = response.success !== undefined ? response : { success: true, ...response };
          setSavingsData(data);
        }
      } catch (error) {
        // Silently fail - we already have dummy data
        console.log('Using dummy data for savings estimation');
      }
    } catch (error) {
      console.error('Error generating dummy data:', error);
      // Fallback to mock data
      setSavingsData(generateMockData(timeRange));
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (range) => {
    const ratePerKWh = 6.5;
    const baselineSavingsRate = 0.18; // 18% average savings with the app
    const improvementOverTime = [0.15, 0.17, 0.18, 0.19, 0.20, 0.20, 0.19, 0.18]; // Improving over time

    let comparisonData = [];
    let labels = [];

    if (range === 'monthly') {
      // Last 8 months
      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        
        const baseConsumption = 750 + Math.random() * 50; // kWh
        const baseCost = baseConsumption * ratePerKWh;
        const savingsRate = improvementOverTime[7 - i] || 0.18;
        const optimizedConsumption = baseConsumption * (1 - savingsRate);
        const optimizedCost = optimizedConsumption * ratePerKWh;
        const savings = baseCost - optimizedCost;

        comparisonData.push({
          period: labels[labels.length - 1],
          baseCost: parseFloat(baseCost.toFixed(2)),
          optimizedCost: parseFloat(optimizedCost.toFixed(2)),
          savings: parseFloat(savings.toFixed(2)),
          baseConsumption: parseFloat(baseConsumption.toFixed(1)),
          optimizedConsumption: parseFloat(optimizedConsumption.toFixed(1)),
          savingsRate: parseFloat((savingsRate * 100).toFixed(1))
        });
      }
    } else if (range === 'weekly') {
      // Last 8 weeks
      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        labels.push(`Week ${8 - i}`);
        
        const baseConsumption = 175 + Math.random() * 15; // kWh
        const baseCost = baseConsumption * ratePerKWh;
        const savingsRate = improvementOverTime[Math.floor((7 - i) / 2)] || 0.18;
        const optimizedConsumption = baseConsumption * (1 - savingsRate);
        const optimizedCost = optimizedConsumption * ratePerKWh;
        const savings = baseCost - optimizedCost;

        comparisonData.push({
          period: labels[labels.length - 1],
          baseCost: parseFloat(baseCost.toFixed(2)),
          optimizedCost: parseFloat(optimizedCost.toFixed(2)),
          savings: parseFloat(savings.toFixed(2)),
          baseConsumption: parseFloat(baseConsumption.toFixed(1)),
          optimizedConsumption: parseFloat(optimizedConsumption.toFixed(1)),
          savingsRate: parseFloat((savingsRate * 100).toFixed(1))
        });
      }
    } else if (range === 'yearly') {
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const year = new Date().getFullYear() - i;
        labels.push(year.toString());
        
        const baseConsumption = (9000 + Math.random() * 500) * (1 - i * 0.02); // Slight reduction trend
        const baseCost = baseConsumption * ratePerKWh;
        const savingsRate = 0.15 + i * 0.03; // Improving each year
        const optimizedConsumption = baseConsumption * (1 - savingsRate);
        const optimizedCost = optimizedConsumption * ratePerKWh;
        const savings = baseCost - optimizedCost;

        comparisonData.push({
          period: labels[labels.length - 1],
          baseCost: parseFloat(baseCost.toFixed(2)),
          optimizedCost: parseFloat(optimizedCost.toFixed(2)),
          savings: parseFloat(savings.toFixed(2)),
          baseConsumption: parseFloat(baseConsumption.toFixed(1)),
          optimizedConsumption: parseFloat(optimizedConsumption.toFixed(1)),
          savingsRate: parseFloat((savingsRate * 100).toFixed(1))
        });
      }
    }

    // Calculate totals
    const totalBaseCost = comparisonData.reduce((sum, d) => sum + d.baseCost, 0);
    const totalOptimizedCost = comparisonData.reduce((sum, d) => sum + d.optimizedCost, 0);
    const totalSavings = totalBaseCost - totalOptimizedCost;
    const avgSavingsRate = (totalSavings / totalBaseCost) * 100;

    // House analytics breakdown
    const houseAnalytics = {
      totalConsumption: comparisonData.reduce((sum, d) => sum + d.baseConsumption, 0),
      optimizedConsumption: comparisonData.reduce((sum, d) => sum + d.optimizedConsumption, 0),
      savingsByCategory: [
        { name: 'Peak Hour Optimization', value: parseFloat((totalSavings * 0.35).toFixed(2)), percentage: 35 },
        { name: 'Device Scheduling', value: parseFloat((totalSavings * 0.25).toFixed(2)), percentage: 25 },
        { name: 'Standby Reduction', value: parseFloat((totalSavings * 0.20).toFixed(2)), percentage: 20 },
        { name: 'Maintenance Alerts', value: parseFloat((totalSavings * 0.15).toFixed(2)), percentage: 15 },
        { name: 'Behavior Insights', value: parseFloat((totalSavings * 0.05).toFixed(2)), percentage: 5 }
      ],
      appliances: [
        { name: 'AC', baseCost: totalBaseCost * 0.35, optimizedCost: totalOptimizedCost * 0.28, savings: totalSavings * 0.40 },
        { name: 'Refrigerator', baseCost: totalBaseCost * 0.20, optimizedCost: totalOptimizedCost * 0.18, savings: totalSavings * 0.25 },
        { name: 'Water Heater', baseCost: totalBaseCost * 0.18, optimizedCost: totalOptimizedCost * 0.15, savings: totalSavings * 0.20 },
        { name: 'Washing Machine', baseCost: totalBaseCost * 0.15, optimizedCost: totalOptimizedCost * 0.13, savings: totalSavings * 0.10 },
        { name: 'Others', baseCost: totalBaseCost * 0.12, optimizedCost: totalOptimizedCost * 0.11, savings: totalSavings * 0.05 }
      ]
    };

    return {
      comparisonData,
      totals: {
        baseCost: parseFloat(totalBaseCost.toFixed(2)),
        optimizedCost: parseFloat(totalOptimizedCost.toFixed(2)),
        savings: parseFloat(totalSavings.toFixed(2)),
        savingsRate: parseFloat(avgSavingsRate.toFixed(1))
      },
      houseAnalytics
    };
  };

  const COLORS = ['#31694e', '#658c58', '#bbc863', '#f0e491', '#e8c547'];

  if (loading) {
    return (
      <div className="savings-estimation">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Calculating savings estimation...</p>
        </div>
      </div>
    );
  }

  // Extract data from response structure
  const comparisonData = savingsData?.comparisonData || [];
  const totals = savingsData?.totals || {};
  const houseAnalytics = savingsData?.houseAnalytics || {};

  return (
    <div className="savings-estimation">
      <div className="savings-header">
        <h3>💰 Total Savings Estimation</h3>
        <p className="savings-subtitle">
          See how much you're saving with WattWise compared to traditional energy management
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button 
          className={timeRange === 'weekly' ? 'active' : ''}
          onClick={() => setTimeRange('weekly')}
        >
          Weekly
        </button>
        <button 
          className={timeRange === 'monthly' ? 'active' : ''}
          onClick={() => setTimeRange('monthly')}
        >
          Monthly
        </button>
        <button 
          className={timeRange === 'yearly' ? 'active' : ''}
          onClick={() => setTimeRange('yearly')}
        >
          Yearly
        </button>
      </div>

      {/* Summary Cards */}
      <div className="savings-summary-grid">
        <div className="summary-card primary">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h4>Total Savings</h4>
            <div className="summary-value">₹{totals?.savings?.toLocaleString('en-IN') || '0'}</div>
            <div className="summary-label">{timeRange === 'yearly' ? 'Over 3 years' : `Over ${comparisonData?.length || 0} ${timeRange === 'weekly' ? 'weeks' : 'months'}`}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📉</div>
          <div className="summary-content">
            <h4>Average Savings Rate</h4>
            <div className="summary-value">{totals?.savingsRate || 0}%</div>
            <div className="summary-label">Energy reduction</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">⚡</div>
          <div className="summary-content">
            <h4>Energy Saved</h4>
            <div className="summary-value">{(houseAnalytics?.totalConsumption - houseAnalytics?.optimizedConsumption)?.toFixed(1) || '0'} kWh</div>
            <div className="summary-label">Without WattWise: {houseAnalytics?.totalConsumption?.toFixed(1) || '0'} kWh</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">🏆</div>
          <div className="summary-content">
            <h4>Efficiency Score</h4>
            <div className="summary-value">{(100 - totals?.savingsRate) || 82}%</div>
            <div className="summary-label">Current performance</div>
          </div>
        </div>
      </div>

      {/* Cost Comparison Chart */}
      <div className="chart-section">
        <h4>Cost Comparison: With vs Without WattWise</h4>
        {comparisonData && comparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={comparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc3545" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc3545" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#28a745" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#28a745" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="period" 
                stroke="#6c757d"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: 'Cost (₹)', angle: -90, position: 'insideLeft' }}
                stroke="#6c757d"
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="baseCost" 
                name="Without WattWise" 
                stroke="#dc3545" 
                fill="url(#baseGradient)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="optimizedCost" 
                name="With WattWise" 
                stroke="#28a745" 
                fill="url(#optimizedGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
            <p>No comparison data available</p>
          </div>
        )}
      </div>

      {/* Savings Over Time */}
      <div className="chart-section">
        <h4>Monthly Savings Trend</h4>
        {comparisonData && comparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="period" 
                stroke="#6c757d"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: 'Savings (₹)', angle: -90, position: 'insideLeft' }}
                stroke="#6c757d"
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="savings" name="Savings" fill="#31694e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
            <p>No savings data available</p>
          </div>
        )}
      </div>

      {/* House Analytics Section */}
      <div className="house-analytics-section">
        <h4>🏠 House Analytics Breakdown</h4>
        
        <div className="analytics-grid">
          {/* Savings by Category */}
          <div className="analytics-card">
            <h5>Savings by Optimization Category</h5>
            {houseAnalytics?.savingsByCategory && houseAnalytics.savingsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={houseAnalytics.savingsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {houseAnalytics.savingsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                <p>No category data available</p>
              </div>
            )}
          </div>

          {/* Appliance-wise Savings */}
          <div className="analytics-card">
            <h5>Savings by Appliance</h5>
            {houseAnalytics?.appliances && houseAnalytics.appliances.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={houseAnalytics.appliances}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    type="number" 
                    stroke="#6c757d"
                    tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#6c757d" 
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="baseCost" name="Without WattWise" fill="#dc3545" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="optimizedCost" name="With WattWise" fill="#28a745" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="savings" name="Savings" fill="#31694e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                <p>No appliance data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="breakdown-table">
          <h5>Detailed Savings Breakdown</h5>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Savings</th>
                <th>Percentage</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {(houseAnalytics?.savingsByCategory || []).map((category, index) => (
                <tr key={index}>
                  <td>{category.name}</td>
                  <td>₹{category.value.toLocaleString('en-IN')}</td>
                  <td>{category.percentage}%</td>
                  <td>
                    <div className="impact-bar">
                      <div 
                        className="impact-fill"
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Insights */}
        <div className="key-insights">
          <h5>💡 Key Insights</h5>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">⚡</div>
              <h6>Peak Hour Optimization</h6>
              <p>Shifting {houseAnalytics?.savingsByCategory?.[0]?.percentage || 35}% of high-consumption activities to off-peak hours saves ₹{houseAnalytics?.savingsByCategory?.[0]?.value?.toLocaleString('en-IN') || '0'}</p>
            </div>
            <div className="insight-card">
              <div className="insight-icon">📱</div>
              <h6>Smart Scheduling</h6>
              <p>Automated device scheduling reduces waste by {houseAnalytics?.savingsByCategory?.[1]?.percentage || 25}%, contributing ₹{houseAnalytics?.savingsByCategory?.[1]?.value?.toLocaleString('en-IN') || '0'}</p>
            </div>
            <div className="insight-card">
              <div className="insight-icon">🔌</div>
              <h6>Standby Reduction</h6>
              <p>Eliminating phantom loads saves {houseAnalytics?.savingsByCategory?.[2]?.percentage || 20}% of total savings: ₹{houseAnalytics?.savingsByCategory?.[2]?.value?.toLocaleString('en-IN') || '0'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavingsEstimation;

