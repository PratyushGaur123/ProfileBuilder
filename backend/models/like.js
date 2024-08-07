const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likeAbleId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['Post', 'Comment', 'Reply'],
        required: true,
    }

}, {
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;