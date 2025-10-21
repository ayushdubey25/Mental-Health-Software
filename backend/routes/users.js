// routes/users.js
const express = require("express");
const User = require("../models/HelpUser");
const router = express.Router();
const multer = require("multer");
const path = require("path");


// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // store in /uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});

const upload = multer({ storage });

// // get user
// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).json({ error: "User not found" });
//   res.json(user);
// });

// UPDATE user (profile info + optional image)
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If image is uploaded, add path
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "null") {
      return res.status(400).json({ message: "User ID missing or invalid" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user); // <-- this is correct
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// // Add a contact
// router.post("/:id/contacts", async (req, res) => {
//   try {
//     const { name, phone, relation } = req.body;
//     if (!name || !phone) {
//       return res.status(400).json({ error: "Name and phone are required." });
//     }

//     const user = await HelpUser.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.contacts.push({ name, phone, relation });
//     await user.save();
//     res.json(user.contacts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all contacts
// router.get("/:id/contacts", async (req, res) => {
//   try {
//     const user = await HelpUser.findById(req.params.id).select("contacts");
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json(user.contacts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete a contact
// router.delete("/:id/contacts/:contactId", async (req, res) => {
//   try {
//     const user = await HelpUser.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.contacts = user.contacts.filter(
//       (c) => c._id.toString() !== req.params.contactId
//     );
//     await user.save();
//     res.json(user.contacts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




module.exports = router;
