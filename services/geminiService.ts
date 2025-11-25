import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize client only when needed to prevent crashes if env is missing during load
const getAiClient = () => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIdeas = async (prompt: string, context: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: Configuración de IA no encontrada.";

  try {
    const fullPrompt = `Actúa como un profesor experto de gastronomía y gestión de restaurantes. 
    Contexto del proyecto: ${context}.
    
    Consulta del alumno: ${prompt}
    
    Responde de forma breve, profesional y orientada a la sostenibilidad y viabilidad económica.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la IA. Verifica tu conexión.";
  }
};

export const analyzeMenu = async (menuItems: string[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analiza este menú desde el punto de vista de la ingeniería de menús y la sostenibilidad. Sugiere una mejora breve.
      Platos: ${menuItems.join(', ')}`,
    });
    return response.text || "";
  } catch (error) {
    return "Error analizando menú.";
  }
};
