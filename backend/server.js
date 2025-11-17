import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  credentials: true
}));

// Log incoming request origins
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url} from origin: ${req.headers.origin || 'no-origin'}`);
  next();
});

app.use(express.json());

// Get access token from environment
const getAccessToken = () => {
  const token = process.env.VITE_FITBIT_ACCESS_KEY;
  if (token) {
    // Remove quotes if present
    return token.replace(/^"(.*)"$/, '$1');
  }
  return null;
};

// Proxy endpoint for Fitbit API - catch all paths after /api/fitbit
app.use('/api/fitbit', async (req, res) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token configured' });
  }

  // Remove /api/fitbit prefix and build the Fitbit API URL
  const fitbitPath = req.url.substring(1); // Remove leading /
  const fitbitUrl = `https://api.fitbit.com/${fitbitPath}`;
  
  console.log(`Proxying request to: ${fitbitUrl}`);

  try {
    const response = await fetch(fitbitUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Accept-Language': 'en_US'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Fitbit API Error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ 
        error: `Fitbit API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched data from Fitbit API`);
    console.log(`📊 Response data: ${JSON.stringify(data, null, 2)}`);
    res.json(data);
  } catch (error) {
    console.error(`❌ Proxy error: ${error.message}`);
    res.status(500).json({ 
      error: 'Proxy server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Fitbit proxy server is running',
    hasToken: !!getAccessToken()
  });
});

// New sharing endpoints for direct Fitbit API access
// Heart Rate endpoint (for date range)
app.get('/api/fitbit-share/heart/:startDate/:endDate', async (req, res) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token configured' });
  }

  const { startDate, endDate } = req.params;
  const fitbitUrl = `https://api.fitbit.com/1/user/-/activities/heart/date/${startDate}/${endDate}.json`;
  
  console.log(`[SHARE] Fetching heart rate data: ${fitbitUrl}`);

  try {
    const response = await fetch(fitbitUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Accept-Language': 'en_US'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [SHARE] Heart Rate Error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ 
        error: `Fitbit API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`✅ [SHARE] Successfully fetched heart rate data`);
    res.json(data);
  } catch (error) {
    console.error(`❌ [SHARE] Heart Rate error: ${error.message}`);
    res.status(500).json({ 
      error: 'Proxy server error',
      message: error.message 
    });
  }
});

// Activity Time Series endpoint
app.get('/api/fitbit-share/activities/:resource/:startDate/:endDate', async (req, res) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token configured' });
  }

  const { resource, startDate, endDate } = req.params;
  const fitbitUrl = `https://api.fitbit.com/1/user/-/activities/${resource}/date/${startDate}/${endDate}.json`;
  
  console.log(`[SHARE] Fetching activity data: ${fitbitUrl}`);

  try {
    const response = await fetch(fitbitUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Accept-Language': 'en_US'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [SHARE] Activity Error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ 
        error: `Fitbit API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`✅ [SHARE] Successfully fetched activity data`);
    res.json(data);
  } catch (error) {
    console.error(`❌ [SHARE] Activity error: ${error.message}`);
    res.status(500).json({ 
      error: 'Proxy server error',
      message: error.message 
    });
  }
});

// Sleep Log endpoint
app.get('/api/fitbit-share/sleep/:startDate/:endDate', async (req, res) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token configured' });
  }

  const { startDate, endDate } = req.params;
  const fitbitUrl = `https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`;
  
  console.log(`[SHARE] Fetching sleep data: ${fitbitUrl}`);

  try {
    const response = await fetch(fitbitUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Accept-Language': 'en_US'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [SHARE] Sleep Error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ 
        error: `Fitbit API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`✅ [SHARE] Successfully fetched sleep data`);
    res.json(data);
  } catch (error) {
    console.error(`❌ [SHARE] Sleep error: ${error.message}`);
    res.status(500).json({ 
      error: 'Proxy server error',
      message: error.message 
    });
  }
});

