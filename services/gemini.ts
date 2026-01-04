import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Itinerary, PlaceRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Itinerary Generation
const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    summary: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                type: { 
                  type: Type.STRING, 
                  enum: ['food', 'transport', 'sightseeing', 'relaxation', 'accommodation'] 
                },
                estimatedCost: { type: Type.STRING }
              },
              required: ['time', 'activity', 'description', 'location', 'type']
            }
          }
        },
        required: ['day', 'theme', 'activities']
      }
    }
  },
  required: ['destination', 'summary', 'days']
};

export const generateItinerary = async (
  destination: string,
  duration: number,
  budget: string,
  interests: string[]
): Promise<Itinerary> => {
  const prompt = `
    Create a detailed ${duration}-day travel itinerary for ${destination}.
    Budget: ${budget}.
    Interests: ${interests.join(', ')}.
    
    Include specific timings, varied activities, and practical transport advice.
    Ensure the itinerary is realistic and well-paced.
    Classify each activity type correctly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: itinerarySchema,
        systemInstruction: "You are an expert travel agent named RoamMate. Create highly personalized, logical, and exciting travel itineraries."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

export const getPlaceRecommendations = async (
  location: string,
  category: 'hotel' | 'restaurant' | 'attraction'
): Promise<PlaceRecommendation[]> => {
  // We want to use search grounding to find REAL places
  const prompt = `Find 3 top-rated ${category}s in ${location}. 
  For each place, analyze online sentiment to provide a sentiment score (0-100) and a brief summary of what people say.
  Return the result as a JSON array.`;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING },
        rating: { type: Type.NUMBER },
        sentimentScore: { type: Type.NUMBER },
        sentimentSummary: { type: Type.STRING },
        priceLevel: { type: Type.STRING, enum: ['Cheap', 'Moderate', 'Expensive', 'Luxury'] },
        description: { type: Type.STRING },
      },
      required: ['name', 'rating', 'sentimentScore', 'sentimentSummary', 'description']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better reasoning on sentiment + search
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as PlaceRecommendation[];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Fallback or empty return
    return [];
  }
};

export const chatWithRoamMate = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[]
) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: "You are RoamMate, a helpful and cheerful travel assistant. Keep answers concise and helpful."
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
