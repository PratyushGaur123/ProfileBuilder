const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.createComment = async function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({ message: 'User not found' });
        }

        let commentAble;    // model that is commented on ['Post', 'Comment']

        const { content, commentAbleId, type } = req.body;

        if(!content || !commentAbleId || !type || (type !== 'Post' && type !== 'Comment')) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        if( type === 'Post' ){
            commentAble = await Post.findById(commentAbleId).populate('comments');
        }else{
            commentAble = await Comment.findById(commentAbleId).populate('replies');
        }

        if(!commentAble){
            return res.status(404).json({ message: 'Record not found' });
        }

        const newComment = await Comment.create({
            content,
            user: req.user,
            commentAbleId,
            onModel: type
        });

        if(type === 'Post'){
            await Post.updateOne({
                _id: commentAbleId
            }, {
                $push: {
                    comments: newComment._id
                }
            });
        }else{
            await Comment.updateOne({
                _id: commentAbleId
            }, {
                $push: {
                    replies: newComment._id
                }
            });
        }

        newComment = await newComment.populate('user').execPopulate();

        return res.status(200).json({
            message: 'Comment created successfully',
            data: {
                comment: newComment
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while creating comment' });
    }
}

// Read is not necessary because comments would exist under a post and we are returning all nested comments when we return post

// Update is totally up to me as popular social-media apps dont allow updation for comments

module.exports.deleteComment = async function(req, res){
    try {
        
    } catch (error) {
        
    }
}

module.exports.deleteReply = async function(req, res){
    try {
        
    } catch (error) {
        
    }
}