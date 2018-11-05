// Express Server
const express = require('express');

// Router
const router = express.Router();

// Database
const mongoose = require('mongoose');

// Grid FS Storage for Files
const Grid = require('gridfs-stream');
const multer = require('multer');
const storage = require('../config/storage');
const upload = multer({ storage });

// Resume Parser Module
const resumeParser = require('../src-modules/resumeParser');

// Elastic Search Module
const elastic = require('../src-modules/elastic');

let gfs;
mongoose.connection.on('connected', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Upload Files
router.post('/upload', upload.array('file', 12), (req, res) => {
    res.status(200).json({ success: true, files: req.files, msg: 'Files Uploaded!' });
});

// Parse Files and Add Data to Elastic Search
router.post('/parse', (req, res) => {
    const name = req.user.username;
    let inputUrlPath;
    const promises = [];
    for (let i = 0; i<req.body.files.length; i++) {
        inputUrlPath = `http://localhost:8080/files/image/${req.body.files[i].filename}`;
        promises.push(resumeParser.extractAndParseDataFromUrl(inputUrlPath));
    }
    Promise.all(promises).then(response => {
        if (!elastic.indexExists(name)) {
            elastic.createIndex(name);
        }
        elastic.bulkUpload(name, response);
        res.status(200).json({success: true, response: response});
    });
});

// Get File
router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(400).json({ success: false, msg: 'No file exists!', error: err });
        }
        if (file.contentType === 'application/pdf') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            res.header('Content-Type', file.contentType);
            readstream.pipe(res);
        } else {
            res.status(400).json({ success: false, msg: 'Not a pdf!' });
        }
    });
});

module.exports = router;