import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeSymptoms = async (symptoms) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a medical emergency triage AI.

Convert the following patient symptoms into structured emergency parameters.

Return ONLY valid JSON in this format:

{
  "severityScore": number,
  "priority": "low | medium | high | critical",
  "requiredSpecialization": string,
  "possibleCondition": string
}

Symptoms:
"${symptoms}"
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        // Remove markdown if Gemini wraps JSON
        text = text.replace(/```json|```/g, "").trim();

        const data = JSON.parse(text);

        return data;

    } catch (error) {
        console.error("Gemini triage error:", error);
        throw new ApiError(500, "AI triage failed");
    }
};