
const express = require("express");
const Job = require("../models/Job");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();



// Auth middleware
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

// GET /api/jobs/applied - get jobs the current user has applied to
router.get('/applied', auth, async (req, res) => {
  const jobs = await Job.find({ applicants: req.userId }).sort({ createdAt: -1 });
  res.json(jobs);
});

// POST /api/jobs/:id/apply - apply for a job (auth required)
router.post('/:id/apply', auth, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.applicants && job.applicants.includes(req.userId)) {
    return res.status(400).json({ message: 'Already applied' });
  }
  job.applicants = job.applicants || [];
  job.applicants.push(req.userId);
  await job.save();

  // Also add job to user's appliedJobs
  await User.findByIdAndUpdate(
    req.userId,
    { $addToSet: { appliedJobs: job._id } }
  );

  res.json({ message: 'Applied successfully' });
});

// POST /api/jobs - create a job (auth required)
router.post("/", auth, async (req, res) => {
  const { title, description, skills, budget, location, tags } = req.body;
  const job = await Job.create({
    title,
    description,
    skills,
    budget,
    location,
    tags,
    postedBy: req.userId
  });
  res.status(201).json(job);
});

// GET /api/jobs - list jobs (with optional filters)
router.get("/", async (req, res) => {
  const { skill, location, tag } = req.query;
  let filter = {};
  if (skill) filter.skills = skill;
  if (location) filter.location = location;
  if (tag) filter.tags = tag;
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).populate('postedBy', 'name');
  res.json(jobs);
});

// (Optional) GET /api/jobs/:id - job details
router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name');
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

module.exports = router;
