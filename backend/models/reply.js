const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {                                              
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;