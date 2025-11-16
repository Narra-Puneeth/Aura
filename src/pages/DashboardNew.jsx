import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';
import { fitbitAPI, mockFitbitData, getToday, getDaysAgo, getWeekStart, formatDate } from '../services/fitbitService';

const useAuth = () => ({ user: { name: 'Friend' } });

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [timeRange, setTimeRange] = useState('today'); // 'today' or 'week'
  const [loading, setLoading] = useState(false);
  const [heartRateData, setHeartRateData] = useState(null);
  const [sleepData, setSleepData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // For now, use mock data. Replace with actual API calls when token is available
  useEffect(() => {
    loadFitbitData();
  }, [timeRange]);

  const loadFitbitData = async () => {
    setLoading(true);
    try {
      // If you have an access token, use real API
      if (accessToken) {
        const today = getToday();
        const weekStart = getWeekStart();
        
        if (timeRange === 'today') {
          const [heartRate, sleep, activity] = await Promise.all([
            fitbitAPI.getHeartRateByDate(today, accessToken),
            fitbitAPI.getSleepByDate(today, accessToken),
            fitbitAPI.getActivityByDate(today, accessToken)
          ]);
          setHeartRateData(heartRate);
          setSleepData(sleep);
          setActivityData(activity);
        } else {
          const [heartRate, sleep, activityMetrics] = await Promise.all([
            fitbitAPI.getHeartRateRange(weekStart, today, accessToken),
            fitbitAPI.getSleepRange(weekStart, today, accessToken),
            fitbitAPI.getActivityMetrics(weekStart, today, accessToken)
          ]);
          setHeartRateData(heartRate);
          setSleepData(sleep);
          setActivityData(activityMetrics);
        }
      } else {
        // Use mock data
        setHeartRateData(mockFitbitData.heartRate);
        setSleepData(mockFitbitData.sleep);
        setActivityData(mockFitbitData.activity);
      }
    } catch (error) {
      console.error('Error loading Fitbit data:', error);
      // Fallback to mock data
      setHeartRateData(mockFitbitData.heartRate);
      setSleepData(mockFitbitData.sleep);
      setActivityData(mockFitbitData.activity);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const getHeartRateChartData = () => {
    if (!heartRateData) return [];
    
    // Check if we have intraday data
    const intradayData = heartRateData['activities-heart-intraday'];
    if (intradayData && intradayData.dataset) {
      // Sample data points to avoid too many points
      const dataset = intradayData.dataset;
      const sampleRate = Math.ceil(dataset.length / 50); // Show ~50 points
      return dataset.filter((_, index) => index % sampleRate === 0).map(item => ({
        time: item.time.substring(0, 5), // HH:MM
        bpm: item.value
      }));
    }
    
    // Otherwise use daily data
    const dailyData = heartRateData['activities-heart'];
    if (dailyData && dailyData.length > 0) {
      return dailyData.map(day => ({
        date: day.dateTime,
        restingHR: day.value.restingHeartRate || 0
      }));
    }
    
    return [];
  };

  const getSleepChartData = () => {
    if (!sleepData || !sleepData.sleep) return [];
    
    return sleepData.sleep.map(sleep => ({
      date: sleep.dateOfSleep,
      deep: sleep.levels?.summary?.deep?.minutes || 0,
      light: sleep.levels?.summary?.light?.minutes || 0,
      rem: sleep.levels?.summary?.rem?.minutes || 0,
      wake: sleep.levels?.summary?.wake?.minutes || 0,
      total: sleep.minutesAsleep || 0
    }));
  };

  const getActivityChartData = () => {
    if (!activityData) return [];
    
    if (timeRange === 'today') {
      const summary = activityData.summary;
      return [
        { name: 'Steps', value: summary?.steps || 0 },
        { name: 'Calories', value: summary?.calories || 0 },
        { name: 'Distance (km)', value: (summary?.distance || 0) },
        { name: 'Active Min', value: summary?.activeMinutes || 0 }
      ];
    } else {
      // Weekly data - combine metrics
      if (activityData.steps && activityData.steps['activities-steps']) {
        return activityData.steps['activities-steps'].map((item, index) => ({
          date: item.dateTime,
          steps: parseInt(item.value) || 0,
          calories: parseInt(activityData.calories?.['activities-calories']?.[index]?.value || 0),
          distance: parseFloat(activityData.distance?.['activities-distance']?.[index]?.value || 0)
        }));
      }
    }
    
    return [];
  };

  // Summary stats
  const getHeartRateStats = () => {
    if (!heartRateData?.['activities-heart']?.[0]?.value) return null;
    const hrValue = heartRateData['activities-heart'][0].value;
    return {
      resting: hrValue.restingHeartRate || 0,
      zones: hrValue.heartRateZones || []
    };
  };

  const getSleepStats = () => {
    if (!sleepData?.summary) return null;
    return {
      totalMinutes: sleepData.summary.totalMinutesAsleep || 0,
      efficiency: sleepData.sleep?.[0]?.efficiency || 0,
      deep: sleepData.sleep?.[0]?.levels?.summary?.deep?.minutes || 0,
      light: sleepData.sleep?.[0]?.levels?.summary?.light?.minutes || 0,
      rem: sleepData.sleep?.[0]?.levels?.summary?.rem?.minutes || 0
    };
  };

  const getActivityStats = () => {
    if (!activityData?.summary) return null;
    return {
      steps: activityData.summary.steps || 0,
      calories: activityData.summary.calories || 0,
      distance: activityData.summary.distance || 0,
      activeMinutes: activityData.summary.activeMinutes || 0
    };
  };

  const heartRateChartData = getHeartRateChartData();
  const sleepChartData = getSleepChartData();
  const activityChartData = getActivityChartData();
  const heartRateStats = getHeartRateStats();
  const sleepStats = getSleepStats();
  const activityStats = getActivityStats();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm border border-white/20 p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome back, <span className="gradient-text">{user?.name || 'Friend'}</span>
            </h1>
            <p className="text-xl text-gray-400">Your health & wellness dashboard</p>
          </header>

          {/* Time Range Toggle */}
          <div className="mb-8 flex justify-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 inline-flex gap-2">
              <button
                onClick={() => setTimeRange('today')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  timeRange === 'today'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Today's Analysis
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  timeRange === 'week'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Current Week
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Heart Rate Stat */}
                {heartRateStats && (
                  <Card className="p-6 group relative overflow-hidden hover:scale-105 transition-transform">
                    <div className="absolute -top-1 -left-1 w-2/3 h-2/3 bg-gradient-to-br from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">Resting HR</h3>
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-4xl font-bold text-white">{heartRateStats.resting}</span>
                      <span className="text-gray-400 text-sm ml-2">bpm</span>
                    </div>
                  </Card>
                )}

                {/* Sleep Stat */}
                {sleepStats && (
                  <Card className="p-6 group relative overflow-hidden hover:scale-105 transition-transform">
                    <div className="absolute -top-1 -right-1 w-2/3 h-2/3 bg-gradient-to-bl from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">Sleep</h3>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-4xl font-bold text-white">{Math.floor(sleepStats.totalMinutes / 60)}h</span>
                      <span className="text-gray-400 text-sm ml-2">{sleepStats.totalMinutes % 60}m</span>
                      <div className="text-sm text-blue-400 mt-1">{sleepStats.efficiency}% efficiency</div>
                    </div>
                  </Card>
                )}

                {/* Steps Stat */}
                {activityStats && (
                  <Card className="p-6 group relative overflow-hidden hover:scale-105 transition-transform">
                    <div className="absolute -top-1 -left-1 w-2/3 h-2/3 bg-gradient-to-br from-green-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">Steps</h3>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-4xl font-bold text-white">{activityStats.steps.toLocaleString()}</span>
                      <div className="text-sm text-green-400 mt-1">{activityStats.distance.toFixed(1)} km</div>
                    </div>
                  </Card>
                )}

                {/* Calories Stat */}
                {activityStats && (
                  <Card className="p-6 group relative overflow-hidden hover:scale-105 transition-transform">
                    <div className="absolute -top-1 -right-1 w-2/3 h-2/3 bg-gradient-to-bl from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">Calories</h3>
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-4xl font-bold text-white">{activityStats.calories.toLocaleString()}</span>
                      <div className="text-sm text-orange-400 mt-1">{activityStats.activeMinutes} active min</div>
                    </div>
                  </Card>
                )}
              </section>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Heart Rate Chart */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Heart Rate
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateChartData}>
                        <defs>
                          <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis 
                          dataKey={timeRange === 'today' ? 'time' : 'date'} 
                          stroke="rgba(255, 255, 255, 0.5)"
                          tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                        />
                        <YAxis 
                          stroke="rgba(255, 255, 255, 0.5)"
                          tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey={timeRange === 'today' ? 'bpm' : 'restingHR'} 
                          stroke="#ef4444" 
                          fill="url(#heartGradient)"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Sleep Chart */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Sleep Stages
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sleepChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="rgba(255, 255, 255, 0.5)"
                          tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                        />
                        <YAxis 
                          stroke="rgba(255, 255, 255, 0.5)"
                          tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                          label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.7)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color: '#fff' }} />
                        <Bar dataKey="deep" stackId="a" fill="#8b5cf6" name="Deep" />
                        <Bar dataKey="light" stackId="a" fill="#3b82f6" name="Light" />
                        <Bar dataKey="rem" stackId="a" fill="#f59e0b" name="REM" />
                        <Bar dataKey="wake" stackId="a" fill="#ef4444" name="Wake" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Activity Chart */}
                <Card className="p-6 lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Activity
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {timeRange === 'today' ? (
                        <BarChart data={activityChartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis type="number" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                          <YAxis dataKey="name" type="category" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      ) : (
                        <LineChart data={activityChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                          <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ color: '#fff' }} />
                          <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={3} name="Steps" />
                          <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={3} name="Calories" />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Heart Rate Zones */}
              {heartRateStats?.zones && (
                <section className="mb-12">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Heart Rate Zones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {heartRateStats.zones.map((zone, index) => {
                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                        return (
                          <div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border-l-4"
                            style={{ borderLeftColor: colors[index] }}
                          >
                            <h3 className="text-white font-bold mb-1">{zone.name}</h3>
                            <p className="text-gray-400 text-sm mb-2">{zone.min} - {zone.max} bpm</p>
                            <p className="text-2xl font-bold text-white">{zone.minutes} <span className="text-sm text-gray-400">min</span></p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </section>
              )}

              {/* Sleep Details */}
              {sleepStats && (
                <section className="mb-12">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Sleep Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🌊</div>
                        <p className="text-3xl font-bold text-white">{sleepStats.deep}m</p>
                        <p className="text-gray-400 text-sm">Deep Sleep</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl mb-2">💫</div>
                        <p className="text-3xl font-bold text-white">{sleepStats.light}m</p>
                        <p className="text-gray-400 text-sm">Light Sleep</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl mb-2">✨</div>
                        <p className="text-3xl font-bold text-white">{sleepStats.rem}m</p>
                        <p className="text-gray-400 text-sm">REM Sleep</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-3xl font-bold text-white">{sleepStats.efficiency}%</p>
                        <p className="text-gray-400 text-sm">Efficiency</p>
                      </div>
                    </div>
                  </Card>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      
      <style jsx global>{`
        :root { 
          --aura-purple: #8B5CF6; 
          --aura-pink: #EC4899; 
        }
        .gradient-text {
          background: -webkit-linear-gradient(45deg, var(--aura-purple), var(--aura-pink));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </GridBackground>
  );
};

export default Dashboard;
