// Express Server
const express = require('express');

// Router
const router = express.Router();

// Database
const mongoose = require('mongoose');

// Ensure Authentication
const passport = require('passport');

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
router.post('/upload', passport.authenticate('jwt', { session: false }), upload.array('file', 12), (req, res) => {
    res.status(200).json({ success: true, files: req.files, msg: 'Files Uploaded!' });
});

// Parse Files and Add Data to Elastic Search
router.post('/parse', passport.authenticate('jwt', { session: false }), (req, res) => {
    const name = req.user.username;
    let inputUrlPath;
    const promises = [];
    for (let i = 0; i<req.body.files.length; i++) {
        inputUrlPath = `http://localhost:8080/api/files/${req.body.files[i].filename}`;
        promises.push(resumeParser.extractAndParseDataFromUrl(inputUrlPath));
    }
    Promise.all(promises).then(data => {
        let rankingData = data.map((file) => file.data.data);
        console.log(rankingData);
        const spawn = require('child_process').spawn;
        const process = spawn('python', ['./rankingResumes.py', rankingData]);
        process.stdout.on('data', function (response) {
            console.log(response);
            if (!elastic.indexExists(name)) {
                elastic.createIndex(name)
                    .then(function(response) {
                        console.log(`Create:  ${response}`);
                        elastic.bulkUpload(name, data)
                            .then(function(response) {
                                // To prevent timelag issue
                                setTimeout(() => {
                                    res.status(200).json({ success: true, response: data });
                                }, 2000);
                            }, function(err) {
                                res.status(400).json({ success: false, err: err });
                            });
                    }, function(err) {
                        res.status(400).json({ success: false, err: err });
                    });
            } else {
                elastic.bulkUpload(name, data)
                    .then(function(response) {
                        // To prevent timelag issue
                        setTimeout(() => {
                            res.status(200).json({ success: true, response: data });
                        }, 10000);
                    }, function(err) {
                        res.status(400).json({ success: false, err: err });
                    });
            }
        });
    });
});

// Get File
router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(400).json({ success: false, msg: 'No file exists!', err: err });
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

// Delete File
router.delete('/:filename', passport.authenticate('jwt', { session: false }), (req, res) => {
    gfs.remove({ filename: req.params.filename, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(400).json({ success: false, err: err });
        }
        res.status(200).json({ success: true, msg: 'File Deleted!' });
    });
});

module.exports = router;