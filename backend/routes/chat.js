const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController');
const auth = require('../middleware/auth');

// Apply auth middleware to all chat routes
router.use(auth);

// Get chat history
router.get('/history', chatController.getChatHistory);

// Process new message
router.post('/message', chatController.processMessage);

// Delete chat
router.delete('/:chatId', chatController.deleteChat);

// Export the router
module.exports = router;
