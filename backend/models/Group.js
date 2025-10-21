// backend/models/Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "Mental Issue" },
  condition: { type: String, required: true }, // e.g. "Depression"
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "HelpUser" },
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
