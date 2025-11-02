// Main App component with routing
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import EnergyInsights from './pages/EnergyInsights';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@energy.com' });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={token ? <Navigate to="/dashboard" /> : <LandingPage />} 
          />
          <Route 
            path="/login" 
            element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} 
          />
          <Route 
            path="/register" 
            element={token ? <Navigate to="/dashboard" /> : <Register setToken={setToken} />} 
          />
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard token={token} setToken={setToken} user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={token ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={<AdminDashboard />} 
          />
          <Route 
            path="/insights" 
            element={<EnergyInsights />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
