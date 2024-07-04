const FriendReq = require("../models/friendreq");
const Friends = require("../models/friends");
const User = require("../models/user");
const { getSocketId, io } = require('../sockets/socket');

module.exports.sendFriendRequest = async function (req, res) {
    try {
        const { friendId } = req.body;
        if (!req.user.id || !friendId) {
            return res.status(400).json({
                message: "Invalid Request => data not passed"
            });
        }

        if (friendId === req.user.id) {
            return res.status(400).json({
                message: "You cannot send friend request to yourself"
            });
        }

        const [friend, existingFriendship] = await Promise.all([
            User.findOne({ _id: friendId }).lean(),

            Friends.findOne({
                $or: [
                    { user1: req.user.id, user2: friendId },
                    { user1: friendId, user2: req.user.id }
                ]
            }).lean()
        ]);

        if (!friend) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }


        if (existingFriendship) {
            return res.status(400).json({
                message: "Already Friends"
            });
        }

        const existingFriendRequest = await FriendReq.findOne({
            $or: [
                { from_user: req.user.id, to_user: friendId },
                { from_user: friendId, to_user: req.user.id }
            ]
        });

        if (existingFriendRequest) {
            return res.status(400).json({
                message: "Friend Request Already Sent Or Already Received"
            });
        }

        const friendRequest = await FriendReq.create({
            from_user: req.user.id,
            to_user: friendId
        });

        const receiverSocketId = getSocketId(friendId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('friendRequest', {
                from_user: req.user.id,
                to_user: friendId
            });
        }

        return res.status(201).json({
            message: "Friend Request Sent"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while sending friend request"
        });
    }
}

module.exports.acceptFriendRequest = async function (req, res) {
    try {
        const { friendReqId, friendId } = req.body;

        if (!req.user.id || !friendReqId || !friendId) {
            return res.status(400).json({
                message: "Invalid Request => data not passed"
            });
        }

        if (friendId === req.user.id) {
            return res.status(400).json({
                message: "You cannot send friend request to yourself"
            });
        }

        const [friendRequest, friend, existingFriendship] = await Promise.all([
            FriendReq.findOne({ _id: friendReqId }).lean(),
            User.findOne({ _id: friendId }).lean(),
            Friends.findOne({
                $or: [
                    { user1: req.user.id, user2: friendId },
                    { user1: friendId, user2: req.user.id }
                ]
            })
        ]);

        if (!friendRequest || friendRequest.from_user !== friendId || friendRequest.to_user !== req.user.id) {
            return res.status(404).json({
                message: "Friend Request not found or not valid"
            });
        }

        if (!friend) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        if (existingFriendship) {
            return res.status(409).json({
                message: "Already Friends"
            });
        }

        await FriendReq.deleteOne({ _id: friendReqId });

        const friendship = await Friends.create({
            user1: req.user.id,
            user2: friendId
        });

        return res.status(200).json({
            message: "Friend Request Accepted"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while accepting friend request"
        });
    }
}

module.exports.rejectFriendRequest = async function (req, res) {
    try {
        const { friendReqId, friendId } = req.body;

        if (!req.user.id || !friendReqId || !friendId) {
            return res.status(400).json({
                message: "Invalid Request => data not passed"
            });
        }

        if (friendId === req.user.id) {
            return res.status(400).json({
                message: "You cannot send friend request to yourself"
            });
        }

        const [friendRequest, friend, existingFriendship] = await Promise.all([
            FriendReq.findOne({ _id: friendReqId,from_user: friendId , to_user: req.user.id }).lean(),
            User.findOne({ _id: friendId }).lean(),
            Friends.findOne({
                $or: [
                    { user1: req.user.id, user2: friendId },
                    { user1: friendId, user2: req.user.id }
                ]
            })
        ]);

        if (!friendRequest) {
            return res.status(404).json({
                message: "Friend Request not found or not valid"
            });
        }

        if (!friend) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        if (existingFriendship) {
            return res.status(409).json({
                message: "Already Friends"
            });
        }

        await FriendReq.deleteOne({ _id: friendReqId });

        return res.status(200).json({
            message: "Friend Request Rejected"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while rejecting friend request"
        });

    }
}

module.exports.getFriendRequests = async function (req, res) {
    try {
        if (!req.user.id) {
            return res.status(400).json({
                message: "Authentication Required"
            });
        }

        const friendRequests = await FriendReq.find({ to_user: req.user.id }).populate('from_user');

        return res.status(200).json({
            message: "Friend Requests",
            friendRequests
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while fetching friend requests"
        });

    }
}

module.exports.fetchFriends = async function (req, res) {
    try {
        if (!req.user.id) {
            return res.status(400).json({
                message: "Authentication Required"
            });
        }

        const friends = await Friends.find({
            $or: [
                { user1: req.user.id },
                { user2: req.user.id }
            ]
        }).populate('user1').populate('user2');

        return res.status(200).json({
            message: "Friends",
            friends
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while fetching friends"
        });
    }
}