const express = require('express')
const port = 8000;
const db = require('./config/mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const app = require('./sockets/socket').app;
const server = require('./sockets/socket').server;
// const io = require('./sockets/socket').io;


app.use(express.json());


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false
}

app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes'));

server.listen(port, function(err){
    if(err){
        console.log('Error in firing up the server');
        return;
    }
    console.log(`Server is running on port ${port}`);
    return;
});

