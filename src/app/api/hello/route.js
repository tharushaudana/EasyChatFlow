import { GoogleGenAI } from "@google/genai";

export async function GET() {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyDppMQH-QxUFphJhug9AaKPTGYOSipx8lA" });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Explain how AI works in a few words",
    });

    return new Response(JSON.stringify({ message: response.text }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  