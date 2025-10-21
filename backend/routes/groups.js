// backend/routes/groups.js
const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const HelpUser = require("../models/HelpUser");
const Message = require("../models/Message");

// Create a group (admin / user-created)
router.post("/", async (req, res) => {
  try {
    const { name, category, condition, createdBy } = req.body;
    if (!name || !condition) return res.status(400).json({ error: "name and condition required" });

    const group = await Group.create({ name, category, condition, createdBy });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// List groups (optionally filter by condition)
router.get("/", async (req, res) => {
  try {
    const { condition } = req.query;
    const q = condition ? { condition } : {};
    const groups = await Group.find(q).sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get or create groups for a user's history conditions
router.get("/for-user/:userId", async (req, res) => {
  try {
    const user = await HelpUser.findById(req.params.userId).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const conditions = user.history || [];
    // For each condition try to find a group; if not exists create a default group
    const groups = [];
    for (const cond of conditions) {
      let g = await Group.findOne({ condition: cond });
      if (!g) {
        g = await Group.create({
          name: `${cond} Support`,
          category: "Mental Issue",
          condition: cond,
          createdBy: user._id,
        });
      }
      groups.push(g);
    }
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages for a group (last 200)
router.get("/:groupId/messages", async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .sort({ createdAt: 1 })
      .limit(200)
      .populate("sender", "fullName profileImage");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get members count (count of users with that condition in DB)
router.get("/:groupId/membersCount", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    // count users who have the group's condition in their history array
    const count = await HelpUser.countDocuments({ history: group.condition });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join a group
router.post("/:groupId/join", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const user = await HelpUser.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    // Check if user already has the group’s condition
    if (!user.history.includes(group.condition)) {
      user.history.push(group.condition);
      await user.save();
    }

    res.json({ message: `Joined group "${group.name}" ✅` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
