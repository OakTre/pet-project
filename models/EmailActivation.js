const mongoose = require('mongoose');
const connection = require('../lib/connection');

const EmailActivation = new mongoose.Schema({
    isActivated: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = connection.model('EmailActivation', EmailActivation);
