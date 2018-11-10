// Express Server
const express = require('express');

// Router
const router = express.Router();

// Elastic Search Module
const elastic = require('../src-modules/elastic');

router.get('/all', (req, res) => {
    const name = req.user.username;
    elastic.searchAll(name)
        .then((response) => {
            res.status(200).json({ success: true, response: response.hits.hits })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/id', (req, res) => {
    const name = req.user.username;
    const id = req.body.id;
    elastic.findById(name, id)
        .then(function(response) {
            res.status(200).json({ success: true, response: response._source })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/master', (req, res) => {
    // Query Type: Amity International School AND/OR Java
    const name = req.user.username;
    const query = req.body.query || ['Amity International School', 'Java'];
    elastic.masterSearch(name, `"${query.join('" OR "')}"`)
        .then(function(response) {
            res.status(200).json({ success: true, response: response.hits.hits })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/keyword', (req, res) => {
    // Query Type: By specific keywords
    const name = req.user.username;
    const query = req.body.query || {
        skills: ['Java'],
        education: ['Amity', 'Montessori'],
        achievement: [''],
        experience: [''],
        certification: ['icpcid'],
        projects: ['nodejs', 'angular']
    };
    elastic.searchByKeyword(name, query)
        .then(function(response) {
            res.status(200).json({ success: true, response: response.hits.hits })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/phrase', (req, res) => {
    // Query Type: By specific phrases
    const name = req.user.username;
    const query = req.body.query || {
        skills: [''],
        education: ['Amity International School', 'Montessori School'],
        achievement: [''],
        experience: [''],
        certification: [''],
        projects: ['']
    }
    elastic.searchByPhrase(name, query)
        .then(function(response) {
            res.status(200).json({ success: true, response: response.hits.hits })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        })
});

module.exports = router;
