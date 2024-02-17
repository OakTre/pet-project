const mongoose = require('mongoose');
const connection = require('../lib/connection');

const Role = new mongoose.Schema({
    value: {
        type: String,
        unique: true,
        default: 'user'
    }
})

module.exports = connection.model('Role', Role);
