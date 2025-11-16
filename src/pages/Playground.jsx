import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';
import HeartRateCard from '../components/HeartRateCard';
import SleepCard from '../components/SleepCard';
import ActivityCard from '../components/ActivityCard';
import { fitbitAPI, getToday, getWeekStart } from '../services/fitbitService';

const Playground = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('heart'); // 'heart', 'sleep', 'activity'
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [heartRateData, setHeartRateData] = useState(null);
  const [sleepData, setSleepData] = useState(null);
  const [activityData, setActivityData] = useState(null);

  // Load data when component or timeRange changes
  useEffect(() => {
    loadComponentData();
  }, [activeComponent, timeRange]);

  const loadComponentData = async () => {
    setLoading(true);
    try {
      const today = getToday();
      const weekStart = getWeekStart();

      if (activeComponent === 'heart') {
        if (timeRange === 'today') {
          const data = await fitbitAPI.getHeartRateByDate(today);
          setHeartRateData(data);
        } else {
          const data = await fitbitAPI.getHeartRateRange(weekStart, today);
          setHeartRateData(data);
        }
      } else if (activeComponent === 'sleep') {
        if (timeRange === 'today') {
          const data = await fitbitAPI.getSleepByDate(today);
          setSleepData(data);
        } else {
          const data = await fitbitAPI.getSleepRange(weekStart, today);
          setSleepData(data);
        }
      } else if (activeComponent === 'activity') {
        if (timeRange === 'today') {
          const data = await fitbitAPI.getActivityByDate(today);
          setActivityData(data);
        } else {
          const data = await fitbitAPI.getActivityMetrics(weekStart, today);
          setActivityData(data);
        }
      }
    } catch (error) {
      console.error(`Error loading ${activeComponent} data:`, error);
      alert(`Failed to load ${activeComponent} data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const components = [
    { id: 'heart', name: 'Heart Rate', icon: '❤️', color: 'from-red-500 to-pink-500' },
    { id: 'sleep', name: 'Sleep', icon: '😴', color: 'from-blue-500 to-indigo-500' },
    { id: 'activity', name: 'Activity', icon: '🏃', color: 'from-green-500 to-teal-500' }
  ];

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
                  Component <span className="gradient-text">Playground</span>
                </h1>
                <p className="text-xl text-gray-400">Test individual components with live data</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl border border-gray-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </header>

          {/* Component Selector */}
          <div className="mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Select Component</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {components.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => setActiveComponent(comp.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      activeComponent === comp.id
                        ? `border-transparent bg-gradient-to-r ${comp.color} shadow-lg scale-105`
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">{comp.icon}</div>
                    <div className="text-xl font-bold text-white">{comp.name}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

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
                Today's Data
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  timeRange === 'week'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Weekly Data
              </button>
            </div>
          </div>

          {/* Component Display */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-white text-lg">Loading {activeComponent} data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Component Info Card */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {components.find(c => c.id === activeComponent)?.name} Component
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Testing with {timeRange === 'today' ? "today's" : 'weekly'} data from Fitbit API
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span>Live Data</span>
                      </div>
                      <div className="text-gray-500">|</div>
                      <div className="text-gray-400">
                        Component: <code className="text-purple-400">{activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}Card.jsx</code>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={loadComponentData}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </button>
                </div>
              </Card>

              {/* Render Active Component */}
              {activeComponent === 'heart' && heartRateData && (
                <HeartRateCard heartRateData={heartRateData} timeRange={timeRange} />
              )}

              {activeComponent === 'sleep' && sleepData && (
                <SleepCard sleepData={sleepData} timeRange={timeRange} />
              )}

              {activeComponent === 'activity' && activityData && (
                <ActivityCard activityData={activityData} timeRange={timeRange} />
              )}

              {/* Debug Info */}
              <Card className="p-6 bg-gray-900/50">
                <details className="cursor-pointer">
                  <summary className="text-lg font-bold text-white mb-2 hover:text-purple-400 transition-colors">
                    🔍 Debug: View Raw Data
                  </summary>
                  <div className="mt-4 bg-black/50 rounded-lg p-4 overflow-auto max-h-96">
                    <pre className="text-xs text-green-400">
                      {activeComponent === 'heart' && JSON.stringify(heartRateData, null, 2)}
                      {activeComponent === 'sleep' && JSON.stringify(sleepData, null, 2)}
                      {activeComponent === 'activity' && JSON.stringify(activityData, null, 2)}
                    </pre>
                  </div>
                </details>
              </Card>
            </div>
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
          background-clip: text;
        }
      `}</style>
    </GridBackground>
  );
};

export default Playground;
