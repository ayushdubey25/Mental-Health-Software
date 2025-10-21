const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  language: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  location: String,
  availability: { type: String, enum: ["5", "10", "15"], required: true },
  skills: [{ 
    type: String, 
    enum: [
      "Counseling",
      "Psychotherapy",
      "Stress Management",
      "Cognitive Behavioral Therapy",
      "Mindfulness",
      "First Aid Mental Health",
      "Peer Support"
    ],
    required: true
  }],
  bio: String,
  experience: [{ type: String }], // store file paths of uploaded PDFs
  profileImage: { type: String, default: "" },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);
