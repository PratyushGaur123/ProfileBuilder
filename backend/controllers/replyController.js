const Reply = require('../models/reply');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.createReply = async function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({message: 'Authentication required'});
        }
        const {content} = req.body;
        const {commentId, postId} = req.params;
        
        if(!content ||!commentId ||!postId){
            return res.status(400).json({message: 'Invalid request'});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: 'Post not found'});
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({message: 'Comment not found'});
        }

        const newReply = await Reply.create({
            content,
            user: req.user,
            comment: commentId
        });

        await Comment.updateOne({
            _id: commentId
        }, {
            $push: {
                replies: newReply._id
            }
        }, { new: true });

        return res.status(200).json({
            message: 'Reply created successfully',
            data: {
                reply: newReply._id
            }
        });
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error while creating reply'});
    }
}

module.exports.deleteReply = async function(req, res){
    try {
        if(!req.user){
            return res.status(400).json({message: 'Authentication required'});
        }

        const {commentId, postId, replyId} = req.params;
        if(!commentId ||!postId){
            return res.status(400).json({message: 'Invalid request'});
        }

        const post = await Post.findById(postId);    
        if(!post){
            return res.status(404).json({message: 'Post not found'});
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({message: 'Comment not found'});
        }

        const reply = await Reply.findById(replyId);
        if(!reply){
            return res.status(404).json({message: 'Reply not found'});
        }

        if(reply.user.toString()!== req.user.toString()){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const updatedComment = await Comment.updateOne({
            _id: commentId
        }, {
            $pull: {
                replies: replyId
            }
        }, { new: true });

        const deletedReply = await Reply.findByIdAndDelete(replyId);

        return res.status(200).json({
            message: 'Reply deleted successfully',
            data: {
                reply: deletedReply._id
            }
        });
        
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error while deleting reply'});
    }
}