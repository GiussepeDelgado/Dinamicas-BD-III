const mongoose=require('mongoose');
mongoose
  .connect(process.env.URL)
  .then(()=> console.log('DB Connect'))
  .catch(e=>console.log('fail db: '+e));
