import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create log file with timestamp
const logFile = path.join(logsDir, `fitbit-proxy-${new Date().toISOString().split('T')[0]}.log`);

// Helper function to write logs
const writeLog = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(message); // Also log to console
};

const app = express();
const PORT = 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

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
  
  writeLog(`Proxying request to: ${fitbitUrl}`);

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
      writeLog(`❌ Fitbit API Error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ 
        error: `Fitbit API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    writeLog(`✅ Successfully fetched data from Fitbit API`);
    writeLog(`📊 Response data: ${JSON.stringify(data, null, 2)}`);
    res.json(data);
  } catch (error) {
    writeLog(`❌ Proxy error: ${error.message}`);
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
      writeLog(`⚠️ Nutrition generation failed: ${err.message}`);
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
    writeLog(`❌ Nutrition endpoint error: ${err.message}`);
    console.error(err);
    return res.status(500).json({ error: 'Nutrition endpoint error', message: err.message });
  }
});

app.listen(PORT, () => {
  writeLog('='.repeat(60));
  writeLog(`🚀 Fitbit proxy server running on http://localhost:${PORT}`);
  writeLog(`✅ CORS enabled for frontend`);
  writeLog(`🔑 Access token configured: ${getAccessToken() ? 'Yes' : 'No'}`);
  writeLog(`📁 Logs being written to: ${logFile}`);
  writeLog('='.repeat(60));
});
