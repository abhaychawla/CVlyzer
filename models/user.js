const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // google: {
    //     id: {
    //         type: String
    //     },
    //     token: {
    //         type: String
    //     }
    // }
});

UserSchema.methods.register = function(done) {
    // TODO(IMP): FIGURE OUT HOW TO BYPASS IN CASE OF GOOGLE AUTHENTICATION
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return done(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) {
                return done(err);
            }
            this.password = hash;
            this.save(done);
        });
    });
}

UserSchema.statics.findByUsername = function(username, done) {
    const query = { username: username };
    User.findOne(query, done);
}

UserSchema.statics.findByEmail = function(email, done) {
    const query = { email: email };
    User.findOne(query, done);
}

UserSchema.methods.verifyPassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err) {
            return done(err);
        }
        return done(null, isMatch);
    });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
