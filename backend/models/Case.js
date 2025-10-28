const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer", required: true },
  userName: String,
  userEmail: String,
  userAge: Number,
  userGender: String,
  userContact: String,
  issue: { type: String, required: true }, // Main concern
  severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Active", "On Hold", "Completed", "Closed"], default: "Pending" },
  assignedDate: { type: Date, default: Date.now },
  notes: [
    {
      author: String, // volunteer or user
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  reports: [String], // file paths or URLs
  progress: String,
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);