// Nutrition & Recipe search endpoint
app.post('/api/nutrition', async (req, res) => {
  const { ingredients = '', goals = '', diet = '' } = req.body || {};

  try {
    const aiKey = process.env.VITE_GOOGLE_AI_API_KEY;
    const tavilyKey = process.env.TAVILY_API_KEY;

    if (!aiKey || !tavilyKey) {
      return res.status(500).json({ error: 'Missing API keys for Google GenAI or Tavily' });
    }

    // 1) Use Gemini to generate up to 5 dish suggestions from the provided ingredients
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `Given the following ingredients: ${ingredients}.\nList up to 5 possible dishes or recipes that can be made using these ingredients. Return only a short numbered list of dish names, one per line.`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // aiResponse.text contains the generated text in the browser usage; handle both shapes
    const dishesText = aiResponse?.text || (aiResponse?.response && aiResponse.response?.text) || '';
    const dishNames = (dishesText || '')
      .split('\n')
      .map(line => line.replace(/^\d+\.?\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 5);

  // 2) Perform a single Tavily web search (single call) using the ingredients to fetch recipes/nutrition
    const { tavily } = await import('@tavily/core');
    const client = tavily({ apiKey: tavilyKey });

    // make a single query that should return multiple recipe results
    const query = `${ingredients} recipes ${diet ? ` ${diet}` : ''} ${goals ? ` ${goals}` : ''}`.trim();

    const searchOptions = {
      includeAnswer: 'advanced',
      includeImages: true,
      includeImageDescriptions: true,
      includeRawContent: 'markdown'
    };

    const searchResult = await client.search(query, searchOptions);
    // If Gemini didn't suggest dishes, fall back to top Tavily result titles
    if (!dishNames || dishNames.length === 0) {
      const titles = (searchResult.results || []).slice(0,5).map(r => r.title).filter(Boolean);
      if (titles.length > 0) dishNames = titles;
    }

    // 3) Use Gemini to estimate nutritional values for each suggested dish
    let nutrition = [];
    try {
  const nutritionPrompt = `You are a nutrition assistant. Provide estimated per-serving nutrition values for the following dishes as a JSON array. Return ONLY valid JSON (no surrounding text). The JSON must be an array of objects where each object has the exact keys: name (string), serving (string, e.g. "1 serving"), calories_kcal (number), protein_g (number), carbs_g (number), fat_g (number), fiber_g (number), sodium_mg (number). Use reasonable rounded estimates based on typical recipes and typical serving sizes. If a value is unknown, provide null. Ensure numeric fields are numbers (not strings). Example output:
[
  {"name":"Banana Oatmeal","serving":"1 cup","calories_kcal":320,"protein_g":8,"carbs_g":56,"fat_g":6,"fiber_g":6,"sodium_mg":150}
]
Dishes: ${dishNames.join(', ')}.`;

      const nutritionResp = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: nutritionPrompt,
      });

      const nutritionText = nutritionResp?.text || (nutritionResp?.response && nutritionResp.response?.text) || '';
      // Try to parse JSON from model output
      const tryParse = (txt) => {
        if (!txt) return null;
        // Find first [ and last ] to extract array JSON
        const start = txt.indexOf('[');
        const end = txt.lastIndexOf(']');
        const jsonStr = start !== -1 && end !== -1 ? txt.slice(start, end + 1) : txt;
        try {
          return JSON.parse(jsonStr);
        } catch (e) {
          return null;
        }
      };

      const parsed = tryParse(nutritionText);
      if (parsed && Array.isArray(parsed)) {
        // Normalize parsed entries and ensure required keys exist
        const normalized = parsed.map(item => ({
          name: item.name || null,
          serving: item.serving || (item.servings || '1 serving'),
          calories_kcal: typeof item.calories_kcal === 'number' ? item.calories_kcal : (typeof item.calories === 'number' ? item.calories : null),
          protein_g: typeof item.protein_g === 'number' ? item.protein_g : (typeof item.protein === 'number' ? item.protein : null),
          carbs_g: typeof item.carbs_g === 'number' ? item.carbs_g : (typeof item.carbs === 'number' ? item.carbs : null),
          fat_g: typeof item.fat_g === 'number' ? item.fat_g : (typeof item.fat === 'number' ? item.fat : null),
          fiber_g: typeof item.fiber_g === 'number' ? item.fiber_g : null,
          sodium_mg: typeof item.sodium_mg === 'number' ? item.sodium_mg : null
        }));

        // If the model returned entries that match dish names, use them. Otherwise, map by index to dishNames.
        const byName = {};
        normalized.forEach(n => { if (n.name) byName[n.name.toLowerCase()] = n; });

        nutrition = dishNames.map((name, idx) => {
          const key = name.toLowerCase();
          if (byName[key]) return Object.assign({ name }, byName[key]);
          const item = normalized[idx];
          if (item && item.name) return Object.assign({ name }, item);
          // fallback per-dish defaults
          return {
            name,
            serving: '1 serving',
            calories_kcal: 250,
            protein_g: 8,
            carbs_g: 35,
            fat_g: 7,
            fiber_g: 4,
            sodium_mg: 150
          };
        });
      } else {
        // fallback: generate simple estimates per dish (very rough)
        nutrition = dishNames.map(name => ({
          name,
          serving: '1 serving',
          calories_kcal: 250,
          protein_g: 8,
          carbs_g: 35,
          fat_g: 7,
          fiber_g: 4,
          sodium_mg: 150
        }));
      }
    } catch (err) {
      console.warn(`⚠️ Nutrition generation failed: ${err.message}`);
      nutrition = dishNames.map(name => ({
        name,
        calories_kcal: 250,
        protein_g: 8,
        carbs_g: 35,
        fat_g: 7,
        fiber_g: 4,
        sodium_mg: 150
      }));
    }

    // Return combined result: AI dishes + tavily raw search response + nutrition estimates
    return res.json({
      dishes: dishNames,
      tavily: searchResult,
      nutrition
    });
  } catch (err) {
    console.error(`❌ Nutrition endpoint error: ${err.message}`);
    console.error(err);
    return res.status(500).json({ error: 'Nutrition endpoint error', message: err.message });
  }
});

