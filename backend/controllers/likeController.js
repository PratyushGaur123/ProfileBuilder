const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.toggleLike = async function(req, res){
    try {
        let likeAble;
        let deleted = false;

        if(!req.user){
            return res.status(400).json({ message: 'User not found' });
        }

        const { likeAbleId, type } = req.body;   // likeAbleId means the id of the post/comment that is liked/unliked

        if(!likeAbleId || !type || (type !== 'Post' && type !== 'Comment')) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        if( type === 'Post' ){
            likeAble = await Post.findById(likeAbleId).populate('likes');
        }else{
            likeAble = await Comment.findById(likeAbleId).populate('likes');
        }

        const existingLike = await Like.findOne({ user: req.user, likeAbleId, onModel: type });

        if(existingLike){
            await likeAble.updateOne({
                $pull: {
                    likes: existingLike._id
                }
            });

            await Like.findByIdAndDelete(existingLike._id);
            deleted = true;
        }else{
            const newLike = await Like.create({
                user: req.user,
                likeAbleId,
                onModel: type
            });

            await likeAble.updateOne({
                $push: {
                    likes: newLike._id
                }
            });
        }

        return res.json(200, {
            message: "Request successful!",
            data: {
                deleted: deleted
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
        
    }
}