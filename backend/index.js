const express = require('express');
const port = 8000;
const db = require('./config/mongoose');
const cors = require('cors');
const app = express();


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

app.listen(port, function(err){
    if(err){
        console.log('Error in firing up the server');
        return;
    }
    console.log(`Server is running on port ${port}`);
    return;
});

