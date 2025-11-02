// API service for backend communication
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User authentication
export const register = async (name, email, password) => {
  const response = await api.post('/users/register', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

// Usage data
export const getUsageData = async () => {
  const response = await api.get('/usage');
  return response.data;
};

export const addUsageData = async (applianceId, timestamp, consumption) => {
  const response = await api.post('/usage', { applianceId, timestamp, consumption });
  return response.data;
};

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/usage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Appliances
export const getAppliances = async () => {
  const response = await api.get('/usage/appliances');
  return response.data;
};

export const createAppliance = async (name, powerRating) => {
  const response = await api.post('/usage/appliance', { name, powerRating });
  return response.data;
};

// Insights
export const getInsights = async () => {
  const response = await api.get('/insights');
  return response.data;
};

export const getWeeklyInsights = async () => {
  const response = await api.get('/insights/weekly');
  return response.data;
};

export const getMonthlyInsights = async () => {
  const response = await api.get('/insights/monthly');
  return response.data;
};

export default api;
