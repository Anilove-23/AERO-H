import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export const generateEmergencyAudio = async (text) => {

  try {

    const audio = await elevenlabs.generate({
      voice: "Rachel",
      model_id: "eleven_multilingual_v2",
      text
    });

    const filename = `emergency_${Date.now()}.mp3`;

    const filepath = path.join("public/audio", filename);

    const stream = fs.createWriteStream(filepath);

    audio.pipe(stream);

    return `/audio/${filename}`;

  } catch (err) {

    console.log("ElevenLabs error:", err);

    return null;

  }

};