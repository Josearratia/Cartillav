const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const V_biologico = new Schema({
    clave: String,
    vacuna: String,
    poblacion_blanco: String,
    calculo: String,
    dosis_por_esquema: String,
    factor_de_perdida: String
});

module.exports = mongoose.model('Vacuna', V_biologico);