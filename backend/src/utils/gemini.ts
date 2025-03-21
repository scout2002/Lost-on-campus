import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  Schema,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const structuredGeminiModel = (
  schema: any,
  system_instruction?: string
) => {
  try {
    return genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        maxOutputTokens: 3000,
        temperature: 0,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
      systemInstruction: system_instruction ?? "",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  } catch (error) {
    console.error("Error initializing Gemini model:", error);
    throw error;
  }
};
