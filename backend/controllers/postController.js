const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createPost = async function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({ message: 'User not found' });
        }
        const { content } = req.body;

        const newPost = await Post.create({
            content,
            user: req.user
        });
        return res.status(200).json({
            message: 'Post created successfully',
            data: {
                post: newPost
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while creating post' });
    }
}

module.exports.readPosts = async function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({ message: 'User not found' });
        }
        const posts = await Post.find({user: {
            $ne: req.user
        }})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'replies',
                model: 'Comment'
            }
        })
        .sort({likes: -1});

        return res.status(200).json({
            message: 'Posts retrieved successfully',
            data: {
                posts
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while retrieving posts' });
    }
}

module.exports.readUserPosts = function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({ message: 'User not found' });
        }
        const posts = Post.find({user: req.user})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'replies',
                model: 'Comment'
            }
        })
        .sort('-createdAt');
        return res.status(200).json({
            message: 'Posts retrieved successfully',
            data: {
                posts
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while retrieving user posts'});
    }
}

module.exports.updatePost = async function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({ message: 'User not found' });
        }
        const {postId, content} = req.body;

        if(!postId || !content){
            return res.status(400).json({ message: 'Invalid request' });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }

        if(post.user.toString() !== req.user.toString()){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {
            content
        }, {
            new: true
        });

        return res.status(200).json({
            message: 'Post updated successfully',
            data: {
                updatedPost
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while updating post' });
    }
}

module.exports.deletePost = async function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({ message: 'User not found' });
        }
        const {postId} = req.body;
        if(!postId){
            return res.status(400).json({ message: 'Invalid request' });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }

        if(post.user.toString() !== req.user.toString()){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({post: postId});

        return res.status(200).json({
            message: 'Post deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while deleting post' });
    }
}