const express = require("express");
const router = express.Router();
const Case = require("../models/Case");
const Volunteer = require("../models/Volunteer");
const User = require("../models/HelpUser");

// Get all cases for a volunteer
router.get("/volunteer/:volunteerId", async (req, res) => {
  try {
    const cases = await Case.find({ volunteerId: req.params.volunteerId }).sort({ lastUpdated: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cases for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.params.userId }).sort({ lastUpdated: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new case (usually by admin or automated assignment)
router.post("/create", async (req, res) => {
  try {
    const { userId, volunteerId, issue, severity } = req.body;
    
    // Fetch user and volunteer details
    const user = await User.findById(userId);
    const volunteer = await Volunteer.findById(volunteerId);
    
    if (!user || !volunteer) {
      return res.status(404).json({ error: "User or volunteer not found" });
    }

    const newCase = await Case.create({
      userId,
      volunteerId,
      userName: user.name,
      userEmail: user.email,
      userAge: user.age,
      userGender: user.gender,
      userContact: user.mobile,
      issue,
      severity,
      status: "Pending",
      progress: "Case assigned, awaiting initial contact"
    });

    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update case status/notes
router.put("/:caseId", async (req, res) => {
  try {
    const { status, progress, newNote, author } = req.body;
    const updateData = { lastUpdated: Date.now() };

    if (status) updateData.status = status;
    if (progress) updateData.progress = progress;
    
    if (newNote && author) {
      const caseDoc = await Case.findById(req.params.caseId);
      caseDoc.notes.push({ author, content: newNote });
      await caseDoc.save();
    }

    const updated = await Case.findByIdAndUpdate(
      req.params.caseId,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete case
router.delete("/:caseId", async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.caseId);
    res.json({ message: "Case deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
