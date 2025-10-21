const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HelpUser = require("../models/HelpUser");

const router = express.Router();

// ---------- REGISTER ----------
router.post("/register", async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    // check if email already exists
    const existing = await HelpUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await HelpUser.create({ email, password: hashed, ...rest });

    // create JWT token so frontend can treat registration as an instant login
    const token = jwt.sign({ id: user._id, role: "help" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Registered successfully",
      user: user,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ---------- LOGIN ----------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await HelpUser.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "help" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", user: user, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- SAVE INTRO ----------
router.put("/intro/:id", async (req, res) => {
  try {
    const updated = await HelpUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Intro info saved", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
