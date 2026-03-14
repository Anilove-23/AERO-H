import express from "express";
import { uploadVoice, voiceEmergency } from "../controllers/voice.controller.js";

const router = express.Router();

router.post("/emergency", uploadVoice, voiceEmergency);

export default router