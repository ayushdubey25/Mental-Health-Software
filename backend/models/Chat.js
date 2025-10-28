const mongoose = require("mongoose");

// Each message can be either text, file, or both.
const messageSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  // message is NOT required (text or file allowed)
  message: { type: String },
  fileUrl: { type: String },         // for file uploads (relative path or URL)
  fileName: { type: String },        // original file name
  fileType: { type: String },        // MIME type
  timestamp: { type: Date, default: Date.now },
});

// Validator: at least message or fileUrl must be present
messageSchema.pre("validate", function (next) {
  if (!this.message && !this.fileUrl) {
    next(new Error("A message must have text or a file."));
  } else {
    next();
  }
});

const chatSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  volunteerEmail: { type: String, required: true },
  messages: [messageSchema],
});

module.exports = mongoose.model("Chat", chatSchema);
