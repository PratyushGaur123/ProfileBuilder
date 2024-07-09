const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Friends = require('../models/friends');
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

function getSocketId(userId) {
    return userMap.get(userId);
}

async function getOnlineUsers(userId) {
    try {
        const friends = await Friends.find({
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        }).lean();
        if(!friends || friends.length === 0){
            return [];
        }else{
            const friendIds = friends.map(friend => friend.user1.toString() == userId.toString() ? friend.user2 : friend.user1);
            let onlineFriends = friendIds.filter(id => userMap.has(id.toString()));
            onlineFriends = onlineFriends.map((friendId)=> friendId = friendId.toString());
            return onlineFriends;
        }
    } catch (error) {
        console.log('Friend ni fetch hue: ')
        
    } 
}

const userMap = new Map();   // {userId: socketId} 

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);


    const userId = socket.handshake.query.userId;
    console.log(userId);
    if (userId) {
        (async () => {
            try {
                userMap.set(userId, socket.id);
                const onlineFriends = await getOnlineUsers(userId);
                if(!onlineFriends || onlineFriends.length === 0){
                    return;
                }else{
                    onlineFriends.forEach(friendId => {
                        if (friendId) {
                            console.log(friendId)
                            io.to(userMap.get(friendId)).emit('userOnline', userId);
                        }
                    });

                    socket.emit('getOnlineUsers', onlineFriends);
                }
            } catch (error) {
                console.log('Error in getting online friends of the user', error);
            }
        })();
    }


    // socket.on('disconnect', () => {
    //     console.log('a user disconnected' + socket.id);
    //     if (userId) {
    //         userMap.delete(userId);
    //         (async () => {
    //             try {
    //                 const onlineFriends = await getOnlineUsers(userId);
    //                 onlineFriends.forEach(friendId => {
    //                     if (friendId) {
    //                         io.to(userMap.get(friendId)).emit('userOffline', userId);
    //                     }
    //                 });
    //             } catch (error) {
    //                 console.log('Error in getting online friends of the user', error);
    //             }
    //         })();
    //     }
    // });

})

module.exports = { app, server, io, getSocketId };
