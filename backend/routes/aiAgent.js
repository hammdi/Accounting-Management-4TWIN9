const express = require('express');
const router = express.Router();
const { runAgent } = require('../aiAgent');

// POST /api/ai-agent
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;
    if (!message) return res.status(400).json({ success: false, message: 'Message required.' });
    const answer = await runAgent(message, userId);
    res.json({ success: true, answer });
  } catch (err) {
    console.error('AI Agent error:', err);
    res.status(500).json({ success: false, message: 'Agent error.' });
  }
});

module.exports = router;
