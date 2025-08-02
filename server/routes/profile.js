const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};


// New routes for /me and /me/profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

router.put("/me", auth, async (req, res) => {
  const { name, bio, linkedin, skills, walletAddress, role } = req.body;
  const update = { name, bio, linkedin, skills, walletAddress };
  if (role) update.role = role;
  await User.findByIdAndUpdate(req.userId, update);
  res.json({ message: "Profile updated" });
});

// Keep old routes for backward compatibility
router.put("/", auth, async (req, res) => {
  const { name, bio, linkedin, skills, walletAddress } = req.body;
  await User.findByIdAndUpdate(req.userId, { name, bio, linkedin, skills, walletAddress });
  res.json({ message: "Profile updated" });
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

module.exports = router;
