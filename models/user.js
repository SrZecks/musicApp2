const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, index: true },
    userHash: { type: String, required: true, index: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    tumbId: { type: String, default: "" },
    googleTumb: { type: String, default: "" },
    isGoogleAccount: { type: Boolean, default: false },
    firstTime: { type: Boolean, default: true },
    validated: { type: Boolean, default: false },
    followers: { type: Array }
})

var User = mongoose.model('users', userSchema)

module.exports = { User: User } 