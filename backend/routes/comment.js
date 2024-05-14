const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router({mergeParams: true});

router.use('/:commentId/reply', require('./reply'));

router.post('/create', authMiddleware.userAuth, commentController.createComment);

router.delete('/delete/:commentId', authMiddleware.userAuth, commentController.deleteComment);



module.exports = router;

