const mongoose = require('mongoose');
const beautify = require('mongoose-beautiful-unique-validation');

const DB_URL = process.env.DB_URL;
mongoose.plugin(beautify);

module.exports = mongoose.createConnection(DB_URL, {
    dbName: 'pet_app'
});
