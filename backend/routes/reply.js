const express = require('express');
const replyController = require('../controllers/replyController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router({mergeParams: true});

router.post('/create', authMiddleware.userAuth, replyController.createReply);

router.delete('/delete/:replyId', authMiddleware.userAuth, replyController.deleteReply);


module.exports = router;

