const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({


    email: {
        type: String,
        required: true,
        unique: true


    }
}
)
// in a user schema , username, password, and email si required, but we
// are only defining email because 'userSchema.plugin(passportLocalMongoose)'
// will automaticaly include username n password

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema);