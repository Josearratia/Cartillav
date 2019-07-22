const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CURP = new Schema({
    curp: String
});

module.exports = mongoose.model('CURP', CURP);