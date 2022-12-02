const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    adminRole: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: [String],
        default: [],
    },
});

module.exports = mongoose.model('User', userSchema);