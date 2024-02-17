const mongoose = require('mongoose');
const validator = require('validator');
const connection = require('../lib/connection');
const hashPassword = require("../utils/hashPassword.js");
const isValidPassword = require("../utils/isValidPassword.js");
const uuid = require('uuid');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    city: {
        type: String
    },
    children: {
        type: Boolean
    },
    height: {
        type: Number
    },
    relationship: {
        type: String
    },
    smoking: {
        type: Boolean
    },
    animals: {
        type: String
    },
    interests: {
        type: Array
    },
    languages: {
        type: Array
    },
    company: {
        type: String,
    },
    education: {
        type: String,
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail,'email неверный'],
    },
    password: {
        type: String,
        required: true,
    },
    activationLink: {
        type: String
    },
    roles: [{
        type: String,
        ref: 'Role'
    }]
})

User.pre('save', async function(next) {
    try {
        const hashedPassword = await hashPassword(this.password);
        this.password = hashedPassword;
        this.activationLink = uuid.v4();

        next();
    } catch (error) {
        return next(error);
    }
});

User.methods.checkPassword = async function(password) {
    if (!password) return false;

    return isValidPassword(password, this.password)
};

module.exports = connection.model('User', User);
