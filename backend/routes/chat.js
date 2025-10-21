const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Volunteer = require("../models/Volunteer");

// Send message
router.post("/send", async (req, res) => {
  const { userEmail, volunteerEmail, senderEmail, message } = req.body;

  if (!userEmail || !volunteerEmail || !senderEmail || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const volunteer = await Volunteer.findOne({ email: volunteerEmail });
    if (!volunteer) return res.status(404).json({ error: "Volunteer not found" });

    let chat = await Chat.findOne({ userEmail, volunteerEmail });
    if (!chat) {
      chat = new Chat({ userEmail, volunteerEmail, messages: [] });
    }

    chat.messages.push({
      senderEmail,
      message,
      timestamp: new Date(),
    });

    await chat.save();
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send message" });
  }
});


// ✅ Get all chats for a volunteer by email
router.get("/volunteer/:email", async (req, res) => {
  try {
    const { email } = req.params;
    // Find all chat docs where volunteerEmail matches
    const chats = await Chat.find({ volunteerEmail: email }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});


// Fetch chat history
router.get("/:userEmail/:volunteerEmail", async (req, res) => {
  const { userEmail, volunteerEmail } = req.params;

  if (!userEmail || !volunteerEmail) {
    return res.status(400).json({ error: "Missing emails" });
  }

  try {
    const chat = await Chat.findOne({ userEmail, volunteerEmail });
    res.status(200).json(chat ? chat.messages : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch chat" });
  }
});

module.exports = router;
