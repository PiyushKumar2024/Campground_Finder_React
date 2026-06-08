import { GoogleGenAI } from '@google/genai';
import catchAsync from '../helper/catchAsync.js';

// Get AI Insights for Trip Planner
export const getTripInsights = catchAsync(async (req, res) => {
    const { origin, stops } = req.body;

    if (!stops || stops.length === 0) {
        return res.status(400).json({ message: 'No stops provided for trip planning' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: 'Gemini API key is missing' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Construct the prompt
    let prompt = `I'm planning a camping road trip.\n`;
    
    if (origin) {
        prompt += `I am starting my trip from: ${origin.name}.\n`;
    }
    
    prompt += `My campground stops in order are:\n`;
    stops.forEach((stop, index) => {
        prompt += ` ${index + 1}. ${stop.name} (${stop.location})\n`;
    });

    prompt += `\nPlease provide detailed travel insights. Return the response as a JSON object strictly matching this schema.

{
  "tripSummary": {
    "totalDistance": "estimated total distance as a string",
    "bestTimeToVisit": "string",
    "packingTips": ["array of", "string", "tips"],
    "overallBudget": { "low": "string", "mid": "string", "high": "string" },
    "visaPermitInfo": "string with visa/permit requirements based on my origin and destinations. If domestic, mention that.",
    "currencyInfo": "string with currency advice. Note if I need to change currency.",
    "timezoneChanges": "string noting any timezone changes"
  },`;

    if (origin) {
        prompt += `
  "firstMile": {
    "from": "${origin.name}",
    "to": "${stops[0].name}",
    "distance": "estimated distance string",
    "travelOptions": [
      { "mode": "Car|Bus|Train|Flight", "cost": "estimated cost with currency symbol", "duration": "estimated duration", "notes": "string", "provider": "string (optional)", "bookingUrl": "string url to book or search (optional)" }
    ],
    "recommendation": "string with best option"
  },`;
    }

    prompt += `
  "legs": [
    {
      "from": "stop name",
      "to": "next stop name", 
      "distance": "string",
      "driveTime": "string",
      "travelOptions": [
        { "mode": "Car|Bus|Train|Flight", "cost": "string", "duration": "string", "notes": "string", "provider": "string (optional)", "bookingUrl": "string url to book or search (optional)" }
      ],
      "routeSuggestion": "string"
    }
  ],
  "stopInsights": [
    {
      "stopName": "stop name",
      "nearbyAttractions": [
        { "name": "string", "distance": "string", "description": "string", "coordinates": [longitude, latitude] }
      ]
    }
  ]
}

Instructions:
1. Provide accurate travel distances and times.
2. Provide travel options for each leg (Car, Bus, Train, Flight if applicable). Find real website URLs for booking these options and put them in bookingUrl.
3. Search the web to provide realistic, current travel prices/costs for each option. Use the currency appropriate for the traveler's origin if possible, otherwise use local currency.
4. Suggest 2-3 specific, real nearby attractions for each stop. You MUST provide real [longitude, latitude] coordinates for each attraction so we can map them.
5. Provide a route suggestion (best roads, scenic drives) for each leg.
`;

    const config = {
        tools: [{ googleSearch: {} }]
        // Note: responseMimeType: 'application/json' is not supported alongside googleSearch tool in Gemini currently.
        // We rely on the prompt instructing it to return strict JSON.
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Use 2.5 flash as 3.5 might not be generally available or has different naming
            contents: prompt,
            config,
        });

        // Parse the JSON response
        // Sometimes the model adds conversational text before or after the JSON.
        // We'll extract only the content between the first { and the last }
        const rawText = response.text;
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No JSON object found in AI response");
        }
        
        const jsonText = rawText.substring(firstBrace, lastBrace + 1);
        const jsonResponse = JSON.parse(jsonText);
        
        res.status(200).json(jsonResponse);
    } catch (error) {
        console.error("Gemini API Error:", error);
        
        // If it's a JSON parse error, send back raw text for debugging
        if (error instanceof SyntaxError) {
             return res.status(500).json({ message: 'Failed to parse AI response', details: error.message });
        }
        
        res.status(500).json({ message: 'Failed to generate trip insights', details: error.message });
    }
});
