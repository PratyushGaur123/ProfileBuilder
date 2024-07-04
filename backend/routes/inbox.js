const express = require('express');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/send/:receiverId', authMiddleware.userAuth, chatController.sendMessage);

router.get('/conversation/:chatWithId', authMiddleware.userAuth, chatController.getConversation);

router.get('/chat', authMiddleware.userAuth, chatController.getChatUsers);




module.exports = router;