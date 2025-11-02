# ML Prediction Service for Energy Consumption
# Uses simple moving average and linear regression for predictions

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configuration from environment variables
ELECTRICITY_RATE_PER_KWH = float(os.getenv('ELECTRICITY_RATE_PER_KWH', '6.5'))
USD_TO_INR_RATE = float(os.getenv('USD_TO_INR_RATE', '83.25'))

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'ML Prediction Service is running'
    })

@app.route('/predict', methods=['POST'])
def predict_consumption():
    """
    Predict next day consumption based on past 7 days
    Input: JSON with 'usage_data' array containing consumption values
    Output: JSON with predicted usage and anomaly alert
    """
    try:
        data = request.get_json()
        
        if not data or 'usage_data' not in data:
            return jsonify({
                'error': 'Please provide usage_data array'
            }), 400
        
        usage_data = data['usage_data']
        
        if len(usage_data) < 3:
            return jsonify({
                'error': 'Need at least 3 days of data for prediction'
            }), 400
        
        # Convert to numpy array
        consumption_values = np.array([float(item['consumption']) for item in usage_data])
        
        # Method 1: Simple Moving Average
        moving_avg_prediction = np.mean(consumption_values[-7:]) if len(consumption_values) >= 7 else np.mean(consumption_values)
        
        # Method 2: Linear Regression
        if len(consumption_values) >= 7:
            X = np.array(range(len(consumption_values))).reshape(-1, 1)
            y = consumption_values
            
            model = LinearRegression()
            model.fit(X, y)
            
            # Predict next day
            next_day = np.array([[len(consumption_values)]])
            lr_prediction = model.predict(next_day)[0]
        else:
            lr_prediction = moving_avg_prediction
        
        # Combine predictions (weighted average)
        predicted_usage = (moving_avg_prediction * 0.6 + lr_prediction * 0.4)
        
        # Detect anomalies
        mean_consumption = np.mean(consumption_values)
        std_consumption = np.std(consumption_values)
        threshold = mean_consumption + (2 * std_consumption)
        
        alert = None
        if predicted_usage > threshold:
            alert = {
                'type': 'high_prediction',
                'message': f'Predicted consumption ({predicted_usage:.2f} kWh) is significantly higher than average ({mean_consumption:.2f} kWh)',
                'severity': 'warning'
            }
        
        # Check if recent consumption shows anomalous pattern
        if len(consumption_values) >= 3:
            recent_avg = np.mean(consumption_values[-3:])
            if recent_avg > threshold:
                alert = {
                    'type': 'recent_high_consumption',
                    'message': f'Recent 3-day average ({recent_avg:.2f} kWh) is unusually high',
                    'severity': 'alert'
                }
        
        return jsonify({
            'success': True,
            'predicted_usage': round(predicted_usage, 2),
            'prediction_method': 'Moving Average + Linear Regression',
            'confidence': 'moderate',
            'alert': alert,
            'statistics': {
                'mean': round(mean_consumption, 2),
                'std': round(std_consumption, 2),
                'min': round(np.min(consumption_values), 2),
                'max': round(np.max(consumption_values), 2)
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/analyze', methods=['POST'])
def analyze_patterns():
    """
    Analyze consumption patterns and provide insights
    """
    try:
        data = request.get_json()
        usage_data = data.get('usage_data', [])
        
        if len(usage_data) < 7:
            return jsonify({
                'error': 'Need at least 7 days of data for pattern analysis'
            }), 400
        
        consumption_values = np.array([float(item['consumption']) for item in usage_data])
        
        # Weekly pattern analysis
        weekly_avg = np.mean(consumption_values[-7:])
        overall_avg = np.mean(consumption_values)
        trend = 'increasing' if weekly_avg > overall_avg else 'decreasing'
        
        # Find peak consumption day
        peak_idx = np.argmax(consumption_values)
        peak_day = usage_data[peak_idx]
        
        # Calculate efficiency score (lower is better)
        efficiency_score = (weekly_avg / overall_avg) * 100 if overall_avg > 0 else 100
        
        insights = {
            'weekly_average': round(weekly_avg, 2),
            'overall_average': round(overall_avg, 2),
            'trend': trend,
            'peak_consumption': {
                'value': round(consumption_values[peak_idx], 2),
                'date': peak_day.get('timestamp', 'N/A')
            },
            'efficiency_score': round(efficiency_score, 2),
            'recommendations': []
        }
        
        # Generate recommendations
        if trend == 'increasing':
            insights['recommendations'].append('Your consumption is trending upward. Review recent appliance usage.')
        if efficiency_score > 110:
            insights['recommendations'].append('Recent consumption is higher than average. Consider energy-saving measures.')
        
        # Add maintenance suggestions
        insights['maintenance_suggestions'] = generate_maintenance_suggestions(usage_data)
        
        # Add long usage alerts
        insights['long_usage_alerts'] = detect_long_usage_patterns(usage_data)
        
        # Add user behavior analysis
        insights['user_behavior'] = analyze_user_behavior(usage_data)
        
        return jsonify({
            'success': True,
            'insights': insights
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Analysis failed: {str(e)}'
        }), 500

def generate_maintenance_suggestions(usage_data):
    """Generate maintenance suggestions based on usage patterns"""
    suggestions = []
    
    if len(usage_data) < 30:
        return suggestions
    
    # Analyze recent 30 days
    recent_data = usage_data[-30:]
    avg_consumption = np.mean([float(item['consumption']) for item in recent_data])
    
    # High consumption suggests maintenance needs
    if avg_consumption > 25:  # kWh per day
        suggestions.append({
            'type': 'high_consumption',
            'priority': 'high',
            'title': 'AC Filter Maintenance Due',
            'message': 'High energy consumption detected. Clean or replace AC filters to improve efficiency.',
            'due_date': '2024-11-15',
            'estimated_savings': '₹500-800/month'
        })
    
    if avg_consumption > 20:
        suggestions.append({
            'type': 'appliance_check',
            'priority': 'medium',
            'title': 'Refrigerator Coil Cleaning',
            'message': 'Clean refrigerator coils for optimal performance and energy savings.',
            'due_date': '2024-11-20',
            'estimated_savings': '₹200-400/month'
        })
    
    # Seasonal maintenance
    suggestions.append({
        'type': 'seasonal',
        'priority': 'low',
        'title': 'Water Heater Inspection',
        'message': 'Annual water heater maintenance recommended for winter season.',
        'due_date': '2024-12-01',
        'estimated_savings': '₹300-500/month'
    })
    
    return suggestions

def detect_long_usage_patterns(usage_data):
    """Detect unnecessarily long usage patterns"""
    alerts = []
    
    if len(usage_data) < 7:
        return alerts
    
    recent_week = usage_data[-7:]
    
    for day_data in recent_week:
        consumption = float(day_data['consumption'])
        
        # Detect high overnight consumption (unnecessary usage)
        if consumption > 15:  # High consumption suggesting devices left on
            alerts.append({
                'type': 'overnight_usage',
                'severity': 'warning',
                'title': 'High Overnight Consumption',
                'message': 'Devices may be running unnecessarily during night hours.',
                'date': day_data.get('timestamp', 'Recent'),
                'consumption': f'{consumption} kWh',
                'potential_waste': f'₹{int(consumption * 6)}'  # ₹6 per kWh
            })
    
    # Detect continuous high usage
    high_usage_days = sum(1 for day in recent_week if float(day['consumption']) > 20)
    if high_usage_days >= 5:
        alerts.append({
            'type': 'continuous_high_usage',
            'severity': 'critical',
            'title': 'Continuous High Energy Usage',
            'message': f'High consumption detected for {high_usage_days} days this week. Check for malfunctioning appliances.',
            'potential_waste': f'₹{int(high_usage_days * 100)}'
        })
    
    return alerts

def analyze_user_behavior(usage_data):
    """Analyze user behavior patterns"""
    if len(usage_data) < 14:
        return {'status': 'insufficient_data'}
    
    recent_data = usage_data[-14:]
    consumptions = [float(item['consumption']) for item in recent_data]
    
    # Calculate behavior metrics
    avg_consumption = np.mean(consumptions)
    consistency = 1 - (np.std(consumptions) / avg_consumption) if avg_consumption > 0 else 0
    
    # Determine user type
    if avg_consumption < 15:
        user_type = 'eco_conscious'
        behavior_score = 85 + (consistency * 15)
    elif avg_consumption < 25:
        user_type = 'moderate'
        behavior_score = 70 + (consistency * 20)
    else:
        user_type = 'high_consumer'
        behavior_score = 50 + (consistency * 30)
    
    # Calculate energy savings potential
    baseline_consumption = 22  # Average household consumption
    if avg_consumption < baseline_consumption:
        savings_this_month = (baseline_consumption - avg_consumption) * 30 * 6  # ₹6 per kWh
        total_savings = savings_this_month * 12  # Annual savings
    else:
        savings_this_month = 0
        total_savings = 0
    
    return {
        'user_type': user_type,
        'behavior_score': round(behavior_score, 1),
        'consistency_rating': round(consistency * 100, 1),
        'avg_daily_consumption': round(avg_consumption, 2),
        'savings_this_month': round(savings_this_month, 0),
        'annual_savings_potential': round(total_savings, 0),
        'rank_percentile': calculate_user_rank(behavior_score),
        'badges': generate_user_badges(user_type, behavior_score, consistency)
    }

def calculate_user_rank(behavior_score):
    """Calculate user rank percentile"""
    if behavior_score >= 90:
        return 95
    elif behavior_score >= 80:
        return 85
    elif behavior_score >= 70:
        return 70
    elif behavior_score >= 60:
        return 50
    else:
        return 25

def generate_user_badges(user_type, behavior_score, consistency):
    """Generate achievement badges for users"""
    badges = []
    
    if user_type == 'eco_conscious':
        badges.append({'name': 'Eco Warrior', 'icon': '🌱', 'description': 'Consistently low energy consumption'})
    
    if behavior_score >= 90:
        badges.append({'name': 'Energy Master', 'icon': '⚡', 'description': 'Excellent energy management'})
    elif behavior_score >= 80:
        badges.append({'name': 'Smart Saver', 'icon': '💡', 'description': 'Great energy efficiency'})
    
    if consistency >= 0.8:
        badges.append({'name': 'Consistent User', 'icon': '📊', 'description': 'Stable consumption patterns'})
    
    return badges

# Currency conversion endpoint
@app.route('/convert-currency', methods=['POST'])
def convert_currency():
    """Convert USD to INR for cost calculations"""
    try:
        data = request.get_json()
        usd_amount = float(data.get('amount', 0))
        
        # Use realistic Indian electricity rates from environment
        # If amount represents kWh, convert to INR cost
        if 'type' in data and data['type'] == 'kwh_to_cost':
            inr_amount = usd_amount * ELECTRICITY_RATE_PER_KWH
        else:
            # Direct currency conversion (legacy support)
            inr_amount = usd_amount * USD_TO_INR_RATE
        
        return jsonify({
            'success': True,
            'usd_amount': usd_amount,
            'inr_amount': round(inr_amount, 2),
            'exchange_rate': USD_TO_INR_RATE,
            'formatted_inr': f'₹{inr_amount:,.2f}'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Currency conversion failed: {str(e)}'
        }), 500

# Leaderboard data endpoint
@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get leaderboard data for energy savings"""
    try:
        # Mock leaderboard data (in production, fetch from database)
        leaderboard_data = [
            {'rank': 1, 'username': 'EcoWarrior2024', 'savings': 15420, 'score': 95, 'badge': '🏆'},
            {'rank': 2, 'username': 'GreenEnergy', 'savings': 12850, 'score': 92, 'badge': '🥈'},
            {'rank': 3, 'username': 'PowerSaver', 'savings': 11200, 'score': 89, 'badge': '🥉'},
            {'rank': 4, 'username': 'SmartHome', 'savings': 9800, 'score': 85, 'badge': '⭐'},
            {'rank': 5, 'username': 'EcoFriend', 'savings': 8900, 'score': 82, 'badge': '⭐'},
            {'rank': 6, 'username': 'CleanEnergy', 'savings': 7600, 'score': 78, 'badge': '💡'},
            {'rank': 7, 'username': 'GreenLiving', 'savings': 6800, 'score': 75, 'badge': '💡'},
            {'rank': 8, 'username': 'EcoSaver', 'savings': 5900, 'score': 71, 'badge': '🌱'},
            {'rank': 9, 'username': 'SmartSaver', 'savings': 5200, 'score': 68, 'badge': '🌱'},
            {'rank': 10, 'username': 'PowerWise', 'savings': 4500, 'score': 65, 'badge': '🌱'}
        ]
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard_data,
            'total_users': 1247,
            'your_rank': 156,
            'your_savings': 3200
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Leaderboard fetch failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', '5002'))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('DEBUG', 'True').lower() == 'true'
    print(f'🤖 Starting ML Prediction Service on {host}:{port}...')
    app.run(debug=debug, host=host, port=port)
