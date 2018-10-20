const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20');

const User = require('../models/user');

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
        secretOrKey: process.env.JWT_SECRET
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

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/user/authenticate/google/callback'
    }, function(accessToken, refreshToken, profile, done) {
        User.findByEmail(profile.emails[0].value, (err, currentUser) => {
            if (err) {
                return done(err, false);
            }
            if (currentUser) {
                return done(null, currentUser);
            } else {
                const newUser = new User();
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.name = profile.displayName;
                newUser.email = profile.emails[0].value;
                newUser.register((err, user) => {
                    console.log(err, user);
                    if(err)
                        return done(err, false);
                    else
                        return done(null, user);
                });
            }
        })
      }));

}
