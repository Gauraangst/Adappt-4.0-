import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const mlServiceUrl = process.env.REACT_APP_ML_SERVICE_URL || 'http://localhost:5002';
      const response = await fetch(`${mlServiceUrl}/leaderboard`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboardData(data.leaderboard);
        setUserStats({
          rank: data.your_rank,
          savings: data.your_savings,
          totalUsers: data.total_users
        });
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '⭐';
    return '🌱';
  };

  const formatSavings = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1 className="page-title">🏆 Energy Savings Leaderboard</h1>
        <p className="page-subtitle">
          See how you rank among WattWise users in energy savings and efficiency
        </p>
      </div>

      {/* User Stats Card */}
      {userStats && (
        <div className="user-stats-card">
          <div className="user-stat">
            <span className="stat-label">Your Rank</span>
            <span className="stat-value">#{userStats.rank}</span>
            <span className="stat-detail">out of {userStats.totalUsers.toLocaleString()} users</span>
          </div>
          <div className="user-stat">
            <span className="stat-label">Your Savings</span>
            <span className="stat-value">{formatSavings(userStats.savings)}</span>
            <span className="stat-detail">this year</span>
          </div>
          <div className="user-stat">
            <span className="stat-label">Percentile</span>
            <span className="stat-value">{Math.round((1 - userStats.rank / userStats.totalUsers) * 100)}%</span>
            <span className="stat-detail">top performers</span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="leaderboard-container">
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="header-cell rank-col">Rank</div>
            <div className="header-cell user-col">User</div>
            <div className="header-cell savings-col">Annual Savings</div>
            <div className="header-cell score-col">Efficiency Score</div>
            <div className="header-cell badge-col">Achievement</div>
          </div>

          <div className="table-body">
            {leaderboardData?.map((user, index) => (
              <div 
                key={user.rank} 
                className={`table-row ${user.rank <= 3 ? 'top-three' : ''} ${user.rank === userStats?.rank ? 'current-user' : ''}`}
              >
                <div className="table-cell rank-col">
                  <span className="rank-number">#{user.rank}</span>
                  <span className="rank-badge">{getRankBadge(user.rank)}</span>
                </div>
                <div className="table-cell user-col">
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                    {user.rank <= 3 && <span className="crown">👑</span>}
                  </div>
                </div>
                <div className="table-cell savings-col">
                  <span className="savings-amount">{formatSavings(user.savings)}</span>
                </div>
                <div className="table-cell score-col">
                  <div className="score-container">
                    <span className="score-value">{user.score}</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${user.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="table-cell badge-col">
                  <span className="achievement-badge">{user.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="achievement-categories">
        <h3>🏅 Achievement Levels</h3>
        <div className="categories-grid">
          <div className="category-card">
            <span className="category-icon">🏆</span>
            <h4>Champion</h4>
            <p>Top 3 performers with exceptional energy savings</p>
          </div>
          <div className="category-card">
            <span className="category-icon">⭐</span>
            <h4>Expert</h4>
            <p>Top 10 users with excellent efficiency scores</p>
          </div>
          <div className="category-card">
            <span className="category-icon">💡</span>
            <h4>Smart Saver</h4>
            <p>Users with good energy management practices</p>
          </div>
          <div className="category-card">
            <span className="category-icon">🌱</span>
            <h4>Eco Friendly</h4>
            <p>Users making positive environmental impact</p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="leaderboard-tips">
        <h3>💡 How to Improve Your Ranking</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📊</span>
            <h4>Monitor Daily Usage</h4>
            <p>Check your dashboard regularly to track consumption patterns</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🔧</span>
            <h4>Follow Maintenance</h4>
            <p>Complete suggested maintenance tasks to improve efficiency</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">⚡</span>
            <h4>Optimize Devices</h4>
            <p>Use smart scheduling and turn off unnecessary appliances</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Set Goals</h4>
            <p>Aim to reduce consumption by 10-15% each month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
