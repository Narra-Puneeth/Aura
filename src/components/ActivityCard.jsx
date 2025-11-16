import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from './Card';

const ActivityCard = ({ activityData, timeRange }) => {
  // Process activity data for chart
  const getActivityChartData = () => {
    if (!activityData) return [];
    
    if (timeRange === 'today') {
      const summary = activityData.summary;
      return [
        { name: 'Steps', value: summary?.steps || 0 },
        { name: 'Calories', value: summary?.caloriesOut || 0 },
        { name: 'Distance (m)', value: parseFloat((summary?.distances?.[0]?.distance || 0) * 1000).toFixed(0) },
        { name: 'Active Min', value: (summary?.veryActiveMinutes || 0) + (summary?.fairlyActiveMinutes || 0) }
      ];
    } else {
      // Weekly data - combine metrics
      if (activityData.steps && activityData.steps['activities-steps']) {
        return activityData.steps['activities-steps'].map((item, index) => ({
          date: item.dateTime,
          steps: parseInt(item.value) || 0,
          calories: parseInt(activityData.calories?.['activities-calories']?.[index]?.value || 0),
          distance: parseFloat(activityData.distance?.['activities-distance']?.[index]?.value || 0) * 1000 // Convert km to meters
        }));
      }
    }
    
    return [];
  };

  // Get activity stats
  const getActivityStats = () => {
    if (!activityData?.summary) return null;
    const totalDistance = activityData.summary.distances?.[0]?.distance || 0;
    return {
      steps: activityData.summary.steps || 0,
      calories: activityData.summary.caloriesOut || 0,
      distance: totalDistance * 1000, // Convert km to meters
      activeMinutes: (activityData.summary.veryActiveMinutes || 0) + (activityData.summary.fairlyActiveMinutes || 0),
      floors: activityData.summary.floors || 0
    };
  };

  const chartData = getActivityChartData();
  const stats = getActivityStats();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Activity Chart */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Activity
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {timeRange === 'today' ? (
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  type="number"
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Steps"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Calories"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Stats */}
      {stats && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-green-400 text-sm">Steps</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.steps.toLocaleString()}</div>
            </div>

            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <span className="text-orange-400 text-sm">Calories</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.calories.toLocaleString()}</div>
            </div>

            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-blue-400 text-sm">Distance</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.distance.toFixed(0)}</div>
              <div className="text-blue-300 text-xs mt-1">meters</div>
            </div>

            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-purple-400 text-sm">Active Min</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.activeMinutes}</div>
            </div>

            <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/30">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-teal-400 text-sm">Floors</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.floors}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActivityCard;
