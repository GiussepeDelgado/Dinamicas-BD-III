const Titere = require("../models/db/Titere");
//const Employee = require("../models/db/employee");

const addTitere=async(req,res)=>{
  try {
    console.log('add');
    const {name,siglas,status}=req.fields;
    const titere=new Titere(
            {name:name,
             precio:siglas,
             status:status
            });
    await titere.save();
    //res.send('Se agrego el titere');
    res.redirect('/titeres')
  } catch (error) {
    console.log(error);
  }
};
const readTitere=async(req,res)=>{
  try {
    console.log('READ');
    const titeres= await Titere.find().lean();
    res.render('areas',{areas:titeres});
    console.log(titeres);
    // res.json(areas);
  } catch (error) {
    console.log(error);
  }
};

const deleteTitere=async(req,res)=>{
  try {
    console.log('DELETE');
    const id = req.params.id;
    const dic=await Titere.findByIdAndDelete(id);
    console.log(dic);
    console.log(req.params);
    res.redirect('/titeres');
  } catch (error) {
    console.log(error);
  }
};

const updateTitere=async(req,res)=>{
  try {
    console.log('ENLAZAR A EDIT');
    const id = req.params.id;
    const area=await Titere.findById(id).lean();
    console.log(area);
    let flag=false;
    if (area.length!=0) {
      flag=true
    } 
    res.render('index',{flag,area});
  } catch (error) {
    console.log(error);
  }
};
const editTitere=async(req,res)=>{
  try {
    console.log('EDIT');
    const id = req.params.id;
    const {name,status,siglas}=req.fields;
    const del=await Titere.findByIdAndUpdate(id,{name:name,precio:siglas,status:status});
    console.log(del);
    console.log(id);
    console.log(req.fields);
    res.redirect('/titeres');
  } catch (error) {
    console.log(error);
  }
};
module.exports ={
  addTitere:addTitere,
  readTitere:readTitere,
  deleteTitere:deleteTitere,
  updateTitere:updateTitere,
  editTitere:editTitere
};