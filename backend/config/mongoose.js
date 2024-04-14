const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/profilebuilder');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(error) {
    if(error){
        console.log('Error in connecting to MongoDB');
        return;
    }
    console.log('Successfully Connected to the database');
});

module.exports = db;