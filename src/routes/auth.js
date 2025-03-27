const express = require('express');
const AuthRouter = express.Router();

const { SignUpValidation, encryptPassword  } = require('../utils/helper');
const User = require('../models/user');
const { UserAuth } = require('../middlewares/auth');


AuthRouter.post('/signup', async (req, res) => {
    try {
        SignUpValidation(req.body);
        req.body.password = await encryptPassword(req.body.password); 
        const user = new User(req.body);
        await user.save();
        res.status(201).send('user successfully added');
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

AuthRouter.post('/login', async (req, res) => {
    try {
        const { firstName, password } = req.body;
        if (!firstName || !password) {
            return res.status(400).send({ error: 'First name and password are required' });
        }
        const user = await User.findOne({ firstName });
        if (!user) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await user.passwordVerification(password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const token = await user.getJWT();
        res.status(200).send({ message: 'Login successful', token });

    } catch (e) {
        res.status(500).send({ error: 'Error during login', details: e.message });
    }
  
});

AuthRouter.post('/logout', (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    });
    res.send();
})

module.exports = AuthRouter;