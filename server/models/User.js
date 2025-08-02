const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  bio: String,
  linkedin: String,
  skills: [String],
  walletAddress: String,
  role: { type: String, enum: ['seeker', 'recruiter'] },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
});

module.exports = mongoose.model("User", UserSchema);
