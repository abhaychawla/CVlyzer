const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const config = require('../config/config');

const router = express.Router();

router.post('/user/register', (req, res) => {
    const newUser = new User(req.body);
    // TODO: validation required, already exists, other failures
    newUser.register((error, user) => {
        if(error)
            res.json({ success: false, message: 'User Registration Failed!', error: error } );
        else
            res.json({ success: true, message: 'User Registered!'} );
    });
});

router.post('/user/authenticate', (req, res, next) => {

    passport.authenticate('local', { session: false }, function(err, user, info) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({success: false, msg: 'User not found!'});
        } 
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.send(err);
            }
            const token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 604800 });
            return res.json({
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

router.get('/user/authenticate/google', (req, res, next) => {
    global.clientHost = req.headers.referer;
    console.log(req.headers.referer);
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/user/authenticate/google/callback', passport.authenticate('google'), (req, res, next) => {

    // passport.authenticate('google', function(err, user, info) {
    //     if (err) {
    //         throw err;
    //     }
    //     if (!user) {
    //         return res.json({success: false, msg: 'User not found!'});
    //     } 
    //     req.login(user, { session: false }, (err) => {
    //         if (err) {
    //             return res.send(err);
    //         }
            const token = jwt.sign({ id: user.google.id }, config.secret, { expiresIn: 604800 });
            console.log(token);
            res.redirect(`/user/authenticate/google/access_token/${token}`);
            // return res.json({
            //     success: true,
            //     token: token,
            //     user: {
            //         id: user._id,
            //         name: user.name,
            //         email: user.email
            //     },
            //     msg: 'Authentication Successful'
            // });
        // });
    // })(req, res, next);

});

router.get('/user/authenticate/google/access_token/:token', (req, res) => {
    res.redirect(global.clientHost);
});

router.get('/user/test', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({ msg: 'test jwt authentication'});
});

module.exports = router;
