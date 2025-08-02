const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const router = express.Router();
const { parseResumeWithGemini } = require('../utils/gemini');
const dotenv = require('dotenv');
dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/resume/parse
router.post('/parse', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not set in backend' });
    }
    const parsed = await parseResumeWithGemini(resumeText, apiKey);
    res.json({ parsed, rawText: resumeText });
  } catch (err) {
    res.status(500).json({ message: 'Failed to parse resume', error: err.message });
  }
});

module.exports = router;
