// routes/aiReport.js
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { avgHeart, avgTemp, data } = req.body;

    if (!data || !data.length) return res.status(400).json({ error: "Sensor data required" });

    // Prepare a more expressive prompt for Gemini
    const prompt = `
You are a friendly mental health assistant. 
User's average heart rate: ${avgHeart} bpm, average temperature: ${avgTemp} °C.
Here is recent sensor data (last 20 records): ${JSON.stringify(data)}

Please generate a mental health summary in a **relaxing, friendly, and reassuring tone**.
- Mention average heart rate and temperature explicitly.
- Summarize trends for happiness, stress, and anxiety.
- Include calming advice or tips to relax.
- Use bullet points with emojis.
- Keep it concise but comforting (max 7 bullets).
- Optionally suggest that the user can save or download this report.
`;

    // Call your gemini route internally
    const gRes = await axios.post(
      `http://localhost:${process.env.PORT || 5600}/api/gemini/chat`,
      { prompt }
    );

    let report = gRes.data.bullets || ["No report generated"];

    // Optionally prepend a friendly opening line
    report.unshift("🌼 Here's your personalized wellness check:");

    res.json({ report: report.join("\n") });
  } catch (err) {
    console.error("AI report error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate AI report" });
  }
});

module.exports = router;

module.exports = router;
