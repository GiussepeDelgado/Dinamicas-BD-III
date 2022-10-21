const express = require('express');
const responseTime = require('response-time');
//const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config({ path: './env/.env' });

const database = require('./database/db');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(responseTime());

//app.use(cookieParser());

console.log(process.env.PORT);
app.use('/', require('./routes/router'));

//Para eliminar la cache 
app.use(function(req, res, next) {
  if (!req.user)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

app.listen(port, () => {
  console.log('SERVER UP runnung in http://localhost:'+port+'/Personajes');
});
