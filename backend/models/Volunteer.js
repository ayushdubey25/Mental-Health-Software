const mongoose = require("mongoose");

const availabilityTimeSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. 'Monday'
  start: { type: String, required: true }, // e.g. '09:00'
  end: { type: String, required: true }    // e.g. '17:00'
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  client: String,
  date: String,   // or Date if you want real dates
  time: String,
  mode: String,
  notes: String,
}, { _id: false });

const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  language: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  location: String,
  availability: { type: String, enum: ["5", "10", "15"], required: true },
  // Emergency time slots (array of times/days, optional)
  emergencyAvailability: [availabilityTimeSchema],
  skills: [{
    type: String,
    enum: [
      "Counseling", "Psychotherapy", "Stress Management",
      "Cognitive Behavioral Therapy", "Mindfulness",
      "First Aid Mental Health", "Peer Support"
    ],
    required: true
  }],
  bio: String,
  sessions: [sessionSchema],
  experience: [{ type: String }], // store file paths of uploaded PDFs
  profileImage: { type: String, default: "" },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);
