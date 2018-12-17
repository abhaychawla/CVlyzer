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

router.get('/:id', (req, res) => {
    const name = req.user.username;
    const id = req.params.id;
    elastic.findById(name, id)
        .then(function(response) {
            res.status(200).json({ success: true, response: response._source })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.delete('/:id', (req, res) => {
    const name = req.user.username;
    const id = req.params.id;
    elastic.deleteById(name, id)
        .then(function(response) {
            res.status(200).json({ success: true, response: response._id })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/master', (req, res) => {
    // Query Type Example(Phrases/Keywords): Amity International School AND/OR Java
    const name = req.user.username;
    let query = req.body.query;
    if (req.body.strictSearch) {
        query = query.join('" AND "');
    } else {
        query = query.join('" OR "');
    }
    elastic.masterSearch(name, `"${query}"`)
        .then(function(response) {
            res.status(200).json({ success: true, response: response.hits.hits })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/phrase', (req, res) => {
    // Query Type: By specific phrases
    const name = req.user.username;
    let query = req.body.query;
    if (req.body.strictSearch) {
        query = {
            skills: query.skills.join('" AND "'),
            education: query.education.join('" AND "'),
            experience: query.experience.join('" AND "'),
            certification: query.certification.join('" AND "'),
            projects: query.projects.join('" AND "')
        };
    } else {
        query = {
            skills: query.skills.join('" OR "'),
            education: query.education.join('" OR "'),
            experience: query.experience.join('" OR "'),
            certification: query.certification.join('" OR "'),
            projects: query.projects.join('" OR "')
        };
    }
    elastic.searchByPhrase(name, query)
        .then(function(response) {
            res.status(200).json({ success: true, response: response.hits.hits })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        })
});

module.exports = router;
