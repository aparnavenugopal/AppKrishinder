const express = require('express');
const ProfileRouter = express.Router();

const User = require('../models/user');
const { UserAuth } = require('../middlewares/auth');
const { UpdateValidation, encryptPassword  } = require('../utils/helper');

ProfileRouter.get('/profile/view', UserAuth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ user: req.user });
    } catch (e) {
        res.status(500).send({ error: 'Error retrieving profile', details: e.message });
    }
   
});

ProfileRouter.patch('/profile/edit/:userId', UserAuth, async(req, res) => {
    try{
        await UpdateValidation(req.body);
        if (req.body.password) {
            req.body.password = await encryptPassword(req.body.password); 
        }
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) {
            return res.status(404).send('User cannot be updated as no record was found with this ID.');
        }
        res.status(200).send({ message: 'User successfully updated', updatedUser: user });
    }catch(e){
        res.status(400).send({ error: 'Error while updating user', details: e.message });
    }
})

module.exports = ProfileRouter;