const express = require('express');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/send', authMiddleware.userAuth, chatController.sendMessage);

router.get('/conversation/:conversationId', authMiddleware.userAuth, chatController.getConversation);

router.get('/', authMiddleware.userAuth, chatController.getChatUsers);




module.exports = router;