import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeSymptoms = async (symptoms) => {

  try {

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a medical emergency triage AI.

Convert the following patient symptoms into structured emergency parameters.

Return ONLY valid JSON:

{
 "severityScore": number,
 "priority": "low | medium | high | critical",
 "requiredSpecialization": string,
 "possibleCondition": string,
 "firstAidAdvice": string
}

Symptoms:
"${symptoms}"
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    text = text.replace(/```json|```/g, "").trim();

    const data = JSON.parse(text);

    return data;

  } catch (error) {

    console.error("⚠️ Gemini triage failed → fallback activated");

    const s = symptoms.toLowerCase();

    // Heart emergency
    if (s.includes("chest") || s.includes("heart")) {
      return {
        severityScore: 9,
        priority: "critical",
        requiredSpecialization: "Cardiology",
        possibleCondition: "Possible heart attack",
        firstAidAdvice:
          "Keep patient seated. Loosen tight clothing. Give aspirin if not allergic and call emergency services immediately."
      };
    }

    // Blood in cough
    if (s.includes("blood") && s.includes("cough")) {
      return {
        severityScore: 8,
        priority: "high",
        requiredSpecialization: "Pulmonology",
        possibleCondition: "Possible pneumonia or lung infection",
        firstAidAdvice:
          "Keep patient upright and calm. Monitor breathing and seek urgent medical attention."
      };
    }

    // Fever
    if (s.includes("fever")) {
      return {
        severityScore: 2,
        priority: "low",
        requiredSpecialization: "General Practice",
        possibleCondition: "Viral infection",
        firstAidAdvice:
          "Ensure hydration, rest, and monitor temperature. Seek medical help if fever persists."
      };
    }

    // Default fallback
    return {
      severityScore: 3,
      priority: "low",
      requiredSpecialization: "General Practice",
      possibleCondition: "Minor illness",
      firstAidAdvice:
        "Ensure the patient rests, stays hydrated, and monitor symptoms."
    };

  }

};