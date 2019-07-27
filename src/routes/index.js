const express = require('express');
const router = express.Router();
const BuscaCurp = require('../models/task');
const logind = require('../models/login');
const vacuna = require('../models/consultas');


router.get('/', (req, res, next) => {
    res.render('index', {session:req.session.user_id, paginalogin: false} );
});

router.get('/login', (req, res, next) => {
    res.render('login', {session:req.session.user_id, paginalogin: true});
});

router.get('/delete/:id', async(req, res, next) =>{
    const { id } = req.params;
    await vacuna.remove({_id: id});
    res.redirect('/');
});

router.get('/edit/:id', async(req, res,next ) => {
    const { id } = req.params;
    const editVacuna = await vacuna.findById(id);
    res.render('edit', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: false, Campo: false,editVacuna});
});

router.post('/edit/:id', async(req, res,next ) => {
    const { id } = req.params;
    await vacuna.update({ _id: id}, req.body);
    res.redirect('/');
});

//sesion iniciada 
router.post('/session', async(req, res, next) =>{
    await logind.findOne({usuario:req.body.usuario, password:req.body.password}, function(err,user){
        try{
            req.session.user_id = user._id;
        }catch(err){
            console.log('usuario no encontrado');
        }
    });
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        res.redirect('/session/dashboard');
    }
});
//cerrar sesion
router.get('/session/exit', (req,res,next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        req.session.destroy();
        res.redirect('/');
    }
});

router.get('/session/dashboard',(req, res, next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        res.render('dashboard', {session:req.session.user_id, paginalogin: false});
    }
});

router.get('/session/nuevopaciente',(req, res, next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        res.render('nuevopaciente', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: false, Campo: false });
    }
});

router.post('/session/nuevopaciente', async (req,res,next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        let no = true;
        console.log(req.body);
        if(req.body.curp == ''){
            no = false;
        }else if(req.body.nombre == ''){
            no = false;
        }else if(req.body.fechanacimiento == ''){
            no = false;
        }

        if(no){
        await BuscaCurp.find({curp: req.body.curp}, function(err,Paciente){
            if(Paciente.length){
                res.render('nuevopaciente', {session:req.session.user_id, paginalogin: false, existente: true , nuevo: false, Campo: false });
            }else{
                const usuario = new BuscaCurp({ curp: req.body.curp, nombre: req.body.nombre,  fechanacimiento: req.body.fechanacimiento , sexo: req.body.sexo});
                usuario.save()
                res.render('nuevopaciente', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: true, Campo: false });
            }
        });
    }else {
        res.render('nuevopaciente', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: false, Campo: true });
    }
    }
});

router.get('/session/nuevodoctor',(req, res, next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        res.render('nuevodoctor', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: false , Campo: false});
    }
});

router.post('/session/guardarnuevousuario', async(req,res,next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        let no = true;
        console.log(req.body);
        if(req.body.usuario == ''){
            no = false;
        }else if(req.body.password == ''){
            no = false;
        }

        if(no){
        await logind.find({usuario: req.body.usuario, password: req.body.password}, function(err,usuario){
            if(usuario.length){
                res.render('nuevodoctor', {session:req.session.user_id, paginalogin: false, existente: true , nuevo: false, Campo: false });
            }else{
                const usuario = new logind({ usuario: req.body.usuario , password: req.body.password});
                usuario.save();
                res.render('nuevodoctor', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: true,Campo: false});
            }
        });
        }else{
            res.render('nuevodoctor', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: false, Campo: true});
        }
    }
});


router.get('/session/atencionpaciente',(req, res, next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        res.render('vacuna', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: false, Campo: false});
    }
});

