const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
require('./config/database');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
   const user = new User(req.body); 
   if (!Array.isArray(user.skills)) {
       return res.status(400).send({ error: 'Skills must be an array.' });
   }
   user.skills = [...new Set(user.skills)];
   if (user.skills.length > 15) {
       return res.status(400).send({ error: 'Skills cannot exceed 15 unique items.' });
   }
   try {
      await user.save();
      res.status(201).send('user successfully added');
   } catch (e) {
        res.status(400).send({ error: 'Error while adding user', details: e.message });
   }
})

app.patch('/update/:userId', async (req, res) => {
    const UPDATE_FIELDS = [
        'lastName',
        'about',
        'age',
        'skills',
        'phoneNumber',
    ];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every(field => UPDATE_FIELDS.includes(field));
    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid updates! Only specific fields can be updated.', allowedFields: UPDATE_FIELDS });
    }
    try {
        if (req.body.skills) {
            if (!Array.isArray(req.body.skills)) {
                return res.status(400).send({ error: 'Skills must be an array.' });
            }
            req.body.skills = [...new Set(req.body.skills)];
            if (req.body.skills.length > 15) {
                return res.status(400).send({ error: 'Skills cannot exceed 15 unique items.' });
            }
        }
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) {
            res.status(404).send('user cant be updatd as no record found with this id');
        }
        res.status(200).send({ message: 'User successfully updated', updatedUser: user });
    } catch (e) {
        res.status(400).send({ error: 'Error while updating user', details: e.message });
    }
})

app.get('/user', async (req, res) => {
    try {
        const firstName = await User.findOne({ firstName: req.body.firstName });
        if (!firstName) {
            res.status(404).send('user not found');
        }
        res.status(200).send(firstName);
    } catch (e) {
        res.status(400).send({ error: 'Error while getting user', details: e.message });
    }
})

app.get('/feed', async (req, res) => {
   try {
        const user = await User.find();
        res.status(200).send(user);
        if (!user) {
            res.status(404).send('user not found');
        }
   } catch (e) {
        res.status(400).send({ error: 'Error while getting user', details: e.message });
   }
})

app.delete('/delete', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body._id);
        if (!user) {
            res.status(404).send('user not found');
        }
        res.status(200).send('user successfully deleted!');
    } catch (e) {
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