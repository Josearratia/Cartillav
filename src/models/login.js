const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Doctor = new Schema({
    usuario: String,
    password: String
});

module.exports = mongoose.model('Doctor', Doctor);