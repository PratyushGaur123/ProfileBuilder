const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.use('/:postId/comment', require('./comment'));

router.post('/create', authMiddleware.userAuth, postController.createPost);

router.get('/', authMiddleware.userAuth, postController.readPosts );

router.get('/myposts', authMiddleware.userAuth, postController.readUserPosts );

router.put('/update/:postId', authMiddleware.userAuth, postController.updatePost);

router.delete('/delete/:postId', authMiddleware.userAuth, postController.deletePost);



module.exports = router;

