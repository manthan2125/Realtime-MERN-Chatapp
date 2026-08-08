import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

export const generateResult = async (prompt) =>  {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    // console.log(response.text);
    return response.text
}
