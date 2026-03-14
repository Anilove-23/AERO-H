import "dotenv/config";
import dotenv from 'dotenv'
dotenv.config()
import app from "./app.js";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    )
  )
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });