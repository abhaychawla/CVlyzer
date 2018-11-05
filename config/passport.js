// Local Strategy
const LocalStrategy = require('passport-local').Strategy;

// JWT Authentication
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// User Model
const User = require('../models/user');

// Environment Configuration
const config = require('../config/config');

module.exports = function(passport) {

    passport.use(new LocalStrategy(function(username, password, done) {
        User.findByUsername(username, (err, user) => {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false);
            } else {
                user.verifyPassword(password, (err, isMatch) => {
                    if(err) {
                        return done(err);
                    }
                    if(isMatch) {
                        return done(null, user, isMatch);
                    }
                    else {
                        return done(null, false, isMatch);
                    }
                });
            }
        });
    }));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret
    }, (jwtPayload, done) => {
        User.findById(jwtPayload._id, (err, user) => {
            if(err)
                return done(err, false);
            if(user)
                return done(null, user);
            else
                return done(null, false);
        });
    }));

}
