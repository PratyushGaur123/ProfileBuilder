const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const { getSocketId, io } = require('../sockets/socket');

module.exports.sendMessage = async function (req, res) {
    try {
        const { message } = req.body;
        const { receiverId } = req.params;

        if (!req.user.id || !message || !receiverId) {
            return res.status(400).json({
                message: "Invalid Request => data not passed"
            });
        }

        const receiver = await User.findOne({_id: receiverId});

        if(!receiver){
            return res.status(404).json({
                message: "User does not exist"
            })
        }

        let conversation = await Conversation.findOne({
            participants: {
                $all: [req.user.id, receiverId]
            }
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants: [req.user.id, receiverId],
            });
        }

        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            message,
            conversation: conversation._id
        });

       conversation = await Conversation.findByIdAndUpdate(conversation._id, {
            latestMessage: newMessage._id,
            $push: { messages: newMessage._id }
        }, { new: true });

        //TODO: Add socket logic
        const receiverSocketId = getSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', {
                message: newMessage,
                sender: req.user.id
            });
        }

        return res.status(200).json({
            message: "Message created successfully",
            data: {
                message: newMessage
            }
        })
    } catch (error) {
        console.log('An error occurred in the sendMessage: ', error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports.getConversation = async function(req, res){
    try {
        const {conversationId} = req.params;

        if(!req.user.id){
            return res.status(401).json({
                message: "Authentication Required"
            });
        }

        if(!conversationId){
            return res.status(400).json({
                message: "Invalid Request => data not passed"
            });
        }


        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: {
            $in: [req.user.id]
          }
        })
        .populate({
            path:"participants",
            match: { _id: { $ne: req.user.id } }, 
            select: "firstName lastName _id"
        })
        .populate({
            path: "messages",
            options: { sort: {createdAt: -1} },
            select: "sender receiver message -_id"
        })
        .populate("latestMessage", "sender message -_id")
        .select("-createdAt -updatedAt -__v")
        .lean(); 
        
        if(!conversation){
            return res.status(404).json({
                message: "conversation not found",
                data: null
            });
        }

        return res.status(200).json({
            message: "conversation fetched successfully",
            data: {
                conversation
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error while getting conversation' });
    }
}

module.exports.getChatUsers = async function(req, res){
    try {
        if(!req.user.id){
            return res.status(401).json({
                message: "Authentication Required"
            });
        }

        const chat = await Conversation.find({
            participants: {
                $in: [req.user.id]
            }
        })
        .populate("participants", "firstName lastName _id")
        .populate("latestMessage", "sender receiver message -_id")
        .select("-createdAt -updatedAt -__v -messages")
        .sort({updatedAt : -1})
        .lean();    

        return res.status(200).json({
            message: "Chat fetched successfully",
            data: {
                chat
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error while getting conversation' });
    }
}

/* optimization: fetching only a limited number of messages in a conversation instead of fetching all of them

        .populate({
            path: "messages",
            select: "sender message -_id",
            options: {
                sort: {
                    createdAt: -1
                },
                limit: 15
            }
        })

*/