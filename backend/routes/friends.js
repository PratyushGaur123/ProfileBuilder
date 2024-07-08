const express = require('express');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();
const friendController = require('../controllers/friendController');


router.get('/', authMiddleware.userAuth, friendController.fetchFriends);

router.post('/send', authMiddleware.userAuth, friendController.sendFriendRequest);

router.post('/accept', authMiddleware.userAuth, friendController.acceptFriendRequest);

router.post('/reject', authMiddleware.userAuth, friendController.rejectFriendRequest);

router.get('/requests', authMiddleware.userAuth, friendController.fetchFriendRequests);

module.exports = router;