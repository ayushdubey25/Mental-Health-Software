const express = require("express");
const multer = require("multer");
const Resource = require("../models/Resource"); // adjust path if needed
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Upload resource
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { volunteerEmail, category, title, description, link } = req.body;

    let fileLink = link || "";
    let type = "link";

    if (req.file) {
      fileLink = `/uploads/${req.file.filename}`;
      if (req.file.mimetype.includes("pdf")) type = "pdf";
      else if (req.file.mimetype.includes("video")) type = "video";
      else type = "other";
    }

    const resource = await Resource.create({
      volunteerEmail,
      category,
      title,
      description,
      type,
      link: fileLink,
    });

    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get resources by volunteer email
router.get("/:email", async (req, res) => {
  try {
    const resources = await Resource.find({ volunteerEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

module.exports = router;
