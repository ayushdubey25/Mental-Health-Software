// routes/contacts.js
const express = require("express");
const HelpUser = require("../models/HelpUser");
const router = express.Router();

// Add a new contact
router.post("/:userId/contacts", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await HelpUser.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.contacts.push({ name, phone });
    await user.save();
    res.json(user.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contacts for a user
router.get("/:userId/contacts", async (req, res) => {
  try {
    const user = await HelpUser.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a contact
router.delete("/:userId/contacts/:contactId", async (req, res) => {
  try {
    const user = await HelpUser.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.contacts = user.contacts.filter(
      (c) => c._id.toString() !== req.params.contactId
    );
    await user.save();
    res.json(user.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
