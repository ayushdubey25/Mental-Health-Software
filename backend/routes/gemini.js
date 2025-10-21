// routes/gemini.js
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// 🔒 Strict crisis detection
function isCrisisIntent(text) {
  const t = text.toLowerCase();
  // match any mention of suicide/self-harm, not just intent
  const crisisWords = [
    "suicide",
    "kill myself",
    "end my life",
    "end it all",
    "hurt myself",
    "take my life",
    "die by suicide",
    "self harm",
    "better off dead",
    "can't go on"
  ];
  return crisisWords.some((w) => t.includes(w));
}

router.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt?.trim();
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // 🚨 1. Block anything with suicide/self-harm words
    if (isCrisisIntent(prompt)) {
      return res.json({
        bullets: [
          "⚠️ I’m really concerned for your safety.",
          "💙 You are not alone. Help is available right now:",
          "• 🇮🇳 India: Call 9152987821 (24/7 helpline – AASRA)",
          "• 🌍 International: https://www.opencounseling.com/suicide-hotlines",
          "📞 Please reach out to emergency services or a trusted person immediately."
        ]
      });
    }

    // ✅ 2. Safe question → Gemini
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`;

    const gRes = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text:
                  "You are a supportive mental-health assistant. " +
                  "Provide kind, factual answers and wellness tips. " +
                  "Do NOT discuss or give opinions about suicide or self-harm. " +
                  `User says: ${prompt}`
              }
            ]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const raw = gRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const bullets = raw
      .split(/[\.\!\?]\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5)
      .map((s) => `• ${s}`);

    res.json({ bullets });
  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

module.exports = router;
