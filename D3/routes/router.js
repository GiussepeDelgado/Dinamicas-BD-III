const express=require('express');
const { readTitere,addTitere, deleteTitere, updateTitere, editTitere } = require('../controllers/home');
//const addArea = require('../controllers/home');
//const addEmployee = require('../controllers/home');

const router=express.Router();

router.get('/',(req,res)=>{

  res.render('index',{flag:false});
});

router.get('/titeres',readTitere);
router.post('/agregar',addTitere);
router.get('/areas/delete/:id',deleteTitere);
router.get('/areas/update/:id',updateTitere);
router.post('/areas/edit/:id',editTitere);
module.exports=router;