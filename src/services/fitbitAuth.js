// Fitbit OAuth Configuration and Helper Functions
// Reference: https://dev.fitbit.com/build/reference/web-api/developer-guide/authorization/

const FITBIT_CONFIG = {
  clientId: 'YOUR_CLIENT_ID', // Get from https://dev.fitbit.com/apps
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'http://localhost:5173/callback', // Update for your app
  authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
  tokenUri: 'https://api.fitbit.com/oauth2/token',
  
  // Scopes needed for dashboard
  scopes: [
    'activity',      // Activity data (steps, calories, distance)
    'heartrate',     // Heart rate data
    'sleep',         // Sleep data
    'profile',       // User profile
  ].join(' ')
};

/**
 * Generate OAuth authorization URL
 * User should be redirected to this URL to authorize the app
 */
export const getAuthorizationUrl = () => {
  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(7);
  sessionStorage.setItem('oauth_state', state);

  // PKCE: Generate code verifier and challenge (recommended)
  const codeVerifier = generateCodeVerifier();
  sessionStorage.setItem('code_verifier', codeVerifier);
  
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: FITBIT_CONFIG.clientId,
    response_type: 'code',
    scope: FITBIT_CONFIG.scopes,
    redirect_uri: FITBIT_CONFIG.redirectUri,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  return `${FITBIT_CONFIG.authorizationUri}?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 * Call this in your callback route after user authorizes
 */
export const exchangeCodeForToken = async (code) => {
  const codeVerifier = sessionStorage.getItem('code_verifier');
  
  const params = new URLSearchParams({
    client_id: FITBIT_CONFIG.clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: FITBIT_CONFIG.redirectUri,
    code_verifier: codeVerifier
  });

  const response = await fetch(FITBIT_CONFIG.tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${FITBIT_CONFIG.clientId}:${FITBIT_CONFIG.clientSecret}`)
    },
    body: params.toString()
  });

  const data = await response.json();
  
  if (data.access_token) {
    // Store tokens securely
    storeTokens(data);
    return data;
  } else {
    throw new Error('Failed to get access token');
  }
};

/**
 * Refresh access token
 * Access tokens expire after 8 hours
 */
export const refreshAccessToken = async (refreshToken) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  const response = await fetch(FITBIT_CONFIG.tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${FITBIT_CONFIG.clientId}:${FITBIT_CONFIG.clientSecret}`)
    },
    body: params.toString()
  });

  const data = await response.json();
  
  if (data.access_token) {
    storeTokens(data);
    return data;
  } else {
    throw new Error('Failed to refresh token');
  }
};

/**
 * Store tokens securely
 * In production, consider using httpOnly cookies or secure storage
 */
const storeTokens = (tokenData) => {
  const tokens = {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: Date.now() + (tokenData.expires_in * 1000),
    userId: tokenData.user_id
  };
  
  // For development - use localStorage
  localStorage.setItem('fitbit_tokens', JSON.stringify(tokens));
  
  // For production - consider more secure options:
  // - Store in httpOnly cookies via backend
  // - Use secure session storage
  // - Encrypt tokens before storing
};

/**
 * Get stored access token
 * Automatically refreshes if expired
 */
export const getAccessToken = async () => {
  const stored = localStorage.getItem('fitbit_tokens');
  if (!stored) return null;
  
  const tokens = JSON.parse(stored);
  
  // Check if token is expired (with 5 min buffer)
  if (Date.now() > tokens.expiresAt - (5 * 60 * 1000)) {
    // Token expired or about to expire, refresh it
    try {
      const newTokens = await refreshAccessToken(tokens.refreshToken);
      return newTokens.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear invalid tokens and redirect to login
      clearTokens();
      return null;
    }
  }
  
  return tokens.accessToken;
};

/**
 * Clear stored tokens (logout)
 */
export const clearTokens = () => {
  localStorage.removeItem('fitbit_tokens');
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('code_verifier');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const stored = localStorage.getItem('fitbit_tokens');
  return stored !== null;
};

// PKCE Helper Functions

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  return crypto.subtle.digest('SHA-256', data)
    .then(hash => base64URLEncode(new Uint8Array(hash)));
}

function base64URLEncode(buffer) {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Example Usage:

/*
// 1. In your Login/Connect Fitbit button component:

import { getAuthorizationUrl } from '../services/fitbitAuth';

const ConnectFitbitButton = () => {
  const handleConnect = () => {
    const authUrl = getAuthorizationUrl();
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleConnect}>
      Connect Fitbit
    </button>
  );
};

// 2. Create a callback route to handle OAuth redirect:

import { exchangeCodeForToken } from '../services/fitbitAuth';

const FitbitCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    // Verify state matches (CSRF protection)
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      console.error('State mismatch - possible CSRF attack');
      return;
    }
    
    if (code) {
      exchangeCodeForToken(code)
        .then(() => {
          // Redirect to dashboard
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('OAuth error:', error);
        });
    }
  }, []);

  return <div>Connecting to Fitbit...</div>;
};

// 3. In your Dashboard, use the token:

import { getAccessToken } from '../services/fitbitAuth';
import { fitbitAPI } from '../services/fitbitService';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = await getAccessToken();
      if (token) {
        const heartRate = await fitbitAPI.getHeartRateByDate(getToday(), token);
        setData(heartRate);
      }
    };
    loadData();
  }, []);

  // ... rest of component
};

// 4. Add logout functionality:

import { clearTokens } from '../services/fitbitAuth';

const LogoutButton = () => {
  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Disconnect Fitbit</button>;
};
*/
