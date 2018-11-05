// Express Server
const express = require('express');

// Authentication
const passport = require('passport');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../models/user');

// Environment Configuration
const config = require('../config/config');

// Router
const router = express.Router();

// User Registration
router.post('/register', (req, res) => {
    const newUser = new User(req.body);
    // TODO: validation required, already exists, other failures
    newUser.register((error, user) => {
        if(error)
            res.status(400).json({ success: false, msg: 'User Registration Failed!', error: error } );
        else
            res.status(200).json({ success: true, msg: 'User Registered!', user: user });
    });
});

// User Authentication
router.post('/authenticate', (req, res, next) => {
    passport.authenticate('local', { session: false }, function(err, user, info) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json({ success: false, msg: 'User not found!' });
        } 
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.send(err);
            }
            const token = jwt.sign(user.toJSON(), config.jwtSecret, { expiresIn: 604800 });
            
            return res.status(200).json({
                success: true,
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                },
                msg: 'Authentication Successful'
            });
        });
    })(req, res, next);

});

module.exports = router;
