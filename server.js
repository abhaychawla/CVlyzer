const path = require('path');

// Express Server
const express = require('express');

// Cross Origin Requests
const cors = require('cors');

// Parse Request Body
const bodyParser = require('body-parser');

// Authentication
const passport = require('passport');

// Database
const mongoose = require('mongoose');

// Logger
const logger = require('morgan');

// Initilize App
const app = express();

// Environment Configuration
const environment = process.env.NODE_ENV || 'development';
const config = require('./config/config');

// Database Connection
mongoose.connect(`${config.mongoConnectionUrl}/${config.mongoDbName}`, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log(`Connected to Database: ${config.mongoDbName}`);
});
mongoose.connection.on('error', (err) => {
    console.log(`Error Connecting to Database: ${err}`);
});

if (environment != 'production') {
    app.use(logger('dev'));
}

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));

// Build Folder to Serve Angular Frontend
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

require('./config/passport')(passport);

// Backend API Routes
const api = require('./routes/api');
app.use('/api', api);

// Serve index.html for all GET Requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(config[environment].port, () => {
    console.log(`Server Started on Port: ${app.get('port')}`);
});
