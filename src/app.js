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
        res.status(400).send({ error: 'Error while adding user', details: e.message });
   }
})

app.patch('/update', async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.body._id,req.body);
        if(!user){
            res.status(404).send('user cant be updatd as no record found with this id');
        }
        res.status(201).send('user successfully updated');
    }catch(e){
        res.status(400).send({ error: 'Error while updating user', details: e.message });
    }
})

app.get('/user',async (req, res) => {
    try{
        const firstName =  await User.findOne({firstName : req.body.firstName});
        if(!firstName){
            res.status(404).send('user not found');
        }
        res.status(200).send(firstName);
    }catch(e){
        res.status(400).send({ error: 'Error while getting user', details: e.message });
    }
})

app.get('/feed',async (req, res) => {
   try{
        const user = await User.find();
        res.status(200).send(user);
        if(!user){
            res.status(404).send('user not found');
        }
   }catch(e){
    res.status(400).send({ error: 'Error while getting user', details: e.message });
   }
})

app.delete('/delete', async(req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.body._id);
        if(!user){
            res.status(404).send('user not found');
        }
        res.status(200).send('user successfully deleted!');
    }catch(e){
        res.status(400).send({ error: 'Error while deleting the user', details: e.message });
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