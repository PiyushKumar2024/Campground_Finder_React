import { GoogleGenAI } from '@google/genai';
import catchAsync from '../helper/catchAsync.js';

export const searchPlaces = catchAsync(async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: 'Gemini API key is missing' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let prompt = `Find 3 to 5 popular tourist destinations or places of interest matching the search query: "${q}".
Return the response as a JSON object strictly matching this schema:
{
  "places": [
    {
      "name": "string",
      "location": "string",
      "description": "string (1-2 short sentences)",
      "coordinates": [longitude, latitude],
      "imageUrl": "string url to a representative image from the web (must be an image URL like .jpg or .png)"
    }
  ]
}
Instructions:
1. Provide real [longitude, latitude] coordinates so they can be mapped.
2. Provide a real image URL representing the place if possible.
3. Ensure the response is strictly JSON.`;

    const config = { responseMimeType: 'application/json' };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config,
        });

        let rawText = response.text;
        
        // Fallback in case response.text is undefined but candidates are present
        if (!rawText && response.candidates && response.candidates[0]?.content?.parts) {
            rawText = response.candidates[0].content.parts.map(p => p.text).join('');
        }

        if (!rawText) {
            console.error("Gemini Raw Response:", JSON.stringify(response, null, 2));
            throw new Error("No text returned from Gemini API (might be safety blocked)");
        }
        
        const jsonResponse = JSON.parse(rawText);
        
        // Add a dummy id to each place so the frontend can use it as a key
        // Format to match what the frontend expects for campgrounds (campLocation.coordinates)
        const placesWithIds = jsonResponse.places.map(p => ({
            _id: `place_${Math.random().toString(36).substr(2, 9)}`,
            name: p.name,
            location: p.location,
            description: p.description,
            image: [{ url: p.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop' }],
            campLocation: { coordinates: p.coordinates },
            isTouristSpot: true // flag to distinguish from campgrounds
        }));

        res.status(200).json(placesWithIds);
    } catch (error) {
        console.error("Gemini Places API Error:", error);
        res.status(500).json({ message: 'Failed to fetch places', details: error.message });
    }
});
