const express=require('express');
const axios=require('axios');
const router=express.Router();
const redis= require('redis');
const client = redis.createClient({
  host:'127.0.0.1',
  port:6379
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => {
  console.log("Se conecto correctamente")
});
router.get("/Personajes",async (req,res)=>{

  const value = await client.get('personajes');
  let personajes={};
  if (value) {
    personajes=JSON.parse(value)   
  }else{
    const response=await axios.get('https://rickandmortyapi.com/api/character');
    personajes=response.data.results
    client.set('personajes',JSON.stringify(personajes));
  }
  res.render('index',{personajes:personajes});
  
});

router.get("/Personajes/data",async (req,res)=>{

  const value = await client.get('personajes');
  let personajes={};
  if (value) {
    personajes=JSON.parse(value)   
  }else{
    const response=await axios.get('https://rickandmortyapi.com/api/character');
    personajes=response.data.results
    client.set('personajes',JSON.stringify(personajes));
  }
  res.json(personajes);
  
});
module.exports=router;