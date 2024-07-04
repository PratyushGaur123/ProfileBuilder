const Comment = require('../models/comment');
const Post = require('../models/post');
const Reply = require('../models/reply');

module.exports.createComment = async function (req, res) {
    try {
        if (!req.user.id) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const { content } = req.body;
        const {postId} = req.params;

        if (!content || !postId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = await Comment.create({
            content,
            user: req.user.id,
            post: postId,
        });


        await Post.updateOne({
            _id: postId
        }, {
            $push: {
                comments: newComment._id
            }
        });


        // newComment = await newComment.populate('user').execPopulate();  // ?

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

module.exports.deleteComment = async function (req, res) {
    try {
        if (!req.user.id) {
            return res.status(400).json({ message: 'Authentication required' });
        }

        const { commentId, postId } = req.params;
        if (!commentId || !postId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString()!== req.user.id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (comment.post.toString() !== postId) {
            return res.status(400).json({ message: 'Invalid request: Comment does not belong to the specified post' });
        }

        const post = await Post.findById(comment.post);
        if (post) {
            // deleting comment from 'comments' array of the post
            const updatedPost = await Post.findByIdAndUpdate(post._id, {
                $pull: {
                    comments: commentId
                }
            }, {
                new: true
            });
        }

        // deleting comment from 'Comment' collection
        const deletedComment = await Comment.deleteOne({
            _id: commentId
        });

        //deleting all the replies under that comment
        const deletedReplies = await Reply.deleteMany({
            comment: commentId
        });

        return res.status(200).json({
            message: 'Comment and associated replies deleted successfully',
            data: {
                comment: commentId,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error while deleting comment' });
    }
}
