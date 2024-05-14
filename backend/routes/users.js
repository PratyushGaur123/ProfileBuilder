const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();


router.use('/auth', require('./auth'));

router.use('/profile', require('./profile'));

router.use('/posts', require('./posts'));

router.get('/home', authMiddleware.userAuth, postController.readPosts );


module.exports = router;

