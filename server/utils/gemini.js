// Utility to call Gemini API for resume parsing
const axios = require('axios');

async function parseResumeWithGemini(text, apiKey) {
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  const prompt = `Extract the following fields from this resume text as JSON: fullName, email, phone, skills (array), education (array), experience (array of jobs with title, company, dates, description). If a field is missing, use null or an empty array.\nResume:\n${text}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  try {
    const response = await axios.post(endpoint + `?key=${apiKey}`, body, { headers });
    // Gemini returns a text response, try to parse JSON from it
    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = raw.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
    return { error: 'Could not parse Gemini response', raw };
  } catch (err) {
    return { error: err.message };
  }
}

module.exports = { parseResumeWithGemini };
