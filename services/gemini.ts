import { GoogleGenAI, Type } from "@google/genai";
import { HealthStatus, MedicalReport } from "../types";

// Note: Ensure process.env.API_KEY is defined in your environment (Vercel Settings)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Extracts the MIME type and base64 data from a Data URL
 */
const parseDataUrl = (dataUrl: string) => {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return { mimeType: 'image/jpeg', data: dataUrl };
  return { mimeType: matches[1], data: matches[2] };
};

// Use flash for high-volume tasks to avoid quota issues
const DEFAULT_MODEL = 'gemini-3-flash-preview';

export const analyzeMedicalReport = async (imageB64: string, fileName: string): Promise<Partial<MedicalReport>> => {
  const { mimeType, data } = parseDataUrl(imageB64);

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: {
      parts: [
        { inlineData: { mimeType, data } },
        {
          text: `You are a medical document specialist. Analyze this document (${fileName}). 
          It might be a handwritten prescription, a lab report, or a doctor's note.
          
          TASK:
          1. Extract the document type (Blood Test, Prescription, Imaging, or Doctor Note).
          2. Provide a clear, professional Title.
          3. Write a 2-sentence Summary of the findings.
          4. Create a "Patient-Friendly" Explanation that avoids jargon.
          5. Identify key metrics/indicators. For each, provide a label, value, reference range, and status.
          6. Status MUST be exactly one of: "Normal", "Borderline", or "Concerning".
          
          IMPORTANT: You must include a medical disclaimer in the 'disclaimer' field.
          Respond ONLY with valid JSON following the schema provided. If a field is unknown, provide a sensible default.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          explanation: { type: Type.STRING },
          disclaimer: { type: Type.STRING },
          indicators: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                range: { type: Type.STRING },
                status: { type: Type.STRING },
              },
              required: ["label", "value", "status"]
            }
          }
        },
        required: ["type", "title", "summary", "explanation", "disclaimer", "indicators"]
      }
    }
  });

  try {
    const textOutput = response.text;
    if (!textOutput) throw new Error("Empty AI response");
    
    const parsedData = JSON.parse(textOutput);
    
    const processedIndicators = (parsedData.indicators || []).map((ind: any) => ({
      ...ind,
      status: Object.values(HealthStatus).includes(ind.status as HealthStatus) 
        ? ind.status 
        : HealthStatus.NORMAL
    }));

    return {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...parsedData,
      indicators: processedIndicators,
    };
  } catch (e) {
    console.error("Analysis Parsing Error:", e);
    throw new Error("Failed to interpret the medical report format. Please ensure the image is clear.");
  }
};

export const getHealthInsights = async (reports: MedicalReport[]) => {
  if (reports.length === 0) return "Upload your first report to get AI-powered insights.";
  
  const historyText = reports.map(r => `${r.date}: ${r.title} - ${r.summary}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `You are a health consultant. Based on the following medical history, provide 3 key insights or trends. 
      Focus on patterns over time. Keep it concise, empathetic, and always include a medical disclaimer.
      
      History:
      ${historyText}`
    });
    return response.text;
  } catch (e) {
    console.error("Insights Error:", e);
    return "Unable to generate insights at this moment. You might have hit your API quota.";
  }
};

export const chatWithAssistant = async (history: { role: string, content: string }[], message: string) => {
  const chat = ai.chats.create({
    model: DEFAULT_MODEL,
    history: history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    })),
    config: {
      systemInstruction: `You are MediInsight AI, a helpful medical assistant. Use simple, empathetic language. ALWAYS include a disclaimer: "This is educational information, not medical advice."`,
    },
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};