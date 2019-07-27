const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paciente = new Schema({
    curp: String,
    vacuna: String,
    Enfermedadprevenida: String,
    Dosis: String,
    meses: Boolean,
    anos: Boolean,
    edad: Number,
    frecuencia: String,
    FechaVacunacion: Date
});

module.exports = mongoose.model('paciente', paciente);