import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import Card from '../components/Card';

const HealthAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [fitbitData, setFitbitData] = useState(null);

  useEffect(() => {
    // Load Fitbit data from localStorage
    loadFitbitData();
  }, []);

  const loadFitbitData = () => {
    try {
      const data = {
        heartRate: {
          daily: JSON.parse(localStorage.getItem('fitbit-heart-one') || 'null'),
          weekly: JSON.parse(localStorage.getItem('fitbit-heart-week') || 'null'),
        },
        sleep: {
          daily: JSON.parse(localStorage.getItem('fitbit-sleep-one') || 'null'),
          weekly: JSON.parse(localStorage.getItem('fitbit-sleep-week') || 'null'),
        },
        activity: {
          daily: JSON.parse(localStorage.getItem('fitbit-activity-one') || 'null'),
          steps: JSON.parse(localStorage.getItem('fitbit-activity-steps-week') || 'null'),
          calories: JSON.parse(localStorage.getItem('fitbit-activity-calories-week') || 'null'),
          distance: JSON.parse(localStorage.getItem('fitbit-activity-distance-week') || 'null'),
          metrics: JSON.parse(localStorage.getItem('fitbit-activity-metrics-week') || 'null'),
        }
      };
      setFitbitData(data);
    } catch (err) {
      console.error('Error loading Fitbit data:', err);
      setError('Failed to load health data from storage');
    }
  };

 const generateHealthPrompt = () => {
  if (!fitbitData) return null;

  const prompt = `You are a professional health and wellness AI coach. 
Use the following data to generate a short, clear, and helpful health summary for a general user. 
Your goal is to highlight what's going well, what needs improvement, and provide evidence-based, actionable advice in simple language.

**Heart Rate Data:**
${fitbitData.heartRate.daily ? `
- Resting Heart Rate: ${fitbitData.heartRate.daily.data?.['activities-heart']?.[0]?.value?.restingHeartRate || 'N/A'} bpm
- Heart Rate Zones: ${JSON.stringify(fitbitData.heartRate.daily.data?.['activities-heart']?.[0]?.value?.heartRateZones || [])}
` : 'No daily heart rate data available'}
${fitbitData.heartRate.weekly ? `
- Weekly Heart Rate Trend: Available
- HRV Indicators: Use variability to assess stress and recovery
` : ''}

**Sleep Data:**
${fitbitData.sleep.daily ? `
- Total Sleep Duration: ${fitbitData.sleep.daily.data?.summary?.totalMinutesAsleep || 'N/A'} minutes
- Sleep Efficiency: ${fitbitData.sleep.daily.data?.summary?.efficiency || 'N/A'}%
- Sleep Stages: ${JSON.stringify(fitbitData.sleep.daily.data?.summary?.stages || {})}
- Restlessness: ${fitbitData.sleep.daily.data?.summary?.restlessCount || 'N/A'} times
` : 'No daily sleep data available'}
${fitbitData.sleep.weekly ? `
- Weekly Sleep Pattern: Available for trend analysis
` : ''}

**Activity Data:**
${fitbitData.activity.daily ? `
- Steps: ${fitbitData.activity.daily.data?.summary?.steps || 'N/A'}
- Calories Burned: ${fitbitData.activity.daily.data?.summary?.caloriesOut || 'N/A'}
- Active Minutes: ${fitbitData.activity.daily.data?.summary?.veryActiveMinutes || 0} very active, ${fitbitData.activity.daily.data?.summary?.fairlyActiveMinutes || 0} fairly active
- Sedentary Minutes: ${fitbitData.activity.daily.data?.summary?.sedentaryMinutes || 'N/A'}
- Distance: ${fitbitData.activity.daily.data?.summary?.distances?.[0]?.distance || 'N/A'} km
` : 'No daily activity data available'}
${fitbitData.activity.metrics ? `
- Weekly Activity Trends: Available
- VO2 Max Estimation: Based on activity intensity and heart rate data
` : ''}

**Task:**
Create a concise, motivational health summary with reasoning behind each point. Use the structure below:

💪 **What You’re Doing Well:**
- Highlight 2–3 positive habits or metrics and explain briefly *why* they are beneficial for long-term health.

⚠️ **What Can Be Improved:**
- Identify 2–3 areas needing improvement (e.g., low deep sleep, low activity, elevated resting HR) and give short, science-backed reasons.

🧭 **Recommendations:**
- Give 3–4 practical, easy-to-follow steps (e.g., “Take short walks after meals,” “Maintain consistent sleep schedule”).

🩺 **Summary Insight:**
- 1–2 lines summarizing the overall health balance and direction of progress (e.g., “Good cardiovascular fitness, but recovery could improve with better sleep”).

Tone: Friendly, supportive, and evidence-based. Keep it under 200 words.`;

  return prompt;
};


  const runHealthAssessment = async () => {
    setLoading(true);
    setError(null);
    setAssessment(null);

    try {
      // Check if Fitbit data exists
      if (!fitbitData || (!fitbitData.heartRate.daily && !fitbitData.sleep.daily && !fitbitData.activity.daily)) {
        throw new Error('No health data available. Please sync your Fitbit data first from the Dashboard.');
      }

      // Initialize Google Generative AI
      const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new Error('Google AI API key not found. Please set VITE_GOOGLE_AI_API_KEY in your environment variables.');
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = generateHealthPrompt();
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });
      
      const text = response.text;

      setAssessment(text);
    } catch (err) {
      console.error('Error generating health assessment:', err);
      setError(err.message || 'Failed to generate health assessment');
    } finally {
      setLoading(false);
    }
  };

  const hasData = fitbitData && (
    fitbitData.heartRate.daily || 
    fitbitData.sleep.daily || 
    fitbitData.activity.daily
  );

  return (
    <div className="min-h-screen bg-aura-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">
              AI Health Assessment
            </h1>
            <p className="text-gray-400 text-lg">
              Comprehensive mental health analysis powered by AI using your Fitbit health data
            </p>
          </div>

          {/* Data Status Card */}
          <Card className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Available Health Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${fitbitData?.heartRate.daily ? 'bg-aura-green/20 border border-aura-green' : 'bg-gray-800 border border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Heart Rate</p>
                    <p className={`text-lg font-semibold ${fitbitData?.heartRate.daily ? 'text-aura-green' : 'text-gray-500'}`}>
                      {fitbitData?.heartRate.daily ? '✓ Available' : '✗ No Data'}
                    </p>
                  </div>
                  <span className="text-3xl">❤️</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${fitbitData?.sleep.daily ? 'bg-aura-purple/20 border border-aura-purple' : 'bg-gray-800 border border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Sleep Data</p>
                    <p className={`text-lg font-semibold ${fitbitData?.sleep.daily ? 'text-aura-purple' : 'text-gray-500'}`}>
                      {fitbitData?.sleep.daily ? '✓ Available' : '✗ No Data'}
                    </p>
                  </div>
                  <span className="text-3xl">😴</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${fitbitData?.activity.daily ? 'bg-aura-blue/20 border border-aura-blue' : 'bg-gray-800 border border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Activity Data</p>
                    <p className={`text-lg font-semibold ${fitbitData?.activity.daily ? 'text-aura-blue' : 'text-gray-500'}`}>
                      {fitbitData?.activity.daily ? '✓ Available' : '✗ No Data'}
                    </p>
                  </div>
                  <span className="text-3xl">🏃</span>
                </div>
              </div>
            </div>

            {!hasData && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-500 text-sm">
                  ⚠️ No health data found. Please visit the Dashboard and sync your Fitbit data first.
                </p>
              </div>
            )}
          </Card>

          {/* Assessment Button */}
          <div className="text-center mb-8">
            <button
              onClick={runHealthAssessment}
              disabled={loading || !hasData}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                loading || !hasData
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-aura-purple via-aura-pink to-aura-blue text-white hover:scale-105 hover:shadow-2xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Your Health Data...
                </span>
              ) : (
                '🔍 Run AI Health Assessment'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="mb-8 bg-red-500/10 border-red-500/50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="text-red-500 font-semibold mb-2">Error</h3>
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Assessment Results */}
          {assessment && (
            <Card className="bg-aura-gray border-aura-purple/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🧠</span>
                <h2 className="text-2xl font-semibold gradient-text">Your Health Assessment</h2>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {assessment.split('\n').map((line, index) => {
                    // Bold headers (lines starting with **)
                    if (line.includes('**')) {
                      return (
                        <p key={index} className="font-bold text-white mt-4 mb-2">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    // Bullet points
                    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                      return (
                        <p key={index} className="ml-4 mb-1">
                          {line}
                        </p>
                      );
                    }
                    // Regular lines
                    return line.trim() ? (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ) : (
                      <br key={index} />
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-500 text-center">
                  💡 This assessment is AI-generated and should not replace professional medical advice.
                  If you have serious health concerns, please consult a healthcare provider.
                </p>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="text-center py-12">
              <Loading />
              <p className="text-gray-400 mt-4">
                Analyzing your health metrics with AI...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This may take 10-30 seconds
              </p>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HealthAssessment;
