//Metodos para configuraciones
const express = require('express');
const formidableMiddleware = require('express-formidable');
const cookieParser = require('cookie-parser');
const app = express();
//funciones de desarrollo
const port = process.env.PORT || 3000;
require('dotenv').config({ path: './env/.env' });
const database = require('./database/db');
app.set('view engine', 'ejs');
//app.use(express.static('public'));
app.use(formidableMiddleware());
app.use(express.json());
app.use(cookieParser());
console.log(process.env.PORT);
app.use('/', require('./routes/router'));
app.listen(port, () => {
  console.log('SERVER UP runnung in http://localhost:'+port)
});
