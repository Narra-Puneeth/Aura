import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from './Card';

const SleepCard = ({ sleepData, timeRange = 'today' }) => {
  console.log('SleepCard - timeRange:', timeRange);
  console.log('SleepCard - sleepData:', sleepData);

  // Process sleep timeline data for TODAY view (4-line timeline)
  const getSleepTimelineData = () => {
    if (!sleepData?.sleep?.[0]?.levels?.data) return null;
    
    const mainSleep = sleepData.sleep.find(s => s.isMainSleep) || sleepData.sleep[0];
    const segments = mainSleep.levels.data;
    const startTime = new Date(mainSleep.startTime);
    const endTime = new Date(mainSleep.endTime);
    const totalDuration = (endTime - startTime) / 1000; // in seconds

    // Group segments by sleep stage
    const stageSegments = {
      wake: [],
      rem: [],
      light: [],
      deep: []
    };

    segments.forEach(segment => {
      const segmentStart = new Date(segment.dateTime);
      const offsetSeconds = (segmentStart - startTime) / 1000;
      const widthPercent = (segment.seconds / totalDuration) * 100;
      const leftPercent = (offsetSeconds / totalDuration) * 100;

      if (stageSegments[segment.level]) {
        stageSegments[segment.level].push({
          left: leftPercent,
          width: widthPercent,
          duration: segment.seconds,
          time: segmentStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    return {
      startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      totalHours: (totalDuration / 3600).toFixed(1),
      stages: stageSegments,
      efficiency: mainSleep.efficiency,
      summary: mainSleep.levels.summary
    };
  };

  // Process sleep data for WEEK view (stacked bar chart)
  const getSleepChartData = () => {
    if (!sleepData || !sleepData.sleep) return [];
    
    return sleepData.sleep.map(sleep => {
      const date = new Date(sleep.dateOfSleep);
      return {
        date: sleep.dateOfSleep,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        deep: sleep.levels?.summary?.deep?.minutes || 0,
        light: sleep.levels?.summary?.light?.minutes || 0,
        rem: sleep.levels?.summary?.rem?.minutes || 0,
        wake: sleep.levels?.summary?.wake?.minutes || 0,
        total: sleep.minutesAsleep || 0,
        efficiency: sleep.efficiency || 0
      };
    });
  };

  // Get sleep stats
  const getSleepStats = () => {
    if (!sleepData?.sleep?.[0]) return null;
    const mainSleep = sleepData.sleep.find(s => s.isMainSleep) || sleepData.sleep[0];
    return {
      totalMinutes: mainSleep.minutesAsleep || 0,
      efficiency: mainSleep.efficiency || 0,
      deep: mainSleep.levels?.summary?.deep?.minutes || 0,
      light: mainSleep.levels?.summary?.light?.minutes || 0,
      rem: mainSleep.levels?.summary?.rem?.minutes || 0,
      wake: mainSleep.levels?.summary?.wake?.minutes || 0
    };
  };

  const timelineData = timeRange === 'today' ? getSleepTimelineData() : null;
  const chartData = timeRange === 'week' ? getSleepChartData() : [];
  const stats = getSleepStats();

  // Custom Tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value} min
            </p>
          ))}
          <p className="text-gray-400 text-sm mt-2 pt-2 border-t border-gray-700">
            Total: {total} min ({(total / 60).toFixed(1)}h)
          </p>
        </div>
      );
    }
    return null;
  };

  // Format minutes to hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Sleep Chart or Timeline */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Sleep {timeRange === 'today' ? '- Today' : '- This Week'}
        </h2>

        {timeRange === 'today' && timelineData ? (
          // TODAY VIEW - 4-line timeline
          <div className="space-y-6">
            {/* Timeline header with start/end time */}
            <div className="flex justify-between items-center text-sm font-semibold text-gray-400 px-2">
              <span className="bg-gray-800 px-3 py-1 rounded-lg">{timelineData.startTime}</span>
              <span className="text-gray-500">— {timelineData.totalHours}h total —</span>
              <span className="bg-gray-800 px-3 py-1 rounded-lg">{timelineData.endTime}</span>
            </div>

            {/* 4 Stage Timelines */}
            <div className="space-y-6 bg-gray-900/30 rounded-xl p-6 pl-32">
              {/* Wake Stage */}
              <div className="relative">
                <div className="absolute -left-28 top-1/2 -translate-y-1/2 w-24 text-right">
                  <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Wake</span>
                </div>
                <div className="relative h-12 bg-gray-800/50 rounded-full">
                  {/* Dashed baseline */}
                  <div className="absolute inset-0 border-b-2 border-dashed border-gray-700/50 top-1/2"></div>
                  {/* Wake segments */}
                  {timelineData.stages.wake.map((segment, idx) => (
                    <div
                      key={idx}
                      className="absolute h-10 top-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-red-400/30"
                      style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
                      title={`${segment.time} - ${Math.round(segment.duration / 60)} min`}
                    >
                      {segment.width > 5 && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {Math.round(segment.duration / 60)}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* REM Stage */}
              <div className="relative">
                <div className="absolute -left-28 top-1/2 -translate-y-1/2 w-24 text-right">
                  <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">REM</span>
                </div>
                <div className="relative h-12 bg-gray-800/50 rounded-full">
                  <div className="absolute inset-0 border-b-2 border-dashed border-gray-700/50 top-1/2"></div>
                  {timelineData.stages.rem.map((segment, idx) => (
                    <div
                      key={idx}
                      className="absolute h-10 top-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-amber-400/30"
                      style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
                      title={`${segment.time} - ${Math.round(segment.duration / 60)} min`}
                    >
                      {segment.width > 5 && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {Math.round(segment.duration / 60)}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Light Stage */}
              <div className="relative">
                <div className="absolute -left-28 top-1/2 -translate-y-1/2 w-24 text-right">
                  <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Light</span>
                </div>
                <div className="relative h-12 bg-gray-800/50 rounded-full">
                  <div className="absolute inset-0 border-b-2 border-dashed border-gray-700/50 top-1/2"></div>
                  {timelineData.stages.light.map((segment, idx) => (
                    <div
                      key={idx}
                      className="absolute h-10 top-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-blue-400/30"
                      style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
                      title={`${segment.time} - ${Math.round(segment.duration / 60)} min`}
                    >
                      {segment.width > 5 && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {Math.round(segment.duration / 60)}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Stage */}
              <div className="relative">
                <div className="absolute -left-28 top-1/2 -translate-y-1/2 w-24 text-right">
                  <span className="text-purple-400 font-bold text-sm uppercase tracking-wider">Deep</span>
                </div>
                <div className="relative h-12 bg-gray-800/50 rounded-full">
                  <div className="absolute inset-0 border-b-2 border-dashed border-gray-700/50 top-1/2"></div>
                  {timelineData.stages.deep.map((segment, idx) => (
                    <div
                      key={idx}
                      className="absolute h-10 top-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-purple-400/30"
                      style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
                      title={`${segment.time} - ${Math.round(segment.duration / 60)} min`}
                    >
                      {segment.width > 5 && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {Math.round(segment.duration / 60)}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md border-2 border-red-400/30"></div>
                <span className="text-gray-300 text-sm font-medium">Wake</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-md border-2 border-amber-400/30"></div>
                <span className="text-gray-300 text-sm font-medium">REM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md border-2 border-blue-400/30"></div>
                <span className="text-gray-300 text-sm font-medium">Light</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md border-2 border-purple-400/30"></div>
                <span className="text-gray-300 text-sm font-medium">Deep</span>
              </div>
            </div>
          </div>
        ) : timeRange === 'week' && chartData.length > 0 ? (
          // WEEK VIEW - Stacked bar chart
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
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
                  label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.7)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="deep" stackId="a" fill="#8b5cf6" name="Deep" radius={[0, 0, 0, 0]} />
                <Bar dataKey="light" stackId="a" fill="#3b82f6" name="Light" radius={[0, 0, 0, 0]} />
                <Bar dataKey="rem" stackId="a" fill="#f59e0b" name="REM" radius={[0, 0, 0, 0]} />
                <Bar dataKey="wake" stackId="a" fill="#ef4444" name="Wake" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No sleep data available</p>
            </div>
          </div>
        )}
      </Card>

      {/* Sleep Summary */}
      {stats && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sleep Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
              <div className="text-purple-400 text-sm mb-1">Deep Sleep</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{stats.deep}</span>
                <span className="text-gray-400 text-sm">min</span>
              </div>
              <div className="text-purple-300 text-xs mt-1">💤 Restorative</div>
            </div>

            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
              <div className="text-blue-400 text-sm mb-1">Light Sleep</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{stats.light}</span>
                <span className="text-gray-400 text-sm">min</span>
              </div>
              <div className="text-blue-300 text-xs mt-1">😌 Restful</div>
            </div>

            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
              <div className="text-orange-400 text-sm mb-1">REM Sleep</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{stats.rem}</span>
                <span className="text-gray-400 text-sm">min</span>
              </div>
              <div className="text-orange-300 text-xs mt-1">🧠 Dreaming</div>
            </div>

            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
              <div className="text-red-400 text-sm mb-1">Awake</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{stats.wake}</span>
                <span className="text-gray-400 text-sm">min</span>
              </div>
              <div className="text-red-300 text-xs mt-1">👀 Restless</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div>
              <div className="text-gray-400 text-sm mb-1">Sleep Efficiency</div>
              <div className="text-3xl font-bold text-white">{stats.efficiency}%</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-1">Total Sleep</div>
              <div className="text-3xl font-bold text-white">
                {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SleepCard;
