import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const speechToText = async (audioPath) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const audioBuffer = fs.readFileSync(audioPath);

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "audio/wav",
        data: audioBuffer.toString("base64")
      }
    },
    {
      text: "Convert this emergency audio into clear text describing the symptoms."
    }
  ]);

  const response = result.response.text();

  return response }