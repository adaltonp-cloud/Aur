
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

export const getSmartSuggestions = async (input: string): Promise<string[]> => {
  // Check if navigator is online before attempting API call
  if (!navigator.onLine) {
    return ["Offline Mode", "Connect to AI", "Network Needed", "Local Only"];
  }

  if (!input.trim()) return ["Rush B!", "Defend the point!", "Need healing!", "GG WP"];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 4 short gamer-style tactical chat commands or common phrases based on this input prefix: "${input}". 
      Keep them very short (1-3 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
  } catch (error) {
    console.error("Gemini Error:", error);
  }
  return ["Nice shot!", "Enemy spotted!", "Fallback!", "Wait for me!"];
};
