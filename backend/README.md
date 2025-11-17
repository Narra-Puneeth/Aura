# Aura Backend - Vercel Deployment

This is the backend server for the Aura VR Therapy application, configured for deployment on Vercel.

## Features

- Fitbit API proxy endpoints
- Nutrition and meal analysis using Google Gemini AI
- Recipe search using Tavily API
- CORS enabled for all origins
- No file logging (console only)

## Environment Variables

Create a `.env` file based on `.env.example` and add your API keys:

```
VITE_FITBIT_ACCESS_KEY=your_fitbit_access_token
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## Local Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:3001

## Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variables in Vercel dashboard

## API Endpoints

- `GET /health` - Health check
- `GET /api/fitbit/*` - Fitbit API proxy
- `GET /api/fitbit-share/heart/:startDate/:endDate` - Heart rate data
- `GET /api/fitbit-share/activities/:resource/:startDate/:endDate` - Activity data
- `GET /api/fitbit-share/sleep/:startDate/:endDate` - Sleep data
- `POST /api/nutrition` - Nutrition and recipe search
- `POST /api/analyze-meal` - Meal analysis

## Changes from Root Server

1. **CORS**: Set to allow all origins (`origin: '*'`)
2. **Logging**: Removed file logging, console output only
3. **Configuration**: Optimized for Vercel serverless deployment
