
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, DiagnosisStatus } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const diagnosisSchema = {
    type: Type.OBJECT,
    properties: {
        diagnosis: {
            type: Type.STRING,
            enum: [DiagnosisStatus.Healthy, DiagnosisStatus.Diseased, DiagnosisStatus.Unknown],
            description: "The diagnosis of the plant leaf.",
        },
        confidence: {
            type: Type.NUMBER,
            description: "The confidence level of the diagnosis, from 0 to 1.",
        },
        reasoning: {
            type: Type.STRING,
            description: "A brief explanation for the diagnosis based on visual evidence from the image.",
        },
    },
    required: ["diagnosis", "confidence", "reasoning"],
};


export async function analyzeLeafImage(base64Image: string, mimeType: string): Promise<DiagnosisResult> {
    const model = 'gemini-2.5-flash';
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
        text: `You are an expert plant pathologist. Analyze the provided image of a plant leaf. Based on visual cues such as discoloration (yellowing, browning), spots, lesions, and overall color health, determine if the leaf is healthy or diseased. Pay attention to the green-to-red color ratio, as diseased leaves often exhibit less green and more yellow/brown tones. Provide your diagnosis in the specified JSON format.`
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: diagnosisSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as DiagnosisResult;

        // Ensure the diagnosis value is one of the enum values
        if (!Object.values(DiagnosisStatus).includes(parsedResult.diagnosis)) {
            console.warn(`Unexpected diagnosis value: ${parsedResult.diagnosis}. Defaulting to Unknown.`);
            parsedResult.diagnosis = DiagnosisStatus.Unknown;
        }

        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a response from the AI model.");
    }
}