router.post('/session/nvacuna', async(req, res, next) =>{
    if(!req.session.user_id){
        res.redirect('/login');
    }else
    {
        let no = true;
        if(req.body.curp == ''){
            no = false;
        }else if(req.body.vacuna == ''){
            no = false;
        }
        else if(req.body.enfermedad == ''){
            no = false;
        }
        else if(req.body.dosis == ''){
            no = false;
        }
        else if(req.body.frecuencia == ''){
            no = false;
        }
        else if(req.body.edad == ''){
            no = false;
        }
        else if(req.body.fechavacuna == ''){
            no = false;
        }

        if(no){
        let pvacuna;
        await BuscaCurp.find({curp: req.body.curp}, function(err,Paciente){
            if(Paciente.length){
                if(req.body.sexo == 'Años'){
                pvacuna = new vacuna({curp: req.body.curp,vacuna: req.body.vacuna,Enfermedadprevenida: req.body.enfermedad,Dosis: req.body.dosis,meses: false,anos: true,edad: req.body.edad,frecuencia: req.body.frecuencia,FechaVacunacion: req.body.fechavacuna});
                }else if(req.body.sexo == 'Meses'){
                pvacuna = new vacuna({curp: req.body.curp,vacuna: req.body.vacuna,Enfermedadprevenida: req.body.enfermedad,Dosis: req.body.dosis,meses: true,anos: false,edad: req.body.edad,frecuencia: req.body.frecuencia,FechaVacunacion: req.body.fechavacuna});
                }
                pvacuna.save();
                res.render('vacuna', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: true, Campo: false});

            }else{
                res.render('vacuna', {session:req.session.user_id, paginalogin: false, existente: true , nuevo: false, Campo: false});
            }
        });
    }else{
        res.render('vacuna', {session:req.session.user_id, paginalogin: false, existente: false , nuevo: false, Campo: true});
    }
    }
});
//sesion
router.get('/ni%C3%B1as_y_ni%C3%B1os', async(req,res,next) => {
    await vacuna.find({curp:req.session.BuscadoCurp}, function(err,docs){
        if(docs){
            res.render('0a9', {session:req.session.user_id, paginalogin: false, docs});
        }else{
            res.redirect('/');
        }
    });
});

router.get('/adolescentes', async(req,res,next) => {
    await vacuna.find({curp:req.session.BuscadoCurp}, function(err,docs){
        if(docs){
            res.render('10a19', {session:req.session.user_id, paginalogin: false, docs});
        }else{
            res.redirect('/');
        }
    });
});

router.get('/mujeres', async(req,res,next) => {
    await vacuna.find({curp:req.session.BuscadoCurp}, function(err,docs){
        if(docs){
            console.log(docs);
            res.render('mujeres20a59', {session:req.session.user_id, paginalogin: false, docs});
        }else{
            res.redirect('/');
        }
    });
});

router.get('/hombres', async(req,res,next) => {
    await vacuna.find({curp:req.session.BuscadoCurp}, function(err,docs){
        if(docs){
            console.log(docs);
            res.render('hombres20a59', {session:req.session.user_id, paginalogin: false, docs});
        }else{
            res.redirect('/');
        }
    });
});

router.get('/adulto', async(req,res,next) => {
    await vacuna.find({curp:req.session.BuscadoCurp}, function(err,docs){
        if(docs){
            console.log(docs);
            res.render('adulto60mas', {session:req.session.user_id, paginalogin: false, docs});
        }else{
            res.redirect('/');
        }
    });
});

router.post('/buscar', async (req, res, next) => {
    await BuscaCurp.find({curp:req.body.curp}, function(err,docs){
        try{
            req.session.BuscadoCurp = docs[0].curp;
            res.render('encontrado', { docs , session:req.session.user_id, paginalogin: false});
        }catch(err){
            console.log('paciente no encontrado');
            console.log(err);
            res.redirect('/');
        }
    });
});

/*//add un usuario statico para pruebas 
router.get('/addp', async (req, res, next) => {
    const usuario = new BuscaCurp({ curp: 'AAZR980814HTSRPM00', nombre: 'Jose Ramon Arratia Zapata',  fechanacimiento: ("1998-08-14"), sexo: 'Hombre'});
    usuario.save();
    res.send('guardado');
});*/

/*
router.get('/addD', async (req, res, next) => {
    const usuario = new logind({ usuario: 'admin', password: 'admin'});
    usuario.save();
    res.send('guardado');
});*/

/*
//eliminar usuario manual 
router.get('/delete', async(req, res, next) => {
    await BuscaCurp.remove({});
    res.send('eliminado');
});
*/

module.exports = router;