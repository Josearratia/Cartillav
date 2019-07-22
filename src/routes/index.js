const express = require('express');
const router = express.Router();
const BuscaCurp = require('../models/task');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/buscar', async (req, res) => {
    const busqueda = new BuscaCurp(req.body);
    await busqueda.save();
    res.send('recivido');
});


module.exports = router;