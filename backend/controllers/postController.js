const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const Reply = require('../models/reply');

module.exports.createPost = async function(req, res){
    try {
        if(!req.user.id){
            return res.status(400).json({ message: 'User not found' });
        }
        const { text } = req.body;

        if(!text){
            return res.status(400).json({ message: 'Post cannot be empty' });
        }

        const newPost = await Post.create({
            text,
            user: req.user.id
        });

        await newPost.populate('user', ' firstName lastName email _id verified ');  // no need to populate comments and replies for newly created post

        return res.status(200).json({
            message: 'Post created successfully',
            data: {
                post: newPost
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: 'Internal Server Error while creating post' });
    }
}

module.exports.readPosts = async function(req, res){
    try {
        if(!req.user.id){
            return res.status(400).json({ message: 'User not found' });
        }
        const posts = await Post.find({user: {
            $ne: req.user.id
        }})
        .populate('user', 'firstName lastName email _id gender')
        .populate({
            path: 'comments',
            populate: {
                path: 'replies',
                model: 'Reply'
            }
        })
        .lean()
        .sort({likes: -1});

        const postsData = posts.map( (post)=> ({
            ...post,
            likes: post.likes.length
        }));

        return res.status(200).json({
            message: 'Posts retrieved successfully',
            data: {
                posts: postsData
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error while retrieving posts' });
    }
}

module.exports.readUserPosts = async function(req, res){
    try {
        if(!req.user.id){
            return res.status(400).json({ message: 'Authentication Required' });
        }
        const posts = await Post.find({user: req.user.id})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'replies',
                model: 'Reply'
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
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error while retrieving user posts'});
    }
}

module.exports.updatePost = async function(req, res){
    try {
        if(!req.user.id){
            return res.status(400).json({ message: 'User not found' });
        }
        const {content} = req.body;
        const {postId} = req.params;

        if(!postId || !content){
            return res.status(400).json({ message: 'Invalid request' });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }

        if(post.user.toString() !== req.user.id.toString()){
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
        if(!req.user.id){
            return res.status(400).json({ message: 'User not found' });
        }
        const {postId} = req.params;
        if(!postId){
            return res.status(400).json({ message: 'Invalid request' });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }

        if(post.user.toString() !== req.user.id.toString()){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // The post, comments, replies and the likes associated with all three of them must also be deleted

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({post: postId});       

        
        await Like.deleteMany({likeAbleId: postId});
        await Like.deleteMany({likeAbleId: { $in: post.comments }});

        await Reply.deleteMany({comment: { $in: post.comments }});
        await Like.deleteMany({likeAbleId: { $in: post.comments.map(comment => comment.replies) }});


        // add code to delete all the replies to comments as well.

        return res.status(200).json({
            message: 'Post deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while deleting post' });
    }
}

//TODO: DONT RETURN SENSITIVE INFO OF THE USER TO FRONTEND