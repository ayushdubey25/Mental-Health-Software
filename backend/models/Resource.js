// models/Resource.js
const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  volunteerEmail: { type: String, required: true },   // owner of the resource
  category: { type: String, required: true },         // guides | articles | videos | others
  title: { type: String, required: true },
  description: String,
  type: { type: String, required: true },             // pdf | link | video
  link: { type: String, required: true },             // file url or external link
  createdAt: { type: Date, default: Date.now }
});

module.exports= mongoose.model("Resource", ResourceSchema);
