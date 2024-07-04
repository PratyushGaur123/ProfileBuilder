const mongoose = require('mongoose');

const friendReqSchema = new mongoose.Schema({
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted','rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const FriendReq = mongoose.model('FriendReq', friendReqSchema);

module.exports = FriendReq;