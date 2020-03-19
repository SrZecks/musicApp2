// NPM Modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Mongo Connection
const mongoURI = "mongodb+srv://yuri:fgmbr4YF9icExBW8@react-fjapq.mongodb.net/musicTest?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.on('error', err => handleError(err));

// Routes
const users = require('./routes/users');
const musics = require('./routes/musics');

// Express app instance
const app = express();

// Middlewares
app.use(cors()) //this is to enable cors policy, for now let's just leave this commented
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Accept requests from unauthorized servers, remove this in prodocution
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Use routes
app.use('/users', users);
app.use('/musics', musics);

if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app on build production
    app.use(express.static(path.join(__dirname, 'soundhub/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/soundhub/build/index.html'));
    });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`))