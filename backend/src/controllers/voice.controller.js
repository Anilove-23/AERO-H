import multer from "multer";
import fs from "fs";
import axios from "axios";
import { speechToText } from "../services/geminiSpeech.service.js";

const upload = multer({ dest: "uploads/" });

export const uploadVoice = upload.single("audio");

export const voiceEmergency = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Audio file required"
      });
    }

    const audioPath = req.file.path;

    // Convert speech → text
    const transcript = await speechToText(audioPath);

    fs.unlinkSync(audioPath);

    // Send to existing emergency API
    const emergency = await axios.post(
      "http://localhost:8000/api/v1/emergencies",
      {
        symptoms: transcript,
        lat: req.body.lat,
        lng: req.body.lng
      },
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json({
      transcript,
      emergency: emergency.data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Voice emergency failed"
    });

  }}