const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Friends = require('../models/friends');
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

function getSocketId(userId) {
    return userMap.get(userId);
}

async function getOnlineUsers(userId) {
    const friends = await Friend.find({
        $or: [
            { user1: userId },
            { user2: userId }
        ]
    });

    const friendIds = friends.map(friend => friend.user1.toString() == userId.toString() ? friend.user2 : friend.user1);

    const onlineFriends = friendIds.filter(id => userMap.has(id.toString()));

    return onlineFriends;
}

const userMap = new Map();   // {userId: socketId}

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);


    const userId = socket.handshake.query.userId;
    if (userId) {
        (async () => {
            try {
                userMap.set(userId, socket.id);
                const onlineFriends = await getOnlineUsers(userId);
                onlineFriends.forEach(friendId => {
                    if (friendId) {
                        io.to(userMap.get(friendId)).emit('userOnline', userId);
                    }
                });
                socket.emit('getOnlineUsers', onlineFriends);
            } catch (error) {
                console.log('Error in getting online friends of the user', error);
            }
        })();
    }


    socket.on('disconnect', () => {
        console.log('a user disconnected' + socket.id);
        if (userId) {
            userMap.delete(userId);
            (async () => {
                try {
                    const onlineFriends = await getOnlineUsers(userId);
                    onlineFriends.forEach(friendId => {
                        if (friendId) {
                            io.to(userMap.get(friendId)).emit('userOffline', userId);
                        }
                    });
                } catch (error) {
                    console.log('Error in getting online friends of the user', error);
                }
            })();
        }
    });

})

module.exports = { app, server, io, getSocketId };
