const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Chat = require("../models/Chat");
const Volunteer = require("../models/Volunteer");

// ---------- MULTER STORAGE FOR CHAT FILES ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/chat/")); // ensure this folder exists and is writable
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });

// ---------- SEND TEXT MESSAGE ----------
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
    res.status(200).json({ messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send message" });
  }
});

// ---------- SEND FILE MESSAGE ----------
router.post("/send-file", upload.single("file"), async (req, res) => {
  const { userEmail, volunteerEmail, senderEmail } = req.body;
  if (!req.file || !userEmail || !volunteerEmail || !senderEmail) {
    return res.status(400).json({ error: "Missing file or fields" });
  }
  try {
    let chat = await Chat.findOne({ userEmail, volunteerEmail });
    if (!chat) {
      chat = new Chat({ userEmail, volunteerEmail, messages: [] });
    }

    chat.messages.push({
      senderEmail,
      fileUrl: `/uploads/chat/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      timestamp: new Date()
    });

    await chat.save();
    res.status(200).json({ messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send file" });
  }
});

// ---------- GET ALL CHATS FOR VOLUNTEER ----------
router.get("/volunteer/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const chats = await Chat.find({ volunteerEmail: email }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// ---------- FETCH CHAT HISTORY ----------
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
