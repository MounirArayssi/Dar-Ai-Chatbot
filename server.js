require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/sources', express.static(path.join(__dirname, 'sources')));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Updated chat endpoint for Gemini
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  // Immediately notify client to show typing indicator (optional, but not needed for new logic)
  try {
    // Get full Gemini response (no streaming)
    const result = await model.generateContent(message);
    const fullResponse = result.response.text();
    res.json({ text: fullResponse });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ text: "Sorry, I'm having trouble responding. Please try again later." });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5512;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));