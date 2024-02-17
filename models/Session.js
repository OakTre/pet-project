const mongoose = require('mongoose');
const connection = require('../lib/connection');

const Session = new mongoose.Schema({
    refreshToken: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    ua: {
        type: String
    }
})

module.exports = connection.model('Session', Session);
