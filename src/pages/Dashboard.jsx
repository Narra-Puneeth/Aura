import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';
import HeartRateCard from '../components/HeartRateCard';
import SleepCard from '../components/SleepCard';
import ActivityCard from '../components/ActivityCard';
import { fitbitAPI, getToday, getDaysAgo, getWeekStart, formatDate, getStoredAccessToken } from '../services/fitbitService';

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
      if (timeRange === 'today') {
        // Load from localStorage for daily data
        const heartRateStorage = localStorage.getItem('fitbit-heart-one');
        const sleepStorage = localStorage.getItem('fitbit-sleep-one');
        const activityStorage = localStorage.getItem('fitbit-activity-one');

        if (heartRateStorage) {
          const heartRateData = JSON.parse(heartRateStorage);
          setHeartRateData(heartRateData.data);
        }

        if (sleepStorage) {
          const sleepData = JSON.parse(sleepStorage);
          setSleepData(sleepData.data);
        }

        if (activityStorage) {
          const activityData = JSON.parse(activityStorage);
          setActivityData(activityData.data);
        }

        // If no data in localStorage, fetch from API
        if (!heartRateStorage || !sleepStorage || !activityStorage) {
          const today = getToday();
          const promises = [];
          
          if (!heartRateStorage) {
            promises.push(fitbitAPI.getHeartRateByDate(today).then(data => setHeartRateData(data)));
          }
          if (!sleepStorage) {
            promises.push(fitbitAPI.getSleepByDate(today).then(data => setSleepData(data)));
          }
          if (!activityStorage) {
            promises.push(fitbitAPI.getActivityByDate(today).then(data => setActivityData(data)));
          }
          
          await Promise.all(promises);
        }
      } else {
        // Load from localStorage for weekly data
        const heartRateStorage = localStorage.getItem('fitbit-heart-week');
        const sleepStorage = localStorage.getItem('fitbit-sleep-week');
        const activityStorage = localStorage.getItem('fitbit-activity-metrics-week');

        if (heartRateStorage) {
          const heartRateData = JSON.parse(heartRateStorage);
          setHeartRateData(heartRateData.data);
        }

        if (sleepStorage) {
          const sleepData = JSON.parse(sleepStorage);
          setSleepData(sleepData.data);
        }

        if (activityStorage) {
          const activityData = JSON.parse(activityStorage);
          setActivityData(activityData.data);
        }

        // If no data in localStorage, fetch from API
        if (!heartRateStorage || !sleepStorage || !activityStorage) {
          const today = getToday();
          const weekStart = getWeekStart();
          const promises = [];
          
          if (!heartRateStorage) {
            promises.push(fitbitAPI.getHeartRateRange(weekStart, today).then(data => setHeartRateData(data)));
          }
          if (!sleepStorage) {
            promises.push(fitbitAPI.getSleepRange(weekStart, today).then(data => setSleepData(data)));
          }
          if (!activityStorage) {
            promises.push(fitbitAPI.getActivityMetrics(weekStart, today).then(data => setActivityData(data)));
          }
          
          await Promise.all(promises);
        }
      }
    } catch (error) {
      console.error('Error loading Fitbit data:', error);
      // alert(`Failed to load Fitbit data: ${error.message}. Please check the proxy server is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Manual sync function to fetch fresh data from API
  const syncFitbitData = async () => {
    setLoading(true);

    try {
      const today = getToday();
      const weekStart = getWeekStart();
      
      if (timeRange === 'today') {
        const [heartRate, sleep, activity] = await Promise.all([
          fitbitAPI.getHeartRateByDate(today),
          fitbitAPI.getSleepByDate(today),
          fitbitAPI.getActivityByDate(today)
        ]);
        setHeartRateData(heartRate);
        setSleepData(sleep);
        setActivityData(activity);
      } else {
        const [heartRate, sleep, activityMetrics] = await Promise.all([
          fitbitAPI.getHeartRateRange(weekStart, today),
          fitbitAPI.getSleepRange(weekStart, today),
          fitbitAPI.getActivityMetrics(weekStart, today)
        ]);
        setHeartRateData(heartRate);
        setSleepData(sleep);
        setActivityData(activityMetrics);
      }
      
      alert('Fitbit data synced successfully!');
    } catch (error) {
      console.error('Error syncing Fitbit data:', error);
      // alert(`Failed to sync Fitbit data: ${error.message}. Please check the proxy server is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Summary stats for header cards
  const getHeartRateStats = () => {
    if (!heartRateData?.['activities-heart']?.[0]?.value) return null;
    const hrValue = heartRateData['activities-heart'][0].value;
    return {
      resting: hrValue.restingHeartRate || 0
    };
  };

  const getSleepStats = () => {
    if (!sleepData?.summary) return null;
    return {
      totalMinutes: sleepData.summary.totalMinutesAsleep || 0,
      efficiency: sleepData.sleep?.[0]?.efficiency || 0
    };
  };

  const getActivityStats = () => {
    if (!activityData?.summary) return null;
    const totalDistance = activityData.summary.distances?.[0]?.distance || 0;
    return {
      steps: activityData.summary.steps || 0,
      calories: activityData.summary.caloriesOut || 0,
      distance: totalDistance * 1000, // Convert km to meters
      activeMinutes: (activityData.summary.veryActiveMinutes || 0) + (activityData.summary.fairlyActiveMinutes || 0)
    };
  };

  const heartRateStats = getHeartRateStats();
  const sleepStats = getSleepStats();
  const activityStats = getActivityStats();

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Welcome back, <span className="gradient-text">{user?.name || 'Friend'}</span>
                </h1>
                <p className="text-xl text-gray-400">Your health & wellness dashboard</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={syncFitbitData}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sync Fitbit Data"
                >
                  <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sync Data
                </button>
                <button
                  onClick={() => navigate('/playground')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Component Playground
                </button>
              </div>
            </div>
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
                      <div className="text-sm text-green-400 mt-1">{activityStats.distance.toFixed(0)} m</div>
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

              {/* Health Data Components */}
              <div className="space-y-8">
                {/* Heart Rate Section */}
                <HeartRateCard heartRateData={heartRateData} timeRange={timeRange} />

                {/* Sleep Section */}
                <SleepCard sleepData={sleepData} />

                {/* Activity Section */}
                <ActivityCard activityData={activityData} timeRange={timeRange} />
              </div>
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
