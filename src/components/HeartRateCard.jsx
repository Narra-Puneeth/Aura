import React from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from './Card';

const HeartRateCard = ({ heartRateData, timeRange }) => {
  // Process heart rate data for chart
  const getHeartRateChartData = () => {
    if (!heartRateData) return [];
    
    if (timeRange === 'today') {
      // For one day - use intraday data for LINE CHART
      const intradayData = heartRateData['activities-heart-intraday'];
      
      if (intradayData && intradayData.dataset && intradayData.dataset.length > 0) {
        // Sample data points to avoid too many points (show ~50-100 points)
        const dataset = intradayData.dataset;
        const sampleRate = Math.max(1, Math.ceil(dataset.length / 80));
        
        return dataset
          .filter((_, index) => index % sampleRate === 0)
          .map(item => ({
            time: item.time.substring(0, 5), // HH:MM format
            bpm: item.value,
            displayTime: item.time.substring(0, 5)
          }));
      }
    } else {
      // For week - use daily data for BAR CHART
      const dailyData = heartRateData['activities-heart'];
      
      if (dailyData && dailyData.length > 0) {
        return dailyData.map(day => {
          const date = new Date(day.dateTime);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          // Calculate average HR from zones (weighted by minutes)
          const zones = day.value.heartRateZones || [];
          let totalMinutes = 0;
          let weightedSum = 0;
          
          zones.forEach(zone => {
            if (zone.minutes > 0) {
              const avgZoneHR = (zone.min + zone.max) / 2;
              weightedSum += avgZoneHR * zone.minutes;
              totalMinutes += zone.minutes;
            }
          });
          
          const avgHR = totalMinutes > 0 ? Math.round(weightedSum / totalMinutes) : 0;
          const restingHR = day.value.restingHeartRate || null;
          
          return {
            date: day.dateTime,
            dayName,
            displayDate: monthDay,
            avgHR,
            restingHR,
            calories: Math.round(zones.reduce((sum, z) => sum + (z.caloriesOut || 0), 0))
          };
        });
      }
    }
    
    return [];
  };

  // Get heart rate stats
  const getHeartRateStats = () => {
  if (!heartRateData?.['activities-heart']?.length) return null;
  const hrValue = heartRateData['activities-heart'].slice(-1)[0].value; // latest day
  return {
    resting: hrValue.restingHeartRate || 0,
    zones: hrValue.heartRateZones || []
  };
};


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value} {entry.name.includes('HR') || entry.name.includes('bpm') ? 'bpm' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = getHeartRateChartData();
  const stats = getHeartRateStats();

  console.log('HeartRateCard - timeRange:', timeRange);
  console.log('HeartRateCard - chartData:', chartData);

  return (
    <div className="space-y-6">
      {/* Heart Rate Chart */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          Heart Rate {timeRange === 'today' ? '- Today' : '- This Week'}
        </h2>
        
        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No heart rate data available</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {timeRange === 'today' ? (
                // LINE CHART for one day (intraday data)
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255, 255, 255, 0.5)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.5)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                    label={{ value: 'BPM', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.7)' }}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                    name="Heart Rate"
                    activeDot={{ r: 6, fill: '#ef4444' }}
                  />
                </LineChart>
              ) : (
                // BAR CHART for week (daily data)
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="dayName"
                    stroke="rgba(255, 255, 255, 0.5)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.5)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                    label={{ value: 'BPM', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.7)' }}
                    domain={[0, 'dataMax + 20']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Bar 
                    dataKey="avgHR" 
                    fill="#ef4444" 
                    name="Avg Heart Rate"
                    radius={[8, 8, 0, 0]}
                  />
                  {chartData.some(d => d.restingHR) && (
                    <Bar 
                      dataKey="restingHR" 
                      fill="#3b82f6" 
                      name="Resting HR"
                      radius={[8, 8, 0, 0]}
                    />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Heart Rate Zones */}
      {stats && stats.zones && stats.zones.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Heart Rate Zones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.zones.map((zone, index) => {
              const zoneColors = {
                'Out of Range': 'from-blue-500 to-blue-600',
                'Fat Burn': 'from-green-500 to-green-600',
                'Cardio': 'from-orange-500 to-orange-600',
                'Peak': 'from-red-500 to-red-600'
              };
              const gradientClass = zoneColors[zone.name] || 'from-gray-500 to-gray-600';

              return (
                <div 
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${gradientClass} mb-3`}></div>
                  <div className="text-white font-semibold mb-1">{zone.name}</div>
                  <div className="text-gray-400 text-sm mb-2">{zone.min} - {zone.max} bpm</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{zone.minutes}</span>
                    <span className="text-gray-400 text-sm">min</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {Math.round(zone.caloriesOut || 0)} cal
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HeartRateCard;
