const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { SignUpValidation, UpdateValidation, encryptPassword  } = require('./utils/helper');
const { UserAuth } = require('./middlewares/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
require('./config/database');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
    try {
        SignUpValidation(req.body);
        req.body.password = await encryptPassword(req.body.password); 
        const user = new User(req.body);
        await user.save();
        res.status(201).send('user successfully added');
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

app.post('/login', async (req, res) => {
    try {
        const { firstName, password } = req.body;
        if (!firstName || !password) {
            return res.status(400).send({ error: 'First name and password are required' });
        }
        const user = await User.findOne({ firstName });
        if (!user) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ _id: user._id }, 'KRISHNA_PUPPY', { expiresIn: '1h' });
        res.status(200).send({ message: 'Login successful', token });

    } catch (e) {
        res.status(500).send({ error: 'Error during login', details: e.message });
    }
  
})

app.get('/profile', UserAuth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ user: req.user });
    } catch (e) {
        res.status(500).send({ error: 'Error retrieving profile', details: e.message });
    }
   
})

app.patch('/update/:userId', async (req, res) => {
    try {
        await UpdateValidation(req.body);
        if (req.body.password) {
            req.body.password = await encryptPassword(req.body.password); 
        }
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) {
            return res.status(404).send('User cannot be updated as no record was found with this ID.');
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
        if (!user) {
            res.status(404).send('user not found');
        }
        res.status(200).send(user);
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