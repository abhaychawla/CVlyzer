const express = require('express');
const router = express.Router();

// Ensure Authentication
const passport = require('passport');

// Authentication Routes
const user = require('./user');
router.use('/user', user);

// File Routes
const files = require('./files');
router.use('/files', passport.authenticate('jwt', { session: false }), files);

// Search Routes
const search = require('./search');
router.use('/search', passport.authenticate('jwt', { session: false }), search);

module.exports = router;