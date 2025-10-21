const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: String,
});

const helpUserSchema = new mongoose.Schema({
  fullName: String,
  age: Number,
  gender: String,
  language: String,
  relationship: String,
  mobile: String,
  location: String,
  supportMode: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: { type: String, default: "" },
  trauma: String,
  history: { type: [String], default: [] },
  disorders: { type: [String], default: [] },
  assistance: String,
  otherHistory: String,
  extraNotes: String,

  /** ✅ NEW FIELD **/
  contacts: { type: [contactSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("HelpUser", helpUserSchema);
