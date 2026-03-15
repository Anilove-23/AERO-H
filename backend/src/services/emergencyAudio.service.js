import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export const generateEmergencyAudio = async (text) => {

  try {

    // ensure folder exists
    if (!fs.existsSync("public/audio")) {
      fs.mkdirSync("public/audio", { recursive: true });
    }

    const audio = await elevenlabs.textToSpeech.convert(
      "21m00Tcm4TlvDq8ikWAM",
      {
        text: text,
        model_id: "eleven_multilingual_v2"
      }
    );

    const filename = `emergency_${Date.now()}.mp3`;
    const filepath = path.join("public/audio", filename);

    const buffer = Buffer.from(await audio.arrayBuffer());

    fs.writeFileSync(filepath, buffer);

    return `/audio/${filename}`;

  } catch (err) {

    console.log("⚠️ ElevenLabs failed → fallback activated");
    console.log(err.message);

    // fallback: no audio but system continues
    return null;

  }

};