// Meal analysis endpoint using Gemini AI
app.post('/api/analyze-meal', async (req, res) => {
  const { meal } = req.body;

  if (!meal) {
    return res.status(400).json({ error: 'Meal description is required' });
  }

  try {
    const aiKey = process.env.VITE_GOOGLE_AI_API_KEY;

    if (!aiKey) {
      return res.status(500).json({ error: 'Missing API key for Google GenAI' });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: aiKey });

    const prompt = `Analyze this meal and provide nutritional estimates in JSON format: "${meal}"

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "calories": <number>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "fat": <number in grams>
}

Be as accurate as possible based on typical serving sizes.`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = aiResponse?.text || (aiResponse?.response && aiResponse.response?.text) || '';
    
    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }

    const nutrition = JSON.parse(jsonText);

    console.log(`✅ [MEAL] Analyzed: "${meal}" -> ${JSON.stringify(nutrition)}`);
    res.json({ nutrition });
  } catch (error) {
    console.error(`❌ [MEAL] Analysis error: ${error.message}`);
    console.error(error);
    res.status(500).json({ 
      error: 'Failed to analyze meal',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Fitbit proxy server running on http://localhost:${PORT}`);
  console.log(`✅ CORS policy: Allow all origins (*)`);
  console.log(`✅ CORS enabled for frontend`);
  console.log(`🔑 Access token configured: ${getAccessToken() ? 'Yes' : 'No'}`);
  console.log('='.repeat(60));
});
