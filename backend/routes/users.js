const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../config/authMiddleware');
const likeController = require('../controllers/likeController');
const utilityController = require('../controllers/utilityController');
const router = express.Router();


router.use('/auth', require('./auth'));

router.use('/profile', require('./profile'));

router.use('/posts', require('./posts'));

router.use('/inbox', require('./inbox'));

router.use('/friends', require('./friends'));

router.post('/like', authMiddleware.userAuth, likeController.toggleLike);

router.get('/home', authMiddleware.userAuth, postController.readPosts );

router.get('/auth-check', authMiddleware.userAuth, utilityController.authCheck);

router.get('/random-users', authMiddleware.userAuth, utilityController.fetchRandomUsers);

module.exports = router;

