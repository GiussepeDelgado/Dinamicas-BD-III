const mongoose = require('mongoose');
const {Schema} = mongoose;

const titere= new Schema({
  name:String,
  precio:String,
  status:String
});

const Titere=mongoose.model('Titere',titere);

module.exports=Titere;