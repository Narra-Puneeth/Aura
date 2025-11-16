// Fitbit API service
// Use proxy server to avoid CORS issues
const FITBIT_API_BASE = 'http://localhost:3001/api/fitbit/1/user/-';
const FITBIT_SLEEP_API_BASE = 'http://localhost:3001/api/fitbit/1.2/user/-';

// Get access token from environment or localStorage
export const getStoredAccessToken = () => {
  // Check localStorage first
  const stored = localStorage.getItem('fitbit_access_token');
  if (stored) return stored;
  
  // Check environment variable (VITE_FITBIT_ACCESS_KEY from .env)
  const envToken = import.meta.env.VITE_FITBIT_ACCESS_KEY;
  if (envToken) {
    // Remove quotes if present
    return envToken.replace(/^"(.*)"$/, '$1');
  }
  
  return null;
};

// Helper to get date in yyyy-mm-dd format
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get today's date
export const getToday = () => formatDate(new Date());

// Get date from days ago
export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

// Get start of current week (Monday)
export const getWeekStart = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  date.setDate(diff);
  return formatDate(date);
};

// Fitbit API calls
export const fitbitAPI = {
  // Heart Rate - Intraday Time Series
  // GET https://api.fitbit.com/1/user/-/activities/heart/date/[date]/1d/[detail-level].json
  getHeartRateByDate: async (date, accessToken) => {
    try {
      const response = await fetch(
        `${FITBIT_API_BASE}/activities/heart/date/${date}/1d/1min.json`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store to localStorage
      localStorage.setItem('fitbit-heart-one', JSON.stringify({
        data: data,
        date: date,
        timestamp: new Date().toISOString()
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching heart rate data:', error);
      throw error;
    }
  },

  // Heart Rate - Date Range
  // GET https://api.fitbit.com/1/user/-/activities/heart/date/[base-date]/[end-date].json
  getHeartRateRange: async (startDate, endDate, accessToken) => {
    try {
      const response = await fetch(
        `${FITBIT_API_BASE}/activities/heart/date/${startDate}/${endDate}.json`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store to localStorage
      localStorage.setItem('fitbit-heart-week', JSON.stringify({
        data: data,
        startDate: startDate,
        endDate: endDate,
        timestamp: new Date().toISOString()
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching heart rate range:', error);
      throw error;
    }
  },

  // Sleep Log by Date
  // GET https://api.fitbit.com/1.2/user/-/sleep/date/[date].json
  getSleepByDate: async (date, accessToken) => {
    try {
      const response = await fetch(
        `${FITBIT_SLEEP_API_BASE}/sleep/date/${date}.json`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store to localStorage
      localStorage.setItem('fitbit-sleep-one', JSON.stringify({
        data: data,
        date: date,
        timestamp: new Date().toISOString()
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      throw error;
    }
  },

  // Sleep Log by Date Range
  // GET https://api.fitbit.com/1.2/user/-/sleep/date/[startDate]/[endDate].json
  getSleepRange: async (startDate, endDate, accessToken) => {
    try {
      const response = await fetch(
        `${FITBIT_SLEEP_API_BASE}/sleep/date/${startDate}/${endDate}.json`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store to localStorage
      localStorage.setItem('fitbit-sleep-week', JSON.stringify({
        data: data,
        startDate: startDate,
        endDate: endDate,
        timestamp: new Date().toISOString()
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching sleep range:', error);
      throw error;
    }
  },

  // Daily Activity Summary
  // GET https://api.fitbit.com/1/user/-/activities/date/[date].json
  getActivityByDate: async (date, accessToken) => {
    try {
      const response = await fetch(
        `${FITBIT_API_BASE}/activities/date/${date}.json`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store to localStorage
      localStorage.setItem('fitbit-activity-one', JSON.stringify({
        data: data,
        date: date,
        timestamp: new Date().toISOString()
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching activity data:', error);
      throw error;
    }
  },

  // Activity Time Series by Date Range
  // GET https://api.fitbit.com/1/user/-/activities/[resource-path]/date/[base-date]/[end-date].json
  // Resource paths: steps, distance, floors, calories, activityCalories
  getActivityRange: async (resource, startDate, endDate, accessToken) => {
    try {
      const response = await fetch(
        `${FITBIT_API_BASE}/activities/${resource}/date/${startDate}/${endDate}.json`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store to localStorage
      localStorage.setItem(`fitbit-activity-${resource}-week`, JSON.stringify({
        data: data,
        resource: resource,
        startDate: startDate,
        endDate: endDate,
        timestamp: new Date().toISOString()
      }));
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${resource} data:`, error);
      throw error;
    }
  },

  // Get multiple activity metrics
  getActivityMetrics: async (startDate, endDate, accessToken) => {
    const metrics = ['steps', 'distance', 'calories', 'activityCalories'];
    try {
      const promises = metrics.map(metric => 
        fitbitAPI.getActivityRange(metric, startDate, endDate, accessToken)
      );
      const results = await Promise.all(promises);
      const metricsData = {
        steps: results[0],
        distance: results[1],
        calories: results[2],
        activityCalories: results[3]
      };
      
      // Store to localStorage
      localStorage.setItem('fitbit-activity-metrics-week', JSON.stringify({
        data: metricsData,
        startDate: startDate,
        endDate: endDate,
        timestamp: new Date().toISOString()
      }));
      
      return metricsData;
    } catch (error) {
      console.error('Error fetching activity metrics:', error);
      throw error;
    }
  }
};
