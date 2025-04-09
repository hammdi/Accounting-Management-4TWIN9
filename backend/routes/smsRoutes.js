const express = require('express');
const router = express.Router();
const { twilioSid, twilioAuthToken, twilioPhoneNumber } = require('../config/smsConfig');
const Twilio = require('twilio');

router.post('/send', async (req, res) => {
  const { to, message } = req.body;

  try {
    const client = new Twilio(twilioSid, twilioAuthToken);
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });

    res.status(200).json({ status: 'success', sid: response.sid });
  } catch (error) {
    console.error('❌ Twilio error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
