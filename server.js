require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const logger = require('morgan');

const Grid = require('gridfs-stream');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const config = require('./config/config')[environment];

mongoose.connect(`${process.env.MONGO_CONNECTION_URL}/${process.env.MONGO_DB_NAME}`, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log(`Connected to Database: ${process.env.MONGO_DB_NAME}`);
});
mongoose.connection.on('error', (err) => {
    console.log(`Error Connecting to Database: ${err}`);
});

if (environment != 'production') {
    app.use(logger('dev'));
}

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

require('./config/passport')(passport);

const api = require('./routes/api');
app.use('/api', api);
const files = require('./routes/upload');
app.use('/files', files);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(config.port, () => {
    console.log(`Server Started on Port: ${config.port}`);
});
