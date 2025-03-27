const express = require('express');
const ProfileRouter = express.Router();

const User = require('../models/user');
const { UserAuth } = require('../middlewares/auth');

ProfileRouter.get('/profile', UserAuth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ user: req.user });
    } catch (e) {
        res.status(500).send({ error: 'Error retrieving profile', details: e.message });
    }
   
})

module.exports = ProfileRouter;