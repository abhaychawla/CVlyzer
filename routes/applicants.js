// Express Server
const express = require('express');

// Router
const router = express.Router();

// Elastic Search Module
const elastic = require('../src-modules/elastic');

// Email
const email = require('../src-modules/email');

const initiateHiringStatus = 1,
    qualifyStatus = 2,
    disqualifyStatus = 3;

router.post('/initiate-hiring-process', (req, res) => {
    const name = req.user.username;
    if (req.body.email) {
        email.sendEmails(req.user, req.body.applicants, req.body.email);
    }
    elastic.bulkUpdate(name, req.body.applicants, initiateHiringStatus)
        .then((response) => {
            res.status(200).json({ success: true, response: response.items })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/qualify', (req, res) => {
    const name = req.user.username;
    if (req.body.email) {
        email.sendEmails(req.user, req.body.applicants, req.body.email);
    }
    elastic.bulkUpdate(name, req.body.applicants, qualifyStatus)
        .then((response) => {
            res.status(200).json({ success: true, response: response.items })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

router.post('/disqualify', (req, res) => {
    const name = req.user.username;
    if (req.body.email) {
        email.sendEmails(req.user, req.body.applicants, req.body.email);
    }
    elastic.bulkUpdate(name, req.body.applicants, disqualifyStatus)
        .then((response) => {
            res.status(200).json({ success: true, response: response.items })
        }, function(err) {
            res.status(400).json({ success: false, err: err });
        });
});

module.exports = router;
