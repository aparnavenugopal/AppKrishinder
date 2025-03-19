const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
require('./config/database');

const app = express();

app.use(express.json());

app.post('/signup',async (req, res) => {
   const user = new User(req.body); 
   try{
      await user.save();
      res.status(201).send('user successfully added');
   }catch(e){
        res.status(400).send('error while adding user',e);
   }
})



connectDB().then(() => {
    console.log('Database connected.....');
}).catch((err) => {
    console.log(err);
})

app.listen(8010, () => {
    console.log('Server is running on port 8010');
});