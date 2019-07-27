const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CURP = new Schema({
    curp: String,
    nombre: String,
    fechanacimiento: Date,
    sexo: String
});



module.exports = mongoose.model('CURP', CURP);
