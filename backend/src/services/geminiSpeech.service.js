import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const speechToText = async (audioPath, mimeType) => {

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const audioBuffer = fs.readFileSync(audioPath);

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: audioBuffer.toString("base64")
        }
      },
      {
        text: `
Convert this emergency audio into SHORT medical symptoms.

Return only symptoms text.

Example outputs:
"chest pain and breathing difficulty"
"severe bleeding from leg"
"high fever and vomiting"
`
      }
    ]);

    return result.response.text().trim();

  } catch (error) {

    console.log("⚠️ Gemini speech failed → fallback");

    return "voice emergency reported";

  }

};