const express = require('express');
const { sendMessage, getChatHistory, clearChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/history', getChatHistory);
router.delete('/clear', clearChatHistory);
module.exports = router;