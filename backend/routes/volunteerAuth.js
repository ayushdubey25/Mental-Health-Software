const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Volunteer = require("../models/Volunteer");

const router = express.Router();

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// -------------------- REGISTER --------------------
// Note: experience PDFs handled with multer
router.post("/register", upload.array("experience", 5), async (req, res) => {
  try {
    const { email, password, skills, ...rest } = req.body;

    // Parse skills array from JSON if sent as string
    let skillsArray = [];
    if (skills) {
      skillsArray = Array.isArray(skills) ? skills : JSON.parse(skills);
      skillsArray = [...new Set(skillsArray)]; // remove duplicates
    }

    // Get uploaded files
    const experienceFiles = req.files ? req.files.map(f => f.path) : [];

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const vol = await Volunteer.create({
      email,
      password: hashedPassword,
      skills: skillsArray,
      experience: experienceFiles,
      ...rest
    });

    res.status(201).json({ message: "Registered", id: vol._id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const vol = await Volunteer.findOne({ email });
    if (!vol) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, vol.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: vol._id, role: "volunteer" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: vol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GET ALL VOLUNTEERS --------------------
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find({}, "fullName email mobile skills bio experience");
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GET CURRENT VOLUNTEER --------------------
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const vol = await Volunteer.findById(decoded.id).select("-password");
    if (!vol) return res.status(404).json({ error: "Volunteer not found" });

    res.json(vol);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// -------------------- UPDATE VOLUNTEER --------------------
// Note: To update PDFs or skills, frontend must send FormData
router.put("/:id", upload.array("experience", 5), async (req, res) => {
  try {
    const { skills, ...rest } = req.body;

    let updateData = { ...rest };

    // Update skills array if provided
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : JSON.parse(skills);
      updateData.skills = [...new Set(skillsArray)];
    }

    // Append new uploaded experience files if any
    if (req.files && req.files.length > 0) {
      const experienceFiles = req.files.map(f => f.path);
      const vol = await Volunteer.findById(req.params.id);
      updateData.experience = [...(vol.experience || []), ...experienceFiles];
    }

    const updated = await Volunteer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Volunteer not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
