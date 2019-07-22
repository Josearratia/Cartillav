const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

//connectiong to db 

mongoose.connect('mongodb://localhost/Cartilla', {useNewUrlParser: true})
    .then(db => console.log('Db connected'))
    .catch(err => console.log(err));

//importing routs
const indexRoutes =  require('./routes/index');


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

//routes
app.use('/', indexRoutes);

//starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});


